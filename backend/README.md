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
