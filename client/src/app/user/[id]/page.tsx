'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; 

import AppHeader from '@/app/components/collection/AppHeader';
import FilterSidebar from '@/app/components/collection/FilterSidebar';
import CardGrid from '@/app/components/collection/CardGrid';
import AddCardModal from '@/app/components/modals/addCardModal';
import CardDetailModal from '../../components/modals/CardDetailModal';

import Loader from '../../components/ui/loader';
import NotFoundError from '../../components/ui/notfoundError';
import Image from 'next/image'; // Ensure Image is imported from next/image

interface Card {
  id: string;
  name?: string;
  value: number;
  imageUrl?: string;
  category?: string;
  isTradable?: boolean; 
  condition?: string; 
}

interface ServerCard {
  _id: string;
  id?: string;
  name?: string;
  image?: string;
  category?: string;
  isTradable?: boolean; 
  condition?: string; 
  pricing?: {
    cardmarket?: { avgPrice?: number } | null;
    tcgplayer?: { normal?: { marketPrice?: number; avgHoloPrice?: number } } | null;
  } | null;
}

const calculateTotalValue = (cards: Card[]) => {
  const total = cards.reduce((sum, card) => sum + (card.value || 0), 0);
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total);
}

const fixImageUrl = (url?: string) => {
  if (!url) return 'https://images.pokemontcg.io/base1/back.png';
  if (url.includes('assets.tcgdex.net')) {
    if (!url.endsWith('/high.png') && !url.endsWith('/low.png')) {
      return `${url}/high.png`;
    }
  }
  return url;
};


