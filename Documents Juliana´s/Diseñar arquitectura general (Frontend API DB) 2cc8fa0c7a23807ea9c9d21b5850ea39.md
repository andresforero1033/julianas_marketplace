# Diseñar arquitectura general (Frontend / API / DB)

# Arquitectura propuesta para Juliana’s

## Enfoque

**Arquitectura de 3 capas (Three-Tier Architecture)**

[ Frontend (React) ]

↓ HTTP / JSON

[ API (Node.js + Express) ]
↓ ODM (Mongoose)

[ Base de Datos (MongoDB Atlas) ]

Cada capa tiene responsabilidades claras.

Nada se mezcla.