# Juliana's Backend

API base para el marketplace multivendedor. Incluye Express configurado, middlewares principales y un endpoint `/api/health` para verificar disponibilidad.

## Scripts

- `npm run dev`: inicia el servidor con recarga automática (nodemon).
- `npm start`: ejecuta el servidor en modo producción.

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```
PORT=4000
NODE_ENV=development
MONGODB_URI=...
CLIENT_URL=http://localhost:5173
JWT_SECRET=...
JWT_EXPIRES_IN=1d
```

El módulo `src/config/env.js` valida automáticamente `MONGODB_URI` y `JWT_SECRET`, establece valores por defecto para el puerto, entorno y URL del cliente, y expone la configuración al resto de la aplicación.

## Conexión a MongoDB Atlas

1. Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Registra tu IP (puedes usar `0.0.0.0/0` durante desarrollo) y crea un usuario con rol `Atlas admin`.
3. Obtén la cadena de conexión tipo `mongodb+srv://<user>:<password>@cluster.mongodb.net/julianas`.
4. Sustituye `<user>`, `<password>` y el nombre de base de datos deseado en `MONGODB_URI` dentro de tu `.env`.
5. Ejecuta `npm run dev`; el servidor se detendrá si no logra conectarse para evitar errores silenciosos.

> Si necesitas cerrar el servidor, presiona `Ctrl + C`; la app hará un apagado elegante y liberará la conexión con MongoDB.

## Estructura de carpetas

```
backend/
├─ src/
│  ├─ app.js               # Configuración de Express + middlewares
│  ├─ server.js            # Bootstrap del servidor y conexión a la DB
│  ├─ config/
│  │  ├─ env.js            # Carga/validación de variables de entorno
│  │  └─ database.js       # Helpers de conexión Mongoose
│  ├─ routes/              # Definición de rutas (index central + subrutas)
│  ├─ controllers/         # Controladores HTTP (ej. health)
│  ├─ services/            # Lógica de negocio reutilizable
│  ├─ models/              # Esquemas y modelos de Mongoose
│  ├─ middlewares/         # Middlewares compartidos (auth, validaciones)
│  └─ utils/               # Helpers y utilidades varias
└─ package.json
```

> La ruta `/api/health` ahora vive en `routes/index.js` y usa el controlador correspondiente como ejemplo del flujo controller → route → service.

## Endpoints disponibles

- `GET /api/health`: comprueba que el backend esté en línea.
- `POST /api/auth/register`: crea un nuevo usuario (roles permitidos: `compradora`, `vendedora`, `admin`).
- `POST /api/auth/login`: devuelve JWT y datos básicos del usuario.
- `GET /api/auth/me`: requiere token válido, retorna el usuario autenticado.
- `GET /api/auth/admin/ping`: requiere token y rol `admin` (permite validar permisos).
- `GET /api/users`: lista usuarios (solo admin, acepta filtros `role`, `isActive`, `page`, `limit`).
- `GET /api/users/:id`: obtiene un usuario por ID (admin).
- `PATCH /api/users/:id`: actualiza `role`, `isActive` y/o `email` (admin).
- `DELETE /api/users/:id`: desactiva al usuario (`isActive = false`, admin).
- `POST /api/buyer-profiles`: crea el perfil de una compradora autenticada (admin puede indicar `userId`).
- `GET /api/buyer-profiles/me`: recupera el perfil de la compradora autenticada.
- `PATCH /api/buyer-profiles/me`: actualiza datos y direcciones de la compradora.
- `GET /api/buyer-profiles`: listado administrado con búsqueda y paginación.
- `PATCH /api/buyer-profiles/:id` / `DELETE /api/buyer-profiles/:id`: mantenimiento administrativo.
- `POST /api/vendor-profiles`: crea el perfil de vendedora (rol `vendedora` o admin).
- `GET /api/vendor-profiles/me`: retorna la información de la tienda asociada al usuario autenticado.
- `PATCH /api/vendor-profiles/me`: permite a la vendedora actualizar su tienda (sin tocar aprobación/estatus).
- `GET /api/vendor-profiles`: listado administrativo con filtros por aprobación y estado.
- `PATCH /api/vendor-profiles/:id` / `DELETE /api/vendor-profiles/:id`: gestión administrada (aprobaciones, suspensiones, etc.).
- `GET /api/categories`: listado público con búsqueda y filtros por estado.
- `GET /api/categories/:id`: detalle público de la categoría.
- `POST /api/categories`: crea categorías (solo admin).
- `PATCH /api/categories/:id`: actualiza nombre, slug o estado (admin).
- `DELETE /api/categories/:id`: desactiva la categoría (admin).
- `GET /api/products`: catálogo público (filtros por categoría, vendedora, precio, estado, publicación).
- `GET /api/products/:id`: detalle de producto con datos básicos de categoría y vendedora.
- `POST /api/products`: crea productos (vendedoras crean los propios; admin puede indicar `vendorId`).
- `PATCH /api/products/:id`: actualiza datos del producto respetando la propiedad (vendedora/admin).
- `DELETE /api/products/:id`: desactiva el producto (vendedora propietaria o admin).
- `POST /api/products/:id/variants`: crea variantes con SKU, atributos y stock granular.
- `PATCH /api/products/:id/variants/:variantId`: actualiza una variante específica.
- `DELETE /api/products/:id/variants/:variantId`: elimina una variante.
- `PATCH /api/products/:id/stock`: ajusta el stock (general o por variante) con operaciones `set`/`increment`.
- `POST /api/media/presign`: genera una URL firmada temporal (mock) para subir imágenes.
- `POST /api/media/assets`: registra metadatos de la imagen subida (URL final, owner, etc.).
- `GET /api/media/assets`: lista los assets filtrados por owner.
- `DELETE /api/media/assets/:id`: elimina un asset (admin o quien lo subió).
- `GET /api/cart`: recupera (o crea) el carrito persistido de la persona autenticada.
- `POST /api/cart/items`: agrega un producto/variante al carrito.
- `PATCH /api/cart/items/:itemId`: actualiza la cantidad de un ítem existente.
- `DELETE /api/cart/items/:itemId`: elimina un ítem puntual.
- `POST /api/cart/clear`: vacía el carrito conservando el registro.
- `POST /api/cart/validate`: vuelve a consultar el stock de cada ítem del carrito y reporta incidencias.
- `POST /api/orders`: genera un pedido a partir del carrito validado.
- `GET /api/orders`: lista los pedidos del usuario autenticado (admin ve todos).
- `GET /api/orders/:id`: detalle del pedido si eres dueña o admin.

