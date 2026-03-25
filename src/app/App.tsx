import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { DashboardAdmin } from './components/DashboardAdmin';
import { DashboardPrefeitura } from './components/DashboardPrefeitura';
import { DashboardEscola } from './components/DashboardEscola';
import { DashboardSala } from './components/DashboardSala';
import { DashboardBloco } from './components/DashboardBloco';
import { AdminUsers } from './components/AdminUsers';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Rotas do Admin (Empresa) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          
          {/* Rotas da Prefeitura */}
          <Route
            path="/prefeitura"
            element={
              <ProtectedRoute requiredRole="prefeitura">
                <DashboardPrefeitura />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prefeitura/:id"
            element={
              <ProtectedRoute requiredRole={['admin', 'prefeitura']}>
                <DashboardPrefeitura />
              </ProtectedRoute>
            }
          />
          
          {/* Rotas da Escola */}
          <Route
            path="/escola/:id"
            element={
              <ProtectedRoute>
                <DashboardEscola />
              </ProtectedRoute>
            }
          />
          <Route
            path="/escola/:id/sala/:salaId"
            element={
              <ProtectedRoute>
                <DashboardSala />
              </ProtectedRoute>
            }
          />
          <Route
            path="/escola/:id/bloco/:corredorId"
            element={
              <ProtectedRoute>
                <DashboardBloco />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}