# Wireframes – Juliana’s Marketplace

**Pantallas Clave: Home, Catálogo, Producto, Carrito, Dashboards**

---

## Objetivo de los Wireframes

Definir la **estructura visual y funcional** de las pantallas principales de Juliana’s, antes de diseño visual (UI final), asegurando:

- Experiencia clara y femenina
- Flujo de compra sin fricción
- Escalabilidad a multivendedor
- Fácil implementación en React + Tailwind

---

## Convenciones UX Generales

- Header fijo con búsqueda global
- CTA primario siempre visible
- Diseño mobile-first
- Componentes reutilizables
- Jerarquía clara de información
- Estilo limpio, moderno y femenino (sin saturación)

---

## 1. Wireframe – Home

### Objetivo

Presentar la marca, destacar productos y guiar al catálogo.

### Estructura

**Header**

- Logo Juliana’s
- Barra de búsqueda
- Icono carrito
- Login / Perfil

**Hero Section**

- Imagen promocional
- Claim principal (ej. “Todo lo que amas, en un solo lugar”)
- CTA: “Comprar ahora”

**Categorías Destacadas**

- Grid de cards:
    - Joyería
    - Accesorios
    - Lociones
    - Ropa
    - Lifestyle
    - Accesorios iPhone

**Productos Destacados**

- Carrusel o grid
- Imagen
- Nombre
- Precio
- Botón “Ver”

**Beneficios**

- Envíos
- Seguridad
- Multivendedor
- Soporte

**Footer**

- Links legales
- Redes sociales
- Contacto

---

## 2. Wireframe – Catálogo

### Objetivo

Explorar productos por categoría y filtros.

### Estructura

**Header**

- Igual al Home

**Sidebar / Filtros**

- Categorías
- Rango de precios
- Vendedoras
- Tags (nuevo, oferta)

**Listado de Productos**

- Grid responsivo
- Card de producto:
    - Imagen
    - Nombre
    - Precio
    - Vendedora
    - Botón “Agregar”

**Paginación / Scroll infinito**

---

## 3. Wireframe – Detalle de Producto

### Objetivo

Convertir visita en compra.

### Estructura

**Galería**

- Imagen principal
- Miniaturas

**Información**

- Nombre del producto
- Precio / Oferta
- Stock
- Selector de cantidad
- CTA: “Agregar al carrito”

**Vendedora**

- Nombre de la tienda
- Ver más productos

**Descripción**

- Texto detallado
- Materiales / uso

**Productos Relacionados**

- Carrusel inferior

---

## 4. Wireframe – Carrito

### Objetivo

Confirmar compra y avanzar al pago.

### Estructura

**Listado de Productos**

- Imagen
- Nombre
- Precio
- Cantidad editable
- Subtotal
- Eliminar

**Resumen**

- Total
- Costos adicionales (si aplica)
- CTA: “Finalizar compra”

**Indicadores**

- Seguridad
- Métodos de pago

---

## 5. Wireframe – Dashboard Compradora

### Objetivo

Gestionar pedidos y perfil.

### Secciones

**Sidebar**

- Mi perfil
- Mis pedidos
- Direcciones
- Cerrar sesión

**Contenido**

- Historial de pedidos
- Estado (pendiente, pagado)
- Detalle del pedido

---

## 6. Wireframe – Dashboard Vendedora

### Objetivo

Gestionar tienda y productos.

### Secciones

**Sidebar**

- Mi tienda
- Productos
- Pedidos
- Estadísticas
- Perfil

**Pantalla Productos**

- Lista de productos
- Crear / editar / desactivar

**Pantalla Pedidos**

- Pedidos por estado
- Detalle por producto vendido

---

## 7. Wireframe – Dashboard Admin

### Objetivo

Control total del marketplace.

### Secciones

**Sidebar**

- Usuarios
- Vendedoras
- Productos
- Categorías
- Pedidos
- Reportes

**Funciones**

- Aprobar vendedoras
- Moderar productos
- Ver métricas básicas

---

## Responsive Breakpoints Considerados

| Dispositivo | Resolución |
| --- | --- |
| Móvil Android | 360 × 800 |
| iPhone | 390 × 844 |
| Tablet | 768 × 1024 |
| Laptop | 1366 × 768 |
| Desktop | 1920 × 1080 |

---

## Resultado de estos Wireframes

- Flujo de compra claro
- Roles bien diferenciados
- Componentes reutilizables
- Base sólida para UI final
- Implementación directa en React