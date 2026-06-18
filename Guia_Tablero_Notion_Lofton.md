# 📊 Tablero Notion - Gestión de Piezas Creativas Lofton | Abril 2026

## 🎯 Objetivo
Control centralizado de **20 piezas creativas** para 5 campañas. Visibilidad en tiempo real del progreso + colaboración con Oriana.

---

## 📋 Paso 1: Crear la Base de Datos en Notion

### Opción A: Importar CSV (RECOMENDADO - más rápido)
1. En Notion, crea una página nueva → **"Database"** → **"Table"**
2. **Database name**: "Lofton Piezas Creativas - Abril 2026"
3. Click **Import** → Sube el archivo `Lofton_Piezas_Creativas_Abril2026.csv`
4. Notion auto-mapeará las columnas

### Opción B: Crear manual desde cero
Si prefieres construir: crear tabla con las propiedades listadas abajo

---

## 🔧 Propiedades de la Database

| Propiedad | Tipo | Ejemplo | Uso |
|-----------|------|---------|-----|
| **Pieza** | Text (auto-numerada) | 1, 2, 3... | ID único |
| **Campaña** | Multi-select | Always On Brand, PTU, etc. | Filtrar por campaña |
| **Formato** | Select | Reel 30seg, Carrusel, Estático, Banner | Tipo de pieza |
| **Descripción** | Text | "Carrusel 5 riesgos (7 tarjetas)" | Breve resumen |
| **Especificación** | Text | "Video 30seg con hook empresa..." | Reqs técnicos/creativo |
| **Estado** | Select | Pendiente, En Diseño, Aprobado, Entregado | Pipeline de trabajo |
| **Prioridad** | Select | Máxima, Alta, Media, Baja | Orden de ejecución |
| **Fecha Límite** | Date | 2026-04-15 | Deadline |
| **Asignado** | Person | Oriana | Responsable |
| **Link Diseño** | URL | [figma link] | Archivo de trabajo |
| **Link Referencias** | URL | [lofton.mx] | Recursos externos |
| **Notas** | Text | "Cada tarjeta termina con →" | Detalles importantes |

---

## 🎨 Valores de Select (Copiar exactamente)

### **Campaña** (Multi-select)
- Always On Brand
- Always On Remarketing
- PTU Reparto Utilidades
- Defensa Fiscal / Bloqueo UIF
- Google Ads Display

### **Formato** (Select)
- Reel 30seg
- Reel 15seg
- Carrusel
- Estático
- Banner 728x90
- Banner 300x250
- Banner 336x280
- Banner 300x600
- Banner 160x600
- Banner 970x250

### **Estado** (Select) - Color-code recomendado
- 🔴 **Pendiente** (rojo)
- 🟡 **En Diseño** (amarillo)
- 🟢 **Aprobado** (verde)
- ✅ **Entregado** (azul)

### **Prioridad** (Select) - Color-code recomendado
- 🔴 **Máxima** (rojo) - UIF/SCJN + Reels principales
- 🟠 **Alta** (naranja) - Carruseles principales + Estáticos urgentes
- 🟡 **Media** (amarillo) - Banners secundarios
- ⚪ **Baja** (gris) - Fallback pieces

---

## 📱 Vistas Recomendadas

### 1️⃣ **Vista "Board" - Kanban por Estado**
**Uso**: Ver flujo de trabajo Oriana
- Columnas: Pendiente | En Diseño | Aprobado | Entregado
- Agrupa por: Estado
- Filtra: Ninguno (ver todo)

### 2️⃣ **Vista "Timeline" - Gantt por Fecha Límite**
**Uso**: Ver deadlines de campaña
- Agrupa por: Campaña
- Eje temporal: Fecha Límite
- Filtra: Estado ≠ Entregado

### 3️⃣ **Vista "Table" - Prioridad Alta**
**Uso**: Panel de control rápido (lo ves primero)
- Filtro: Prioridad = Máxima | Alta
- Ordena por: Fecha Límite (ascendente)
- Columnas visibles: Pieza | Campaña | Formato | Estado | Fecha Límite | Asignado

### 4️⃣ **Vista "Table" - Por Campaña (Pestañas)**
**Uso**: Desglose de cada campaña
- Pestañas separadas para cada campaña
- Filtro: Campaña = [X]
- Ordena por: Prioridad (descendente)

### 5️⃣ **Vista "Gallery" (Opcional)**
**Uso**: Vista visual para Oriana
- Agrupa por: Campaña
- Muestra: Thumbnail si carga imagen + Formato + Estado

---

## 📊 Dashboard Summary (Opcional - Página separada)

Crea una página **"Dashboard"** con bloques de resumen:

