# Roles del sistema

Para el MVP, Juliana’s necesita **solo 3 roless**

| Rol | Descripción |
| --- | --- |
| **Compradora** | Persona que navega, agrega al carrito y compra |
| **Vendedora** | Persona o marca que publica y vende productos |
| **Administrador** | Control total del marketplace |

# Permisos por Rol

## 1. Compradora

### Puede:

- Registrarse e iniciar sesión
- Ver catálogo de productos
- Buscar y filtrar productos
- Ver detalle de producto
- Agregar productos al carrito
- Comprar productos
- Ver sus pedidos
- Editar su perfil básico

### NO puede:

- Crear productos
- Ver dashboards
- Ver pedidos de otras personas
- Acceder a administración
- Ver métricas del sistema

---

## 2. Vendedora

### Puede:

- Registrarse como vendedora
- Iniciar sesión
- Crear productos
- Editar sus propios productos
- Activar / desactivar productos
- Ver pedidos de **sus productos**
- Ver ingresos básicos
- Editar su perfil de tienda

### NO puede:

- Ver productos de otras vendedoras (modo edición)
- Ver pedidos de otras vendedoras
- Ver métricas globales
- Modificar comisiones
- Acceder a panel administrativo global

---

## 3. Administrador

### Puede:

- Acceder al panel administrativo
- Ver todos los usuarios
- Ver todas las vendedoras
- Ver todos los productos
- Bloquear o eliminar productos
- Ver todos los pedidos
- Intervenir en pedidos
- Gestionar categorías
- Definir reglas del marketplace

### NO puede:

- Comprar como usuaria normal (opcional)
- Ser vendedora activa (recomendado separarlo)