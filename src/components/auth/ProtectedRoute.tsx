import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../layout/PageLoader';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    // Remember where they were headed so we can send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
