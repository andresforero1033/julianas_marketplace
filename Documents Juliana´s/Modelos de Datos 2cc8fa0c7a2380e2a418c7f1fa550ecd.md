# Modelos de Datos

**Proyecto: Juliana’s – Marketplace Multivendedor**

---

## Objetivo

Documentar los **modelos de datos** del sistema Juliana’s, definiendo campos, tipos, reglas y relaciones, con foco en el **MVP**, escalabilidad y mantenimiento.

---

## Convenciones Generales

- Base de datos: **MongoDB**
- ODM: **Mongoose**
- Todas las colecciones usan:
    - `_id` como `ObjectId`
    - `createdAt` y `updatedAt`
- Las contraseñas se almacenan **hasheadas**
- Las relaciones se manejan mediante **referencias**

---

## Modelo: User

### Descripción

Representa a todos los usuarios del sistema: compradoras, vendedoras y administradores.

### Colección

`users`

### Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| email | String | Sí | Email único del usuario |
| password | String | Sí | Contraseña encriptada |
| role | String | Sí | compradora / vendedora / admin |
| isActive | Boolean | Sí | Estado del usuario |
| createdAt | Date | Auto | Fecha de creación |
| updatedAt | Date | Auto | Fecha de actualización |

### Reglas

- `email` debe ser único.
- `role` define permisos del sistema.

### Relaciones

- Un usuario puede tener un **Vendor**.
- Un usuario puede tener muchos **Orders**.
- Un usuario tiene un **Cart** activo.

---

## Modelo: Vendor

### Descripción

Representa una tienda vendedora dentro del marketplace.

### Colección

`vendors`

### Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| userId | ObjectId | Sí | Referencia a User |
| storeName | String | Sí | Nombre de la tienda |
| description | String | No | Descripción de la tienda |
| logo | String | No | URL del logo |
| isApproved | Boolean | Sí | Aprobación por admin |
| createdAt | Date | Auto | Fecha de creación |

### Reglas

- Un usuario solo puede tener **una tienda**.
- Solo vendors aprobados pueden publicar productos.

### Relaciones

- Vendor → User (1:1)
- Vendor → Products (1:N)

---

## Modelo: Category

### Descripción

Clasificación de productos.

### Colección

`categories`

### Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| name | String | Sí | Nombre de la categoría |
| slug | String | Sí | Identificador URL |
| isActive | Boolean | Sí | Estado |
| createdAt | Date | Auto | Fecha de creación |

### Reglas

- `slug` debe ser único.

### Relaciones

- Category → Products (1:N)

---

## Modelo: Product

### Descripción

Producto publicado por una vendedora.

### Colección

`products`

### Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| vendorId | ObjectId | Sí | Referencia a Vendor |
| categoryId | ObjectId | Sí | Referencia a Category |
| name | String | Sí | Nombre del producto |
| description | String | Sí | Descripción |
| price | Number | Sí | Precio base |
| salePrice | Number | No | Precio en oferta |
| stock | Number | Sí | Cantidad disponible |
| images | [String] | Sí | Imágenes del producto |
| tags | [String] | No | Etiquetas |
| isActive | Boolean | Sí | Estado |
| createdAt | Date | Auto | Fecha de creación |

### Reglas

- `stock` no puede ser negativo.
- `salePrice` < `price`.

### Relaciones

- Product → Vendor (N:1)
- Product → Category (N:1)

---

## Modelo: Cart

### Descripción

Carrito activo de una compradora.

### Colección

`carts`

### Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| userId | ObjectId | Sí | Referencia a User |
| items | Array | Sí | Productos del carrito |
| updatedAt | Date | Auto | Última modificación |

### Subdocumento: Item

| Campo | Tipo | Descripción |
| --- | --- | --- |
| productId | ObjectId | Producto |
| quantity | Number | Cantidad |
| price | Number | Precio al agregar |

### Reglas

- Un usuario solo puede tener **un carrito activo**.
- `quantity` mínimo 1.

### Relaciones

- Cart → User (1:1)
- Cart → Products (N:M)

---

## Modelo: Order

### Descripción

Pedido realizado por una compradora.

### Colección

`orders`

### Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| userId | ObjectId | Sí | Compradora |
| items | Array | Sí | Productos comprados |
| total | Number | Sí | Total del pedido |
| status | String | Sí | pendiente / pagado |
| createdAt | Date | Auto | Fecha |

### Subdocumento: Item

| Campo | Tipo | Descripción |
| --- | --- | --- |
| productId | ObjectId | Producto |
| vendorId | ObjectId | Vendedora |
| quantity | Number | Cantidad |
| price | Number | Precio final |

### Relaciones

- Order → User (N:1)
- Order → Products (N:M)
- Order → Vendors (N:M)

---

## Modelo: Payment

### Descripción

Registro de pagos realizados.

### Colección

`payments`

### Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| orderId | ObjectId | Sí | Pedido asociado |
| paymentMethod | String | Sí | Método |
| amount | Number | Sí | Monto |
| status | String | Sí | success / failed |
| createdAt | Date | Auto | Fecha |

### Relaciones

- Payment → Order (1:1)

---

## Resumen de Relaciones

```
User
 ├─ Vendor
 │   └─ Products
 ├─ Cart
 │   └─ Products
 └─ Orders
     └─ Products
         └─ Vendor

```

---

## Resultado

- Modelos claramente definidos
- Listos para implementación en Mongoose
- Alineados con MVP y crecimiento futuro
- Evita refactorizaciones costosas