'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

import AppHeader from '@/app/components/collection/AppHeader';
import FilterSidebar from '@/app/components/collection/FilterSidebar';
import CardGrid from '@/app/components/collection/CardGrid';
import AddCardModal from '@/app/components/addCardModal';

interface Card {
  id: string;
  name?: string;
  value: number;
  imageUrl?: string;
  category?: string;
}

// Tipo que describe la respuesta que viene del servidor/back-end
interface ServerCard {
  _id: string;
  id?: string;
  name?: string;
  image?: string;
  category?: string;
  pricing?: {
    cardmarket?: { avgPrice?: number } | null;
    tcgplayer?: { normal?: { marketPrice?: number; avgHoloPrice?: number } } | null;
  } | null;
}

const calculateTotalValue = (cards: Card[]) => {
  const total = cards.reduce((sum, card) => sum + (card.value || 0), 0);
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(total);
}

export default function CollectionPage() {
  const router = useRouter();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Función auxiliar para corregir URLs de TCGdex
  const fixImageUrl = (url?: string) => {
    // 1. Si no hay URL, devolvemos el reverso de la carta
    if (!url) return 'https://images.pokemontcg.io/base1/back.png';
    
    // 2. Si es una URL de TCGdex (assets.tcgdex.net)
    if (url.includes('assets.tcgdex.net')) {
      // Si ya termina en /high.png o /low.png, la dejamos tal cual (o forzamos high si quieres)
      if (url.endsWith('/high.png') || url.endsWith('/low.png')) {
        return url; 
      }
      
      // Si termina en .png o .jpg pero NO es high/low, podría ser otra cosa, pero por seguridad...
      // La mayoría de las veces TCGdex devuelve la ruta base sin extensión.
      // Así que simplemente le pegamos '/high.png' al final.
      return `${url}/high.png`;
    }

    // 3. Si es de otra API (como pokemontcg.io), la devolvemos tal cual
    return url;
  };

  const reloadCards = async () => {
    try {
      const response = await fetch('/api/collection');
      if (response.ok) {
        const data = await response.json();
        const mappedCards = (Array.isArray(data) ? data : []).map((c: ServerCard) => ({
          id: c._id,
          name: c.name,
          imageUrl: fixImageUrl(c.image),
          category: c.category,
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
        const response = await fetch('/api/collection', {
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
          id: c._id,
          name: c.name,
          imageUrl: fixImageUrl(c.image),
          category: c.category,
          value: c.pricing?.cardmarket?.avgPrice 
              || c.pricing?.tcgplayer?.normal?.marketPrice 
              || c.pricing?.tcgplayer?.normal?.avgHoloPrice
              || 0,
        }));

        setCards(mappedCards);

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards();
  }, [router]);

  const handleAddCard = async (cardApiId: string, category?: string) => {
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cardApiId,
          category: category, 
          isForTrade: false
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
    if (!confirm("¿Eliminar carta de tu colección?")) return;
    const idString = String(cardId);

    // 1. Buscamos la carta en el estado local para obtener su categoría
    const cardToDelete = cards.find(c => c.id === idString);
    
    // Si no encontramos la categoría, asumimos 'Pokemon' por defecto o lanzamos error
    const category = cardToDelete?.category || 'Pokemon';

    try {
      const res = await fetch(`/api/cards/${idString}`, { 
        method: 'DELETE',
        // IMPORTANTE: Añadimos headers y body para enviar la categoría
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

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">{error}</div>;

  const totalValueCalculated = calculateTotalValue(cards);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      
      <AppHeader />

      <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        <aside className="w-full md:w-1/4 space-y-6">
          <FilterSidebar totalValue={totalValueCalculated} totalCards={cards.length} />
        </aside>

        <main className="w-full md:w-3/4">
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Mi Colección</h1>
              <p className="text-gray-400 text-sm">Gestiona tus cartas y mazos</p>
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl leading-none">+</span>
              <span>Añadir Carta</span>
            </button>
          </div>

          {cards.length > 0 ? (
            <CardGrid cards={cards} onRemove={handleRemove} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30">
              <span className="text-4xl mb-4">📭</span>
              <p className="text-gray-300">Tu colección está vacía.</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 text-blue-400 hover:underline"
              >
                ¡Añade tu primera carta ahora!
              </button>
            </div>
          )}
        </main>
      </div>

      <AddCardModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddCard} 
      />

    </div>
  );
}