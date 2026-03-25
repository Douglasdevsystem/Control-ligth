import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { escolas, Asset, Sala } from '../data/mockData';
import { ArrowLeft, Building, LayoutGrid, PlugZap, Clock3, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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

export function DashboardBloco() {
  const navigate = useNavigate();
  const { id, corredorId } = useParams();
  const [overrideVersion, setOverrideVersion] = useState(0);

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
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm">Detalhes do bloco</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">{corredor.nome}</h1>
          <p className="text-blue-200">{escola.nome}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Salas no bloco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{salasEfetivasDoBloco.length}</div>
              <p className="text-blue-100 text-sm mt-1">Salas vinculadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Consumo geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{consumoTotalBloco.toLocaleString()} kWh</div>
              <p className="text-emerald-100 text-sm mt-1">Total do bloco</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PlugZap className="h-4 w-4" />
                Equipamentos ligados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{equipamentosLigados}/{totalEquipamentos}</div>
              <p className="text-orange-100 text-sm mt-1">Ativos em operação</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Horas de uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{horasUsoBloco.toFixed(1)} h</div>
              <p className="text-purple-100 text-sm mt-1">Programadas por semana</p>
            </CardContent>
          </Card>
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
