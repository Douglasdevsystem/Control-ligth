import { useNavigate, useParams } from 'react-router';
import { getEscolasByPrefeitura, getPrefeituraById, getDashboardPrefeitura } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2,
  School,
  TrendingDown,
  TrendingUp,
  Zap,
  DollarSign,
  BarChart3,
  ArrowLeft,
  Activity,
  LayoutGrid,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserMenu } from './UserMenu';

export function DashboardPrefeitura() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  
  // Determinar o ID da prefeitura (da URL ou do usuário)
  const prefeituraId = id || user?.prefeituraId;
  
  if (!prefeituraId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prefeitura não encontrada</h2>
          <Button onClick={() => navigate('/admin')}>Voltar</Button>
        </div>
      </div>
    );
  }

  const prefeitura = getPrefeituraById(prefeituraId);
  const escolas = getEscolasByPrefeitura(prefeituraId);
  const stats = getDashboardPrefeitura(prefeituraId);

  if (!prefeitura) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prefeitura não encontrada</h2>
          <Button onClick={() => navigate('/admin')}>Voltar</Button>
        </div>
      </div>
    );
  }

  const reducao = stats.reducaoConsumo;
  const percentualReducao = parseFloat(stats.percentualReducao);
  const isMelhora = reducao > 0;

  // Dados consolidados para gráfico
  const dadosComparativos = escolas.map((escola) => ({
    id: escola.id,
    nome: escola.nome.replace('Escola Municipal ', ''),
    Atual: escola.consumoMesAtual,
    Anterior: escola.consumoMesAnterior,
  }));

  // Histórico consolidado
  const historicoConsolidado = ['Set', 'Out', 'Nov', 'Dez', 'Jan'].map((mes, index) => {
    const consumoTotal = escolas.reduce((sum, escola) => {
      return sum + (escola.historico[index]?.consumo || 0);
    }, 0);
    return {
      id: `${mes}-${index}`,
      mes,
      consumo: consumoTotal,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {user?.role === 'admin' && (
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="text-white hover:bg-blue-800"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar ao Painel Admin
              </Button>
            )}
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">{prefeitura.nome}</h1>
                <p className="text-blue-200">{prefeitura.cidade} - {prefeitura.estado}</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <School className="h-4 w-4" />
                Total de Escolas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalEscolas}</div>
              <p className="text-blue-100 text-sm mt-1">Unidades cadastradas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Consumo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.consumoTotal.toLocaleString()} kWh</div>
              <p className="text-orange-100 text-sm mt-1">Mês atual</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Consumo Anterior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.consumoMesAnterior.toLocaleString()} kWh</div>
              <p className="text-purple-100 text-sm mt-1">Mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Salas Monitoradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalSalas}</div>
              <p className="text-emerald-100 text-sm mt-1">Em todas as escolas</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Consumo por Escola - Comparativo</CardTitle>
              <CardDescription>Mês atual vs. mês anterior (kWh)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosComparativos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" angle={-15} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Anterior" fill="#94a3b8" name="Mês Anterior" />
                  <Bar dataKey="Atual" fill="#1e40af" name="Mês Atual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendência de Consumo</CardTitle>
              <CardDescription>Últimos 5 meses (kWh)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicoConsolidado}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="consumo" stroke="#1e40af" strokeWidth={3} name="Consumo Total" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Escolas */}
        <Card>
          <CardHeader>
            <CardTitle>Escolas</CardTitle>
            <CardDescription>Clique para visualizar detalhes de cada escola</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {escolas.map((escola) => {
                const reducaoEscola = escola.consumoMesAnterior - escola.consumoMesAtual;
                const percentualEscola = ((reducaoEscola / escola.consumoMesAnterior) * 100).toFixed(1);
                const isMelhoraEscola = reducaoEscola > 0;

                return (
                  <div
                    key={escola.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/escola/${escola.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <School className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{escola.nome}</h3>
                        <p className="text-sm text-gray-600">{escola.endereco}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {escola.consumoMesAtual.toLocaleString()} kWh
                      </div>
                      <div className={`text-sm ${isMelhoraEscola ? 'text-green-600' : 'text-red-600'}`}>
                        {isMelhoraEscola ? '↓' : '↑'} {Math.abs(parseFloat(percentualEscola))}% vs anterior
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}