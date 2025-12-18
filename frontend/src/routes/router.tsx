import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
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
        element: (
          <PlaceholderPage
            badge="Auth"
            title="Acceso para vendedoras y admins"
            description="Implementaremos login con validación y conexión al backend en las tareas 5 y 6."
          />
        ),
      },
      {
        path: 'registro',
        element: (
          <PlaceholderPage
            badge="Auth"
            title="Registro de nuevas cuentas"
            description="Pantalla para crear perfiles de compradora y vendedora. Llegará después del layout general."
          />
        ),
      },
      {
        path: 'panel/vendedora',
        element: (
          <PlaceholderPage
            badge="Dashboard"
            title="Panel de control de vendedora"
            description="Aquí vivirá la suite de métricas, pedidos y catálogo específico para cada marca."
          />
        ),
      },
      {
        path: 'panel/admin',
        element: (
          <PlaceholderPage
            badge="Dashboard"
            title="Panel administrativo"
            description="Vista para admins con gestión global de usuarios, productos y métricas."
          />
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
