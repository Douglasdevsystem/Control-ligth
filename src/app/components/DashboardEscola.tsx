import { useNavigate, useParams } from 'react-router';
import { escolas, getPrefeituraById, Corredor, Sala } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Zap,
  LayoutGrid,
  Activity,
  Plus,
  Edit,
  Trash2,
  Building,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserMenu } from './UserMenu';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner';

export function DashboardEscola() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const escola = escolas.find((e) => e.id === id);

  // Estados para gerenciar diálogos e formulários
  const [dialogCorredorOpen, setDialogCorredorOpen] = useState(false);
  const [dialogSalaOpen, setDialogSalaOpen] = useState(false);
  const [editingCorredor, setEditingCorredor] = useState<Corredor | null>(null);
  const [selectedCorredorId, setSelectedCorredorId] = useState<string>('');
  const [corredorForm, setCorredorForm] = useState({ nome: '', descricao: '' });
  const [salaForm, setSalaForm] = useState({ nome: '', corredorId: '' });

  if (!escola) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Escola não encontrada</h2>
          <Button onClick={() => navigate('/prefeitura')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  const prefeitura = getPrefeituraById(escola.prefeituraId);

  // Dados das salas
  const dadosSalas = escola.salas.map((sala) => ({
    id: sala.id,
    nome: sala.nome,
    consumo: sala.consumoTotal,
  }));

  // Total de ativos
  const totalAtivos = escola.salas.reduce((acc, sala) => acc + sala.ativos.length, 0);

  // Agrupar salas por corredor
  const getSalasPorCorredor = (corredorId: string) => {
    return escola.salas.filter((sala) => sala.corredorId === corredorId);
  };

  const getAtivosSala = (sala: Sala) => {
    try {
      const saved = localStorage.getItem('salaAtivosOverrides');
      if (!saved) {
        return sala.ativos;
      }

      const parsed = JSON.parse(saved) as Record<string, Sala['ativos']>;
      return parsed[sala.id] || sala.ativos;
    } catch {
      return sala.ativos;
    }
  };

  // Calcular consumo total de um corredor
  const getConsumoTotalCorredor = (corredorId: string) => {
    const salas = getSalasPorCorredor(corredorId);
    return salas.reduce((total, sala) => total + sala.consumoTotal, 0);
  };

  // Handlers para corredores
  const handleAdicionarCorredor = () => {
    setEditingCorredor(null);
    setCorredorForm({ nome: '', descricao: '' });
    setDialogCorredorOpen(true);
  };

  const handleEditarCorredor = (corredor: Corredor) => {
    setEditingCorredor(corredor);
    setCorredorForm({ nome: corredor.nome, descricao: corredor.descricao || '' });
    setDialogCorredorOpen(true);
  };

  const handleSalvarCorredor = () => {
    if (!corredorForm.nome.trim()) {
      toast.error('Nome do corredor é obrigatório');
      return;
    }
    
    if (editingCorredor) {
      toast.success(`Corredor "${corredorForm.nome}" atualizado com sucesso!`);
    } else {
      toast.success(`Corredor "${corredorForm.nome}" criado com sucesso!`);
    }
    
    setDialogCorredorOpen(false);
    setCorredorForm({ nome: '', descricao: '' });
    setEditingCorredor(null);
  };

  const handleExcluirCorredor = (corredor: Corredor) => {
    const salas = getSalasPorCorredor(corredor.id);
    if (salas.length > 0) {
      toast.error('Não é possível excluir um corredor que possui salas. Mova ou exclua as salas primeiro.');
      return;
    }
    toast.success(`Corredor "${corredor.nome}" excluído com sucesso!`);
  };

  // Handlers para salas
  const handleAdicionarSala = (corredorId: string) => {
    setSelectedCorredorId(corredorId);
    setSalaForm({ nome: '', corredorId });
    setDialogSalaOpen(true);
  };

  const handleSalvarSala = () => {
    if (!salaForm.nome.trim()) {
      toast.error('Nome da sala é obrigatório');
      return;
    }
    
    toast.success(`Sala "${salaForm.nome}" criada com sucesso!`);
    setDialogSalaOpen(false);
    setSalaForm({ nome: '', corredorId: '' });
  };

  const handleAbrirBloco = (corredorId: string) => {
    const path = `/escola/${escola.id}/bloco/${corredorId}`;
    const opened = window.open(path, '_blank', 'noopener,noreferrer');

    if (!opened) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/prefeitura')}
              className="text-white hover:bg-blue-800"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar ao Dashboard Municipal
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6" />
                <span className="text-sm">Gestão Energética</span>
              </div>
              <UserMenu />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{escola.nome}</h1>
          <p className="text-blue-200">{escola.endereco}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Consumo Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{escola.consumoMesAtual.toLocaleString()} kWh</div>
              <p className="text-blue-100 text-sm mt-1">Mês atual</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Consumo Anterior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{escola.consumoMesAnterior.toLocaleString()} kWh</div>
              <p className="text-orange-100 text-sm mt-1">Mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Corredores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{escola.corredores.length}</div>
              <p className="text-purple-100 text-sm mt-1">{escola.salas.length} salas totais</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Total de Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalAtivos}</div>
              <p className="text-emerald-100 text-sm mt-1">Equipamentos cadastrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Consumo</CardTitle>
              <CardDescription>Últimos 5 meses (kWh)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={escola.historico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="consumo" stroke="#1e40af" strokeWidth={3} name="Consumo (kWh)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consumo por Sala</CardTitle>
              <CardDescription>Distribuição atual (kWh)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosSalas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consumo" fill="#1e40af" name="Consumo (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Corredores e Salas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Corredores e Salas</CardTitle>
                <CardDescription>Organize suas salas por corredor</CardDescription>
              </div>
              <Button onClick={handleAdicionarCorredor} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Corredor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {escola.corredores.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum corredor cadastrado</h3>
                <p className="text-gray-500 mb-4">Crie seu primeiro corredor para organizar as salas</p>
                <Button onClick={handleAdicionarCorredor} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Corredor
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {escola.corredores.map((corredor) => {
                  const salas = getSalasPorCorredor(corredor.id);
                  const consumoTotal = getConsumoTotalCorredor(corredor.id);
                  
                  return (
                    <AccordionItem key={corredor.id} value={corredor.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Building className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-gray-900">{corredor.nome}</h3>
                              <p className="text-sm text-gray-500">
                                {salas.length} {salas.length === 1 ? 'sala' : 'salas'}
                                {corredor.descricao && ` • ${corredor.descricao}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right mr-4">
                              <div className="text-lg font-bold text-gray-900">
                                {consumoTotal.toLocaleString()} kWh
                              </div>
                              <div className="text-sm text-gray-500">Consumo total</div>
                            </div>
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAbrirBloco(corredor.id)}
                                className="h-8 px-2 text-blue-700 hover:text-blue-800"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Abrir bloco
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditarCorredor(corredor)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExcluirCorredor(corredor)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 pr-4 pt-4 space-y-3">
                          {salas.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                              <LayoutGrid className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 mb-4">Nenhuma sala neste corredor</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAdicionarSala(corredor.id)}
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Sala
                              </Button>
                            </div>
                          ) : (
                            <>
                              {salas.map((sala) => (
                                (() => {
                                  const ativosDaSala = getAtivosSala(sala);
                                  const ativosLigados = ativosDaSala.filter((ativo) => ativo.status === 'ligado').length;
                                  const temAtivos = ativosDaSala.length > 0;
                                  const todosLigados = temAtivos && ativosLigados === ativosDaSala.length;
                                  const todosDesligados = temAtivos && ativosLigados === 0;

                                  const salaClasses = todosLigados
                                    ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100'
                                    : todosDesligados
                                      ? 'border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100'
                                      : 'hover:border-blue-400 hover:bg-blue-50';

                                  const iconClasses = todosLigados
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : todosDesligados
                                      ? 'bg-red-100 text-red-600'
                                      : 'bg-blue-100 text-blue-600';

                                  const statusLabel = todosLigados
                                    ? 'Todos os equipamentos ligados'
                                    : todosDesligados
                                      ? 'Todos os equipamentos desligados'
                                      : `${ativosLigados}/${ativosDaSala.length} equipamentos ligados`;

                                  return (
                                    <button
                                      key={sala.id}
                                      onClick={() => navigate(`/escola/${escola.id}/sala/${sala.id}`)}
                                      className={`w-full p-4 rounded-lg border transition-all text-left ${salaClasses}`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className={`p-3 rounded-lg ${iconClasses}`}>
                                            <LayoutGrid className="h-6 w-6" />
                                          </div>
                                          <div>
                                            <h3 className="font-semibold text-gray-900">{sala.nome}</h3>
                                            <p className="text-sm text-gray-600">
                                              {ativosDaSala.length} ativos monitorados
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{statusLabel}</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-lg font-bold text-gray-900">
                                            {sala.consumoTotal} kWh
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {sala.horariosProgramados.length} programações
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })()
                              ))}
                              <div className="pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAdicionarSala(corredor.id)}
                                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Adicionar Sala
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Criar/Editar Corredor */}
      <Dialog open={dialogCorredorOpen} onOpenChange={setDialogCorredorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCorredor ? 'Editar Corredor' : 'Novo Corredor'}
            </DialogTitle>
            <DialogDescription>
              {editingCorredor
                ? 'Atualize as informações do corredor'
                : 'Crie um novo corredor para organizar suas salas'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Corredor *</Label>
              <Input
                id="nome"
                placeholder="Ex: Corredor Principal"
                value={corredorForm.nome}
                onChange={(e) => setCorredorForm({ ...corredorForm, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição do corredor..."
                value={corredorForm.descricao}
                onChange={(e) => setCorredorForm({ ...corredorForm, descricao: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogCorredorOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarCorredor} className="bg-blue-600 hover:bg-blue-700">
              {editingCorredor ? 'Salvar Alterações' : 'Criar Corredor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Criar Sala */}
      <Dialog open={dialogSalaOpen} onOpenChange={setDialogSalaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Sala</DialogTitle>
            <DialogDescription>Adicione uma nova sala ao corredor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nomeSala">Nome da Sala *</Label>
              <Input
                id="nomeSala"
                placeholder="Ex: Sala 1A"
                value={salaForm.nome}
                onChange={(e) => setSalaForm({ ...salaForm, nome: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogSalaOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarSala} className="bg-blue-600 hover:bg-blue-700">
              Criar Sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
