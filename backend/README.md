# Juliana's Backend

API base para el marketplace multivendedor. Incluye Express configurado, middlewares principales y un endpoint `/api/health` para verificar disponibilidad.

## Scripts

- `npm run dev`: inicia el servidor con recarga automática (nodemon).
- `npm start`: ejecuta el servidor en modo producción.

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```
PORT=4000
MONGODB_URI=...
CLIENT_URL=http://localhost:5173
JWT_SECRET=...
```
