import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../lib/seo';

export function Register() {
  usePageMeta({ title: 'Create an account', description: 'Create an account for Our Cafe Journal.' });
  const { signUp } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    const result = await signUp(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setConfirmationSent(true);
      return;
    }

    // Email confirmation disabled on the Supabase project → session exists already.
    success('Account created — welcome!');
    navigate('/', { replace: true });
  }

  if (confirmationSent) {
    return (
      <AuthLayout eyebrow="Almost there" title="Check your email">
        <p className="text-sm text-ink-soft text-center leading-relaxed">
          We've sent a confirmation link to <span className="font-medium text-ink">{email}</span>.
          Follow it to finish setting up your account, then come back and log in.
        </p>
        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-medium text-accent-deep hover:text-accent"
        >
          Back to log in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="Just for us" title="Create an account">
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="text-sm text-red-500 -mt-1">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="mt-1">
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent-deep hover:text-accent">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