### Ejemplo `POST /api/auth/register`

```bash
curl -X POST http://localhost:4000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{
		"email": "usuario@example.com",
		"password": "MiClaveSegura123",
		"role": "compradora"
	}'
```

Respuesta esperada (201):

```json
{
	"message": "Usuario registrado correctamente.",
	"user": {
		"_id": "66bff...",
		"email": "usuario@example.com",
		"role": "compradora",
		"isActive": true,
		"createdAt": "2025-12-17T...",
		"updatedAt": "2025-12-17T..."
	}
}
```

### Ejemplo `POST /api/orders`

```bash
curl -X POST http://localhost:4000/api/orders \
	-H "Authorization: Bearer <jwt_compradora>" \
	-H "Content-Type: application/json" \
	-d '{
		"shippingAddress": {
			"recipientName": "Juliana Perez",
			"phone": "+57 3000000000",
			"street": "Cra 7 #70-10",
			"city": "Bogotá",
			"country": "Colombia"
		},
		"paymentMethod": {
			"type": "transferencia",
			"reference": "PAY-123456"
		},
		"shippingCost": 10000,
		"notes": "Por favor entregar después de las 6pm"
	}'
```

Respuesta esperada (201):

```json
{
	"message": "Pedido creado correctamente.",
	"order": {
		"_id": "66c1...",
		"orderNumber": "ORD-1734440000000-1234",
		"total": 250000,
		"status": "pending",
		"items": [
			{
				"productId": "66bf...",
				"vendorId": "66b1...",
				"quantity": 2,
				"subtotal": 240000
			}
		],
		"shippingAddress": { "city": "Bogotá" },
		"createdAt": "2025-12-17T12:15:00.000Z"
	}
}
```

### Ejemplo `POST /api/cart/validate`

```bash
curl -X POST http://localhost:4000/api/cart/validate \
	-H "Authorization: Bearer <jwt_compradora>"
```

Respuesta esperada (200):

```json
{
	"message": "Stock verificado con éxito.",
	"cart": {
		"subtotal": 240000,
		"totalItems": 1,
		"totalQuantity": 2,
		"items": [
			{
				"_id": "66c0...",
				"productId": "66bf...",
				"quantity": 2
			}
		]
	},
	"validation": {
		"isValid": true,
		"items": [
			{
				"itemId": "66c0...",
				"status": "valid",
				"availableQuantity": 5,
				"requestedQuantity": 2,
				"issues": []
			}
		],
		"checkedAt": "2025-12-17T12:00:00.000Z"
	}
}
```

