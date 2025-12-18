import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Role } from '../../context/AuthContext.tsx';
import { useAuth } from '../../hooks/useAuth.ts';

const loginHighlights = [
  'Accede al panel de control y métricas en segundos',
  'Centraliza pedidos, catálogo y soporte en un solo lugar',
  'Tu sesión permanece segura con tokens y MFA (próximamente)',
];

const loginRoles: Array<{ value: Role; label: string }> = [
  { value: 'buyer', label: 'Compradora' },
  { value: 'vendor', label: 'Vendedora' },
  { value: 'admin', label: 'Administradora' },
];

function LoginPage() {
  const { loginAs } = useAuth();
  const [role, setRole] = useState<Role>('vendor');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginAs(role);
  };

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value as Role);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
      <section className="space-y-6 rounded-3xl bg-white/70 p-8 shadow-lg shadow-secondary/30">
        <span className="inline-flex items-center rounded-full bg-secondary/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          Acceso seguro
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif">Ingresa para gestionar tu marca</h1>
          <p className="text-lg text-muted">
            El login conecta con el backend Node/Express para validar tokens y cargar tu contexto (roles, catálogo y pedidos).
            Mientras tanto, puedes explorar la UI y validar el flujo completo.
          </p>
        </div>
        <ul className="space-y-3">
          {loginHighlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-text">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-base text-text">{item}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-dashed border-muted/50 p-4 text-sm text-muted">
          Integración pendiente: conectaremos este formulario con el endpoint `/api/auth/login`, incluyendo manejo de errores y recordatorio de sesión.
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-2xl shadow-primary/10">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Juliana’s Marketplace</p>
          <h2 className="text-3xl font-serif">Inicia sesión</h2>
          <p className="text-sm text-muted">Acceso para compradoras, vendedoras y administradoras.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text" htmlFor="login-email">
              Correo electrónico
            </label>
            <input
              className="w-full rounded-2xl border border-muted/40 px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              id="login-email"
              name="email"
              placeholder="tu-email@julianas.com"
              required
              type="email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text" htmlFor="login-password">
                Contraseña
              </label>
              <button className="text-sm font-semibold text-primary hover:underline" type="button">
                Recuperar
              </button>
            </div>
            <input
              className="w-full rounded-2xl border border-muted/40 px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              id="login-password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text" htmlFor="login-role">
              Rol para esta sesión
            </label>
            <select
              className="w-full rounded-2xl border border-muted/40 bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              id="login-role"
              onChange={handleRoleChange}
              value={role}
            >
              {loginRoles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted">
              Selecciona el rol que quieres validar mientras conectamos este formulario con el backend real.
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-muted">
            <label className="flex items-center gap-2">
              <input className="rounded border-muted text-primary focus:ring-primary/40" name="remember" type="checkbox" />
              <span>Recordarme 30 días</span>
            </label>
            <span>Soporta MFA</span>
          </div>

          <button className="w-full rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90" type="submit">
            Entrar
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center text-sm text-muted">
          <p>
            ¿No tienes cuenta?{' '}
            <Link className="font-semibold text-primary hover:underline" to="/registro">
              Crear perfil
            </Link>
          </p>
          <p className="text-xs uppercase tracking-[0.3em]">Soporte 24/7 para marcas activas</p>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
