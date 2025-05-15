// src/layouts/AnonymousLayout.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AnonymousLayout() {
 const { user } = useAuth();
  const mfaPending = sessionStorage.getItem("MFA_PENDING");
  if (user && !mfaPending) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
