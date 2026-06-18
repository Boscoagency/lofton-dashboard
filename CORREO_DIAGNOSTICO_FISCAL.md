---
Para: Gerencia Lofton Servicios Integrales
Asunto: Diagnóstico Fiscal para Personas Morales — Diseño completado y en vivo
---

# DIAGNÓSTICO FISCAL PARA PERSONAS MORALES
## Resumen ejecutivo

Estimados,

Hemos completado la construcción e implementación del **Diagnóstico Fiscal para Personas Morales**, una herramienta interactiva gratuita diseñada para que las empresas evalúen su situación fiscal, contable y de cumplimiento ante autoridades (SAT, IMSS, Secretaría de Finanzas).

---

## 📊 ESPECIFICACIONES DEL DIAGNÓSTICO

### Estructura
- **Total de preguntas:** 26 (todas de respuesta objetiva, sin ambigüedad)
- **Pilares evaluados:** 2 áreas principales
  - **Pilar 1:** Situación Legal Fiscal (19 preguntas)
  - **Pilar 2:** Contabilidad y CFDI (7 preguntas)

### Opciones de respuesta
Cada pregunta ofrece 4 opciones mutuamente excluyentes:
1. **Sí** → Verde oscuro (respuesta positiva/segura)
2. **No** → Rojo (respuesta negativa/riesgosa según tipo)
3. **No sé** → Azul marino (incertidumbre/bandera amarilla)
4. **No aplica** → Morado (pregunta excluida del cálculo si no es aplicable)

---

## 🔢 LÓGICA DE SCORING Y TABULACIÓN

### Clasificación de preguntas por tipo

**Tipo CUMPLIMIENTO (14 preguntas):** La empresa DEBE hacer esto. Responder "No" es riesgo.
- Ejemplos: ¿Cuenta con opinión de cumplimiento positiva? ¿Documentación comprobatoria? ¿Conciliaciones mensuales?
- Puntuación: **Sí=2 pts** | No sé=1 pt | No=0 pts

**Tipo CONTINGENCIA (8 preguntas):** Describe eventos negativos. Responder "Sí" es riesgo.
- Ejemplos: ¿Ha recibido cartas invitación? ¿Créditos fiscales? ¿CSD restringido? ¿Contingencias del grupo/socios?
- Puntuación: **No=2 pts** | No sé=1 pt | Sí=0 pts

**Tipo CONTEXTO (4 preguntas):** No puntúan. Son filtros para mostir preguntas dependientes.
- ¿Forma parte de un grupo empresarial?
- ¿Realiza operaciones con partes relacionadas?
- ¿Obligada a presentar dictámenes?
- ¿Solicita frecuentemente devoluciones de IVA?

### Cálculo del resultado

1. **Puntaje total:** suma de puntos en todas las preguntas aplicables
2. **Máximo posible:** 2 × (preguntas contadas). Varía si Q2/Q9/Q15 = "No" (excluye Q3/Q10/Q16)
3. **% de preparación:** (puntaje total ÷ máximo posible) × 100
4. **Nivel de riesgo:**
   - 🟢 **Riesgo bajo** (75%+): empresa preparada, recomendación es revisión preventiva
   - 🟡 **Riesgo medio** (40-74%): áreas de oportunidad detectadas, requiere asesoría
   - 🔴 **Riesgo alto** (<40%): exposición importante, requiere revisión integral

### Por pilar
Cada pilar también se puntúa independientemente (% y nivel propio) para identificar dónde están las debilidades.

### Dependencias automáticas
- **Q3** ("¿Se han contestado en tiempo y forma?") aparece solo si Q2 = "Sí"
- **Q10** ("¿Contingencia fiscal en el grupo?") aparece solo si Q9 = "Sí"
- **Q16** ("¿Estudios de precios de transferencia?") aparece solo si Q15 = "Sí"

Si la pregunta "padre" es respondida con otro valor, la pregunta dependiente se oculta y se excluye del cálculo automáticamente.

---

## 📱 EXPERIENCIA DEL USUARIO

### 4 pantallas (flujo lineal)

**1. INICIO**
- Título impactante y descripción del diagnóstico
- 2 pilares resumidos en tarjetas
- Nota de soporte y disclaimer legal
- Botón: "Iniciar diagnóstico gratuito"

**2. CUESTIONARIO**
- Barra de progreso sticky (fija al scroll)
- 26 preguntas visibles en una sola página
- Preguntas agrupadas por pilar con separador visual
- 4 opciones neumórficas (sombras suaves, se iluminan al seleccionar)
- Botón "Ver mi resultado" activado solo cuando todas están respondidas

