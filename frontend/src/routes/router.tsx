import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.tsx';
import LoginPage from '../pages/auth/LoginPage.tsx';
import RegisterPage from '../pages/auth/RegisterPage.tsx';
import CatalogPage from '../pages/catalog/CatalogPage.tsx';
import ProductDetailPage from '../pages/catalog/ProductDetailPage.tsx';
import SearchPage from '../pages/catalog/SearchPage.tsx';
import HomePage from '../pages/home/HomePage.tsx';
import PlaceholderPage from '../pages/system/PlaceholderPage.tsx';
import CartPage from '../pages/cart/CartPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'catalogo',
        element: <CatalogPage />,
      },
      {
        path: 'catalogo/:productId',
        element: <ProductDetailPage />,
      },
      {
        path: 'buscar',
        element: <SearchPage />,
      },
      {
        path: 'carrito',
        element: <CartPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'registro',
        element: <RegisterPage />,
      },
      {
        path: 'panel/vendedora',
        element: (
          <ProtectedRoute allowedRoles={['vendor', 'admin']}>
            <PlaceholderPage
              badge="Dashboard"
              title="Panel de control de vendedora"
              description="Aquí vivirá la suite de métricas, pedidos y catálogo específico para cada marca."
            />
          </ProtectedRoute>
        ),
      },
      {
        path: 'panel/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <PlaceholderPage
              badge="Dashboard"
              title="Panel administrativo"
              description="Vista para admins con gestión global de usuarios, productos y métricas."
            />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: (
          <PlaceholderPage
            badge="Error"
            title="No encontramos esta pantalla"
            description="Revisa la URL o regresa al inicio para continuar con el flujo planificado."
          />
        ),
      },
    ],
  },
]);
