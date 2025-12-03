'use client';
import Image from 'next/image';
import NotFoundError from '../ui/notfoundError';
import Loader from '../ui/loader';

// side donde aparecen los usuarios con chat y trades
// const MOCK_TRADES = [
//   { id: 1, user: 'charlCEard', avatar: 'https://i.pravatar.cc/150?u=1', message: 'Tu charizard está de locos...', active: true },
//   { id: 2, user: 'electricDog34', avatar: 'https://i.pravatar.cc/150?u=2', message: 'Hola buenas, podría bajar...', active: false },
//   { id: 3, user: 'arrakis_sunsetXD', avatar: 'https://i.pravatar.cc/150?u=3', message: 'Hey', active: false },
//   { id: 4, user: 'leaderocket63', avatar: 'https://i.pravatar.cc/150?u=4', message: 'Lo siento pero no me...', active: false },
//   { id: 5, user: 'pokebeachwalker', avatar: 'https://i.pravatar.cc/150?u=5', message: 'Si claro, sin problemas', active: false },
// ];
interface TradesSidebarProps {
  users: { id: string; username: string; avatarUrl?: string; lastMessage?: string }[]; // Lista de usuarios
  loading: boolean;
  error: string | null;
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void; // Callback al seleccionar un usuario (esto puede abrir el chat o trade)

}
export interface ChatUser {
  id: string;
  username: string;
  avatarUrl?: string;
  lastMessage?: string;
}

export default function TradesSidebar({ users, loading, error, selectedUserId, onUserSelect }: TradesSidebarProps) {
  if (loading) {
    return <div className="p-4"><Loader /></div>;
  }
  
  if (error) {
    return <div className="p-4"><NotFoundError /></div>;
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/50 border-r border-gray-800">
      
      {/* Cabecera del Sidebar */}
      <div className="p-4 border-b border-gray-800 h-16 flex items-center">
        <h2 className="text-xl font-bold text-gray-200">Lista de propuestas</h2>
      </div>
      {/* Lista de usuarios */}
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No tienes conversaciones activas.</p>
          </div>
        ) : (
          users.map((user) => {
            const isSelected = selectedUserId === user.id;
            return (
              <div
                key={user.id}
                onClick={() => onUserSelect(user.id)}
                // CLASES DINÁMICAS:
                // - border-l-4: Borde izquierdo de 4px
                // - border-blue-500: Si está seleccionado, azul. Si no, transparente (para que no salte el texto).
                className={`
                  flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-gray-800/50
                  border-l-4 
                  ${isSelected 
                    ? 'bg-gray-800 border-l-blue-500 shadow-inner' 
                    : 'hover:bg-gray-800/40 border-l-transparent'
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative">
                  <Image
                    src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border border-gray-600"
                    unoptimized // Útil si usas pravatar o URLs externas dinámicas
                  />
                </div>

                {/* Info de Texto */}
                <div className="flex-1 min-w-0"> {/* min-w-0 es vital para que funcione truncate */}
                  <div className="flex justify-between items-baseline">
                    <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {user.username}
                    </h3>
                    {/* Fecha simulada (opcional) */}
                    <span className="text-xs text-gray-600">12:30</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 truncate">
                    {user.lastMessage || 'Haz clic para ver la propuesta...'}
                  </p>
                </div>

                {/* Flecha decorativa (solo visible al hacer hover o estar activo) */}
                <span className={`text-gray-600 text-lg transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                  ›
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  
}
