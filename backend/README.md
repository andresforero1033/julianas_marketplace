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
```

El módulo `src/config/env.js` valida automáticamente `MONGODB_URI` y `JWT_SECRET`, establece valores por defecto para el puerto, entorno y URL del cliente, y expone la configuración al resto de la aplicación.

## Conexión a MongoDB Atlas

1. Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Registra tu IP (puedes usar `0.0.0.0/0` durante desarrollo) y crea un usuario con rol `Atlas admin`.
3. Obtén la cadena de conexión tipo `mongodb+srv://<user>:<password>@cluster.mongodb.net/julianas`.
4. Sustituye `<user>`, `<password>` y el nombre de base de datos deseado en `MONGODB_URI` dentro de tu `.env`.
5. Ejecuta `npm run dev`; el servidor se detendrá si no logra conectarse para evitar errores silenciosos.

> Si necesitas cerrar el servidor, presiona `Ctrl + C`; la app hará un apagado elegante y liberará la conexión con MongoDB.
