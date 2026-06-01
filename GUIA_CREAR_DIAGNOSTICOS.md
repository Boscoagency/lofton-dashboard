# 📋 GUÍA COMPLETA: Crear Diagnósticos Lofton sin Programar
**Versión 2.0 — Actualizada con aprendizajes del Diagnóstico IMSS/Infonavit**

> Para cualquier persona no técnica que quiera crear un nuevo diagnóstico  
> Respetando el diseño, tarjetas, animaciones y estructura del sistema Lofton

---

## ¿QUÉ ES ESTO?

Este documento permite crear **diagnósticos interactivos profesionales** para Lofton sin escribir código. Simplemente:
1. Rellenas las plantillas con tus preguntas
2. Copias el prompt a Claude Code
3. Recibes un archivo HTML listo para compartir y subir a GitHub

**Tiempo estimado**: 30-45 minutos de preparación + 5 minutos en Claude.

---

## PARTE 1: FLUJO COMPLETO DE LA EXPERIENCIA

El diagnóstico siempre tiene **4 pantallas en este orden exacto**:

```
PANTALLA 1          PANTALLA 2              PANTALLA 3          PANTALLA 4
──────────          ──────────              ──────────          ──────────
INICIO         →   CUESTIONARIO        →   FORMULARIO      →   REPORTE
                   (todas las              (captura de         (resultado +
                   preguntas en            datos antes         pilares +
                   una sola página)        de ver resultado)   CTA)
```

### Descripción de cada pantalla:

**PANTALLA 1 — INICIO**
- Título impactante con la pregunta principal
- Subtítulo explicativo
- Lista de los pilares (áreas que evalúa)
- Disclaimer de confidencialidad
- Botón CTA: "Evaluar mi [tema]"

**PANTALLA 2 — CUESTIONARIO**
- Barra de progreso sticky (fija arriba al hacer scroll)
- Todas las preguntas visibles en una sola página con scroll
- Preguntas agrupadas por pilar con separador visual
- Opciones de respuesta en fila horizontal (4 columnas desktop / 2 columnas móvil)
- Botón "Ver mi resultado" al final (se activa solo cuando todas están respondidas)

**PANTALLA 3 — FORMULARIO DE CAPTURA (Lead Gate)**
- Aparece DESPUÉS de responder todo, ANTES de ver resultados
- Mensaje: "Tu resultado está listo — comparte tus datos para verlo"
- 5 campos únicamente (ver Parte 4)
- Botón: "Ver mi resultado completo"
- Disclaimer de confidencialidad

**PANTALLA 4 — REPORTE**
- Gauge visual (velocímetro de riesgo/exposición)
- Nivel de resultado con mensaje explicativo
- Tarjetas por pilar (resultado individual de cada área)
- Lista de pilares con mayor oportunidad de mejora (top 3)
- CTA final con isotipo Lofton a color + botón de agendar llamada

---

## PARTE 2: LOGOS Y MARCA

### Logos disponibles en la carpeta `Lofton Logos/`

| Archivo | Uso | Dónde va |
|---|---|---|
| `Logo blanco .png` | Logo completo blanco | **Header** (fondo verde oscuro) |
| `IsotipoLogos a color.png` | Isotipo a color | **CTA final** del reporte |
| `Isotipoblanco .png` | Isotipo blanco | Alternativo para fondos oscuros |
| `Logo full Logos a color.png` | Logo completo a color | No se usa en diagnósticos |

### Reglas de uso de logos:

**Header (siempre igual en todos los diagnósticos):**
```
[Logo blanco .png]  |  SERVICIOS INTEGRALES
                       Diagnóstico de [Nombre del Diagnóstico]
```
- Logo blanco a la izquierda
- Divisor vertical (línea blanca semitransparente)
- Texto "SERVICIOS INTEGRALES" en letra pequeña gris
- Nombre del diagnóstico en negrita blanca
- Badge "Confidencial" a la derecha (sin íconos, solo texto)

