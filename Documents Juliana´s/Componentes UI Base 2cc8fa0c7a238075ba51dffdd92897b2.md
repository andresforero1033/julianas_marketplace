# Componentes UI Base

**Proyecto: Juliana’s – Marketplace Multivendedor**

---

## Objetivo

Definir e implementar los **componentes UI base** que servirán como cimientos visuales y funcionales de todo el frontend:

- Botones
- Cards
- Inputs
- Modales

Estos componentes deben ser:

- Reutilizables
- Responsivos
- Consistentes con la identidad femenina
- Fáciles de mantener

---

## Convenciones Generales

- Componentes desacoplados del negocio
- Props claras y predecibles
- Clases Tailwind centralizadas
- Accesibilidad básica incluida
- Sin lógica compleja

---

## Estructura Recomendada

```
src/
 └─ components/
     └─ ui/
         ├─Button.jsx
         ├─ Card.jsx
         ├─Input.jsx
         └─ Modal.jsx

```

---

## 1. Button (Botón)

### Uso

Acciones principales y secundarias.

### Props

- `variant`: primary | secondary | outline
- `type`: button | submit
- `disabled`
- `onClick`
- `children`

### Ejemplo de Implementación

```jsx
exportdefaultfunctionButton({
  variant ='primary',
  type ='button',
  disabled =false,
  children,
  ...props
}) {
const base ='px-6 py-3 rounded-xl font-semibold transition';
const variants = {
primary:'bg-primary text-white hover:opacity-90',
secondary:'bg-accent text-white hover:opacity-90',
outline:'border border-primary text-primary hover:bg-primary hover:text-white',
  };

return (
<button
type={type}
disabled={disabled}
className={`${base} ${variants[variant]} ${disabled ? 'opacity-50cursor-not-allowed': ''}`}
      {...props}
    >
      {children}
</button>
  );
}

```

---

## 2. Card

### Uso

Contenedores visuales (productos, secciones, dashboards).

### Props

- `children`
- `className`

### Ejemplo

```jsx
exportdefaultfunctionCard({ children, className = '' }) {
return (
<divclassName={`bg-whiterounded-2xlshadow-smp-4 ${className}`}>
      {children}
</div>
  );
}

```

---

## 3. Input

### Uso

Formularios, búsqueda, autenticación.

### Props

- `label`
- `type`
- `placeholder`
- `value`
- `onChange`
- `error`

### Ejemplo

```jsx
exportdefaultfunctionInput({
  label,
  type ='text',
  error,
  ...props
}) {
return (
<divclassName="flex flex-col gap-1">
      {label &&<labelclassName="text-sm font-medium text-text">{label}</label>}
<input
type={type}
className={`borderrounded-lgpx-4py-2focus:outline-nonefocus:ring-2focus:ring-primary
        ${error ? 'border-error': 'border-gray-300'}`}
        {...props}
      />
      {error &&<spanclassName="text-sm text-error">{error}</span>}
</div>
  );
}

```

---

## 4. Modal

### Uso

Confirmaciones, formularios, acciones críticas.

### Props

- `isOpen`
- `onClose`
- `title`
- `children`

### Ejemplo

```jsx
exportdefaultfunctionModal({ isOpen, onClose, title, children }) {
if (!isOpen)returnnull;

return (
<divclassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
<divclassName="bg-white rounded-2xl p-6 w-full max-w-md">
<divclassName="flex justify-between items-center mb-4">
<h3className="font-serif text-xl">{title}</h3>
<buttononClick={onClose}className="text-muted">✕</button>
</div>
        {children}
</div>
</div>
  );
}

```

---

## Estados y Accesibilidad

- Botones deshabilitados visibles
- Focus visible en inputs
- Modal con overlay
- Texto legible en todos los tamaños
- CTA claro

---

## Ejemplo de Uso Combinado

```jsx
<Card>
<h3>Collar Dorado</h3>
<p>Elegante y moderno</p>
<Button>Agregar al carrito</Button>
</Card>

```

---

## Resultado

- UI consistente en todo el sistema
- Menos código duplicado
- Fácil escalado
- Base sólida para pantallas complejas
- Estilo femenino coherente