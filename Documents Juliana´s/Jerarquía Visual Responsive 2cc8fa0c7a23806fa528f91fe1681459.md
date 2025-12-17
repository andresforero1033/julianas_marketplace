# Jerarquía Visual Responsive

**Proyecto: Juliana’s – Marketplace Multivendedor**

---

## Objetivo

Definir una **jerarquía visual clara y consistente** que guíe la atención del usuario, mejore la conversión y se adapte correctamente a **móvil, tablet y desktop**, manteniendo coherencia estética y funcional.

---

## Principios de Jerarquía Visual

1. **Lo más importante se ve primero**
2. **Un CTA primario por pantalla**
3. Contraste controlado (no saturar)
4. Escaneo rápido (F-pattern / Z-pattern)
5. Diseño **mobile-first**
6. Reutilización de componentes

---

## Breakpoints Responsive

| Dispositivo | Breakpoint Tailwind | Resolución |
| --- | --- | --- |
| Móvil | `sm` | 360 × 800 |
| iPhone | `sm` | 390 × 844 |
| Tablet | `md` | 768 × 1024 |
| Laptop | `lg` | 1366 × 768 |
| Desktop | `xl` | 1920 × 1080 |

---

## Niveles de Jerarquía Visual

### Nivel 1 – Atención Principal (Hero / CTA)

**Uso**

- Mensaje principal
- CTA clave (Comprar, Agregar, Finalizar)

**Características**

- Tamaño grande
- Alto contraste
- Espacio alrededor

**Ejemplos**

- Hero Home
- Precio del producto
- Botón “Comprar ahora”

**Tailwind**

```
text-3xl md:text-4xl font-bold
bg-primary text-white

```

---

### Nivel 2 – Información Prioritaria

**Uso**

- Nombres de productos
- Categorías
- Subtítulos

**Características**

- Menor tamaño que el nivel 1
- Peso medio
- Visible sin competir

**Tailwind**

```
text-xl md:text-2xl font-semibold

```

---

### Nivel 3 – Información Secundaria

**Uso**

- Descripciones
- Datos de vendedora
- Detalles adicionales

**Características**

- Texto legible
- Menor contraste
- No distrae

**Tailwind**

```
text-base text-gray-600

```

---

### Nivel 4 – Metadata / Apoyo

**Uso**

- Tags
- Stock
- Timestamps
- Notas legales

**Características**

- Pequeño
- Bajo contraste

**Tailwind**

```
text-sm text-gray-400

```

---

## Jerarquía por Pantalla

---

### Home

1. Hero + CTA (Nivel 1)
2. Categorías destacadas (Nivel 2)
3. Productos destacados (Nivel 2)
4. Beneficios y footer (Nivel 3–4)

---

### Catálogo

1. Filtros activos (Nivel 2)
2. Productos (Nombre + Precio) (Nivel 1–2)
3. Metadata (Nivel 3–4)

---

### Detalle de Producto

1. Precio + CTA (Nivel 1)
2. Nombre del producto (Nivel 2)
3. Descripción (Nivel 3)
4. Vendedora / Stock (Nivel 4)

---

### Carrito

1. Total a pagar (Nivel 1)
2. CTA “Finalizar compra” (Nivel 1)
3. Productos listados (Nivel 2)
4. Detalles (Nivel 3–4)

---

### Dashboards

1. Métricas clave (Nivel 1)
2. Secciones principales (Nivel 2)
3. Tablas y listados (Nivel 3)
4. Acciones secundarias (Nivel 4)

---

## Comportamiento Responsive

### Móvil

- Una sola columna
- CTA sticky inferior
- Priorizar scroll vertical
- Ocultar info secundaria

### Tablet

- Dos columnas
- Sidebar colapsable
- Más información visible

### Desktop

- Layout completo
- Sidebar fija
- Tablas completas
- Menos scroll

---

## Uso del Color en la Jerarquía

- Color primario → CTA principal
- Colores neutros → contenido
- Color secundario → estados (oferta, nuevo)
- Evitar más de 3 colores activos por pantalla

---

## Resultado

- Lectura clara y rápida
- Mejor conversión
- Menos carga cognitiva
- UI consistente y escalable
- Implementación directa en Tailwind