**CTA Final (siempre igual en todos los diagnósticos):**
- `IsotipoLogos a color.png` centrado, 96×96px, bordes redondeados
- Título debajo (se adapta al nivel de riesgo obtenido)
- Botón verde oscuro "Agendar llamada con Lofton"

---

## PARTE 3: DISEÑO — REGLAS FIJAS (NO MODIFICAR)

Todos los diagnósticos deben verse **exactamente iguales** en diseño visual:

| Elemento | Valor |
|---|---|
| **Tipografía** | Manrope (Google Fonts) |
| **Color primario** | Verde esmeralda `#003e1c` |
| **Color acento** | Lima `#b8e04a` |
| **Fondo general** | `#f6f7f5` (gris muy claro) |
| **Cards** | Blanco, bordes redondeados 20px, sombra suave |
| **Cards oscuras** | Degradado verde oscuro (pilares del reporte) |
| **Botón principal** | Degradado lima, texto verde oscuro, pill redondo |
| **Opciones de respuesta** | Estilo neumórfico (sombras suaves, se iluminan al seleccionar) |
| **Barra de progreso** | Degradado verde → lima |

**Responsive obligatorio en todos los diagnósticos:**

| Breakpoint | Header | Opciones de respuesta | Pilares en reporte | Formulario |
|---|---|---|---|---|
| **Desktop** (1280px+) | Logo + divisor + nombre completo | 4 columnas | 3 columnas | 2 columnas |
| **Tablet** (768px) | Solo logo + "Confidencial" | 2 columnas | 2 columnas | 2 columnas |
| **Móvil** (480px) | Solo logo + "Confidencial" | 2 columnas | 1 columna | 1 columna |

---

## PARTE 4: FORMULARIO DE CAPTURA

**SIEMPRE usar exactamente estos 5 campos, en este orden:**

| Campo | Tipo | Obligatorio | Placeholder |
|---|---|---|---|
| Nombre | Texto | ✅ Sí | "Tu nombre" |
| Empresa | Texto | ✅ Sí | "Nombre de la empresa" |
| Correo | Email | ✅ Sí | "tu@empresa.com" |
| Teléfono / WhatsApp | Teléfono | ✅ Sí | "(55) 0000-0000" |
| No. de empleados | Select | No | Menos de 10 / 10 a 50 / 51 a 200 / 201 a 500 / Más de 500 |

**Reglas del formulario:**
- Layout: 2 columnas en desktop/tablet → 1 columna en móvil
- NO pedir RFC, registros patronales, primas de riesgo, documentos ni información fiscal sensible
- Siempre mostrar al final: *"La información proporcionada será tratada con carácter confidencial."*
- El código guarda todo en un objeto `leadData` listo para conectar a CRM en el futuro

---

## PARTE 5: PREGUNTAS — TIPOS Y SCORING

### Tipos de respuesta (siempre los mismos 4, más "No aplica" opcional):

- **Sí** → Verde oscuro al seleccionar
- **Parcialmente** → Naranja oscuro al seleccionar
- **No** → Rojo oscuro al seleccionar
- **No estoy seguro** → Azul marino al seleccionar
- **No aplica** → Morado oscuro (solo si la pregunta lo requiere)

### Dos modos de scoring — MUY IMPORTANTE:

| Modo | Cuándo usarlo | Sí | Parcial | NS | No |
|---|---|---|---|---|---|
| **Cumplimiento** | La empresa DEBE hacerlo. Si no lo hace, hay riesgo | 0 pts | 1 pt | 2 pts | 3 pts |
| **Existencia** | La empresa puede o no tener esa figura. Si no la tiene, no hay riesgo | 0 pts | 1 pt | 2 pts | **0 pts** |

**¿Cómo saber qué modo usar?**
> Pregúntate: *"Si la empresa responde No, ¿eso en sí mismo es un problema?"*
> - Si SÍ es un problema → **Cumplimiento**
> - Si No simplemente significa que no tienen esa figura → **Existencia**

