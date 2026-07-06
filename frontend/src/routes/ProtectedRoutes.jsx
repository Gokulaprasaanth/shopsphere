import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/ui/Loader/Loader';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized role, redirect to home or admin dashboard depending on role
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/products'} replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/products'} replace />;
  }

  return <Outlet />;
};
