# Colecciones Post-MVP

## Schemas MongoDB – Post-MVP

**Proyecto: Juliana’s – Marketplace Multivendedor**

> Estas colecciones NO se incluyen en el MVP, pero su diseño es compatible con la arquitectura base (users, products, orders).
> 

---

## 1. `reviews`

### Propósito

Reseñas y calificaciones de productos y vendedoras.

### Schema

```jsx
{
_id:ObjectId,
productId:ObjectId,// referencia a products
sellerId:ObjectId,// referencia a users (vendedora)
userId:ObjectId,// compradora
rating:Number,// 1 a 5
comment:String,
status:"active" |"hidden" |"reported",
createdAt:Date,
updatedAt:Date
}

```

### Relaciones

- users (compradora)
- products
- users (vendedora)

---

## 2. `wishlists`

### Propósito

Productos guardados por usuarias.

### Schema

```jsx
{
_id:ObjectId,
userId:ObjectId,// compradora
products: [
    {
productId:ObjectId,
addedAt:Date
    }
  ],
createdAt:Date,
updatedAt:Date
}

```

### Relaciones

- users
- products

---

## 3. `promotions`

### Propósito

Campañas promocionales y productos destacados.

### Schema

```jsx
{
_id:ObjectId,
title:String,
description:String,
type:"banner" |"featured" |"offer",
discountPercentage:Number,
sellerId:ObjectId,// opcional
productIds: [ObjectId],
categoryIds: [ObjectId],
startDate:Date,
endDate:Date,
isActive:Boolean,
createdAt:Date
}

```

### Relaciones

- products
- categories
- users (vendedora)

---

## 4. `notifications`

### Propósito

Notificaciones del sistema.

### Schema

```jsx
{
_id:ObjectId,
userId:ObjectId,
type:"order" |"promotion" |"system",
title:String,
message:String,
isRead:Boolean,
channel: ["in-app","email"],
createdAt:Date
}

```

### Relaciones

- users
- orders (referencia implícita)

---

## 5. `analytics`

### Propósito

Métricas de comportamiento y negocio.

### Schema

```jsx
{
_id:ObjectId,
entityType:"product" |"seller" |"category",
entityId:ObjectId,
event:"view" |"click" |"purchase",
userId:ObjectId,
metadata:Object,
createdAt:Date
}

```

### Relaciones

- users
- products
- categories

---

## 6. `coupons`

### Propósito

Cupones y descuentos.

### Schema

```jsx
{
_id:ObjectId,
code:String,
discountType:"percentage" |"fixed",
discountValue:Number,
sellerId:ObjectId,// opcional
productIds: [ObjectId],
categoryIds: [ObjectId],
usageLimit:Number,
usedCount:Number,
startDate:Date,
endDate:Date,
isActive:Boolean
}

```

### Relaciones

- users (vendedora)
- products
- categories
- orders

---

## 7. `shipments`

### Propósito

Gestión avanzada de envíos.

### Schema

```jsx
{
_id:ObjectId,
orderId:ObjectId,
sellerId:ObjectId,
carrier:String,
trackingNumber:String,
status:"pending" |"shipped" |"delivered" |"returned",
estimatedDelivery:Date,
shippedAt:Date,
deliveredAt:Date,
createdAt:Date
}

```

### Relaciones

- orders
- users (vendedora)

---

## Consideraciones de Arquitectura

- Todas las colecciones usan **ObjectId referencial**
- Índices recomendados:
    - `userId`
    - `productId`
    - `sellerId`
    - `createdAt`
- Preparadas para:
    - Escalado horizontal
    - Lecturas intensivas
    - Dashboards analíticos