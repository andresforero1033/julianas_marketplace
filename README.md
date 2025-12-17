# Juliana's Marketplace

Marketplace multivendedor enfocado 100% en productos femeninos. Este repositorio centraliza la documentación funcional y el código del MVP: backend en Node.js + Express, base de datos MongoDB Atlas y frontend planeado en React + Tailwind.

## Objetivo del proyecto

Crear una plataforma similar a Temu, pero especializada en curaduría femenina: joyería, accesorios, moda, lifestyle y tecnología con estética cuidada. La experiencia prioriza diseño responsive, flujos mobile-first y dashboards diferenciados para compradoras, vendedoras y administración.

## Arquitectura

1. **Frontend**: React + Tailwind (UI, routing, manejo básico de estado, consumo de API).
2. **API Backend**: Node.js + Express, JWT para autenticación, reglas de negocio y comunicación con la base de datos.
3. **Base de datos**: MongoDB Atlas con colecciones para usuarios, vendedoras, productos, carritos, pedidos y pagos.

## Estado actual

- Documentación funcional y de diseño completa en `Documents Juliana´s/`.
- Esqueleto del backend en `backend/` con Express configurado y endpoint `/api/health`.
- Roadmap por fases (preparación, UX/UI, backend, frontend, funcionalidades avanzadas, optimización y deploy).


## Requisitos mínimos

- Node.js 18+
- npm 9+
- Cuenta en MongoDB Atlas y Render (para deploy posterior)

## Desarrollo local (backend)

```bash
cd backend
cp .env.example .env  # Completa los valores
npm install
npm run dev
```

El servidor se levanta por defecto en `http://localhost:4000` y expone `GET /api/health`.

---

Para más detalles revisa los documentos dentro de `Documents Juliana´s/`, donde encontrarás alcance del MVP, requerimientos, modelos de datos, wireframes, paleta de colores y estructura visual.
