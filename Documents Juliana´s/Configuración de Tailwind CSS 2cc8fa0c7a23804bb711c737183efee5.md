# Configuración de Tailwind CSS

**Proyecto: Juliana’s – Marketplace Multivendedor**

---

## Objetivo

Configurar **Tailwind CSS** como sistema de estilos base del proyecto para:

- Desarrollo rápido y consistente
- Diseño responsive
- Escalabilidad del UI
- Integración limpia con React

---

## Requisitos Previos

- Node.js instalado
- Proyecto React creado (Vite o CRA)
- Estructura base del frontend definida

---

## 1. Instalación de Tailwind CSS

Ejecutar en el frontend:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

```

Esto crea:

- `tailwind.config.js`
- `postcss.config.js`

---

## 2. Configuración de Rutas (Content)

Editar `tailwind.config.js`:

```jsx
/** @type {import('tailwindcss').Config} */
exportdefault {
content: [
"./index.html",
"./src/**/*.{js,jsx,ts,tsx}",
  ],
theme: {
extend: {},
  },
plugins: [],
}

```

Esto permite que Tailwind escanee todos los componentes React.

---

## 3. Configuración de Paleta de Colores

Agregar los colores definidos para Juliana’s:

```jsx
theme: {
extend: {
colors: {
primary:'#E91E63',
secondary:'#F8BBD0',
accent:'#C9A24D',
success:'#4CAF50',
warning:'#FF9800',
error:'#F44336',
text:'#333333',
muted:'#757575',
light:'#F5F5F5',
    }
  }
}

```

---

## 4. Configuración de Tipografías

### Importar fuentes en `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Playfair+Display:wght@400;700&display=swap');

```

### Definir fuentes en Tailwind

```jsx
fontFamily: {
sans: ['Poppins','sans-serif'],
serif: ['Playfair Display','serif'],
}

```

---

## 5. Directivas Base de Tailwind

En `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

---

## 6. Estilos Base Globales

Agregar estilos base recomendados:

```css
@layer base {
body {
@apply font-sans text-text bg-white;
  }

h1 {
@apply font-serif text-4xlmd:text-5xl font-bold;
  }

h2 {
@apply font-serif text-3xlmd:text-4xl font-bold;
  }

h3 {
@apply font-serif text-2xl font-semibold;
  }

p {
@apply text-base text-muted leading-relaxed;
  }
}

```

---

## 7. Breakpoints Responsive

Tailwind usa por defecto:

| Breakpoint | Uso |
| --- | --- |
| `sm` | Móvil grande |
| `md` | Tablet |
| `lg` | Laptop |
| `xl` | Desktop |
| `2xl` | Pantallas grandes |

No es necesario redefinirlos para el MVP.

---

## 8. Clases Utilitarias Recomendadas

### Botón Primario

```
bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition

```

### Card Base

```
bg-white rounded-2xl shadow-sm p-4

```

### Input Base

```
border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary

```

---

## 9. Estructura Recomendada de Estilos

```
src/
 ├─ index.css
 ├─ components/
 │   └─ ui/
 │       ├─Button.jsx
 │       ├─ Card.jsx
 │       └─Input.jsx

```

Esto permite reutilización y consistencia.

---

## 10. Validación de Instalación

En cualquier componente React:

```jsx
<h1 className="text-primary">Juliana’s</h1>

```

Si se ve correctamente estilado, Tailwind está funcionando.

---

## Resultado

- Tailwind correctamente configurado
- Paleta y tipografías integradas
- Base sólida para UI escalable
- Desarrollo rápido y ordenado
- Compatible con Render y producción