import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

export type Role = 'buyer' | 'vendor' | 'admin';

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  roles: Role[];
  loginAs: (role: Role) => void;
  logout: () => void;
};

const ROLE_OPTIONS: Role[] = ['buyer', 'vendor', 'admin'];

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
