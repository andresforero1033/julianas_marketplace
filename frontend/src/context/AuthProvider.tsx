import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, ROLE_OPTIONS, type AuthUser, type Role } from './AuthContext.tsx';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>({
    name: 'Juliana Demo',
    email: 'demo@julianas.com',
    role: 'vendor',
  });

  const loginAs = useCallback((role: Role) => {
    setUser({ name: 'Juliana Demo', email: 'demo@julianas.com', role });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      roles: ROLE_OPTIONS,
      loginAs,
      logout,
    }),
    [loginAs, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
