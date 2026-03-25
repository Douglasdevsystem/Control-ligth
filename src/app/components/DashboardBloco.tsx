import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { escolas, Asset, Sala } from '../data/mockData';
import {
  ArrowLeft,
  Activity,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const calcularHorasIntervalo = (inicio: string, fim: string) => {
  const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
  const [horaFim, minutoFim] = fim.split(':').map(Number);

  const inicioMinutos = horaInicio * 60 + minutoInicio;
  const fimMinutos = horaFim * 60 + minutoFim;
  const diferenca = fimMinutos - inicioMinutos;

  if (Number.isNaN(diferenca)) {
    return 0;
  }

  if (diferenca >= 0) {
    return diferenca / 60;
  }

  return (24 * 60 + diferenca) / 60;
};

const calcularHorasUsoSemanais = (sala: Sala) => {
  return sala.horariosProgramados.reduce((total, horario) => {
    const horasPorDia = calcularHorasIntervalo(horario.inicio, horario.fim);
    return total + horasPorDia * horario.diasSemana.length;
  }, 0);
};

type MedicaoEnergia = {
  tempo: string;
  ativa: number;
  reativa: number;
  tensao: number;
  fatorPotencia: number;
};

const calcularFatorPotencia = (ativa: number, reativa: number) => {
  const aparente = Math.sqrt(ativa * ativa + reativa * reativa);
  if (!aparente) {
    return 1;
  }

  return ativa / aparente;
};

const gerarPonto = (baseAtiva: number, baseReativa: number, indice: number): MedicaoEnergia => {
  const variacaoAtiva = Math.sin(indice / 3) * 7 + (Math.random() - 0.5) * 4;
  const variacaoReativa = Math.cos(indice / 4) * 4 + (Math.random() - 0.5) * 3;
  const ativa = Math.max(10, Number((baseAtiva + variacaoAtiva).toFixed(2)));
  const reativa = Math.max(4, Number((baseReativa + variacaoReativa).toFixed(2)));
  const tensao = Number((220 + Math.sin(indice / 2) * 2 + (Math.random() - 0.5) * 1.4).toFixed(1));
  const fatorPotencia = Number(calcularFatorPotencia(ativa, reativa).toFixed(3));

  return {
    tempo: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    ativa,
    reativa,
    tensao,
    fatorPotencia,
  };
};

export function DashboardBloco() {
  const navigate = useNavigate();
  const { id, corredorId } = useParams();
  const [overrideVersion, setOverrideVersion] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  const escola = escolas.find((item) => item.id === id);
  const corredor = escola?.corredores.find((item) => item.id === corredorId);
  const salasDoBloco = useMemo(
    () => (escola ? escola.salas.filter((sala) => sala.corredorId === corredorId) : []),
    [escola, corredorId]
  );

  useEffect(() => {
    const forceRefresh = () => setOverrideVersion((current) => current + 1);

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'salaAtivosOverrides') {
        forceRefresh();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', forceRefresh);
    document.addEventListener('visibilitychange', forceRefresh);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', forceRefresh);
      document.removeEventListener('visibilitychange', forceRefresh);
    };
  }, []);

  const getAtivosSala = (sala: Sala): Asset[] => {
    try {
      const saved = localStorage.getItem('salaAtivosOverrides');
      if (!saved) {
        return sala.ativos;
      }

      const parsed = JSON.parse(saved) as Record<string, Asset[]>;
      return parsed[sala.id] || sala.ativos;
    } catch {
      return sala.ativos;
    }
  };

  const salasEfetivasDoBloco = useMemo(
    () =>
      salasDoBloco.map((sala) => ({
        ...sala,
        ativos: getAtivosSala(sala),
      })),
    [salasDoBloco, overrideVersion]
  );

  if (!escola || !corredor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Bloco não encontrado</h2>
          <p className="text-gray-500 mb-4">Verifique se o bloco ainda existe nesta escola.</p>
          <Button onClick={() => navigate(`/escola/${id}`)}>Voltar para escola</Button>
        </div>
      </div>
    );
  }

  const consumoTotalBloco = salasEfetivasDoBloco.reduce((total, sala) => total + sala.consumoTotal, 0);
  const totalEquipamentos = salasEfetivasDoBloco.reduce((total, sala) => total + sala.ativos.length, 0);
  const equipamentosLigados = salasEfetivasDoBloco.reduce(
    (total, sala) => total + sala.ativos.filter((ativo) => ativo.status === 'ligado').length,
    0
  );
  const horasUsoBloco = salasEfetivasDoBloco.reduce((total, sala) => total + calcularHorasUsoSemanais(sala), 0);

  const cargaRelativa = totalEquipamentos > 0 ? equipamentosLigados / totalEquipamentos : 0;

  const correntes = [
    {
      fase: 'L1',
      corrente: Number((32 + cargaRelativa * 22).toFixed(1)),
      maximo: 80,
      cor: 'from-emerald-500 to-emerald-400',
    },
    {
      fase: 'L2',
      corrente: Number((28 + cargaRelativa * 20).toFixed(1)),
      maximo: 80,
      cor: 'from-cyan-500 to-cyan-400',
    },
    {
      fase: 'L3',
      corrente: Number((30 + cargaRelativa * 24).toFixed(1)),
      maximo: 80,
      cor: 'from-amber-400 to-yellow-300',
    },
  ];

  const baseAtiva = Math.max(24, Number((consumoTotalBloco / Math.max(salasEfetivasDoBloco.length, 1) / 4).toFixed(2)));
  const baseReativa = Number((baseAtiva * 0.42).toFixed(2));

  const [medicoes, setMedicoes] = useState<MedicaoEnergia[]>(() =>
    Array.from({ length: 20 }, (_, indice) => gerarPonto(baseAtiva, baseReativa, indice))
  );

  useEffect(() => {
    setMedicoes(Array.from({ length: 20 }, (_, indice) => gerarPonto(baseAtiva, baseReativa, indice)));
  }, [baseAtiva, baseReativa, corredorId]);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setMedicoes((atual) => {
        const proximo = [...atual, gerarPonto(baseAtiva, baseReativa, atual.length + 1)];
        return proximo.slice(-24);
      });

      setIsOnline(Math.random() > 0.08);
    }, 3000);

    return () => window.clearInterval(intervalo);
  }, [baseAtiva, baseReativa]);

  const ultimaMedicao = medicoes[medicoes.length - 1];
  const fatorPotenciaAtual = ultimaMedicao?.fatorPotencia ?? 1;
  const alertaFatorPotencia = fatorPotenciaAtual < 0.92;
  const consumoKvarh = Number((consumoTotalBloco * 0.38).toFixed(2));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/escola/${escola.id}`)}
              className="text-white hover:bg-blue-800"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para escola
            </Button>
            <div className="flex items-center gap-3 text-sm">
              {isOnline ? <Wifi className="h-4 w-4 text-emerald-400" /> : <WifiOff className="h-4 w-4 text-red-400" />}
              <span className={isOnline ? 'text-emerald-300' : 'text-red-300'}>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">Sistema de Monitoramento Elétrico - ELO</h1>
          <p className="text-blue-200">{corredor.nome} • {escola.nome}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {correntes.map((item) => {
            const percentual = Math.min(100, (item.corrente / item.maximo) * 100);

            return (
              <Card key={item.fase} className="border border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center justify-between">
                    <span>Fase {item.fase}</span>
                    <span className="text-xs text-gray-500">Corrente (A)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.cor} transition-all duration-700`}
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold text-gray-900">{item.corrente} A</div>
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      {percentual.toFixed(0)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Potência Ativa (kW) vs Potência Reativa (kVAr)
            </CardTitle>
            <CardDescription>Monitoramento em tempo real do bloco</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={medicoes}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="tempo" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    color: '#111827',
                  }}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend wrapperStyle={{ color: '#374151' }} />
                <Line
                  type="monotone"
                  dataKey="ativa"
                  name="Potência Ativa (kW)"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive
                />
                <Line
                  type="monotone"
                  dataKey="reativa"
                  name="Potência Reativa (kVAr)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive
                />
                <Line
                  type="monotone"
                  dataKey="tensao"
                  name="Tensão (V)"
                  stroke="#facc15"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabela de Acumulados</CardTitle>
            <CardDescription>Consumo total do corredor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-700">
                    <th className="py-3 pr-4">Indicador</th>
                    <th className="py-3 pr-4">Valor</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Consumo Total (kWh)</td>
                    <td className="py-3 pr-4">{consumoTotalBloco.toLocaleString('pt-BR')} kWh</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Energia Reativa Acumulada (kVArh)</td>
                    <td className="py-3 pr-4">{consumoKvarh.toLocaleString('pt-BR')} kVArh</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div
          className={`rounded-xl border px-5 py-4 transition-colors ${
            alertaFatorPotencia ? 'bg-red-50 border-red-300 text-red-700' : 'bg-emerald-50 border-emerald-300 text-emerald-700'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-semibold">
              <Zap className="h-5 w-5" />
              {alertaFatorPotencia
                ? 'Atenção: Baixo Fator de Potência detectado'
                : 'Fator de Potência dentro da faixa ideal'}
            </div>
            <Badge
              variant="outline"
              className={alertaFatorPotencia ? 'border-red-300 text-red-700' : 'border-emerald-300 text-emerald-700'}
            >
              FP {fatorPotenciaAtual.toFixed(3)}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Salas do bloco</CardTitle>
            <CardDescription>Visão detalhada das salas e indicadores energéticos</CardDescription>
          </CardHeader>
          <CardContent>
            {salasEfetivasDoBloco.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Nenhuma sala cadastrada neste bloco.</div>
            ) : (
              <div className="space-y-3">
                {salasEfetivasDoBloco.map((sala) => {
                  const ativosLigadosSala = sala.ativos.filter((ativo) => ativo.status === 'ligado').length;
                  const totalAtivosSala = sala.ativos.length;
                  const todosLigados = totalAtivosSala > 0 && ativosLigadosSala === totalAtivosSala;
                  const todosDesligados = totalAtivosSala > 0 && ativosLigadosSala === 0;
                  const horasSala = calcularHorasUsoSemanais(sala);

                  const cardClasses = todosLigados
                    ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100'
                    : todosDesligados
                      ? 'border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100'
                      : 'hover:border-blue-400 hover:bg-blue-50';

                  return (
                    <button
                      key={sala.id}
                      onClick={() => navigate(`/escola/${escola.id}/sala/${sala.id}`)}
                      className={`w-full p-4 rounded-lg border transition-all text-left ${cardClasses}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{sala.nome}</h3>
                          <p className="text-sm text-gray-500">{sala.ativos.length} equipamentos</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {todosLigados
                              ? 'Todos os equipamentos ligados'
                              : todosDesligados
                                ? 'Todos os equipamentos desligados'
                                : `${ativosLigadosSala}/${totalAtivosSala} equipamentos ligados`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {sala.consumoTotal} kWh
                          </Badge>
                          <Badge variant="outline" className="border-orange-200 text-orange-700">
                            {ativosLigadosSala} ligados
                          </Badge>
                          <Badge variant="outline" className="border-purple-200 text-purple-700">
                            {horasSala.toFixed(1)} h/sem
                          </Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
