/* ══════════════════════════════════════════════════════════════════════════
   LOFTON · Tracking unificado de Diagnósticos
   ─────────────────────────────────────────────────────────────────────────
   Un solo archivo para los 5 diagnósticos. Mide el mismo embudo de 8 pasos
   en todos, captura la campaña de origen (Google / Meta) y la manda también
   dentro del correo del lead.

   CÓMO SE INSTALA
   Una sola línea antes de </body> en cada diagnóstico:
       <script src="lofton-tracking.js" defer></script>

   QUÉ TIENES QUE CONFIGURAR  →  solo el bloque CONFIG de aquí abajo.
   No se toca nada más, ni aquí ni en los diagnósticos.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────────────────
     1) CONFIG  —  PEGA AQUÍ LOS IDs CUANDO CREES LAS CUENTAS
     ────────────────────────────────────────────────────────────────────────
     Dos formas de trabajar, elige UNA:

     A) RECOMENDADA — con Google Tag Manager:
        pon solo GTM_ID. Deja GA4_ID, META_PIXEL_ID y CLARITY_ID vacíos.
        Google Analytics, el Pixel de Meta y Clarity se conectan DENTRO de
        GTM. Ventaja: cambiar algo después no requiere tocar código.

     B) SIN GTM — directa:
        deja GTM_ID vacío y llena GA4_ID, META_PIXEL_ID y CLARITY_ID.
        Este archivo carga las tres herramientas por su cuenta.

     Puedes empezar con B y migrar a A después sin cambiar nada más.
     ──────────────────────────────────────────────────────────────────────── */
  var CONFIG = {
    GTM_ID:        'GTM-TLWZXPBZ',   // el mismo contenedor que ya corre en loftonsc.com
    GA4_ID:        '',   // 'G-XXXXXXXXXX'
    META_PIXEL_ID: '',   // '1234567890123456'
    CLARITY_ID:    '',   // 'abcdefghij'

    // Dominio principal del sitio. Sirve para no contar como "referral" el
    // salto entre loftonsc.com y los diagnósticos.
    DOMINIO_SITIO: 'loftonsc.com',

    // Imprime cada evento en la consola (F12). Se puede prender sin tocar el
    // archivo agregando ?lofton_debug=1 al final de la URL del diagnóstico.
    DEBUG: /[?&]lofton_debug=1/.test(location.search)
  };

  // Permite sobrescribir la config desde el HTML si algún día hiciera falta:
  // <script>window.LOFTON_TRACKING_CONFIG = { GTM_ID:'GTM-XXXX' }</script>
  if (window.LOFTON_TRACKING_CONFIG) {
    for (var k in window.LOFTON_TRACKING_CONFIG) CONFIG[k] = window.LOFTON_TRACKING_CONFIG[k];
  }

  var USA_GTM = !!CONFIG.GTM_ID;

  /* ────────────────────────────────────────────────────────────────────────
     2) QUÉ DIAGNÓSTICO ES  —  se detecta solo por el nombre del archivo
     ──────────────────────────────────────────────────────────────────────── */
  var CATALOGO = {
    'lofton-diagnostico-fiscal-pm':       { id: 'fiscal_pm',     nombre: 'Diagnóstico Fiscal PM',              familia: 'A' },
    'lofton-diagnostico-imss-infonavit':  { id: 'imss_infonavit',nombre: 'Diagnóstico IMSS-Infonavit',         familia: 'A' },
    'lofton-diagnostico-riesgo-legal':    { id: 'riesgo_legal',  nombre: 'Diagnóstico de Riesgo Legal',        familia: 'A' },
    'lofton-nomina-diagnostico':          { id: 'nomina',        nombre: 'Diagnóstico de Riesgos de Nómina',   familia: 'B' },
    'lofton-hr-riesgos-lite':             { id: 'laboral_lite',  nombre: 'Diagnóstico Laboral (Lite)',         familia: 'B' },
    'lofton-hr-riesgos':                  { id: 'laboral_full',  nombre: 'Diagnóstico Laboral (Completo)',     familia: 'B' }
  };

  var slug = (location.pathname.split('/').pop() || '').replace(/\.html?$/i, '');
  var DIAG = CATALOGO[slug] || { id: slug || 'desconocido', nombre: slug || 'Desconocido', familia: '?' };

  /* ────────────────────────────────────────────────────────────────────────
     3) UTILIDADES
     ──────────────────────────────────────────────────────────────────────── */
  function log() {
    if (!CONFIG.DEBUG || !window.console) return;
    var a = ['%c[Lofton tracking]', 'color:#0ea5e9;font-weight:bold'];
    console.log.apply(console, a.concat([].slice.call(arguments)));
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function guardar(clave, valor) {
    try { sessionStorage.setItem(clave, valor); } catch (e) {}
    try { localStorage.setItem(clave, valor); } catch (e) {}
  }
  function leer(clave) {
    try { var v = sessionStorage.getItem(clave); if (v) return v; } catch (e) {}
    try { return localStorage.getItem(clave); } catch (e) {}
    return null;
  }
  function cookie(nombre) {
    var m = document.cookie.match('(^|;)\\s*' + nombre + '\\s*=\\s*([^;]+)');
    return m ? m.pop() : '';
  }

  /* ────────────────────────────────────────────────────────────────────────
     4) ATRIBUCIÓN  —  de qué campaña vino el visitante
     Se captura en la PRIMERA visita y se conserva hasta que envía el lead,
     aunque navegue entre páginas.
     ──────────────────────────────────────────────────────────────────────── */
  var CLAVE_ATTR = 'lofton_attr';

  function capturarAtribucion() {
    var guardada = leer(CLAVE_ATTR);
    var qs = new URLSearchParams(location.search);
    var campos = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'];
    var nueva = {};
    var traeAlgo = false;

    campos.forEach(function (c) {
      var v = qs.get(c);
      if (v) { nueva[c] = v; traeAlgo = true; }
    });

    // Si la URL trae campaña, esa manda (visita nueva desde un anuncio).
    if (traeAlgo) {
      nueva.landing_page = location.pathname;
      nueva.referrer = document.referrer || '';
      nueva.primera_visita = new Date().toISOString();
      guardar(CLAVE_ATTR, JSON.stringify(nueva));
      return nueva;
    }

    // Si no, se reutiliza la ya guardada.
    if (guardada) { try { return JSON.parse(guardada); } catch (e) {} }

    // Primera visita sin parámetros: se deduce del referrer.
    var ref = document.referrer || '';
    var origen = 'directo', medio = 'none';
    if (ref) {
      var host = '';
      try { host = new URL(ref).hostname.replace(/^www\./, ''); } catch (e) {}
      if (host && host.indexOf(CONFIG.DOMINIO_SITIO) === -1) {
        origen = host;
        medio = /google\.|bing\.|duckduckgo|yahoo\./.test(host) ? 'organic'
              : /facebook|instagram|linkedin|t\.co|twitter|x\.com/.test(host) ? 'social'
              : 'referral';
      } else if (host) {
        origen = 'sitio_lofton';
        medio = 'interno';
      }
    }
    var base = {
      utm_source: origen,
      utm_medium: medio,
      referrer: ref,
      landing_page: location.pathname,
      primera_visita: new Date().toISOString()
    };
    guardar(CLAVE_ATTR, JSON.stringify(base));
    return base;
  }

  var ATTR = capturarAtribucion();

  // ID de sesión propio: permite unir en un mismo embudo todos los eventos
  // de una misma persona, y sirve de event_id base para Meta CAPI.
  var SESION_ID = leer('lofton_sid');
  if (!SESION_ID) { SESION_ID = uuid(); guardar('lofton_sid', SESION_ID); }

  /* ────────────────────────────────────────────────────────────────────────
     5) CARGA DE HERRAMIENTAS
     ──────────────────────────────────────────────────────────────────────── */
  window.dataLayer = window.dataLayer || [];

  function cargarScript(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    document.head.appendChild(s);
    return s;
  }

  if (USA_GTM) {
    // Modo A: todo cuelga de GTM.
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    cargarScript('https://www.googletagmanager.com/gtm.js?id=' + CONFIG.GTM_ID);
    log('GTM cargado:', CONFIG.GTM_ID);
  } else {
    // Modo B: cada herramienta por separado.
    if (CONFIG.GA4_ID) {
      cargarScript('https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA4_ID);
      window.gtag = window.gtag || function () { dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', CONFIG.GA4_ID, {
        // Mide loftonsc.com y los diagnósticos como una sola sesión.
        linker: { domains: [CONFIG.DOMINIO_SITIO, location.hostname] },
        send_page_view: true
      });
      log('GA4 cargado:', CONFIG.GA4_ID);
    }

    if (CONFIG.META_PIXEL_ID) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      fbq('init', CONFIG.META_PIXEL_ID);
      log('Meta Pixel cargado:', CONFIG.META_PIXEL_ID);
    }

    if (CONFIG.CLARITY_ID) {
      /* eslint-disable */
      (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})
      (window,document,"clarity","script",CONFIG.CLARITY_ID);
      /* eslint-enable */
      log('Clarity cargado:', CONFIG.CLARITY_ID);
    }
  }

  // Etiquetas de Clarity: permiten filtrar grabaciones por diagnóstico.
  function clarityTag(clave, valor) {
    if (!window.clarity || valor == null || valor === '') return;
    try { clarity('set', clave, String(valor)); } catch (e) {}
  }
  setTimeout(function () {
    clarityTag('diagnostico', DIAG.nombre);
    clarityTag('utm_source', ATTR.utm_source);
    clarityTag('utm_campaign', ATTR.utm_campaign);
  }, 1500);

  /* ────────────────────────────────────────────────────────────────────────
     6) EL DISPARADOR DE EVENTOS
     Los 8 eventos del embudo salen todos por aquí.
     ──────────────────────────────────────────────────────────────────────── */
  // Equivalencia con los eventos estándar de Meta (modo B).
  var META_EVENTOS = {
    diag_view:        { nombre: 'ViewContent', estandar: true },
    diag_start:       { nombre: 'InitiateCheckout', estandar: true },
    diag_complete:    { nombre: 'CompleteRegistration', estandar: true },
    diag_lead_submit: { nombre: 'Lead', estandar: true },
    diag_cta_click:   { nombre: 'Schedule', estandar: true }
  };

  var yaDisparados = {};

  function track(evento, params, opciones) {
    opciones = opciones || {};
    if (opciones.unaVez) {
      if (yaDisparados[evento]) return;
      yaDisparados[evento] = true;
    }

    var eventId = evento + '.' + SESION_ID + '.' + Date.now();
    var datos = {
      event: evento,
      diagnostico: DIAG.nombre,
      diagnostico_id: DIAG.id,
      familia_embudo: DIAG.familia,
      session_id: SESION_ID,
      event_id: eventId,          // para deduplicar Pixel ↔ CAPI en Meta
      page_path: location.pathname
    };
    for (var a in ATTR) datos[a] = ATTR[a];
    for (var p in (params || {})) datos[p] = params[p];

    // Siempre al dataLayer (lo lee GTM; inofensivo si no está).
    dataLayer.push(datos);

    // Modo B: envío directo.
    if (!USA_GTM) {
      if (CONFIG.GA4_ID && window.gtag) {
        var g = {}; for (var x in datos) if (x !== 'event') g[x] = datos[x];
        gtag('event', evento, g);
      }
      if (CONFIG.META_PIXEL_ID && window.fbq) {
        var m = META_EVENTOS[evento];
        var mParams = {
          content_name: DIAG.nombre,
          content_category: 'diagnostico',
          diagnostico_id: DIAG.id
        };
        for (var y in (params || {})) mParams[y] = params[y];
        if (m) fbq('track', m.nombre, mParams, { eventID: eventId });
        else   fbq('trackCustom', evento, mParams, { eventID: eventId });
      }
    }

    clarityTag('paso', evento);
    log(evento, datos);
    return eventId;
  }

  /* ────────────────────────────────────────────────────────────────────────
     7) LECTURA DEL PROGRESO  —  sin tocar la lógica del cuestionario
     Familia A: barra "#prog-pct" (ej. "45%")
     Familia B: contador "#prog-text" (ej. "12 / 24")
     ──────────────────────────────────────────────────────────────────────── */
  function leerProgreso() {
    var a = document.getElementById('prog-pct');
    if (a) {
      var pct = parseInt((a.textContent || '').replace('%', ''), 10);
      if (!isNaN(pct)) return { pct: pct };
    }
    var b = document.getElementById('prog-text');
    if (b) {
      var m = (b.textContent || '').match(/(\d+)\s*\/\s*(\d+)/);
      if (m) {
        var t = parseInt(m[2], 10);
        return { pct: t ? Math.round(parseInt(m[1], 10) / t * 100) : 0,
                 respondidas: parseInt(m[1], 10), total: t };
      }
    }
    return null;
  }

  var hitosDisparados = {};
  function revisarProgreso() {
    var p = leerProgreso();
    if (!p) return;

    if (p.pct > 0) track('diag_start', { paso: 'primera_respuesta' }, { unaVez: true });

    [25, 50, 75].forEach(function (h) {
      if (p.pct >= h && !hitosDisparados[h]) {
        hitosDisparados[h] = true;
        track('diag_progress', { paso: 'avance_' + h, avance_pct: h });
      }
    });

    if (p.pct >= 100) {
      track('diag_complete', { paso: 'cuestionario_completo', avance_pct: 100 }, { unaVez: true });
    }
  }

  /* ────────────────────────────────────────────────────────────────────────
     8) LECTURA DEL RESULTADO  —  para saber qué perfil convierte mejor
     ──────────────────────────────────────────────────────────────────────── */
  function texto(id) {
    var el = document.getElementById(id);
    return el ? (el.textContent || '').trim() : '';
  }
  function valor(id) {
    var el = document.getElementById(id);
    return el ? (el.value || '').trim() : '';
  }

  function leerResultado() {
    var r = {};
    // Familia A
    var badge = texto('result-badge');
    if (badge) {
      r.nivel_riesgo = badge;
      // Fiscal PM muestra puntos ("28" de "44"); IMSS y Riesgo Legal muestran
      // directamente un porcentaje ("37%"). Se contemplan los dos casos.
      var crudo = texto('result-score-num');
      var num = parseInt(crudo, 10);
      var max = parseInt(texto('result-max'), 10);
      if (isNaN(max)) {
        // Riesgo Legal no tiene elemento de máximo: lo dice el texto de abajo
        // ("de 44 puntos de preparación").
        var el = document.getElementById('result-score-num');
        var sig = el && el.nextElementSibling ? el.nextElementSibling.textContent : '';
        var m = (sig || '').match(/de\s+(\d+)\s+puntos/i);
        if (m) max = parseInt(m[1], 10);
      }
      if (!isNaN(num)) {
        if (crudo.indexOf('%') > -1) r.score_pct = num;
        else {
          r.score = num;
          if (!isNaN(max) && max) r.score_pct = Math.round(num / max * 100);
        }
      }
    }
    // Familia B
    var circulo = texto('risk-circle-label');
    if (circulo) {
      r.nivel_riesgo = circulo;
      var alto = parseInt(texto('kpi-alto'), 10);
      if (!isNaN(alto)) r.hallazgos_alto = alto;
      var exp = texto('kpi-total-exp').replace(/[^\d]/g, '');
      if (exp) r.exposicion_mxn = parseInt(exp, 10);
    }
    return r;
  }

  function leerFormulario() {
    return {
      nombre:        valor('f-nombre'),
      email:         valor('f-email'),
      telefono:      valor('f-tel'),
      empresa:       valor('f-empresa'),
      cargo:         valor('f-cargo'),
      colaboradores: valor('f-colaboradores')
    };
  }

  // SHA-256 del correo y del teléfono. Meta lo exige para el matching avanzado
  // y la Conversions API; Google lo usa para Enhanced Conversions. El dato en
  // claro NUNCA sale del navegador. Va síncrono a propósito: así el evento del
  // lead se dispara completo y en el orden correcto del embudo.
  function sha256(msg) {
    function rotr(n, x) { return (x >>> n) | (x << (32 - n)); }
    var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
             0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
             0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
             0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
             0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
             0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
             0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
             0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    // UTF-8
    var bytes = [], i, c;
    for (i = 0; i < msg.length; i++) {
      c = msg.charCodeAt(i);
      if (c < 0x80) bytes.push(c);
      else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0xd800 || c >= 0xe000) bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else { i++; c = 0x10000 + (((c & 0x3ff) << 10) | (msg.charCodeAt(i) & 0x3ff));
             bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
    }
    var bits = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (i = 7; i >= 0; i--) bytes.push((bits / Math.pow(2, i * 8)) & 0xff);

    var w = new Array(64), a, b, cc, d, e, f, g, h, t1, t2, j, s0, s1, ch, maj;
    for (i = 0; i < bytes.length; i += 64) {
      for (j = 0; j < 16; j++) {
        w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) | (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
      }
      for (j = 16; j < 64; j++) {
        s0 = rotr(7, w[j - 15]) ^ rotr(18, w[j - 15]) ^ (w[j - 15] >>> 3);
        s1 = rotr(17, w[j - 2]) ^ rotr(19, w[j - 2]) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      a = H[0]; b = H[1]; cc = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];
      for (j = 0; j < 64; j++) {
        s1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
        ch = (e & f) ^ (~e & g);
        t1 = (h + s1 + ch + K[j] + w[j]) | 0;
        s0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
        maj = (a & b) ^ (a & cc) ^ (b & cc);
        t2 = (s0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }

  function hash(txt) {
    if (!txt) return '';
    try { return sha256(String(txt).trim().toLowerCase()); } catch (e) { return ''; }
  }

  // El teléfono se normaliza como pide Meta: solo dígitos, con lada de país.
  function hashTelefono(tel) {
    if (!tel) return '';
    var d = String(tel).replace(/\D/g, '');
    if (d.length === 10) d = '52' + d;          // México sin lada internacional
    return hash(d);
  }

  /* ────────────────────────────────────────────────────────────────────────
     9) ENVOLTURAS  —  se "abrazan" las funciones del diagnóstico sin
     modificarlas. Si mañana cambia el cuestionario, esto sigue funcionando.
     ──────────────────────────────────────────────────────────────────────── */
  function envolver(nombre, antes, despues) {
    var original = window[nombre];
    if (typeof original !== 'function') return false;
    window[nombre] = function () {
      var args = arguments;
      if (antes) { try { antes.apply(null, args); } catch (e) { log('error antes de ' + nombre, e); } }
      var resultado = original.apply(this, args);
      if (despues) {
        try { despues.call(null, resultado, args); } catch (e) { log('error después de ' + nombre, e); }
      }
      return resultado;
    };
    window[nombre]._loftonWrapped = true;
    return true;
  }

  function vistaActiva() {
    var v = document.querySelector('.view.active');
    return v ? (v.id || '').replace('view-', '') : '';
  }

  var LEAD_ID = null;
  // El evento del lead se retrasa un momento para alcanzar a leer el nivel de
  // riesgo. Mientras tanto, diag_report_view espera su turno: así el embudo
  // conserva el orden lead → reporte en GA4 y en Meta.
  var LEAD_PENDIENTE = false;

  function alCambiarVista(intentos) {
    intentos = intentos || 0;
    var v = vistaActiva();
    clarityTag('vista', v);

    if (v === 'leadgate' || v === 'lead') {
      track('diag_lead_view', { paso: 'formulario_visible' }, { unaVez: true });
    }
    if (v === 'reporte') {
      if (LEAD_PENDIENTE && intentos < 12) { setTimeout(function () { alCambiarVista(intentos + 1); }, 120); return; }
      var r = leerResultado();
      r.paso = 'reporte_visible';
      clarityTag('nivel_riesgo', r.nivel_riesgo);
      track('diag_report_view', r, { unaVez: true });
    }
  }

  // ── Navegación (las dos familias) ──
  envolver('showView', null, function (_r, args) { setTimeout(alCambiarVista, 50); });
  envolver('setView',  null, function (_r, args) { setTimeout(alCambiarVista, 120); });

  // ── Arranque del cuestionario (familia A) ──
  envolver('startDiagnostico', function () {
    track('diag_start', { paso: 'boton_comenzar' }, { unaVez: true });
  });
  envolver('submitEmpresa', null, function () {
    if (vistaActiva() === 'cuestionario') {
      track('diag_start', { paso: 'datos_empresa' }, { unaVez: true });
    }
  });

  // ── Progreso: se lee después de cada respuesta ──
  envolver('updateProgress', null, function () { setTimeout(revisarProgreso, 30); });
  envolver('selectOption',   null, function () { setTimeout(revisarProgreso, 60); });
  document.addEventListener('change', function (e) {
    if (e.target && e.target.type === 'radio') setTimeout(revisarProgreso, 60);
  }, true);

  // ── Intento de ver el resultado (fin del cuestionario) ──
  envolver('submitCuestionario', null, function () {
    if (vistaActiva() === 'leadgate') {
      track('diag_complete', { paso: 'cuestionario_completo' }, { unaVez: true });
    }
  });

  // ── EL EVENTO IMPORTANTE: envío del lead ──
  envolver('submitLeadGate', null, function () {
    // Solo cuenta si de verdad pasó la validación: se nota porque ya se
    // muestra el reporte (familia A) o porque leadSubmitted quedó en true.
    var paso = window.leadSubmitted === true || vistaActiva() === 'reporte';
    if (!paso) {
      track('diag_lead_error', { paso: 'validacion_fallida' });
      return;
    }

    var f = leerFormulario();
    LEAD_ID = uuid();
    guardar('lofton_lead_id', LEAD_ID);

    // El reporte de la familia B se dibuja ~100 ms después de mostrarse la
    // vista; se espera para que el evento lleve ya el nivel de riesgo.
    LEAD_PENDIENTE = true;
    setTimeout(function () {
      try { enviarEventoLead(f); } finally { LEAD_PENDIENTE = false; }
    }, 600);
  });

  function enviarEventoLead(f) {
    var datos = leerResultado();
    datos.paso = 'lead_enviado';
    datos.lead_id = LEAD_ID;
    datos.cargo = f.cargo;
    datos.colaboradores = f.colaboradores;
    datos.empresa_dominio = (f.email.split('@')[1] || '').toLowerCase();
    datos.value = 1;
    datos.currency = 'MXN';

    // El correo y el teléfono, cifrados, para Enhanced Conversions (Google)
    // y matching avanzado (Meta). Nunca en texto plano.
    datos.email_sha256 = hash(f.email);
    datos.phone_sha256 = hashTelefono(f.telefono);
    datos.fbp = cookie('_fbp');
    datos.fbc = cookie('_fbc');
    clarityTag('lead', 'si');
    clarityTag('empresa', f.empresa);
    track('diag_lead_submit', datos);
  }

  // ── Que la campaña viaje dentro del correo del lead ──
  // Se le añaden campos al envío de Web3Forms sin tocar su lógica.
  (function () {
    var original = window.enviarLead;
    if (typeof original !== 'function') return;
    window.enviarLead = function (ld, extra) {
      extra = extra || {};
      extra['ID de lead']    = LEAD_ID || leer('lofton_lead_id') || '';
      extra['Origen']        = ATTR.utm_source || 'directo';
      extra['Medio']         = ATTR.utm_medium || 'none';
      extra['Campaña']       = ATTR.utm_campaign || '(sin campaña)';
      extra['Anuncio']       = ATTR.utm_content || '';
      extra['Google click']  = ATTR.gclid || ATTR.gbraid || ATTR.wbraid || '';
      extra['Meta click']    = ATTR.fbclid || '';
      extra['Página de entrada'] = ATTR.landing_page || '';
      extra['Primera visita']    = ATTR.primera_visita || '';
      return original.call(this, ld, extra);
    };
  })();

  // ── CTAs de alto valor: WhatsApp y agenda de llamada ──
  function ctaClick(canal) {
    var d = leerResultado();
    d.paso = 'cta_' + canal;
    d.canal = canal;
    d.lead_id = LEAD_ID || leer('lofton_lead_id') || '';
    d.value = 1;
    d.currency = 'MXN';
    track('diag_cta_click', d);
  }
  envolver('agendarWhatsApp',      function () { ctaClick('whatsapp'); });
  envolver('agendarLlamada',       function () { ctaClick('llamada'); });
  envolver('agendarLlamadaOutlook',function () { ctaClick('bookings'); });

  // Red de seguridad: cualquier enlace a WhatsApp o Bookings que no pase por
  // esas funciones también se mide.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp') > -1) ctaClick('whatsapp_link');
    else if (href.indexOf('bookwithme') > -1) ctaClick('bookings_link');
  }, true);

  /* ────────────────────────────────────────────────────────────────────────
     10) ARRANQUE
     ──────────────────────────────────────────────────────────────────────── */
  track('diag_view', { paso: 'carga_pagina' });
  setTimeout(alCambiarVista, 300);   // familia B abre directo en cuestionario

  // Cuánto tiempo aguantó antes de irse (útil para leer el abandono).
  var t0 = Date.now();
  window.addEventListener('pagehide', function () {
    var p = leerProgreso() || {};
    var datos = {
      paso: 'salida',
      vista_final: vistaActiva(),
      avance_pct: p.pct || 0,
      segundos: Math.round((Date.now() - t0) / 1000),
      lead_enviado: !!(window.leadSubmitted || LEAD_ID)
    };
    dataLayer.push(Object.assign({ event: 'diag_exit', diagnostico: DIAG.nombre,
      diagnostico_id: DIAG.id, session_id: SESION_ID }, datos));
  });

  // Para poder revisar todo desde la consola del navegador.
  window.LOFTON_TRACKING = {
    diagnostico: DIAG,
    atribucion: ATTR,
    sesion: SESION_ID,
    track: track,
    progreso: leerProgreso,
    resultado: leerResultado,
    version: '1.3.0'
  };

  log('Listo ·', DIAG.nombre, '· modo', USA_GTM ? 'GTM' : 'directo', '· origen', ATTR.utm_source);
})();
