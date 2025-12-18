import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import PlaceholderPage from '../../pages/system/PlaceholderPage.tsx';
import type { Role } from '../../context/AuthContext.tsx';

type ProtectedRouteProps = {
  allowedRoles: Role[];
  children: ReactNode;
};

function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <PlaceholderPage
        badge="Auth"
        title="Inicia sesión para continuar"
        description="Esta sección requiere autenticación. Usa las vistas de login o registro mientras conectamos con el backend."
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <PlaceholderPage
        badge="Permisos"
        title="No tienes permisos para esta vista"
        description="Cambia al rol correcto desde el selector superior o ingresa con una cuenta autorizada."
      />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
