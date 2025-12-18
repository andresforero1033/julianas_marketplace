import { createContext } from 'react';

export type Role = 'buyer' | 'vendor' | 'admin';

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
};

export type AuthContextValue = {
  user: AuthUser | null;
  roles: Role[];
  loginAs: (role: Role) => void;
  logout: () => void;
};

export const ROLE_OPTIONS: Role[] = ['buyer', 'vendor', 'admin'];

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
