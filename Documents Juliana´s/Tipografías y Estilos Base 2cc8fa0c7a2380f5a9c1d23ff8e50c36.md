# Tipografías y Estilos Base

**Proyecto: Juliana’s – Marketplace Multivendedor**

---

## Objetivo

Definir un sistema tipográfico claro, legible y femenino que:

- Refuerce la identidad de marca
- Mejore la lectura en todos los dispositivos
- Soporte jerarquía visual clara
- Sea fácil de implementar y mantener

---

## Principios Tipográficos

- Legibilidad primero
- Mobile-first
- Consistencia entre pantallas
- Contraste adecuado
- Máximo **2 familias tipográficas**

---

## Tipografía Principal (Texto y UI)

### **Poppins**

- Moderna
- Redondeada
- Amigable
- Muy usada en e-commerce

**Usos**

- Texto general
- Botones
- Formularios
- Navegación
- Dashboards

**Pesos recomendados**

- Regular (400)
- Medium (500)
- SemiBold (600)

---

## Tipografía Secundaria (Títulos y énfasis)

### **Playfair Display**

- Elegante
- Estilo editorial
- Ideal para moda y lifestyle

**Usos**

- Títulos principales
- Hero text
- Secciones destacadas

**Pesos recomendados**

- Regular (400)
- Bold (700)

---

## Alternativa Sans

Si se desea simplificar:

- **Inter**
- **Montserrat**

---

## Escala Tipográfica Base

| Nivel | Uso | Móvil | Desktop |
| --- | --- | --- | --- |
| H1 | Hero / Título principal | 2rem | 3rem |
| H2 | Sección | 1.5rem | 2.25rem |
| H3 | Sub-sección | 1.25rem | 1.75rem |
| Body | Texto normal | 1rem | 1rem |
| Small | Metadata | 0.875rem | 0.875rem |

---

## Line Height y Espaciado

- Body: `1.6`
- Títulos: `1.2`
- Margen inferior consistente entre bloques
- Evitar bloques densos de texto

---

## Estilos Base por Elemento

### Títulos

- Fuente: Playfair Display
- Color: Gris Oscuro
- Peso: Bold

### Texto

- Fuente: Poppins
- Color: Gris Medio
- Peso: Regular

### Botones

- Fuente: Poppins
- Peso: SemiBold
- Texto en mayúscula ligera (tracking)

---

## Implementación en Tailwind

### Importar fuentes

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Playfair+Display:wght@400;700&display=swap');

```

### Configuración Tailwind

```jsx
theme: {
extend: {
fontFamily: {
sans: ['Poppins','sans-serif'],
serif: ['Playfair Display','serif'],
    }
  }
}

```

---

## Clases Base Recomendadas

```
h1 → font-serif text-4xl md:text-5xl font-bold
h2 → font-serif text-3xl md:text-4xl font-bold
h3 → font-serif text-2xl font-semibold
p  → font-sans text-base text-muted leading-relaxed

```

---

## Estados y Variaciones

- Links: subrayado suave + hover color primario
- Botones: hover + shadow ligera
- Inputs: bordes redondeados, focus visible

---

## Accesibilidad

- Tamaño mínimo texto: 14px
- Contraste AA
- No abusar de texto decorativo
- Evitar fuentes cursivas largas

---

## Resultado

- Identidad clara y femenina
- Excelente legibilidad
- UI profesional
- Escalable y coherente
- Fácil de implementar