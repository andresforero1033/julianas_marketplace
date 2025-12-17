# Juliana's Marketplace

<div align="center">

Marketplace multivendedor especializado en productos femeninos.

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20MongoDB-ff69b4)
![Status](https://img.shields.io/badge/MVP-En%20desarrollo-f39)
![License](https://img.shields.io/badge/Licencia-MIT-lightgrey)

</div>

## ✨ Visión general

- Curaduría femenina: joyería, accesorios, moda, lifestyle y tech.
- UX mobile-first con dashboards separados para compradoras, vendedoras y admin.
- Documentación integral del MVP y roadmap post-MVP dentro de `Documents Juliana´s/`.

## 🧭 Tabla de contenidos

1. [Arquitectura](#-arquitectura)
2. [Estado del proyecto](#-estado-del-proyecto)
3. [Stack y requisitos](#-stack-y-requisitos)
4. [Guía rápida backend](#-guía-rápida-backend)
5. [Documentación relacionada](#-documentación-relacionada)

## 🏗 Arquitectura

```
React + Tailwind (UI/UX)
	|
	v
Node.js + Express (API, auth, reglas)
	|
	v
MongoDB Atlas (persistencia marketplace)
```

- **Frontend**: componentes reutilizables, jerarquía visual responsive, consumo de API.
- **Backend**: Express modular (routes/controllers/services), JWT, validaciones y mapeo a MongoDB.
- **Base de datos**: colecciones para users, vendors, products, carts, orders y payments, preparadas para crecer con post-MVP.

## 📊 Estado del proyecto

| Fase | Descripción | Estado |
| --- | --- | --- |
| 0 | Preparación (alcance, roles, repos) | ✅ completado |
| 1 | UX/UI y arquitectura | ✅ completado |
| 2 | Backend core | 🚧 en progreso |
| 3 | Frontend core | ⏳ pendiente |
| 4-6 | Funcionalidades avanzadas, optimización, deploy | ⏳ pendiente |

## 🧰 Stack y requisitos

- Node.js 18+
- npm 9+
- Cuenta en MongoDB Atlas y Render (deploy futuro)

| Capa | Tecnología | Rol |
| --- | --- | --- |
| UI | React, Vite, Tailwind | Frontend responsive y componentes base |
| API | Node.js, Express, JWT, Joi (validaciones futuras) | Lógica de negocio y seguridad |
| Datos | MongoDB Atlas, Mongoose | Modelado flexible y relaciones referenciales |

## ⚙ Guía rápida backend

```bash
cd backend
cp .env.example .env  # Ajusta PORT, MONGODB_URI, CLIENT_URL, JWT_SECRET
npm install
npm run dev
```

El servidor se levanta en `http://localhost:4000` y expone `GET /api/health` como chequeo básico.

## 📚 Documentación relacionada

- `Documents Juliana´s/Alcance del MVP – Juliana’s…md`
- `Documents Juliana´s/Modelos de Datos…md`
- `Documents Juliana´s/Wireframes – Juliana’s Marketplace…md`
- `Documents Juliana´s/Paleta de Colores – Juliana’s…md`

Explora la carpeta completa para requerimientos, colecciones MongoDB, roadmap post-MVP, lineamientos visuales y componentes UI.