**Ejemplos modo CUMPLIMIENTO** (No = riesgo):
- ¿Tienes reglamento interno de trabajo?
- ¿Se realizan conciliaciones de nómina?
- ¿Cuentas con respaldos de SIPARE?
- ¿La documentación puede localizarse rápidamente?

**Ejemplos modo EXISTENCIA** (No = neutral, no penaliza):
- ¿La empresa contrata proveedores especializados? (si no contrata, no hay obligación)
- ¿Realiza pagos recurrentes a personas físicas? (si no hace pagos, sin riesgo)
- ¿Presta servicios especializados a terceros? (si no presta, sin obligación adicional)

### Dependencias entre preguntas:

Cuando una pregunta solo aplica si otra tuvo cierta respuesta, se marca como dependiente.
Si la pregunta "padre" fue respondida con el valor de exclusión, la pregunta dependiente se excluye automáticamente del cálculo (cuenta como "no aplica").

Ejemplo real del diagnóstico IMSS/Infonavit:
- Q16: ¿Contrata proveedores especializados? (Existencia)
- Q17: ¿Tiene documentación de esos proveedores? → **Depende de Q16. Si Q16=No → excluir**

Indica las dependencias en tu tabla de preguntas en la columna "Notas".

---

## PARTE 6: PLANTILLAS PARA RELLENAR

### PLANTILLA A: INFORMACIÓN GENERAL

```
NOMBRE DEL DIAGNÓSTICO:
(Ejemplo: "Diagnóstico de Riesgo Patronal IMSS/Infonavit")

DESCRIPCIÓN CORTA (una línea):
(Ejemplo: "Evalúa tu preparación ante una revisión del IMSS o Infonavit")

DURACIÓN ESTIMADA:
(Ejemplo: 10 minutos)

TOTAL DE PREGUNTAS:
(Ejemplo: 25)

NÚMERO DE PILARES:
(Ejemplo: 5)

NOMBRE DEL ARCHIVO DE SALIDA:
(Ejemplo: lofton-diagnostico-imss-infonavit.html)
```

---

### PLANTILLA B: TABLA DE PILARES

```
| # | Nombre del Pilar | Descripción corta |
|---|---|---|
| 1 | [Nombre] | [Qué evalúa este pilar en una línea] |
| 2 | [Nombre] | [Qué evalúa este pilar en una línea] |
| 3 | [Nombre] | [Qué evalúa este pilar en una línea] |
```

---

### PLANTILLA C: TABLA DE PREGUNTAS

```
| # | Pregunta exacta | ¿Tiene "No aplica"? | Pilar # | Modo | Notas de dependencia |
|---|---|---|---|---|---|
| 1 | ¿[Pregunta]? | No | 1 | Cumplimiento | |
| 2 | ¿[Pregunta]? | No | 1 | Cumplimiento | |
| 3 | ¿[Pregunta]? | No | 2 | Existencia | |
| 4 | ¿[Pregunta]? | Sí | 2 | Cumplimiento | Depende de Q3=No → excluir |
```

**Columna Modo:**
- `Cumplimiento` si responder No = riesgo real
- `Existencia` si responder No = simplemente no tienen esa figura

**Columna Notas:**
- Vacío si la pregunta aplica siempre
- `Depende de Q[número]=No → excluir` si solo aplica cuando otra fue Sí

---

### PLANTILLA D: NIVELES DE RESULTADO

