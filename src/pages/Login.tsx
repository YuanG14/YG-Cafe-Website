import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../lib/seo';

interface LocationState {
  from?: { pathname: string };
}

export function Login() {
  usePageMeta({ title: 'Log in', description: 'Log in to Our Cafe Journal.' });
  const { signIn } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn(email, password, remember);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    success('Welcome back!');
    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/';
    navigate(redirectTo, { replace: true });
  }

  return (
    <AuthLayout eyebrow="Welcome back" title="Log in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm text-ink-soft select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-hairline text-accent focus-visible:outline-2 focus-visible:outline-accent"
          />
          Remember me on this device
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-500 -mt-1">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="mt-1">
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{' '}
        <Link to="/register" className="font-medium text-accent-deep hover:text-accent">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
