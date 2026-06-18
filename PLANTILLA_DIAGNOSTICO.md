# PLANTILLA: Diagnóstico Interactivo Lofton

Este documento describe cómo crear un nuevo diagnóstico siguiendo el diseño de **"Diagnóstico de Riesgos Laborales"** sin necesidad de programar.

---

## INSTRUCCIONES PARA CLAUDE

Copia y pega esto en un nuevo chat de Claude Code:

```
Necesito crear un nuevo diagnóstico interactivo para Lofton Servicios Integrales.

BASE DE DISEÑO:
- Usar EXACTAMENTE el mismo diseño, colores, animaciones y estructura que el archivo:
  /Users/alejandroantunaleon/Desktop/Lofton Cowork/lofton-hr-riesgos.html

NUEVO DIAGNÓSTICO - ESPECIFICACIONES:

1. INFORMACIÓN GENERAL
   - Nombre del diagnóstico: [INSERTAR NOMBRE]
   - Descripción corta: [INSERTAR DESCRIPCIÓN]
   - Duración estimada: [INSERTAR MINUTOS, ej: 10 minutos]
   - Disclaimer/Confidencialidad: "La información proporcionada será tratada con carácter confidencial."

2. ESTRUCTURA DE PREGUNTAS
   Total de preguntas: [NÚMERO]
   
   [COPIAR AQUÍ LA TABLA DE PREGUNTAS - VER SECCIÓN ABAJO]

3. ESTRUCTURA DE PILARES
   Cantidad de pilares: [NÚMERO]
   
   [COPIAR AQUÍ LA TABLA DE PILARES - VER SECCIÓN ABAJO]

4. LEAD GATE (Formulario de captura)
   - Campos: Nombre completo, Empresa, Correo electrónico, Teléfono
   - Texto del botón: "Ver mi Diagnóstico"
   - Encabezado: "Ya casi terminas"
   - Subencabezado: "Para enviarte tu diagnóstico personalizado, necesitamos algunos datos"

5. REPORTE
   - Mostrar: exposición económica total, semaforización (Riesgo Alto/Medio/Bajo)
   - Gauge de arcos concéntricos: rojo (altos), amarillo (medios), verde (bajos)
   - Tarjetas por pilar: mostrar cantidad de riesgos altos, medios, bajos y exposición

6. LOGO Y BRANDING
   - Logo blanco Lofton: [MANTENER IGUAL]
   - Colores: Verde esmeralda (primario), Lime (acentos)
   - Font: Manrope
   - Isotipo en CTA: [MANTENER IGUAL]

INSTRUCCIONES IMPORTANTES:
- No cambiar el diseño CSS ni la estructura HTML general
- Mantener todas las animaciones y efectos visuales
- Mantener la lógica de progreso (0/N preguntas)
- Mantener el lead gate antes de ver resultados
- Mantener el botón PDF para descargar
- Usar el archivo lofton-hr-riesgos.html como base 100% estructural

RESULTADO ESPERADO:
Un archivo HTML llamado: lofton-diagnostico-[NOMBRE-AREA].html
```

---

## TEMPLATE: TABLA DE PREGUNTAS

Copia esto y rellena con tus preguntas:

```
| # | Pregunta | Opción A | Opción B | ¿Tiene "No aplica"? | Pilar | Nivel de Riesgo | Exposición ($) | Se sanciona si... |
|---|----------|----------|----------|-------------------|-------|-----------------|-----------------|-------------------|
| 1 | ¿[Tu pregunta aquí]? | Sí | No | No | 1 | Alto | 500000 | responde No |
| 2 | ¿[Tu pregunta aquí]? | Sí | No | Sí | 1 | Medio | 250000 | responde No |
| 3 | ¿[Tu pregunta aquí]? | Sí | No | No | 2 | Alto | 750000 | responde Sí |
...
```

**Explicación de columnas:**
- **#**: Número de pregunta (1, 2, 3, ...)
- **Pregunta**: El texto completo de la pregunta
- **Opción A / Opción B**: Las dos opciones de respuesta (normalmente "Sí" / "No")
- **¿Tiene "No aplica"?**: Sí o No (si es Sí, agrega una tercera opción)
- **Pilar**: Número de pilar (1, 2, 3, 4, 5, 6, etc.)
- **Nivel de Riesgo**: Alto / Medio / Bajo
- **Exposición ($)**: Cantidad en pesos mexicanos si se incumple
- **Se sanciona si...**: "responde Sí" o "responde No" (cuándo genera riesgo)

---

## TEMPLATE: TABLA DE PILARES

```
| # | Nombre del Pilar | Descripción corta |
|---|---------------------|-------------------------|
| 1 | [Nombre] | [Descripción breve] |
| 2 | [Nombre] | [Descripción breve] |
...
```

---

## EJEMPLO COMPLETADO (para referencia)

### Información General
- Nombre: Diagnóstico de Cumplimiento Contractual
- Descripción: Evalúa el cumplimiento de obligaciones contractuales en tu empresa
- Duración: 8 minutos

### Tabla de Preguntas (primeras 5)
| # | Pregunta | Opción A | Opción B | ¿Tiene "No aplica"? | Pilar | Nivel | Exposición | Se sanciona si... |
|---|----------|----------|----------|-------------------|-------|--------|-----------|-------------------|
| 1 | ¿Tienes contratos actualizados con todos tus proveedores? | Sí | No | No | 1 | Alto | 600000 | responde No |
| 2 | ¿Has documentado los términos de pago en cada contrato? | Sí | No | Sí | 1 | Medio | 300000 | responde No |
| 3 | ¿Cumples con los tiempos de entrega pactados? | Sí | No | No | 2 | Alto | 800000 | responde No |

### Tabla de Pilares
| # | Nombre | Descripción |
|---|--------|-------------|
| 1 | Gestión Contractual | Cumplimiento de cláusulas y obligaciones |
| 2 | Entregas y Cronograma | Cumplimiento de plazos y compromisos |

---

## CHECKLIST ANTES DE ENVIAR A CLAUDE

- [ ] Tengo el nombre del nuevo diagnóstico
- [ ] Tengo la lista de preguntas completa (¿cuántas son?)
- [ ] Tengo los pilares definidos (¿cuántos son?)
- [ ] Tengo los valores de riesgo/multas para cada pregunta
- [ ] Sé cuál es el archivo original (lofton-hr-riesgos.html)
- [ ] Estoy listo para pasar toda la info a Claude

---

## ¿QUÉ HARÁ CLAUDE?

Claude tomará tu especificación y:
1. Copiará el archivo lofton-hr-riesgos.html
2. Reemplazará SOLO el contenido (preguntas, pilares, valores)
3. Mantendrá TODO el diseño, CSS, animaciones y lógica
4. Entregará un archivo .html listo para subir a GitHub

**Resultado**: Un nuevo diagnóstico con el mismo look & feel en ~5 minutos.