```
✅ PROGRESO GENERAL
- Entregadas: 0/20
- En Diseño: 0/20
- Aprobadas: 0/20
- Pendientes: 20/20

🎯 POR CAMPAÑA
- Always On Brand: 5 piezas
- Always On Remarketing: 3 piezas
- PTU: 3 piezas
- Defensa Fiscal: 3 piezas
- Google Ads Display: 6 piezas

🔴 CRÍTICAS (Prioridad Máxima + Pendientes)
- Pieza 12: Reel UIF | Deadline: 10-04 | Asignado: Oriana
- Pieza 13: Estático SCJN | Deadline: 10-04 | Asignado: Oriana
- Pieza 7: Estático UIF | Deadline: 12-04 | Asignado: Oriana

📅 PRÓXIMAS ENTREGAS (Por fecha)
- 10-04: Pieza 12, 13
- 12-04: Pieza 3, 7
- 15-04: Pieza 1, 2, 4, 5, etc.
```

Para esto, crea bloques de **database query** que filtren y muestren info específica.

---

## 🔗 Flujo de Trabajo Sugerido

### **Para TI (Manuel)**
1. Cada lunes: Revisa **Vista Kanban** → Valida progreso
2. Cada martes: Actualiza deadlines si cambian
3. Proporciona feedback → Mueve pieza a **"Aprobado"** en Notion
4. Descarga finales → Mueve a **"Entregado"**

### **Para Oriana (Diseñadora)**
1. Accede al tablero → Filtra por **"En Diseño"**
2. Abre **Link Diseño** (Figma o Google Drive)
3. Cuando termina → Mueve a **"Aprobado"**
4. Espera feedback → Actualiza o confirma final
5. Descarga pieza → Mueve a **"Entregado"**

---

## 🔐 Permisos y Compartir

1. En Notion, abre el **Database**
2. Click **Share** → Invita a **Oriana**
3. Dale permisos: **Edit** (puede editar propiedades + crear registros)
4. Opcional: Crea una **"Public Link"** (view only) para María (cliente) si quiere ver progreso

---

## 💡 Tips de Uso

### Mantener actualizado
- **Cada lunes**: Sincro 15min con Oriana sobre estado
- **Propiedades críticas**: Fecha Límite + Estado (absolutamente necesarias)
- **Link Diseño**: Actualiza apenas Oriana abre el archivo

### Automaciones (Notion Plus)
Opcional — crea automatizaciones para:
- Si Estado = "Aprobado" → Enviar recordatorio a Manuel
- Si Fecha Límite = Hoy → Notificar a Oriana
- Si Prioridad = Máxima + Estado ≠ Entregado → Alert diario

### Integraciones
- **Google Drive**: Empotra links de carpetas por campaña
- **Slack**: Sincroniza cambios de estado en canal #lofton-design
- **Figma**: Si usas Figma, enlaza archivos directamente

---

## 📦 Estructura de Carpetas Recomendada (Google Drive / Figma)

```
Lofton - Piezas Creativas Abril 2026
├── 1. Always On Brand
│   ├── Reel 30seg identidad
│   ├── Reel 15seg servicios
│   ├── Carrusel 5 Riesgos
│   └── Estáticos (2)
├── 2. Always On Remarketing
│   ├── Estáticos (2)
│   └── Carrusel Portafolio
├── 3. PTU Reparto Utilidades
│   ├── Carrusel 5 Errores
│   └── Estáticos (2)
├── 4. Defensa Fiscal UIF
│   ├── Reel Cascada
│   └── Estáticos (2)
└── 5. Google Ads Display
    └── Banners (6 tamaños)
```

Cada carpeta contiene archivos de **Figma / Adobe / Canva** con todos los activos.

---

## 🚀 Siguientes Pasos

1. ✅ **Importa el CSV** → Crea base de datos
2. ✅ **Configura vistas** → Kanban + Timeline
3. ✅ **Comparte con Oriana** → Dale permisos Edit
4. ✅ **Crea estructura de carpetas** → Links en "Link Diseño"
5. ✅ **Haz sync inicial** → Oriana abre tabla, entiende flujo
6. ✅ **Empieza con Pieza 12-14** → Máxima prioridad (UIF/SCJN)

---

## ❓ FAQ Rápido

**¿Cómo edita Oriana las piezas?**
- Notion es solo control. Oriana edita en Figma/Adobe y actualiza Link Diseño.

**¿Puedo ver imágenes en Notion?**
- Sí, crea propiedad "Imagen" (type Files) e incrusta previsualizaciones.

**¿Cómo envío piezas finales a Manuel?**
- Al entregar, Oriana mueve a "Entregado" + usa "Link Diseño" para descarga.

**¿Qué si cambian deadlines?**
- Actualiza fecha en Notion → Automáticamente recalcula vistas Timeline.

---

**Documento creado**: 8 de abril de 2026
**Contacto brief**: antuna@boscoagency.com (Manuel Antuna)
**Diseñadora**: Oriana
