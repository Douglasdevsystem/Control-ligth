import { useNavigate } from 'react-router';
import { prefeituras, getDashboardAdmin, getEscolasByPrefeitura } from '../data/mockData';
import {
  Building2,
  School,
  TrendingDown,
  TrendingUp,
  Zap,
  DollarSign,
  BarChart3,
  Users,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserMenu } from './UserMenu';

export function DashboardAdmin() {
  const navigate = useNavigate();
  const stats = getDashboardAdmin();

  const reducao = stats.reducaoConsumo;
  const percentualReducao = parseFloat(stats.percentualReducao);
  const isMelhora = reducao > 0;

  // Dados por prefeitura
  const dadosPrefeituras = prefeituras.map((pref) => {
    const escolasPref = getEscolasByPrefeitura(pref.id);
    const consumoAtual = escolasPref.reduce((sum, e) => sum + e.consumoMesAtual, 0);
    const consumoAnterior = escolasPref.reduce((sum, e) => sum + e.consumoMesAnterior, 0);
    
    return {
      id: pref.id,
      nome: pref.cidade,
      Atual: consumoAtual,
      Anterior: consumoAnterior,
      escolas: escolasPref.length,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                <p className="text-blue-200">Gestão Energética Municipal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/users')}
                className="text-white hover:bg-blue-800"
              >
                <Users className="mr-2 h-5 w-5" />
                Gerenciar Usuários
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Total de Prefeituras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{prefeituras.length}</div>
              <p className="text-blue-100 text-sm mt-1">Unidades cadastradas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <School className="h-4 w-4" />
                Total de Escolas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalEscolas}</div>
              <p className="text-purple-100 text-sm mt-1">Em todas as prefeituras</p>
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
              <div className="text-3xl font-bold">{stats.consumoTotalAtual.toLocaleString()} kWh</div>
              <p className="text-orange-100 text-sm mt-1">Mês atual</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Consumo Anterior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.consumoTotalAnterior.toLocaleString()} kWh</div>
              <p className="text-emerald-100 text-sm mt-1">Mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico Comparativo */}
        <Card>
          <CardHeader>
            <CardTitle>Consumo por Prefeitura</CardTitle>
            <CardDescription>Comparativo mês atual vs. anterior (kWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosPrefeituras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Anterior" fill="#94a3b8" name="Mês Anterior" />
                <Bar dataKey="Atual" fill="#6366f1" name="Mês Atual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lista de Prefeituras */}
        <Card>
          <CardHeader>
            <CardTitle>Prefeituras Cadastradas</CardTitle>
            <CardDescription>Clique para visualizar o dashboard de cada prefeitura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prefeituras.map((pref) => {
                const escolasPref = getEscolasByPrefeitura(pref.id);
                const consumo = escolasPref.reduce((sum, e) => sum + e.consumoMesAtual, 0);

                return (
                  <div
                    key={pref.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/prefeitura/${pref.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{pref.nome}</h3>
                        <p className="text-sm text-gray-600">{pref.cidade} - {pref.estado}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {escolasPref.length} escola{escolasPref.length !== 1 ? 's' : ''} • {pref.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {consumo.toLocaleString()} kWh
                      </div>
                      <div className="text-sm text-gray-600">
                        Mês atual
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