**3. LEAD GATE** (Captura de datos)
- Mensaje: "Tu resultado está listo — comparte tus datos para verlo"
- 5 campos obligatorios: Nombre, Empresa, Correo, Teléfono/WhatsApp, No. de empleados
- Leyenda de Aviso de Privacidad con enlace a https://loftonsc.com/aviso-de-privacidad/
- Botón: "Ver mi resultado completo"

**4. REPORTE**
- Gauge visual (velocímetro de riesgo)
- Puntaje total y nivel con mensaje interpretativo
- 2 tarjetas de pilar (resultado individual + % de preparación)
- Sección "Pilares con mayor oportunidad de mejora" (top 3 o solo los débiles)
- CTA con isotipo Lofton a color (imagen 96×96px) + título/mensaje adaptativos al nivel
- Botones secundarios: Imprimir/PDF, Reiniciar diagnóstico

---

## 🎨 DISEÑO Y MARCA

- **Tipografía:** Manrope (Google Fonts)
- **Colores:**
  - Verde esmeralda primario: `#003e1c`
  - Lima acento: `#b8e04a`
  - Fondo: `#f6f7f5`
- **Header:** Logo blanco + divisor + nombre diagnóstico + badge "Confidencial"
- **Opciones:** Estilo neumórfico (sombras suaves, interactivas)
- **Animaciones:** Fade-up al renderear vistas
- **Responsive:** Desktop (4 opciones en fila) → Tablet (2 cols) → Móvil (2 cols, header colapsa)

---

## 🔗 ACCESO EN VIVO

**GitHub:** https://github.com/Boscoagency/lofton-dashboard  
**Diagnóstico en GitHub Pages:**  
🌐 **https://boscoagency.github.io/lofton-dashboard/lofton-diagnostico-fiscal-pm.html**

Probado y verificado sin errores. Flujo completo funcional.

---

## ✏️ CUSTOMIZACIÓN Y SIGUIENTE PASO

Algunos textos están **parametrizados y personalizables** en el reporte:

**Portada:**
- Título: "¿Tu empresa está preparada ante una revisión del SAT, IMSS o la Secretaría de Finanzas?"
- Subtítulo: "Identifica si tu persona moral cuenta con la situación fiscal, la documentación comprobatoria y los controles contables necesarios..."
- Badge: "Diagnóstico gratuito · 26 preguntas · ~10 minutos · Solo Personas Morales"

**Mensajes por nivel de riesgo:**
- Cada nivel (bajo/medio/alto) tiene título, descripción y CTA adaptable
- Ejemplos: "Tu empresa mantiene una posición fiscal sólida" (bajo) vs "Tu empresa requiere una revisión fiscal integral" (alto)

**Nombres y descripciones de pilares:**
- Pilar 1: "Situación Legal Fiscal" 
- Pilar 2: "Contabilidad y CFDI"

---

## ❓ PREGUNTA A GERENCIA

**¿Hay algún texto, título, CTA o mensaje de resultado que desees modificar?**

Por ejemplo:
- ¿La redacción de la portada es clara y persuasiva?
- ¿Los mensajes de resultado reflejan el tono preventivo de Lofton sin ser alarmistas?
- ¿Quieres cambiar los nombres/descripciones de los pilares?
- ¿La llamada a la acción es la adecuada para el nivel de riesgo?

Favor confirmar y con gusto realizaré ajustes.

---

## ✅ CHECKLIST

- [x] 26 preguntas clasificadas por tipo (cumplimiento, contingencia, contexto)
- [x] 4 opciones por pregunta (Sí / No / No sé / No aplica)
- [x] Scoring dinámico con polaridad mixta
- [x] Dependencias automáticas (Q3, Q10, Q16)
- [x] 3 niveles de resultado (bajo/medio/alto)
- [x] Flujo 4 pantallas (Inicio → Cuestionario → Lead Gate → Reporte)
- [x] Formulario de 5 campos + Aviso de Privacidad
- [x] Gauge visual + tarjetas por pilar + top áreas de mejora
- [x] Responsive (desktop, tablet, móvil)
- [x] Sin errores de consola
- [x] Subido a GitHub y en vivo

---

**Atentamente,**  
Equipo de Desarrollo Lofton

---

*Nota: El archivo se encuentra en `/Users/alejandroantunaleon/Desktop/Lofton Cowork/lofton-diagnostico-fiscal-pm.html` y ya está en producción en GitHub Pages.*
