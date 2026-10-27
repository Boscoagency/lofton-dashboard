"""Baja el rendimiento de Meta Ads y Google Ads de Lofton y lo guarda en data/rendimiento.json.

Lo corre el workflow "Actualizar datos de campañas" todos los días. Solo usa la
biblioteca estándar de Python. Las llaves llegan como variables de entorno (Secrets
de GitHub) y nunca se escriben en el JSON ni en los mensajes de error.

Uso local: python3 scripts/actualizar_campanas.py
"""
import datetime as dt
import hashlib
import hmac
import json
import os
import pathlib
import sys
import urllib.error
import urllib.parse
import urllib.request
from zoneinfo import ZoneInfo

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "data" / "rendimiento.json"
ZONA = ZoneInfo("America/Mexico_City")
META_API = "https://graph.facebook.com/v21.0"
# Google retira cada versión de la API en ~1 año; si responde 404, subir el número.
GOOGLE_API = "https://googleads.googleapis.com/v25"

LLAVES_META = ("META_ACCESS_TOKEN", "META_AD_ACCOUNT_ID")
LLAVES_GOOGLE = ("GOOGLE_ADS_CUSTOMER_ID", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN")
SECRETOS = [os.environ.get(k, "") for k in (*LLAVES_META, *LLAVES_GOOGLE, "META_APP_SECRET", "GOOGLE_DEVELOPER_TOKEN")]


class ErrorConsulta(Exception):
    pass


def limpiar(texto):
    """Quita cualquier llave que se haya colado en un mensaje de error."""
    texto = str(texto)[:400]
    for s in SECRETOS:
        if len(s) >= 6:
            texto = texto.replace(s, "***")
    return texto


def pedir(url, datos=None, encabezados=None):
    req = urllib.request.Request(url, data=datos, headers=encabezados or {})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        cuerpo = e.read().decode("utf-8", "replace")
        try:
            return {"_error_http": e.code, **json.loads(cuerpo)}
        except ValueError:
            raise ErrorConsulta(f"HTTP {e.code}: {limpiar(cuerpo)}")
    except urllib.error.URLError as e:
        raise ErrorConsulta(f"Sin conexión: {limpiar(e.reason)}")


def periodos(hoy):
    ayer = hoy - dt.timedelta(days=1)
    # El día 1 todavía no hay datos del mes: se muestra el mes anterior completo.
    inicio_mes = ayer.replace(day=1)
    return {
        "mes": {"desde": inicio_mes.isoformat(), "hasta": ayer.isoformat()},
        "7d": {"desde": (ayer - dt.timedelta(days=6)).isoformat(), "hasta": ayer.isoformat()},
        "30d": {"desde": (ayer - dt.timedelta(days=29)).isoformat(), "hasta": ayer.isoformat()},
    }


def vacio():
    return {"gasto": 0.0, "impresiones": 0, "clics": 0, "resultados": 0.0}


def sumar(filas):
    total = vacio()
    for f in filas:
        for k in total:
            total[k] += f[k]
    total["gasto"] = round(total["gasto"], 2)
    total["resultados"] = round(total["resultados"], 2)
    return total


# ── Meta ─────────────────────────────────────────────────────────────

def meta(per):
    token = os.environ["META_ACCESS_TOKEN"]
    cuenta = os.environ["META_AD_ACCOUNT_ID"].strip()
    if not cuenta.startswith("act_"):
        cuenta = "act_" + cuenta
    base = {"access_token": token}
    secreto = os.environ.get("META_APP_SECRET", "")
    if secreto:
        base["appsecret_proof"] = hmac.new(secreto.encode(), token.encode(), hashlib.sha256).hexdigest()

    def consultar(ruta, params):
        url = f"{META_API}/{ruta}?{urllib.parse.urlencode({**params, **base})}"
        filas = []
        while url:
            r = pedir(url)
            if "error" in r:
                e = r["error"]
                if e.get("code") == 190:
                    raise ErrorConsulta("El token de Meta caducó o no es válido. Genera uno nuevo y reemplaza el secret META_ACCESS_TOKEN.")
                if "appsecret_proof" in str(e.get("message", "")):
                    raise ErrorConsulta("El token de Meta es de una app distinta a la del secret META_APP_SECRET.")
                raise ErrorConsulta(f"Meta respondió error {e.get('code')}: {limpiar(e.get('message'))}")
            filas += r.get("data", [])
            url = r.get("paging", {}).get("next")
        return filas

    def fila(f):
        acciones = {a["action_type"]: float(a["value"]) for a in f.get("actions", [])}
        leads = acciones.get("lead", acciones.get("offsite_conversion.fb_pixel_lead", 0.0))
        return {"gasto": float(f.get("spend", 0)), "impresiones": int(f.get("impressions", 0)),
                "clics": int(f.get("clicks", 0)), "resultados": leads}

    def rango(p):
        return json.dumps({"since": p["desde"], "until": p["hasta"]})

    campos = "campaign_id,campaign_name,spend,impressions,clicks,actions,account_currency"
    por_campana = consultar(f"{cuenta}/insights", {"level": "campaign", "time_range": rango(per["mes"]), "fields": campos, "limit": 200})
    semana = consultar(f"{cuenta}/insights", {"level": "account", "time_range": rango(per["7d"]), "fields": campos, "limit": 200})
    diario = consultar(f"{cuenta}/insights", {"level": "account", "time_range": rango(per["30d"]), "time_increment": 1,
                                              "fields": "spend,impressions,clicks,actions", "limit": 200})

    campanas = sorted(({"nombre": f.get("campaign_name"), **fila(f)} for f in por_campana), key=lambda c: -c["gasto"])
    moneda = next((f.get("account_currency") for f in por_campana + semana if f.get("account_currency")), None)

    vence = None
    dbg = pedir(f"{META_API}/debug_token?{urllib.parse.urlencode({'input_token': token, 'access_token': token})}")
    expira = dbg.get("data", {}).get("expires_at")
    if expira:
        vence = dt.datetime.fromtimestamp(expira, ZONA).isoformat(timespec="minutes")

    return {
        "moneda": moneda,
        "resultado_etiqueta": "Leads (píxel)",
        "token_vence": vence,
        "totales": {"mes": sumar(campanas), "7d": sumar(fila(f) for f in semana)},
        "campanas": campanas,
        "diario": [{"fecha": f["date_start"], **fila(f)} for f in diario],
    }


# ── Google ───────────────────────────────────────────────────────────

def google(per):
    datos = urllib.parse.urlencode({
        "client_id": os.environ["GOOGLE_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
        "refresh_token": os.environ["GOOGLE_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    r = pedir("https://oauth2.googleapis.com/token", datos)
    if "access_token" not in r:
        if r.get("error") == "invalid_grant":
            raise ErrorConsulta("El refresh token de Google caducó. Genera uno nuevo y reemplaza el secret GOOGLE_REFRESH_TOKEN.")
        if r.get("error") == "invalid_client":
            raise ErrorConsulta("Google no reconoce GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET.")
        raise ErrorConsulta(f"Google no entregó acceso: {limpiar(r.get('error_description') or r.get('error'))}")

    encabezados = {"Authorization": f"Bearer {r['access_token']}", "Content-Type": "application/json"}
    if os.environ.get("GOOGLE_DEVELOPER_TOKEN"):
        encabezados["developer-token"] = os.environ["GOOGLE_DEVELOPER_TOKEN"]
    if os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID"):
        encabezados["login-customer-id"] = os.environ["GOOGLE_ADS_LOGIN_CUSTOMER_ID"].replace("-", "")
    cliente = os.environ["GOOGLE_ADS_CUSTOMER_ID"].replace("-", "")

    def consultar(gaql):
        filas, pagina = [], None
        while True:
            cuerpo = {"query": gaql}
            if pagina:
                cuerpo["pageToken"] = pagina
            r = pedir(f"{GOOGLE_API}/customers/{cliente}/googleAds:search", json.dumps(cuerpo).encode(), encabezados)
            if "error" in r:
                e = r["error"]
                raise ErrorConsulta(f"Google Ads respondió {e.get('status') or e.get('code')}: {limpiar(e.get('message'))}")
            filas += r.get("results", [])
            pagina = r.get("nextPageToken")
            if not pagina:
                return filas

    def fila(f):
        m = f.get("metrics", {})
        return {"gasto": round(int(m.get("costMicros", 0)) / 1e6, 2), "impresiones": int(m.get("impressions", 0)),
                "clics": int(m.get("clicks", 0)), "resultados": round(float(m.get("conversions", 0)), 2)}

    def entre(p):
        return f"segments.date BETWEEN '{p['desde']}' AND '{p['hasta']}'"

    metricas = "metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions"
    por_campana = consultar(f"SELECT campaign.name, campaign.status, {metricas} FROM campaign WHERE {entre(per['mes'])}")
    semana = consultar(f"SELECT customer.currency_code, {metricas} FROM customer WHERE {entre(per['7d'])}")
    diario = consultar(f"SELECT segments.date, {metricas} FROM customer WHERE {entre(per['30d'])}")

    campanas = {}
    for f in por_campana:
        nombre = f["campaign"]["name"]
        c = campanas.setdefault(nombre, {"nombre": nombre, "estado": f["campaign"].get("status"), **vacio()})
        for k, v in fila(f).items():
            c[k] += v
    for c in campanas.values():
        c["gasto"] = round(c["gasto"], 2)
        c["resultados"] = round(c["resultados"], 2)

    return {
        "moneda": next((f["customer"].get("currencyCode") for f in semana if f.get("customer")), None),
        "resultado_etiqueta": "Conversiones",
        "totales": {"mes": sumar(campanas.values()), "7d": sumar(fila(f) for f in semana)},
        "campanas": sorted(campanas.values(), key=lambda c: -c["gasto"]),
        "diario": sorted(({"fecha": f["segments"]["date"], **fila(f)} for f in diario), key=lambda d: d["fecha"]),
    }


# ── Armado ───────────────────────────────────────────────────────────

def correr(nombre, funcion, llaves, per, anterior, ahora):
    faltan = [k for k in llaves if not os.environ.get(k)]
    if faltan:
        bloque = {"estado": "sin_llaves", "mensaje": "Faltan los secrets: " + ", ".join(faltan) + "."}
    else:
        try:
            bloque = {"estado": "ok", "mensaje": None, "consultado": ahora, "periodos": per, **funcion(per)}
        except ErrorConsulta as e:
            bloque = {"estado": "error", "mensaje": limpiar(e)}
        except Exception as e:  # noqa: BLE001 (cualquier falla queda en la página sin tumbar a la otra plataforma)
            bloque = {"estado": "error", "mensaje": limpiar(f"{type(e).__name__}: {e}")}
    if bloque["estado"] != "ok":
        # Se conservan los últimos datos buenos para que la página no quede en blanco.
        for k, v in anterior.items():
            if k not in ("estado", "mensaje"):
                bloque.setdefault(k, v)
        bloque["fallo"] = ahora
    print(f"{nombre}: {bloque['estado']}" + (f" ({bloque['mensaje']})" if bloque.get("mensaje") else ""))
    return bloque


def main():
    ahora_dt = dt.datetime.now(ZONA)
    ahora = ahora_dt.isoformat(timespec="minutes")
    per = periodos(ahora_dt.date())
    anterior = json.loads(SALIDA.read_text()) if SALIDA.exists() else {}

    datos = {
        "actualizado": ahora,
        "meta": correr("Meta", meta, LLAVES_META, per, anterior.get("meta", {}), ahora),
        "google": correr("Google", google, LLAVES_GOOGLE, per, anterior.get("google", {}), ahora),
    }
    SALIDA.parent.mkdir(exist_ok=True)
    SALIDA.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n")
    # Una consulta que falló marca el proceso en rojo para que GitHub avise por correo.
    sys.exit(1 if any(datos[p]["estado"] == "error" for p in ("meta", "google")) else 0)


if __name__ == "__main__":
    main()
