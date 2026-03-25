import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft,
  Building2,
  Mail,
  Shield,
  Search,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { User, UserRole, users as initialUsers } from '../data/auth';
import { escolas } from '../data/mockData';

export function AdminUsers() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'escola' as UserRole,
    escolaId: ''
  });

  // Carregar usuários do localStorage ou usar os iniciais
  useEffect(() => {
    const savedUsers = localStorage.getItem('systemUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('systemUsers', JSON.stringify(initialUsers));
    }
  }, []);

  // Verificar se usuário tem permissão
  useEffect(() => {
    if (currentUser?.role !== 'prefeitura') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('systemUsers', JSON.stringify(newUsers));
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Não mostrar senha por segurança
        role: user.role,
        escolaId: user.escolaId || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'escola',
        escolaId: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'escola',
      escolaId: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.name || !formData.email) {
      setAlert({ type: 'error', message: 'Nome e email são obrigatórios' });
      return;
    }

    if (!editingUser && !formData.password) {
      setAlert({ type: 'error', message: 'Senha é obrigatória para novos usuários' });
      return;
    }

    if (formData.role === 'escola' && !formData.escolaId) {
      setAlert({ type: 'error', message: 'Selecione uma escola para usuários do tipo Escola' });
      return;
    }

    // Verificar email duplicado
    const emailExists = users.some(
      u => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== editingUser?.id
    );
    if (emailExists) {
      setAlert({ type: 'error', message: 'Este email já está cadastrado' });
      return;
    }

    if (editingUser) {
      // Editar usuário existente
      const updatedUsers = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: formData.name,
            email: formData.email,
            password: formData.password || u.password, // Manter senha antiga se não fornecida
            role: formData.role,
            escolaId: formData.role === 'escola' ? formData.escolaId : undefined
          };
        }
        return u;
      });
      saveUsers(updatedUsers);
      setAlert({ type: 'success', message: 'Usuário atualizado com sucesso!' });
    } else {
      // Criar novo usuário
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        escolaId: formData.role === 'escola' ? formData.escolaId : undefined
      };
      saveUsers([...users, newUser]);
      setAlert({ type: 'success', message: 'Usuário criado com sucesso!' });
    }

    handleCloseDialog();
  };

  const handleDelete = (userId: string) => {
    // Prevenir exclusão do próprio usuário
    if (userId === currentUser?.id) {
      setAlert({ type: 'error', message: 'Você não pode excluir sua própria conta' });
      return;
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    setAlert({ type: 'success', message: 'Usuário excluído com sucesso!' });
    setDeleteConfirm(null);
  };

  // Filtrar usuários
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/municipal')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
                  <p className="text-blue-100 text-sm">
                    Controle de acesso ao sistema
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        {alert && (
          <Alert 
            variant={alert.type === 'error' ? 'destructive' : 'default'}
            className="mb-6"
          >
            <AlertDescription className="flex items-center justify-between">
              <span>{alert.message}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlert(null)}
                className="h-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Usuários</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prefeitura</p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'prefeitura').length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Escolas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'escola').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Busca */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Lista de Usuários */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Escola
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={user.role === 'prefeitura' ? 'default' : 'secondary'}
                        className={user.role === 'prefeitura' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}
                      >
                        {user.role === 'prefeitura' ? 'Prefeitura' : 'Escola'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.escolaId ? (
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          {escolas.find(e => e.id === user.escolaId)?.nome || 'N/A'}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(user)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(user.id)}
                          disabled={user.id === currentUser?.id}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          )}
        </Card>
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Atualize as informações do usuário' 
                : 'Preencha os dados para criar um novo usuário'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João da Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.gov.br"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Senha {editingUser && '(deixe em branco para manter a atual)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required={!editingUser}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Usuário</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefeitura">Prefeitura</SelectItem>
                    <SelectItem value="escola">Escola</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'escola' && (
                <div className="space-y-2">
                  <Label htmlFor="escola">Escola</Label>
                  <Select 
                    value={formData.escolaId} 
                    onValueChange={(value) => setFormData({ ...formData, escolaId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma escola" />
                    </SelectTrigger>
                    <SelectContent>
                      {escolas.map(escola => (
                        <SelectItem key={escola.id} value={escola.id}>
                          {escola.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
