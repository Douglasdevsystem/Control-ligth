import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { LogOut, User, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-white hover:bg-blue-800 flex items-center gap-2">
          <User className="h-5 w-5" />
          <span className="hidden md:inline">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2">
              {user.role === 'prefeitura' ? (
                <Badge className="bg-purple-600">
                  <Building2 className="h-3 w-3 mr-1" />
                  Prefeitura
                </Badge>
              ) : (
                <Badge className="bg-blue-600">
                  <Building2 className="h-3 w-3 mr-1" />
                  Escola
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sair do Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}