```
NIVEL 1 — Riesgo bajo / preparación adecuada
Criterio de puntos: 0 a [X] puntos Y sin muchos "No estoy seguro"
Título: [Ej. "Preparación adecuada"]
Mensaje: [2-3 oraciones. Tono positivo pero sugiere mantener revisiones preventivas.]
Título CTA: [Ej. "Mantén tu empresa preparada"]

NIVEL 2 — Riesgo medio / áreas de oportunidad
Criterio de puntos: [X+1] a [Y] puntos
Título: [Ej. "Áreas de oportunidad relevantes"]
Mensaje: [2-3 oraciones. No alarmante. Sugiere revisar antes de que haya un requerimiento.]
Título CTA: [Ej. "Tu empresa tiene áreas de mejora importantes"]

NIVEL 3 — Riesgo alto / exposición importante
Criterio de puntos: [Y+1] puntos o más
Título: [Ej. "Exposición importante ante revisión"]
Mensaje: [2-3 oraciones. Directo. Recomienda revisión especializada.]
Título CTA: [Ej. "Tu empresa tiene áreas de mejora importantes"]

NIVEL 4 — Información insuficiente
Criterio: Más del 35% de respuestas son "No estoy seguro" (automático)
Título: [Ej. "Requiere análisis especializado"]
Mensaje: [2-3 oraciones. No alarmante. Sugiere revisar con especialista para ganar visibilidad.]
Título CTA: [Ej. "Conviene revisar estos puntos con un especialista"]
```

**Tono de los mensajes — reglas de lenguaje:**

✅ Usar:
- "Podría existir exposición"
- "Se identifican áreas que conviene revisar"
- "Se recomienda una revisión especializada"
- "Es conveniente validar la documentación"

❌ Evitar:
- "Tu empresa será multada"
- "Estás incumpliendo la ley"
- "Tienes una multa segura"
- "El IMSS te va a sancionar"

---

## PARTE 7: PROMPT PARA CLAUDE

Una vez que tengas todo rellenado, abre **Claude Code** y copia este prompt completo:

```
Necesito crear un NUEVO DIAGNÓSTICO INTERACTIVO para Lofton Servicios Integrales.

ARCHIVO BASE:
Usar EXACTAMENTE la misma estructura, diseño y lógica del archivo:
/Users/alejandroantunaleon/Desktop/Lofton Cowork/lofton-diagnostico-imss-infonavit.html

MANTENER IGUAL (no cambiar nada de esto):
- Colores: Verde esmeralda primario, Lima para acentos
- Tipografía: Manrope
- Efectos: Neumorfismo en opciones, sombras, animaciones fadeUp
- Header: "Logo blanco .png" + divisor + nombre del diagnóstico + badge "Confidencial"
- CTA final: "IsotipoLogos a color.png" centrado + título adaptable + botón verde oscuro
- Formulario: exactamente 5 campos (Nombre, Empresa, Correo, Teléfono, No. empleados)
- Flujo: Inicio → Cuestionario (todas en 1 página) → Lead Gate → Reporte
- Responsive: Desktop 4 cols opciones / Tablet 2 cols / Móvil 1 col pilares
- Sistema de scoring con modo 'cumplimiento' y modo 'existencia'
- Dependencias automáticas entre preguntas

NUEVO DIAGNÓSTICO — ESPECIFICACIONES:

[INFORMACIÓN GENERAL — PEGA AQUÍ TU PLANTILLA A]

[TABLA DE PILARES — PEGA AQUÍ TU PLANTILLA B]

[TABLA DE PREGUNTAS — PEGA AQUÍ TU PLANTILLA C]

[NIVELES DE RESULTADO — PEGA AQUÍ TU PLANTILLA D]

INSTRUCCIONES TÉCNICAS:
1. Tomar lofton-diagnostico-imss-infonavit.html como base exacta
2. Reemplazar SOLO el contenido (preguntas, pilares, textos, niveles)
3. Mantener TODA la estructura HTML, CSS y JavaScript
4. Aplicar modo 'existencia' a las preguntas indicadas en la tabla
5. Aplicar dependencias entre preguntas donde se indique
6. El diseño visual NO cambia bajo ninguna circunstancia
7. Guardar como: lofton-diagnostico-[NOMBRE].html
8. Al terminar, subir a GitHub y dar la liga de GitHub Pages
```

---

## PARTE 8: QUÉ HACER CON EL ARCHIVO

1. **Guardar** en la carpeta:
   ```
   /Users/alejandroantunaleon/Desktop/Lofton Cowork/lofton-diagnostico-[NOMBRE].html
   ```

