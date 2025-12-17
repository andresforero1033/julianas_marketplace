# Paleta de Colores – Juliana’s

**Estilo: Femenino · Elegante · Moderno · Comercial**

---

## Objetivo

Definir una **paleta de colores femenina**, equilibrada y comercial, que transmita:

- Confianza
- Elegancia
- Cercanía
- Moda y lifestyle

Sin caer en estereotipos ni saturación visual.

---

## Principios de Color

- Un color primario dominante
- Un color secundario de apoyo
- Neutros claros para respiración visual
- Acentos suaves para estados y etiquetas
- Alto contraste para accesibilidad

---

## Colores Principales

### 🎀 Color Primario – Rosa Elegante

Usado para CTAs, botones principales y acciones clave.

- **Hex:** `#E91E63`
- **Uso:** Comprar, Agregar al carrito, Finalizar compra
- **Emoción:** Feminidad, acción, atracción

---

### 🌸 Color Secundario – Rosa Suave

Usado como fondo ligero o hover.

- **Hex:** `#F8BBD0`
- **Uso:** Backgrounds suaves, cards destacadas
- **Emoción:** Calma, delicadeza

---

## Colores Neutros

### 🤍 Blanco Base

- **Hex:** `#FFFFFF`
- **Uso:** Fondo principal

### 🌫 Gris Claro

- **Hex:** `#F5F5F5`
- **Uso:** Secciones, separadores

### 🖤 Gris Oscuro (Texto)

- **Hex:** `#333333`
- **Uso:** Texto principal

### 🌪 Gris Medio

- **Hex:** `#757575`
- **Uso:** Texto secundario

---

## Colores de Estado

### 💚 Éxito

- **Hex:** `#4CAF50`
- **Uso:** Pago exitoso, acción correcta

### 🧡 Advertencia

- **Hex:** `#FF9800`
- **Uso:** Stock bajo, alertas

### ❤️ Error

- **Hex:** `#F44336`
- **Uso:** Errores, validaciones

---

## Colores de Acento

### ✨ Dorado Suave

- **Hex:** `#C9A24D`
- **Uso:** Ofertas, premium, joyería
- **Emoción:** Elegancia, lujo accesible

---

## Ejemplo de Jerarquía de Uso

| Elemento | Color |
| --- | --- |
| CTA Principal | Rosa Elegante |
| CTA Secundario | Dorado Suave |
| Fondo general | Blanco |
| Cards | Gris Claro |
| Texto principal | Gris Oscuro |
| Texto secundario | Gris Medio |
| Ofertas | Dorado Suave |
| Estados | Verde / Naranja / Rojo |

---

## Implementación en Tailwind (Ejemplo)

```jsx
// tailwind.config.js
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

## Accesibilidad

- Contraste AA mínimo en texto
- CTA con fondo sólido
- No usar color como único indicador
- Estados siempre con texto o icono

---

## Resultado

- Identidad femenina clara y elegante
- UI coherente y profesional
- Fácil mantenimiento
- Compatible con React + Tailwind
- Escalable a nuevas categorías