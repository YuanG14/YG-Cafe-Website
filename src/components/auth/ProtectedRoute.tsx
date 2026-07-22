import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-ink-soft">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Remember where they were headed so we can send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
