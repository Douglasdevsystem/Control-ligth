import { useNavigate } from 'react-router';
import { escolas, getDashboardMunicipal } from '../data/mockData';
import {
  Building2,
  TrendingDown,
  TrendingUp,
  Zap,
  DollarSign,
  ArrowLeft,
  BarChart3,
  Activity,
  LightbulbIcon,
  LayoutGrid,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserMenu } from './UserMenu';

export function DashboardMunicipal() {
  const navigate = useNavigate();
  const stats = getDashboardMunicipal();

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
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-blue-800"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/users')}
                className="text-white hover:bg-blue-800 border border-white/30"
              >
                <Users className="mr-2 h-5 w-5" />
                Gerenciar Usuários
              </Button>
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6" />
                <span className="text-sm">Sistema Municipal</span>
              </div>
              <UserMenu />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Geral - Município</h1>
          <p className="text-blue-200">Visão consolidada de todas as escolas municipais</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Consumo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.consumoTotalAtual.toLocaleString()} kWh</div>
              <p className="text-blue-100 text-sm mt-1">Mês atual</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Redução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.percentualReducao}%</div>
              <p className="text-green-100 text-sm mt-1">vs. mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Economia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R$ {stats.economiaMonetaria.toLocaleString()}</div>
              <p className="text-emerald-100 text-sm mt-1">Economia mensal</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Total de Escolas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{escolas.length}</div>
              <p className="text-purple-100 text-sm mt-1">Unidades ativas</p>
            </CardContent>
          </Card>
        </div>

        {/* Análise Inteligente e Previsões */}
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Análise Inteligente e Previsões
            </CardTitle>
            <CardDescription>
              Insights baseados em dados históricos e tendências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Desempenho Atual</h4>
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingDown className="h-5 w-5" />
                    <span className="font-medium">Redução de {stats.reducaoConsumo.toLocaleString()} kWh</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Excelente desempenho! O município reduziu {stats.percentualReducao}% do consumo em relação ao mês anterior.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <LightbulbIcon className="h-4 w-4" />
                    Insights
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Tendência de redução consistente nos últimos 3 meses</li>
                    <li>• Maior economia observada: E.M. Prof. João Silva (-12%)</li>
                    <li>• Horários de pico: 10h-12h e 14h-16h</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Previsão - Próximo Mês</h4>
                  <div className="flex items-center gap-2 text-blue-600">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-medium">{stats.previsaoProximoMes.toLocaleString()} kWh estimados</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Com base nas tendências, esperamos uma redução adicional de ~8%.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Economia Prevista</h4>
                  <div className="text-2xl font-bold text-green-700">
                    R$ {stats.economiaPrevista.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Potencial de economia adicional para o próximo mês
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <CardTitle>Tendência de Consumo Municipal</CardTitle>
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
            <CardTitle>Escolas Municipais</CardTitle>
            <CardDescription>Clique para visualizar detalhes de cada escola</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {escolas.map((escola) => {
                const reducao = escola.consumoMesAnterior - escola.consumoMesAtual;
                const percentual = ((reducao / escola.consumoMesAnterior) * 100).toFixed(1);
                const isMelhora = reducao > 0;

                return (
                  <button
                    key={escola.id}
                    onClick={() => navigate(`/escola/${escola.id}`)}
                    className="w-full p-4 rounded-lg border hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{escola.nome}</h3>
                          <p className="text-sm text-gray-500">{escola.endereco}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {escola.consumoMesAtual.toLocaleString()} kWh
                        </div>
                        <div className={`text-sm flex items-center gap-1 justify-end ${
                          isMelhora ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isMelhora ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          {isMelhora ? '-' : '+'}{Math.abs(Number(percentual))}%
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}