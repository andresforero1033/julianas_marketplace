# API / Backend (Node.js + Express)

### Responsabilidad

👉 **Cerebro del sistema**

Aquí vive toda la lógica real.

### Qué hace la API

- Autenticación (login, JWT)
- Autorización (roles y permisos)
- Reglas del marketplace:
    - Quién puede crear productos
    - Quién puede ver pedidos
- Validación de datos
- Lógica de carrito
- Creación de pedidos
- Integración de pagos
- Cálculo de totales
- Comunicación con la base de datos

### Capas internas del Backend (importante)

routes/ **Routes**: definen URLs
controllers/ **Controllers**: reciben requests
services/ **Services**: lógica de negocio
models/ **Models**: esquemas MongoDB
middlewares/ **Middlewares**: auth, roles, validaciones