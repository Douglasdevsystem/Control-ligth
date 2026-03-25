import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Lock, Mail, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getStoredPassword = (emailValue: string, fallbackPassword: string) => {
    try {
      const savedUsers = localStorage.getItem('systemUsers');
      if (!savedUsers) {
        return fallbackPassword;
      }

      const parsedUsers = JSON.parse(savedUsers) as Array<{ email?: string; password?: string }>;
      const matchedUser = parsedUsers.find(
        (user) => user.email?.toLowerCase() === emailValue.toLowerCase()
      );

      return matchedUser?.password || fallbackPassword;
    } catch {
      return fallbackPassword;
    }
  };

  const redirectByRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'prefeitura') {
      navigate('/prefeitura');
    } else if (user.role === 'escola' && user.escolaId) {
      navigate(`/escola/${user.escolaId}`);
    }
  };

  const performLogin = async (emailValue: string, passwordValue: string) => {
    const success = await login(emailValue, passwordValue);

    if (success) {
      redirectByRole();
    } else {
      setError('Email ou senha incorretos. Por favor, tente novamente.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await performLogin(email, password);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccess = async (emailValue: string, fallbackPassword: string) => {
    const resolvedPassword = getStoredPassword(emailValue, fallbackPassword);

    setError('');
    setEmail(emailValue);
    setPassword(resolvedPassword);
    setIsLoading(true);

    try {
      await performLogin(emailValue, resolvedPassword);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-2xl">
              <Zap className="h-14 w-14 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Gestão Energética
          </h1>
          <p className="text-blue-200 text-base">
            Controle de Ativos Energéticos Municipal
          </p>
        </div>

        {/* Card de Login */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 shadow-2xl border-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Bem-vindo
            </h2>
            <p className="text-gray-500 text-sm">
              Faça login para acessar o sistema
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@instituicao.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 border-gray-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 border-gray-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-base font-semibold shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Info de Teste */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                💡 Credenciais de Teste
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 text-xs border-blue-200 text-blue-800 hover:bg-blue-100"
                  onClick={() => handleQuickAccess('admin@energysmart.com.br', 'admin123')}
                  disabled={isLoading}
                >
                  Entrar como Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 text-xs border-blue-200 text-blue-800 hover:bg-blue-100"
                  onClick={() => handleQuickAccess('gestao@prefeitura-sp.gov.br', 'pref123')}
                  disabled={isLoading}
                >
                  Entrar como Prefeitura
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 text-xs border-blue-200 text-blue-800 hover:bg-blue-100"
                  onClick={() => handleQuickAccess('direcao@joaosilva.edu.br', 'escola123')}
                  disabled={isLoading}
                >
                  Entrar como Escola
                </Button>
              </div>
              <div className="space-y-2 text-xs text-blue-800">
                <div>
                  <span className="font-semibold">Admin:</span>
                  <br />
                  <span className="text-blue-700">admin@energysmart.com.br / admin123</span>
                </div>
                <div>
                  <span className="font-semibold">Prefeitura:</span>
                  <br />
                  <span className="text-blue-700">gestao@prefeitura-sp.gov.br / pref123</span>
                </div>
                <div>
                  <span className="font-semibold">Escola:</span>
                  <br />
                  <span className="text-blue-700">direcao@joaosilva.edu.br / escola123</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-center text-blue-200 mt-6 text-sm">
          © 2026 Prefeitura Municipal
        </p>
      </div>
    </div>
  );
}