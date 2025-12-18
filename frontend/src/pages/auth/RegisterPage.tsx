import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Role } from '../../context/AuthContext.tsx';
import { useAuth } from '../../hooks/useAuth.ts';

const accountTypes: Array<{ value: Role; label: string }> = [
  { value: 'buyer', label: 'Compradora' },
  { value: 'vendor', label: 'Vendedora' },
  { value: 'admin', label: 'Administradora' },
];

const onboardingSteps = [
  'Valida tu identidad y marca (24h)',
  'Carga catálogo, medios y condiciones de envío',
  'Activa canales de venta y comienza a recibir pedidos',
];

function RegisterPage() {
  const { loginAs } = useAuth();
  const [role, setRole] = useState<Role>('buyer');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginAs(role);
  };

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value as Role);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      <section className="rounded-3xl bg-white p-8 shadow-2xl shadow-secondary/30">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Nueva cuenta</p>
          <h2 className="text-3xl font-serif">Crea tu perfil</h2>
          <p className="text-sm text-muted">Un solo formulario para compradoras, vendedoras o admins.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text" htmlFor="register-name">
                Nombre completo / Marca
              </label>
              <input
                className="w-full rounded-2xl border border-muted/40 px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                id="register-name"
                name="name"
                placeholder="Juliana Boutique"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text" htmlFor="register-email">
                Correo de contacto
              </label>
              <input
                className="w-full rounded-2xl border border-muted/40 px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                id="register-email"
                name="email"
                placeholder="contacto@julianas.com"
                required
                type="email"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text" htmlFor="register-phone">
                Teléfono / WhatsApp
              </label>
              <input
                className="w-full rounded-2xl border border-muted/40 px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                id="register-phone"
                name="phone"
                placeholder="+57 300 000 0000"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text" htmlFor="register-role">
                Tipo de cuenta
              </label>
              <select
                className="w-full rounded-2xl border border-muted/40 bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                id="register-role"
                name="role"
                onChange={handleRoleChange}
                value={role}
              >
                {accountTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted">Esto también simula el rol que quedará activo tras el registro.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text" htmlFor="register-password">
              Crea una contraseña
            </label>
            <input
              className="w-full rounded-2xl border border-muted/40 px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              id="register-password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </div>

          <div className="space-y-3 rounded-2xl bg-light/70 p-4 text-sm text-muted">
            <label className="flex items-center gap-2 text-text">
              <input className="rounded border-muted text-primary focus:ring-primary/40" required type="checkbox" />
              <span>Acepto los términos, políticas de datos y reglas del marketplace.</span>
            </label>
            <label className="flex items-center gap-2 text-text">
              <input className="rounded border-muted text-primary focus:ring-primary/40" type="checkbox" />
              <span>Quiero recibir tips y recordatorios por correo.</span>
            </label>
          </div>

          <button className="w-full rounded-2xl bg-text px-6 py-3 text-base font-semibold text-white shadow-lg shadow-muted/30 transition hover:opacity-90" type="submit">
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link className="font-semibold text-primary hover:underline" to="/login">
            Inicia sesión
          </Link>
        </p>
      </section>

      <section className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-lg shadow-primary/20">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          Onboarding guiado
        </span>
        <h1 className="text-4xl font-serif">Checklist de activación</h1>
        <p className="text-lg text-muted">
          Nuestro equipo acompaña la publicación de tu marca en menos de 48 horas. Completa el formulario y te guiaremos con la documentación necesaria.
        </p>
        <ol className="space-y-4">
          {onboardingSteps.map((step, index) => (
            <li key={step} className="flex gap-4 rounded-2xl border border-light bg-white/90 px-4 py-4 shadow-sm">
              <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white">
                {index + 1}
              </span>
              <p className="text-base text-text">{step}</p>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl border border-dashed border-muted/60 p-4 text-sm text-muted">
          Pronto conectaremos este flujo con `/api/auth/register` y agregaremos verificación por correo y aprobación manual para cuentas de vendedora/admin.
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
