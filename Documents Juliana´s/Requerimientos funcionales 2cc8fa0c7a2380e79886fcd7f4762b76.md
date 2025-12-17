# Requerimientos funcionales

# Requerimientos Funcionales – Juliana’s

## 1. Gestión de Usuarios y Autenticación

### 1.1 Registro de usuarios

- El sistema debe permitir el registro de:
    - Compradoras
    - Vendedoras
    - Administradores
- Registro mediante:
    - Email y contraseña
    - (Opcional) OAuth (Google / Apple)
- Validación de email.
- Aceptación de términos y condiciones.

### 1.2 Inicio de sesión

- Login seguro con email y contraseña.
- Recuperación de contraseña por email.
- Persistencia de sesión.
- Cierre de sesión manual.

### 1.3 Roles y permisos

- Rol **Compradora**
- Rol **Vendedora**
- Rol **Administrador**
- Restricción de vistas y acciones según rol.
- Control de acceso a endpoints y UI.

---

## 2. Perfil de Usuario

### 2.1 Perfil de compradora

- Ver y editar datos personales.
- Gestión de direcciones de envío.
- Historial de pedidos.
- Métodos de pago guardados.
- Wishlist (favoritos).

### 2.2 Perfil de vendedora

- Información del negocio/marca.
- Logo e imágenes de marca.
- Datos de contacto.
- Configuración de políticas (envíos, devoluciones).
- Estado de la cuenta (activa, suspendida).

---

## 3. Gestión de Productos (Multivendedor)

### 3.1 Creación de productos

- Nombre del producto.
- Descripción detallada.
- Categoría y subcategoría.
- Precio y precio en oferta.
- Variantes:
    - Colores
    - Tallas
    - Presentaciones
- Stock por variante.
- Imágenes múltiples (galería).
- Etiquetas: Nuevo, Destacado, Oferta.
- Estado del producto (borrador, publicado, pausado).

### 3.2 Edición y eliminación

- Edición total del producto.
- Eliminación lógica (no física).
- Historial de cambios.

### 3.3 Visualización

- Cards de producto con:
    - Imagen
    - Precio
    - Oferta
    - Nombre
    - Vendedor
- Vista de detalle del producto.

---

## 4. Catálogo y Navegación

### 4.1 Catálogo público

- Listado general de productos.
- Ordenamiento:
    - Más vendidos
    - Más nuevos
    - Precio
- Paginación o scroll infinito.

### 4.2 Filtros

- Por categoría.
- Por rango de precio.
- Por color.
- Por talla.
- Por vendedor.
- Por disponibilidad.

### 4.3 Búsqueda

- Búsqueda por texto.
- Autocompletado.
- Resultados relevantes.

---

## 5. Carrito de Compras

- Agregar productos al carrito.
- Editar cantidades.
- Eliminar productos.
- Carrito persistente.
- Validación de stock en tiempo real.
- Cálculo automático de:
    - Subtotal
    - Envío
    - Impuestos (si aplica)
    - Total

---

## 6. Proceso de Compra (Checkout)

- Selección de dirección.
- Selección de método de pago.
- Resumen del pedido.
- Confirmación de compra.
- Generación de número de pedido.
- Notificación por email.
- Soporte para múltiples vendedores en un mismo pedido.

---

## 7. Pagos

- Integración con pasarela de pago.
- Soporte para:
    - Tarjetas
    - Transferencias
    - Wallets (según región)
- Confirmación automática de pago.
- Manejo de pagos fallidos.
- Registro de transacciones.
- Comisión por venta (marketplace).

---

## 8. Gestión de Pedidos

### 8.1 Compradora

- Ver estado del pedido:
    - Pendiente
    - Pagado
    - Enviado
    - Entregado
- Seguimiento del envío.
- Solicitud de devolución.

### 8.2 Vendedora

- Ver pedidos asociados.
- Cambiar estado del pedido.
- Cargar número de guía.
- Gestión de devoluciones.

### 8.3 Administrador

- Vista global de pedidos.
- Intervención manual.
- Resolución de disputas.

---

## 9. Envíos y Logística

- Configuración de costos de envío.
- Integración con proveedores logísticos.
- Cálculo de envío por producto o vendedor.
- Seguimiento de envíos.

---

## 10. Reseñas y Calificaciones

- Compradoras pueden calificar productos.
- Comentarios con texto.
- Calificación por estrellas.
- Moderación de reseñas.
- Promedio visible por producto y vendedor.

---

## 11. Dashboard de Vendedoras

- Resumen de ventas.
- Productos activos.
- Pedidos recientes.
- Métricas:
    - Ingresos
    - Ventas
    - Productos más vendidos
- Gestión completa del catálogo.

---

## 12. Dashboard Administrativo

- Gestión de usuarios.
- Gestión de vendedoras.
- Gestión de productos.
- Moderación de contenido.
- Gestión de categorías.
- Visualización de métricas globales:
    - Ventas totales
    - Usuarios activos
    - Engagement
- Control de comisiones.

---

## 13. Promociones y Marketing

- Productos destacados.
- Banners promocionales.
- Ofertas temporales.
- Cupones de descuento.
- Campañas por categoría o vendedor.

---

## 14. Analítica y Métricas

- Vistas por producto.
- Conversión.
- Ventas por categoría.
- Rendimiento por vendedora.
- Dashboard analítico con gráficos.

---

## 15. Notificaciones

- Notificaciones in-app.
- Emails automáticos:
    - Registro
    - Compra
    - Envío
    - Cambios de estado
- Alertas a vendedoras y administradores.

---

## 16. Wishlist y Favoritos

- Guardar productos.
- Ver lista de favoritos.
- Notificaciones de cambio de precio.

---

## 17. Seguridad y Control

- Protección de rutas.
- Validación de datos.
- Registro de actividad (logs).
- Bloqueo de cuentas.
- Manejo de fraudes.

---

## 18. Configuración del Sistema

- Configuración general del marketplace.
- Comisiones.
- Políticas legales.
- Idioma y moneda.

---

## 19. Soporte y Atención al Cliente

- Sistema de tickets.
- Chat interno.
- Historial de conversaciones.
- Escalamiento a administración.

---

## 20. Requerimientos de UI/UX

- Diseño responsive (mobile, tablet, desktop).
- Accesibilidad básica.
- Tiempo de carga optimizado.
- Consistencia visual.

---

## 21. Escalabilidad y Operación

- Arquitectura preparada para múltiples vendedores.
- Soporte para alto volumen de productos.
- Preparación para despliegue en Render.
- Compatibilidad con MongoDB Atlas.