import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { escolas, Asset } from '../data/mockData';
import {
  ArrowLeft,
  Zap,
  AirVent,
  Lightbulb,
  Fan,
  Projector,
  Power,
  Clock,
  Plus,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';

const getAssetIcon = (type: Asset['type']) => {
  switch (type) {
    case 'ar-condicionado':
      return <AirVent className="h-5 w-5" />;
    case 'lampada':
      return <Lightbulb className="h-5 w-5" />;
    case 'ventilador':
      return <Fan className="h-5 w-5" />;
    case 'projetor':
      return <Projector className="h-5 w-5" />;
  }
};

const getAssetColor = (type: Asset['type']) => {
  switch (type) {
    case 'ar-condicionado':
      return 'bg-cyan-100 text-cyan-700';
    case 'lampada':
      return 'bg-yellow-100 text-yellow-700';
    case 'ventilador':
      return 'bg-blue-100 text-blue-700';
    case 'projetor':
      return 'bg-purple-100 text-purple-700';
  }
};

export function DashboardSala() {
  const navigate = useNavigate();
  const { id, salaId } = useParams();
  const escola = escolas.find((e) => e.id === id);
  const sala = escola?.salas.find((s) => s.id === salaId);

  const getSavedAtivos = (currentSalaId: string, fallbackAtivos: Asset[]) => {
    try {
      const saved = localStorage.getItem('salaAtivosOverrides');
      if (!saved) {
        return fallbackAtivos;
      }

      const parsed = JSON.parse(saved) as Record<string, Asset[]>;
      return parsed[currentSalaId] || fallbackAtivos;
    } catch {
      return fallbackAtivos;
    }
  };

  const [ativos, setAtivos] = useState(() => {
    if (!salaId || !sala) {
      return [];
    }
    return getSavedAtivos(salaId, sala.ativos);
  });
  const [horarios, setHorarios] = useState(sala?.horariosProgramados || []);
  const [novoHorario, setNovoHorario] = useState({ inicio: '07:00', fim: '12:00' });

  if (!escola || !sala) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sala não encontrada</h2>
          <Button onClick={() => navigate(`/escola/${id}`)}>Voltar</Button>
        </div>
      </div>
    );
  }

  const toggleAtivo = (ativoId: string) => {
    const updatedAtivos = ativos.map(ativo =>
      ativo.id === ativoId
        ? { ...ativo, status: ativo.status === 'ligado' ? 'desligado' : 'ligado' }
        : ativo
    );

    setAtivos(updatedAtivos);

    if (salaId) {
      try {
        const saved = localStorage.getItem('salaAtivosOverrides');
        const parsed = saved ? (JSON.parse(saved) as Record<string, Asset[]>) : {};
        parsed[salaId] = updatedAtivos;
        localStorage.setItem('salaAtivosOverrides', JSON.stringify(parsed));
      } catch {
        // Ignora falha de persistência local
      }
    }
  };

  const adicionarHorario = () => {
    setHorarios([...horarios, {
      ...novoHorario,
      diasSemana: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
    }]);
  };

  const removerHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const ativosLigados = ativos.filter(a => a.status === 'ligado').length;
  const consumoAtual = ativos
    .filter(a => a.status === 'ligado')
    .reduce((sum, a) => sum + a.consumo, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/escola/${id}`)}
              className="text-white hover:bg-blue-800"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para Escola
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              <span className="text-sm">Controle de Ativos</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">{sala.nome}</h1>
          <p className="text-blue-200">{escola.nome}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Ativos Ligados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ativosLigados}/{ativos.length}</div>
              <p className="text-blue-100 text-sm mt-1">Em operação</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Consumo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{consumoAtual} kWh</div>
              <p className="text-purple-100 text-sm mt-1">Tempo real</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Programações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{horarios.length}</div>
              <p className="text-orange-100 text-sm mt-1">Horários ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Controle de Ativos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5 text-blue-600" />
              Controle de Ativos
            </CardTitle>
            <CardDescription>
              Ligue ou desligue os ativos individualmente em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ativos.map((ativo) => (
                <div
                  key={ativo.id}
                  className="p-4 rounded-lg border-2 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getAssetColor(ativo.type)}`}>
                        {getAssetIcon(ativo.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{ativo.name}</h4>
                        <Badge variant={ativo.status === 'ligado' ? 'default' : 'secondary'}>
                          {ativo.status === 'ligado' ? 'Ligado' : 'Desligado'}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={ativo.status === 'ligado'}
                      onCheckedChange={() => toggleAtivo(ativo.id)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Consumo</p>
                      <p className="font-semibold text-gray-900">{ativo.consumo} kWh</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Programação de Horários */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Horários Programados
                </CardTitle>
                <CardDescription>
                  Configure os horários de funcionamento automático dos ativos
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Horário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Horário Programado</DialogTitle>
                    <DialogDescription>
                      Configure um novo período de funcionamento
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inicio">Horário de Início</Label>
                        <Input
                          id="inicio"
                          type="time"
                          value={novoHorario.inicio}
                          onChange={(e) => setNovoHorario({ ...novoHorario, inicio: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fim">Horário de Término</Label>
                        <Input
                          id="fim"
                          type="time"
                          value={novoHorario.fim}
                          onChange={(e) => setNovoHorario({ ...novoHorario, fim: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={adicionarHorario} className="w-full">
                      Salvar Programação
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {horarios.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum horário programado</p>
                </div>
              ) : (
                horarios.map((horario, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {horario.inicio} - {horario.fim}
                        </div>
                        <div className="text-sm text-gray-600">
                          {horario.diasSemana.join(', ')}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerHorario(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhamento de Consumo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Detalhamento de Consumo
            </CardTitle>
            <CardDescription>Análise detalhada por ativo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ativo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Consumo (kWh)</th>
                  </tr>
                </thead>
                <tbody>
                  {ativos.map((ativo) => (
                    <tr key={ativo.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{ativo.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={getAssetColor(ativo.type)}>
                          {ativo.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={ativo.status === 'ligado' ? 'default' : 'secondary'}>
                          {ativo.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">{ativo.consumo} kWh</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-bold">
                    <td colSpan={3} className="py-3 px-4">TOTAL</td>
                    <td className="py-3 px-4 text-right">
                      {ativos.reduce((sum, a) => sum + a.consumo, 0)} kWh
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}