2. **Probar localmente** antes de compartir:
   - Abre el archivo en el navegador
   - Responde todas las preguntas (prueba distintos escenarios)
   - Verifica que el formulario capture datos
   - Verifica que el reporte muestre resultados correctos
   - Prueba en móvil: Chrome → F12 → ícono de dispositivo móvil

3. **Subir a GitHub** (pedirle a Claude):
   ```
   Sube lofton-diagnostico-[NOMBRE].html a GitHub y dame la liga de GitHub Pages
   ```

4. **Liga final para compartir:**
   ```
   https://boscoagency.github.io/lofton-dashboard/lofton-diagnostico-[NOMBRE].html
   ```

---

## PARTE 9: CHECKLIST ANTES DE ENVIAR A PRODUCCIÓN

- [ ] Nombre del diagnóstico definido
- [ ] Descripción corta de una línea
- [ ] Todos los pilares con nombre y descripción
- [ ] Todas las preguntas en la tabla
- [ ] Modo correcto marcado para cada pregunta (Cumplimiento / Existencia)
- [ ] Dependencias identificadas y anotadas
- [ ] 4 niveles de resultado con mensajes redactados
- [ ] Tono revisado (sin frases alarmistas)
- [ ] Todo en ESPAÑOL
- [ ] Probado en desktop, tablet y móvil
- [ ] Subido a GitHub con liga funcional

---

## PARTE 10: DIAGNÓSTICOS EXISTENTES

| Diagnóstico | Archivo | Liga |
|---|---|---|
| Diagnóstico de Riesgo Patronal IMSS/Infonavit | `lofton-diagnostico-imss-infonavit.html` | https://boscoagency.github.io/lofton-dashboard/lofton-diagnostico-imss-infonavit.html |

*(Agregar nuevos diagnósticos aquí conforme se creen)*

---

## PARTE 11: FAQ

**P: ¿Puedo cambiar los colores o el diseño?**
R: NO. Todos los diagnósticos deben verse iguales para consistencia de marca Lofton.

**P: ¿Cuántas preguntas puedo tener?**
R: Entre 15 y 60. Lo ideal es 20-30 para que tome menos de 15 minutos.

**P: ¿Cuántos pilares puedo tener?**
R: Entre 3 y 6. Con 5 pilares las tarjetas de resultado se ven mejor.

**P: ¿Por qué el formulario va DESPUÉS de las preguntas y no al inicio?**
R: Porque el usuario ya invirtió tiempo respondiendo y tiene más interés en ver su resultado. Esto genera más conversiones que pedirlo al inicio.

**P: ¿Cómo sé si una pregunta es de Existencia o Cumplimiento?**
R: Hazte esta pregunta: *"Si la empresa responde No, ¿eso en sí mismo es un problema?"* Si la respuesta es "depende de si tienen esa figura", es **Existencia**. Si la respuesta es "sí, es un problema que no lo hagan", es **Cumplimiento**.

**P: ¿Puedo tener preguntas de Sí/No simple?**
R: NO. El sistema siempre usa: Sí / Parcialmente / No / No estoy seguro (+ No aplica opcional).

**P: ¿Dónde se guardan los datos del formulario?**
R: En el objeto `leadData` dentro del HTML. La versión actual no los envía automáticamente, pero el código está preparado para conectarse a un CRM con una línea adicional cuando se requiera.

**P: ¿Cómo comparto el diagnóstico?**
R: Siempre a través de GitHub Pages. La liga es:
`https://boscoagency.github.io/lofton-dashboard/lofton-diagnostico-[NOMBRE].html`

**P: ¿Qué archivo base debo indicarle a Claude?**
R: Siempre `lofton-diagnostico-imss-infonavit.html`. Es el más actualizado y tiene todas las mejoras implementadas.

---

**Última actualización: 2026-06-01**
**Versión: 2.0**
**Archivo base de referencia: lofton-diagnostico-imss-infonavit.html**
**Status: Listo para usar**
