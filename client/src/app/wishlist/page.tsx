'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AppHeader from '@/app/components/collection/AppHeader';
import FilterSidebar from '@/app/components/collection/FilterSidebar';
import CardGridWishlist from '@/app/components/CardGridWishlist';
import AddWishlistModal from '../components/modals/wishlistModal';
import CardDetailModal from '../components/modals/CardDetailModal';

import NotFoundError from '../components/ui/notfoundError';
import Loader from '../components/ui/loader';
interface Card {
  id: string;
  name?: string;
  value: number;
  imageUrl?: string;
  category?: string;
}

const calculateTotalValue = (cards: Card[]) => {
  const total = cards.reduce((sum, card) => sum + (card.value || 0), 0);
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total);
}

export default function WishlistPage() {
  const router = useRouter();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Helper para imágenes (igual que en collection)
  const fixImageUrl = (url?: string) => {
    if (!url) return 'https://images.pokemontcg.io/base1/back.png';
    if (url.includes('assets.tcgdex.net') && !url.endsWith('.png') && !url.endsWith('.jpg')) {
      return `${url}/high.png`;
    }
    return url;
  };

  const handleCardClick = (cardId: string | number) => {
    setSelectedCardId(String(cardId));
    setIsDetailModalOpen(true);
  };

  // Función para cargar/recargar la wishlist
  const loadWishlist = async () => {
    try {
      // LLAMADA AL BACKEND: GET /api/wishlist
      const response = await fetch('/api/wishlist');
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) throw new Error('Error al cargar wishlist');
      
      const data = await response.json();
      
      // Mapeamos los datos que vienen de la API externa (a través de tu backend)
      const mappedCards = (Array.isArray(data) ? data : []).map((c: any) => ({
        id: c.id, // OJO: Aquí el ID es el de la API externa (ej 'sv1-1'), no _id de Mongo
        name: c.name,
        imageUrl: fixImageUrl(c.image),
        category: c.category,
        // Precio estimado
        value: c.cardmarket?.prices?.averageSellPrice || 0,
      }));
      
      setCards(mappedCards);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [router]);

  // --- AÑADIR A WISHLIST ---
  const handleAddWish = async (cardApiId: string) => {
    try {
      // LLAMADA AL BACKEND: POST /api/wishlist
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: cardApiId }) // Enviamos solo el ID
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      alert("¡Añadida a tu lista de deseos!");
      await loadWishlist(); // Recargamos para verla

    } catch (error) {
      console.error(error);
      alert("Error de conexión");

    }
  };

  // --- ELIMINAR DE WISHLIST ---
  const handleRemove = async (cardId: string | number) => {
    if (!confirm("¿Quitar de tu lista de deseos?")) return;
    const idString = String(cardId);

    try {
      // LLAMADA AL BACKEND: DELETE /api/wishlist/:id
      const res = await fetch(`/api/wishlist/${idString}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      
      setCards(prev => prev.filter(c => c.id !== idString));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar");
    }
  };

  if (loading) return <Loader />; // PRIMERA VERIFICACIÓN DE CARGA/ERROR
  if (error) return <NotFoundError />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      
      <AppHeader />

      <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        <aside className="w-full md:w-1/4 space-y-6">
          {/* Reutilizamos el sidebar, el valor total aquí es "cuánto costaría comprar todo" */}
          <FilterSidebar 
            totalValue={calculateTotalValue(cards)} 
            totalCards={cards.length} 
          />
        </aside>

        <main className="w-full md:w-3/4">
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                ❤️ Mi Lista de Deseos
              </h1>
              <p className="text-gray-400 text-sm">Cartas que estás buscando</p>
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-pink-600 hover:bg-pink-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-pink-900/20 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl leading-none">+</span>
              <span>Añadir Deseo</span>
            </button>
          </div>

              {cards.length > 0 ? (
              <CardGridWishlist 
                cards={cards} 
                onRemove={handleRemove}
                onCardClick={handleCardClick}
              />
              ) : (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30">
                <span className="text-4xl mb-4">✨</span>
                <p className="text-gray-300">Tu lista de deseos está vacía.</p>
                <button 
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 text-pink-400 hover:underline"
                >
                ¡Empieza a soñar aquí!
                </button>
              </div>
              )}
        </main>
      </div>

      <AddWishlistModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddWish} 
      />
      <CardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        cardId={selectedCardId}
      />

    </div>
  );
}