"""Carga en GitHub los secrets del workflow "Actualizar datos de campañas".

Lee las llaves de los archivos locales (que nunca se suben a git), prueba los
tokens que caducan y sube a GitHub solo los que funcionan. Nunca imprime valores.

Fuentes:
  meta-ads/api/meta.env           META_ACCESS_TOKEN, META_AD_ACCOUNT_ID (y META_APP_SECRET si está)
  .env                            FB_APP_SECRET (respaldo de META_APP_SECRET)
  google-ads/api/google-ads.yaml  client_id, client_secret, refresh_token, customer_id

Uso: python3 scripts/cargar_secrets.py
Requiere gh con sesión iniciada en la cuenta boscoagency.
"""
import json
import pathlib
import subprocess
import urllib.error
import urllib.parse
import urllib.request

RAIZ = pathlib.Path(__file__).resolve().parent.parent
REPO = "boscoagency/lofton-dashboard"


def leer_env(ruta):
    datos = {}
    if ruta.exists():
        for linea in ruta.read_text().splitlines():
            if "=" in linea and not linea.strip().startswith("#"):
                k, v = linea.split("=", 1)
                datos[k.strip()] = v.strip().strip('"').strip("'")
    return datos


def leer_yaml_plano(ruta):
    """google-ads.yaml solo tiene pares clave: valor, no hace falta PyYAML."""
    datos = {}
    for linea in ruta.read_text().splitlines():
        if ": " in linea:
            k, v = linea.split(": ", 1)
            datos[k.strip()] = v.strip().strip('"').strip("'")
    return datos


def pedir(url, datos=None):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=datos), timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return json.load(e)


def main():
    meta = leer_env(RAIZ / "meta-ads/api/meta.env")
    raiz = leer_env(RAIZ / ".env")
    google = leer_yaml_plano(RAIZ / "google-ads/api/google-ads.yaml")

    secrets = {
        "META_ACCESS_TOKEN": meta.get("META_ACCESS_TOKEN"),
        "META_APP_SECRET": meta.get("META_APP_SECRET") or raiz.get("FB_APP_SECRET"),
        "META_AD_ACCOUNT_ID": meta.get("META_AD_ACCOUNT_ID"),
        "GOOGLE_ADS_CUSTOMER_ID": google.get("customer_id", "").replace("-", ""),
        "GOOGLE_CLIENT_ID": google.get("client_id"),
        "GOOGLE_CLIENT_SECRET": google.get("client_secret"),
        "GOOGLE_REFRESH_TOKEN": google.get("refresh_token"),
    }
    problemas = {k: "no está en los archivos locales" for k, v in secrets.items() if not v}

    # Tokens que caducan: se prueban antes de subirlos.
    if secrets["META_ACCESS_TOKEN"]:
        r = pedir("https://graph.facebook.com/v21.0/me?" + urllib.parse.urlencode({"access_token": secrets["META_ACCESS_TOKEN"]}))
        if "error" in r:
            problemas["META_ACCESS_TOKEN"] = "caducó o no es válido (renovar con meta-ads/api/guardar_token.sh)"
    if all(secrets[k] for k in ("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN")):
        r = pedir("https://oauth2.googleapis.com/token", urllib.parse.urlencode({
            "client_id": secrets["GOOGLE_CLIENT_ID"], "client_secret": secrets["GOOGLE_CLIENT_SECRET"],
            "refresh_token": secrets["GOOGLE_REFRESH_TOKEN"], "grant_type": "refresh_token"}).encode())
        if r.get("error") == "invalid_grant":
            problemas["GOOGLE_REFRESH_TOKEN"] = "caducó (renovar con google-ads/api/generar_token.py)"
        elif r.get("error"):
            for k in ("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"):
                problemas[k] = f"Google respondió {r.get('error')}"

    for nombre, valor in secrets.items():
        if nombre in problemas:
            print(f"OMITIDO  {nombre}: {problemas[nombre]}")
            continue
        r = subprocess.run(["gh", "secret", "set", nombre, "-R", REPO], input=valor, text=True, capture_output=True)
        print(f"{'CARGADO ' if r.returncode == 0 else 'ERROR   '} {nombre}" + ("" if r.returncode == 0 else f": {r.stderr.strip()}"))


if __name__ == "__main__":
    main()
