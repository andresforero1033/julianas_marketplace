import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.tsx';
import LoginPage from '../pages/auth/LoginPage.tsx';
import RegisterPage from '../pages/auth/RegisterPage.tsx';
import HomePage from '../pages/home/HomePage.tsx';
import PlaceholderPage from '../pages/system/PlaceholderPage.tsx';

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
