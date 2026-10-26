---
name: feedback_no-tocar-archivos-base
description: Los HTML de diagnósticos son plantillas de producción; solo se permite agregar el modo embebido para Webflow (autorizado el 26 oct 2026)
metadata:
  type: feedback
---

Los archivos HTML de diagnóstico (lofton-hr-riesgos-lite.html, lofton-hr-riesgos.html, lofton-nomina-diagnostico.html, lofton-diagnostico-imss-infonavit.html, lofton-diagnostico-fiscal-pm.html, lofton-diagnostico-riesgo-legal.html) son plantillas de producción. No se modifican sus preguntas, scoring, cálculos, copy, formulario, WhatsApp ni diseño propio, y no se borran.

**Excepción autorizada (Alejandro Antuna, 26 oct 2026):** sí se puede agregar a todos los diagnósticos el "modo embebido" para Webflow. Se aplicó primero en lofton-hr-riesgos-lite.html y se replicará en los demás. Consiste solo en código agregado, sin borrar nada:

1. En el `<head>`, un script que agrega la clase `embedded` al `<html>` cuando el archivo corre dentro de un iframe.
2. CSS bajo `html.embedded` que oculta el encabezado (`.app-header`) y la tarjeta de introducción del cuestionario, porque ese contenido vive en el banner de Webflow.
3. Al final del archivo, un script que envía `parent.postMessage({loftonDiagnosticoHeight})` con la altura real (ResizeObserver), envía `{loftonScrollTop:true}` al cambiar de vista y recibe `{loftonViewport}` para fijar la barra de progreso.
4. Bloqueo previo (solo en diagnósticos que abren directo en el cuestionario, como el laboral lite): el cuestionario se ve atenuado y sin poder contestarse hasta hacer clic en "Iniciar diagnóstico", ya sea dentro del diagnóstico o en el banner de Webflow (`postMessage({loftonStart:true, origen:'banner'})`). Los diagnósticos fiscal, IMSS-Infonavit y riesgo legal ya tienen su pantalla de intro con botón; nómina tiene un paso previo de datos de empresa.

Tracking: el clic de inicio dispara el evento nuevo `diag_intro_click` (paso `boton_iniciar`, `origen_boton`) por `window.LOFTON_TRACKING.track`. NO se cambia `diag_start`, que en la familia B sigue disparando con la primera respuesta, para no romper el embudo ni las conversiones que ya existen en GA4 y Meta. Para que `diag_intro_click` llegue a GA4 o Meta se necesita un activador en GTM (GTM-TLWZXPBZ).

Fuera de un iframe el archivo se ve y funciona exactamente igual que antes.

**Why:** El usuario fue claro en que estos diagnósticos no se tocan. En octubre de 2026 autorizó explícitamente el modo embebido para que el iframe se integre a Webflow como en Flint (flint-value-growth-score), sin encabezado duplicado y sin que el iframe se coma el scroll.

**How to apply:** Para cualquier otro cambio, preguntar antes y esperar autorización explícita y puntual. Para el modo embebido, copiar el patrón de lofton-hr-riesgos-lite.html y ajustar solo los selectores de encabezado e introducción de cada archivo. Verificar en un iframe de prueba (escritorio y 390 px) antes de subir.
