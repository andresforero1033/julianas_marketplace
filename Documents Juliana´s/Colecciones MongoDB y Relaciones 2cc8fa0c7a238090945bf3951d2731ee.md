# Colecciones MongoDB y Relaciones

**Proyecto: Juliana’s – Marketplace Multivendedor**

---

## Objetivo

Definir de forma clara las **colecciones de MongoDB**, su estructura y sus **relaciones**, alineadas al **MVP** de Juliana’s y preparadas para escalar a funcionalidades Post-MVP.

---

## Principios de Diseño

- Juliana’s utiliza **MongoDB (NoSQL)**.
- No se usan tablas, se usan **colecciones**.
- Las relaciones se manejan con:
    - **Referencias (`ObjectId`)**
    - **Datos embebidos cuando es conveniente**
- Regla general:
    - Datos que cambian con frecuencia → **referenciados**
    - Datos pequeños y estáticos → **embebidos**

---

## Colección: `users`

### Propósito

Almacenar todos los usuarios del sistema (compradoras, vendedoras y administradores).

### Estructura

```json
{
"_id": ObjectId,
"email":"user@email.com",
"password":"hashed_password",
"role":"compradora | vendedora | admin",
"isActive":true,
"createdAt": Date,
"updatedAt": Date
}

```

### Relaciones

- Un usuario puede tener **un perfil de vendedora**.
- Un usuario puede tener **muchos pedidos**.
- Un usuario puede tener **un carrito activo**.

---

## Colección: `vendors`

### Propósito

Guardar información específica de las vendedoras (tiendas).

### Estructura

```json
{
"_id": ObjectId,
"userId": ObjectId,
"storeName":"Juliana Accesorios",
"description":"Accesorios femeninos",
"logo":"url",
"isApproved":true,
"createdAt": Date
}

```

### Relaciones

- Una vendedora pertenece a **un usuario**.
- Una vendedora puede tener **muchos productos**.
- Una vendedora puede tener **muchos pedidos** (indirectamente).

---

## Colección: `categories`

### Propósito

Organizar los productos por categoría.

### Estructura

```json
{
"_id": ObjectId,
"name":"Joyería",
"slug":"joyeria",
"isActive":true
}

```

### Relaciones

- Una categoría puede tener **muchos productos**.

---

## Colección: `products`

### Propósito

Almacenar los productos publicados por las vendedoras.

### Estructura (MVP)

```json
{
"_id": ObjectId,
"vendorId": ObjectId,
"categoryId": ObjectId,
"name":"Collar Dorado",
"description":"Collar elegante",
"price":25000,
"salePrice":20000,
"stock":10,
"images":["url1","url2"],
"tags":["nuevo","oferta"],
"isActive":true,
"createdAt": Date
}

```

### Relaciones

- Un producto pertenece a **una vendedora**.
- Un producto pertenece a **una categoría**.
- Un producto puede estar en **muchos pedidos**.

---

## Colección: `carts`

### Propósito

Almacenar el carrito activo de cada compradora.

### Estructura

```json
{
"_id": ObjectId,
"userId": ObjectId,
"items":[
{
"productId": ObjectId,
"quantity":2,
"price":20000
}
],
"updatedAt": Date
}

```

### Relaciones

- Un carrito pertenece a **una usuaria**.
- Un carrito contiene **muchos productos**.

---

## Colección: `orders`

### Propósito

Registrar los pedidos realizados por las compradoras.

### Estructura (MVP)

```json
{
"_id": ObjectId,
"userId": ObjectId,
"items":[
{
"productId": ObjectId,
"vendorId": ObjectId,
"quantity":1,
"price":20000
}
],
"total":20000,
"status":"pendiente | pagado",
"createdAt": Date
}

```

### Relaciones

- Un pedido pertenece a **una compradora**.
- Un pedido puede contener productos de **múltiples vendedoras**.
- Un pedido tiene **muchos productos**.

---

## Colección: `payments`

### Propósito

Registrar la información de los pagos.

### Estructura

```json
{
"_id": ObjectId,
"orderId": ObjectId,
"paymentMethod":"pasarela",
"amount":20000,
"status":"success | failed",
"createdAt": Date
}

```

### Relaciones

- Un pago pertenece a **un pedido**.

---

## Colecciones Post-MVP (No incluidas inicialmente)

Estas colecciones no forman parte del MVP, pero la arquitectura está preparada para incluirlas:

- `reviews`
- `wishlists`
- `promotions`
- `notifications`
- `analytics`
- `coupons`
- `shipments`

---

## Diagrama Lógico Simplificado

```
User
 ├── Vendor
 │    └── Products
 ├── Cart
 │    └── Products
 └── Orders
      └── Products
           └── Vendor

```

---

## Resultado de esta Definición

- Estructura clara y sin ambigüedades.
- Preparado para marketplace multivendedor.
- Compatible con MVP y crecimiento futuro.
- Listo para crear modelos Mongoose y endpoints REST.

[Colecciones Post-MVP](Colecciones%20Post-MVP%202cc8fa0c7a23808993d0e88a469cf614.md)