// Tipos de usuário e permissões
export type UserRole = 'admin' | 'prefeitura' | 'escola';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  prefeituraId?: string; // Para usuários 'prefeitura' e 'escola'
  escolaId?: string; // Apenas para usuários do tipo 'escola'
}

// Usuários iniciais para simulação
const initialUsers: User[] = [
  // Usuário Admin (você - empresa)
  {
    id: 'u-admin',
    email: 'admin@energysmart.com.br',
    password: 'admin123',
    role: 'admin',
    name: 'Admin EnergySmart',
  },
  // Usuários das Prefeituras
  {
    id: 'u-pref-1',
    email: 'gestao@prefeitura-sp.gov.br',
    password: 'pref123',
    role: 'prefeitura',
    name: 'Secretaria de Educação - SP',
    prefeituraId: 'pref-1',
  },
  {
    id: 'u-pref-2',
    email: 'gestao@prefeitura-rj.gov.br',
    password: 'pref123',
    role: 'prefeitura',
    name: 'Secretaria de Educação - RJ',
    prefeituraId: 'pref-2',
  },
  // Usuários das Escolas - São Paulo
  {
    id: 'u-escola-1',
    email: 'direcao@joaosilva.edu.br',
    password: 'escola123',
    role: 'escola',
    name: 'Direção - E.M. Prof. João Silva',
    prefeituraId: 'pref-1',
    escolaId: 'escola-1',
  },
  {
    id: 'u-escola-2',
    email: 'direcao@mariasantos.edu.br',
    password: 'escola123',
    role: 'escola',
    name: 'Direção - E.M. Maria Santos',
    prefeituraId: 'pref-1',
    escolaId: 'escola-2',
  },
  {
    id: 'u-escola-3',
    email: 'direcao@dompedro.edu.br',
    password: 'escola123',
    role: 'escola',
    name: 'Direção - E.M. Dom Pedro II',
    prefeituraId: 'pref-1',
    escolaId: 'escola-3',
  },
  // Usuários das Escolas - Rio de Janeiro
  {
    id: 'u-escola-4',
    email: 'direcao@tiradentes.edu.br',
    password: 'escola123',
    role: 'escola',
    name: 'Direção - E.M. Tiradentes',
    prefeituraId: 'pref-2',
    escolaId: 'escola-4',
  },
  {
    id: 'u-escola-5',
    email: 'direcao@monteirolobato.edu.br',
    password: 'escola123',
    role: 'escola',
    name: 'Direção - E.M. Monteiro Lobato',
    prefeituraId: 'pref-2',
    escolaId: 'escola-5',
  },
];

// Exportar usuários iniciais para uso no componente AdminUsers
export const users = initialUsers;

const isValidUser = (candidate: unknown): candidate is User => {
  if (!candidate || typeof candidate !== 'object') {
    return false;
  }

  const value = candidate as Partial<User>;
  return (
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.password === 'string' &&
    typeof value.role === 'string' &&
    typeof value.name === 'string'
  );
};

// Função para obter usuários do localStorage ou retornar os iniciais
const getUsers = (): User[] => {
  const savedUsers = localStorage.getItem('systemUsers');
  if (savedUsers) {
    try {
      const parsedUsers: unknown = JSON.parse(savedUsers);
      if (Array.isArray(parsedUsers)) {
        const validUsers = parsedUsers.filter(isValidUser);
        if (validUsers.length > 0) {
          return validUsers;
        }
      }
    } catch {
      // Se localStorage estiver inválido, cair para dados iniciais
    }
  }

  // Se não houver usuários salvos, salvar os iniciais
  localStorage.setItem('systemUsers', JSON.stringify(initialUsers));
  return initialUsers;
};

// Função de autenticação
export const authenticate = (email: string, password: string): User | null => {
  const systemUsers = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const user = systemUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === normalizedPassword
  );

  if (user) {
    return user;
  }

  // Fallback para credenciais padrão de demonstração
  const defaultUser = initialUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === normalizedPassword
  );

  return defaultUser || null;
};

// Funções auxiliares
export const getUserEscola = (user: User) => {
  if (user.role === 'escola' && user.escolaId) {
    return user.escolaId;
  }
  return null;
};

export const getUserPrefeitura = (user: User) => {
  if ((user.role === 'prefeitura' || user.role === 'escola') && user.prefeituraId) {
    return user.prefeituraId;
  }
  return null;
};
