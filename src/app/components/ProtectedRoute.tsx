import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';
import { UserRole } from '../data/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar se a role é permitida
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!allowedRoles.includes(user.role)) {
      // Redirecionar para a home apropriada
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (user.role === 'prefeitura') {
        return <Navigate to="/prefeitura" replace />;
      } else if (user.role === 'escola') {
        return <Navigate to={`/escola/${user.escolaId}`} replace />;
      }
    }
  }

  return <>{children}</>;
}
