'use client';
import { useState } from 'react';

import AppHeader from '@/app/components/collection/AppHeader';
import TradesSidebar from '../components/trades/TradesSidebar';
import TradesDetail from '../components/trades/TradesDetail';
import TradesChat from '../components/trades/TradesChat';
// --- DATOS MOCK DE USUARIOS Y PROPUESTAS ---
const MOCK_USERS_DATA = [
  {
    id: "user_01",
    username: "AshKetchum99",
    avatarUrl: "https://i.pravatar.cc/150?u=ash",
    lastMessage: "¡Te cambio mi Charizard por tu Blastoise! Es una oferta única.",
    isActive: true, // Para el puntito verde
  },
  {
    id: "user_02",
    username: "MistyWater",
    avatarUrl: "https://i.pravatar.cc/150?u=misty",
    lastMessage: "¿Esa carta es holográfica? Me interesa mucho.",
    isActive: false,
  },
  {
    id: "user_03",
    username: "Brock_Rock",
    avatarUrl: "https://i.pravatar.cc/150?u=brock",
    lastMessage: "Te ofrezco 3 cartas de energía y un Onix.",
    isActive: true,
  },
  {
    id: "user_04",
    username: "Gary_Oak",
    avatarUrl: "https://i.pravatar.cc/150?u=gary",
    lastMessage: "Mi oferta es la mejor, acéptala ya.",
    isActive: false,
  },
  {
    id: "user_05",
    username: "TeamRocket_Jessie",
    avatarUrl: "https://i.pravatar.cc/150?u=jessie",
    lastMessage: "Prepárate para los problemas...",
    isActive: true,
  },
  {
    id: "user_06",
    username: "EntrenadorNovato",
    avatarUrl: undefined, // Probamos el fallback (sin imagen)
    lastMessage: "Hola, ¿sigue disponible?",
    isActive: false,
  },
  {
    id: "user_07",
    username: "PokeFan_2024",
    avatarUrl: "https://i.pravatar.cc/150?u=pokefan",
    lastMessage: "¡Gracias por el intercambio!",
    isActive: false,
  },
  {
    id: "user_08",
    username: "Profesor_Oak",
    avatarUrl: "https://i.pravatar.cc/150?u=oak",
    lastMessage: "¿Eres chico o chica?",
    isActive: true,
  }
];

export default function ExchangesPage() {
  // Estado: ID del usuario seleccionado (Empezamos con el primero por defecto)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(MOCK_USERS_DATA[0].id);

  // Helper: Buscar el objeto usuario completo basado en el ID seleccionado
  const selectedUser = MOCK_USERS_DATA.find(u => u.id === selectedUserId);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 overflow-hidden">      
      
      {/* Header Global */}
      <AppHeader />
      
      <div className="flex flex-1 overflow-hidden">
        
        {/* COLUMNA 1: SIDEBAR (Lista de Chats) */}
        <aside className="w-1/4 min-w-[280px] border-r border-gray-800 bg-gray-900/50">
          <TradesSidebar
            users={MOCK_USERS_DATA}
            loading={false}
            error={null}
            selectedUserId={selectedUserId}
            onUserSelect={setSelectedUserId}
          />
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 flex flex-row overflow-hidden relative">
          
          {selectedUserId && selectedUser ? (
            <>
              {/* COLUMNA 2: DETALLE DEL INTERCAMBIO (Centro) */}
              <section className="flex-1 bg-gray-800/30 p-6 overflow-y-auto flex items-center justify-center relative">
                {/* Pasamos el ID del usuario como si fuera el ID del trade 
                   para que el componente cargue los datos mock correspondientes 
                */}
                <TradesDetail tradeId={selectedUserId} />
              </section>

              {/* COLUMNA 3: CHAT Y ACCIONES (Derecha) */}
              <aside className="w-[350px] bg-gray-900 h-full border-l border-gray-800">
                <TradesChat 
                  userId={selectedUser.id} 
                  username={selectedUser.username} 
                />
              </aside>
            </>
          ) : (
            // Estado vacío (si no hay selección)
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
              <span className="text-6xl opacity-50">💬</span>
              <p className="text-lg">Selecciona una propuesta para ver los detalles.</p>
            </div>
          )}
        </main>
      </div>
      
    </div>
  );
}