### Ejemplo `POST /api/auth/login`

```bash
curl -X POST http://localhost:4000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{
		"email": "usuario@example.com",
		"password": "MiClaveSegura123"
	}'
```

Respuesta esperada (200):

```json
{
	"message": "Inicio de sesión exitoso.",
	"token": "<jwt>",
	"user": { ... }
}
```

Usa el token en los endpoints protegidos:

```bash
curl http://localhost:4000/api/auth/me -H "Authorization: Bearer <jwt>"
```

### Ejemplo `POST /api/buyer-profiles`

```bash
curl -X POST http://localhost:4000/api/buyer-profiles \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <jwt_compradora>" \
	-d '{
		"fullName": "Juliana Perez",
		"phone": "+57 3000000000",
		"addresses": [
			{
				"label": "Casa",
				"street": "Cra 7 #70-10",
				"city": "Bogotá",
				"country": "Colombia",
				"isDefault": true
			}
		]
	}'
```

### Ejemplo `POST /api/categories`

```bash
curl -X POST http://localhost:4000/api/categories \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <jwt_admin>" \
	-d '{
		"name": "Joyería",
		"description": "Accesorios y joyas",
		"slug": "joyeria"
	}'
```

### Ejemplo `POST /api/products`

```bash
curl -X POST http://localhost:4000/api/products \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <jwt_vendedora>" \
	-d '{
		"name": "Collar Dorado",
		"description": "Collar minimalista bañado en oro",
		"price": 120000,
		"stock": 15,
		"categoryId": "<category_id>",
		"images": ["https://cdn.example.com/collar.jpg"]
	}'
```

### Ejemplo `POST /api/products/:id/variants`

```bash
curl -X POST http://localhost:4000/api/products/<product_id>/variants \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <jwt_vendedora>" \
	-d '{
		"name": "Collar Dorado / Talla M",
		"sku": "COLLAR-M",
		"stock": 5,
		"price": 125000,
		"color": "Dorado",
		"size": "M"
	}'
```

### Ejemplo `PATCH /api/products/:id/stock`

```bash
curl -X PATCH http://localhost:4000/api/products/<product_id>/stock \
	-H "Authorization: Bearer <jwt_vendedora>" \
	-H "Content-Type: application/json" \
	-d '{
		"operation": "increment",
		"quantity": -2,
		"variantId": "<variant_id>"
	}'
```

### Ejemplo `POST /api/media/presign`

```bash
curl -X POST http://localhost:4000/api/media/presign \
	-H "Authorization: Bearer <jwt_admin>" \
	-H "Content-Type: application/json" \
	-d '{
		"fileName": "collar.jpg",
		"mimeType": "image/jpeg",
		"fileSize": 204800
	}'
```

### Ejemplo `POST /api/cart/items`

```bash
curl -X POST http://localhost:4000/api/cart/items \
	-H "Authorization: Bearer <jwt_compradora>" \
	-H "Content-Type: application/json" \
	-d '{
		"productId": "<product_id>",
		"variantId": "<variant_id>",
		"quantity": 2
	}'
```

Respuesta esperada (201):

```json
{
	"message": "Producto agregado al carrito.",
	"cart": {
		"subtotal": 240000,
		"totalItems": 1,
		"totalQuantity": 2,
		"items": [
			{
				"_id": "66c0...",
				"productId": "66bf...",
				"variantId": "66c0...",
				"quantity": 2,
				"unitPrice": 120000,
				"subtotal": 240000,
				"productName": "Collar Dorado",
				"variantName": "Collar Dorado / Talla M"
			}
		]
	}
}
```

### Ejemplo `POST /api/vendor-profiles`

```bash
curl -X POST http://localhost:4000/api/vendor-profiles \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <jwt_vendedora>" \
	-d '{
		"storeName": "Juliana Accessories",
		"description": "Accesorios hechos a mano",
		"contactEmail": "tienda@example.com",
		"socialLinks": {
			"instagram": "https://instagram.com/juliana"
		}
	}'
```

### Ejemplo `GET /api/users`

```bash
curl "http://localhost:4000/api/users?role=vendedora&isActive=true" \
	-H "Authorization: Bearer <admin_jwt>"
```

Respuesta esperada (200):

```json
{
	"items": [{ "_id": "...", "email": "...", "role": "vendedora" }],
	"total": 5,
	"page": 1,
	"pages": 1
}
```
