'use client';

import Image from 'next/image';
import NotFoundError from '../ui/notfoundError';
import Loader from '../ui/loader';
import CardDetailModal from '../modals/CardDetailModal';
import AddCardFromCollectionModal from '../modals/addCardFromColectionModal';
import { useState, useEffect } from 'react';

// 1. ACTUALIZAMOS EL MOCK A ARRAYS
interface Card {
  id: number | string;
  name: string;
  image: string;
  value?: number;
}

interface Owner {
  _id: string;
  username: string;
  profileImageUrl?: string;
}

const MOCK_OFFER: { theirCards: Card[]; myCards: Card[] } = {
  theirCards: [
    {
      id: 'base1-58',
      name: 'Pikachu Base Set',
      image: 'https://images.pokemontcg.io/base1/58.png',
      value: 200
    },
    {
      id: 'base1-63',
      name: 'Squirtle Base Set',
      image: 'https://images.pokemontcg.io/base1/63.png',
      value: 50
    }
  ],
  myCards: [
    {
      id: 'swsh3-20',
      name: 'Charizard VMAX',
      image: 'https://images.pokemontcg.io/swsh3/20.png',
      value: 230
    },
    {
      id: 'base1-104',
      name: 'Darkness Energy',
      image: 'https://images.pokemontcg.io/base1/104.png',
      value: 5
    },
    {
      id: 'base1-94',
      name: 'Potion',
      image: 'https://images.pokemontcg.io/base1/94.png',
      value: 2
    }
  ]
};

// Icono de intercambio
const ExchangeIcon = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-900 p-2 rounded-full border border-gray-700 shadow-xl">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  </div>
);

interface TradeDetailProps {
  tradeId: string | number;
}

export default function TradesDetail({ tradeId }: TradeDetailProps) {
  // move hooks inside component
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [mySelectedCards, setMySelectedCards] = useState<Card[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    username: string;
    profileImageUrl?: string;
  } | null>(null);
  const [theirCard, setTheirCard] = useState<{
    cardId: string;
    tcgdexId?: string;
    name: string;
    image?: string;
    category: string;
    condition?: string;
    rarity?: string;
    isTradable?: boolean;
    owner: Owner;
  } | null>(null);

  // Cargar la carta seleccionada desde sessionStorage
  useEffect(() => {
    try {
      const storedCard = sessionStorage.getItem('trade_theirCard');
      if (storedCard) {
        const parsedCard = JSON.parse(storedCard);
        setTheirCard(parsedCard);
      }
    } catch (e) {
      console.error('Error loading trade card:', e);
    }
  }, []);

  // Cargar información del usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const fixImageUrl = (url?: string) => {
    if (!url) return 'https://images.pokemontcg.io/base1/back.png';
    
    if (url.includes('assets.tcgdex.net')) {
      if (url.endsWith('/high.png') || url.endsWith('/low.png')) return url;
      return `${url}/high.png`;
    }
    return url;
  };

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  const handleAddCardFromCollection = (card: Card) => {
    setMySelectedCards(prev => [...prev, card]);
  };

  const handleRemoveCard = (cardId: string | number) => {
    setMySelectedCards(prev => prev.filter(card => card.id !== cardId));
  };
  
  if (loading) return <div className="p-4 flex justify-center"><Loader /></div>;
  if (error) return <div className="p-4"><NotFoundError /></div>;

  // Si no hay carta seleccionada, mostrar mensaje
  if (!theirCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
        <span className="text-6xl opacity-50">🃏</span>
        <p className="text-lg">Selecciona una carta para intercambiar</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl h-full flex flex-col justify-center">
      
      {/* Modal de detalle */}
      <CardDetailModal 
        cardId={selectedCardId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Modal para añadir cartas de la colección */}
      <AddCardFromCollectionModal 
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onSelectCard={handleAddCardFromCollection}
        selectedCardIds={new Set(mySelectedCards.map(card => {
          // Si es una carta de la colección tendrá _id, si es mockup tendrá id
          const cardId = (card as any)._id || card.id.toString();
          return cardId.toString();
        }))}
      />

      {/* Contenedor de comparación */}
      <div className="flex flex-row items-stretch justify-center gap-0 relative bg-gray-900/40 rounded-2xl border border-gray-800 p-2 min-h-[500px]">
        
        {/* ICONO CENTRAL */}
        <ExchangeIcon />

        {/* --- LADO IZQUIERDO (RECIBIR) --- */}
        <div className="flex-1 flex flex-col items-center gap-4 p-4 border-r border-gray-700/50 border-dashed">
          
          {/* Cabecera Usuario */}
          <div className="flex items-center gap-3 mb-2 bg-gray-800/50 px-4 py-2 rounded-full shadow-sm">
            <div className="relative w-8 h-8">
              <Image 
                src={theirCard.owner.profileImageUrl || 'https://i.pravatar.cc/150'} 
                alt={theirCard.owner.username} 
                fill
                className="rounded-full object-cover border border-gray-500"
                unoptimized
              />
            </div>
            <h3 className="text-lg font-bold text-gray-200">Recibir de {theirCard.owner.username} (1)</h3>
          </div>
          
          {/* GRID DE CARTAS */}
          <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar flex items-center justify-center">
            <div 
              className="relative group w-full max-w-[180px] cursor-pointer"
              onClick={() => handleCardClick(theirCard.tcgdexId || theirCard.cardId)}
            >
              <div className="relative aspect-[2.5/3.5] w-full">
                <Image 
                  src={fixImageUrl(theirCard.image)} 
                  alt={theirCard.name} 
                  fill
                  className="object-contain drop-shadow-lg transition-transform group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] p-1 text-center rounded transition-opacity pointer-events-none">
                {theirCard.name}
              </div>
            </div>
          </div>
        </div>


        {/* --- LADO DERECHO (DAR) --- */}
        <div className="flex-1 flex flex-col items-center gap-4 p-4">
          
          {/* Cabecera Yo */}
          <div className="flex items-center gap-3 mb-2 bg-gray-800/50 px-4 py-2 rounded-full shadow-sm">
            <h3 className="text-lg font-bold text-gray-200">Dar ({MOCK_OFFER.myCards.length})</h3>
            <div className="relative w-8 h-8">
              <Image 
                src={currentUser?.profileImageUrl || 'https://i.pravatar.cc/150'} 
                alt={currentUser?.username || 'Usuario'} 
                fill
                className="rounded-full object-cover border border-blue-400"
                unoptimized
              />
            </div>
          </div>

          {/* Botón para añadir cartas */}
          <button 
            className="w-full max-w-[280px] py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            onClick={() => setIsAddCardModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Añadir cartas
          </button>

          {/* GRID DE CARTAS (SCROLLABLE) */}
          <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3 place-items-center">
              {mySelectedCards.map((card) => (
                <div 
                  key={card.id} 
                  className="group w-full max-w-[140px] space-y-2"
                >
                  <div 
                    className="relative aspect-[2.5/3.5] w-full cursor-pointer"
                    onClick={() => handleCardClick(card.id.toString())}
                  >
                    <Image 
                      src={fixImageUrl(card.image)} 
                      alt={card.name} 
                      fill
                      className="object-contain drop-shadow-lg transition-transform group-hover:scale-105"
                      unoptimized
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] p-1 text-center rounded transition-opacity pointer-events-none">
                      {card.name}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="w-full py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
                    title="Eliminar carta"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>

  );
}