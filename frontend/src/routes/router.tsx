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
import CheckoutPage from '../pages/checkout/CheckoutPage.tsx';
import CheckoutSuccessPage from '../pages/checkout/CheckoutSuccessPage.tsx';
import VendorLayout from '../pages/vendor/VendorLayout.tsx';
import VendorDashboardPage from '../pages/vendor/VendorDashboardPage.tsx';
import VendorProductsPage from '../pages/vendor/VendorProductsPage.tsx';
import VendorOrdersPage from '../pages/vendor/VendorOrdersPage.tsx';
import VendorMetricsPage from '../pages/vendor/VendorMetricsPage.tsx';
import AdminLayout from '../pages/admin/AdminLayout.tsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.tsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.tsx';
import AdminProductsPage from '../pages/admin/AdminProductsPage.tsx';
import AdminMetricsPage from '../pages/admin/AdminMetricsPage.tsx';

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
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'checkout/confirmacion',
        element: <CheckoutSuccessPage />,
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
            <VendorLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <VendorDashboardPage />,
          },
          {
            path: 'productos',
            element: <VendorProductsPage />,
          },
          {
            path: 'pedidos',
            element: <VendorOrdersPage />,
          },
          {
            path: 'metricas',
            element: <VendorMetricsPage />,
          },
        ],
      },
      {
        path: 'panel/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: 'usuarios',
            element: <AdminUsersPage />,
          },
          {
            path: 'productos',
            element: <AdminProductsPage />,
          },
          {
            path: 'metricas',
            element: <AdminMetricsPage />,
          },
        ],
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