export default function CollectionPage() {
  const router = useRouter();
  const params =  useParams(); 
  const targetUserId = params.id as string || null; 
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [targetUsername, setTargetUsername] = useState<string | null>(null);
  const [targetUserAvatar, setTargetUserAvatar] = useState<string | null>(null);

  const isViewingOwn = !targetUserId;
  
  const handleCardClick = (cardId: string | number) => {
    setSelectedCardId(String(cardId)); 
    setIsDetailModalOpen(true);
  };
  
  const fetchTargetUsername = async (userId: string) => {
    try {
      // Endpoint /api/users/:userId devuelve username y profileImageUrl (lo creamos en un paso anterior)
      const res = await fetch(`/api/users/${userId}`); 
      if (res.ok) {
        const data = await res.json();
        setTargetUsername(data.username);
        // Capturamos el avatar
        setTargetUserAvatar(data.profileImageUrl || 'https://images.pokemontcg.io/base1/4.png'); 
      } else {
        setTargetUsername('Usuario Desconocido');
        setTargetUserAvatar(null);
      }
    } catch (e) {
      setTargetUsername('Error al obtener el nombre');
      setTargetUserAvatar(null);
    }
  };

  const reloadCards = async () => {
    try {
      const url = targetUserId ? `/api/collection/${targetUserId}` : '/api/collection';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const mappedCards = (Array.isArray(data) ? data : []).map((c: ServerCard) => ({
          id: c.id || c._id,
          name: c.name,
          imageUrl: fixImageUrl(c.image),
          category: c.category,
          isTradable: c.isTradable || false, 
          condition: c.condition || 'Mint', 
          value: c.pricing?.cardmarket?.avgPrice 
              || c.pricing?.tcgplayer?.normal?.marketPrice 
              || c.pricing?.tcgplayer?.normal?.avgHoloPrice
              || 0,
        }));
        setCards(mappedCards);
      }
    } catch (err) {
      console.error("Error recargando:", err);
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const url = targetUserId ? `/api/collection/${targetUserId}` : '/api/collection';
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('No se pudieron cargar las cartas.');
        }
        
        const data = await response.json();
        
        const mappedCards = (Array.isArray(data) ? data : []).map((c: ServerCard) => ({
          id: c.id || c._id,
          name: c.name,
          imageUrl: fixImageUrl(c.image),
          category: c.category,
          isTradable: c.isTradable || false, 
          condition: c.condition || 'Mint', 
          value: c.pricing?.cardmarket?.avgPrice 
              || c.pricing?.tcgplayer?.normal?.marketPrice 
              || c.pricing?.tcgplayer?.normal?.avgHoloPrice
              || 0,
        }));

        setCards(mappedCards);
        
        if (targetUserId) {
          fetchTargetUsername(targetUserId);
        }

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards();
  }, [router, targetUserId]);

  // --- HANDLER DE TOGGLE (PATCH) ---
  const handleToggleTradable = async (cardId: string, currentStatus: boolean) => {
    const idString = String(cardId);
    
    const cardToUpdate = cards.find(c => c.id === idString);
    const category = cardToUpdate?.category;

    if (!category) {
      alert("Error: No se pudo determinar el tipo de carta para actualizar.");
      return;
    }
    
    try {
      // LLAMAMOS AL ENDPOINT PATCH
      const res = await fetch(`/api/cards/${cardId}/tradable`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTradable: !currentStatus, // El nuevo estado
          category: category // Pasamos la categoría al backend
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar estado.');
      }
      
      // Actualización optimista: Solo cambiamos el estado en la UI
      setCards(prev => prev.map(c => 
        c.id === idString ? { ...c, isTradable: !currentStatus } : c
      ));

    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert(`Fallo al actualizar el estado: ${message}`);
    }
  };

  // --- HANDLER DE AÑADIR CARTA (RECIBE CONDICIÓN Y TRADABLE) ---
  const handleAddCard = async (cardApiId: string, category: string, condition: string, isTradable: boolean) => {
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cardApiId,
          category: category,
          condition: condition, // <--- CAMPO ENVIADO
          isTradable: isTradable // <--- CAMPO ENVIADO
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
        return;
      }
      alert("¡Carta añadida a tu colección!");
      await reloadCards(); 
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };


  const handleRemove = async (cardId: string | number) => {
    // ... (lógica de borrado) ...
    if (!confirm("¿Eliminar carta de tu colección?")) return;
    const idString = String(cardId);

    const cardToDelete = cards.find(c => c.id === idString);
    const category = cardToDelete?.category || 'Pokemon';

    try {
      const res = await fetch(`/api/cards/${idString}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: category }) 
      });

      if (!res.ok) throw new Error('Error al eliminar');
      
      setCards(prev => prev.filter(c => c.id !== idString));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar. Revisa la consola.");
    }
  };

  if (loading) return <Loader />; // PRIMERA VERIFICACIÓN DE CARGA/ERROR
  if (error) return <NotFoundError />;

  const totalValueCalculated = calculateTotalValue(cards);
  
  const collectionTitle = isViewingOwn 
    ? 'Mi Colección' 
    : `Colección de ${targetUsername || targetUserId || 'Usuario'}`;
    
  const collectionSubtitle = isViewingOwn 
    ? 'Gestiona tus cartas y mazos' 
    : 'Colección pública de este coleccionista';


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      
      <AppHeader />

      <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        <aside className="w-full md:w-1/4 space-y-6">
          <FilterSidebar totalValue={totalValueCalculated} totalCards={cards.length} />
        </aside>

        <main className="w-full md:w-3/4">
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 gap-4">
            <div className="flex items-center gap-4">
                {/* 1. Imagen del Usuario Ajeno (Condicional) */}
                {!isViewingOwn && targetUserAvatar && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                        <Image 
                            src={targetUserAvatar} 
                            alt={`Avatar de ${targetUsername}`} 
                            width={48} 
                            height={48} 
                            className="object-cover w-full h-full"
                            unoptimized
                        />
                    </div>
                )}
              <div>
              <h1 className="text-2xl font-bold text-white">{collectionTitle}</h1>
              <p className="text-gray-400 text-sm">{collectionSubtitle}</p>
              </div>
            </div>
            {/* Botón de añadir solo aparece si es TU colección */}
            {isViewingOwn && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl leading-none">+</span>
                <span>Añadir Carta</span>
              </button>
            )}
          </div>

          {cards.length > 0 ? (
            <CardGrid 
              cards={cards} 
              onRemove={isViewingOwn ? handleRemove : undefined}
              onCardClick={handleCardClick}
              // PASAMOS EL HANDLER DEL TOGGLE SOLO SI ES PROPIA
              onToggleTradable={isViewingOwn ? handleToggleTradable : undefined}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30">
              <span className="text-4xl mb-4">📭</span>
              <p className="text-gray-300">
                {isViewingOwn ? 'Tu colección está vacía.' : 'Este usuario aún no tiene cartas.'}
              </p>
              {isViewingOwn && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 text-blue-400 hover:underline"
                >
                  ¡Añade tu primera carta ahora!
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {isViewingOwn && (
        <AddCardModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddCard} 
        />
      )}
      <CardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        cardId={selectedCardId}
      />

    </div>
  );
}
