import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../constants/auth.js';

export default function GuestRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
