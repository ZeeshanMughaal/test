import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

export default function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
