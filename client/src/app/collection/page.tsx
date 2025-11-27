'use client';
import  { useState, useEffect, use } from 'react';
import { useRouter } from 'next/router';

import AppHeader from '@/app/components/collection/AppHeader'; // <-- 1. Importa el Header
import FilterSidebar from '@/app/components/collection/FilterSidebar'; // <-- 2. Importa el Sidebar
import CardGrid from '@/app/components/collection/CardGrid';
import Loader from '@/app/components/ui/loader';
import NotFoundError from '@/app/components/ui/notfoundError';

interface Card {
  id: string;
  name?: string;
  value: number;
  imageUrl?: string;
}

// funcion que calcula el valor total de las cartas
const calculateTotalValue = (cards: { id: string | number; name?: string; value?: number }[]) => {
  const total = cards.reduce((sum, card) => sum + (card.value ?? 0), 0);
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total);
  // devuelve el total formateado en euros
}

export default function CollectionPage() {

  
  const router = useRouter();
  // estado vacio al principio
  const [cards, setCards] = useState<Card[]>([]); // <-- 3. Estado para las cartas
  const [loading, setLoading] = useState(true); // estado de carga
  const [error, setError] = useState(""); // estado de error

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // peticion al backend (usar NEXT_PUBLIC_API_URL si está definido)
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
        const response = await fetch(`${API_URL}/api/collection`, {
          method: 'GET',
          credentials: 'include', // para enviar cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          // si no está autenticado, redirige al login
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Error al obtener las cartas de la colección.');
        }
        
        const data = await response.json();
        // transformar la respuesta al formato que espera CardGrid
        interface BackendCard {
          _id?: string;
          id?: string;
          name?: string;
          image?: string;
          pricing?: {
            cardmarket?: {
              avgPrice?: number;
            } | null;
          } | null;
        }
        const mapped = (Array.isArray(data) ? data : []).map((c: BackendCard) => ({
          id: c._id || c.id || String(Math.random()),
          name: c.name,
          imageUrl: c.image,
          value: (c.pricing && c.pricing.cardmarket && c.pricing.cardmarket.avgPrice) ? c.pricing.cardmarket.avgPrice : 0,
        }));
        setCards(mapped);
        /// TODO: comprobar que el backend devuelve bien las cartas de la colección ( {cards: [...] } )

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards(); // llama a la función para obtener las cartas
  }, [router]);
  // calcula el valor total de las cartas
  const totalValueCalculated = calculateTotalValue(cards);
  const totalCards = cards.length;

  // eliminar carta localmente y en backend
  const handleRemove = async (cardId: string | number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
      const res = await fetch(`${API_URL}/api/collection/${String(cardId)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al eliminar carta');
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFoundError />;
  }
  return (
    // CONTENEDOR DE PÁGINA COMPLETA
    // 'flex-col' apila los elementos verticalmente (Header encima de Contenido)
    <div className="flex flex-col min-h-screen bg-gray-900">
      
      {/* 1. BARRA DE NAVEGACIÓN SUPERIOR */}
      <AppHeader />

      {/* 2. CONTENIDO PRINCIPAL (El layout de 2 columnas que ya tenías) */}
      <div className="flex flex-row gap-8 p-8">
        
        {/* COLUMNA IZQUIERDA (Sidebar de Filtros) */}
        <aside className="w-1/4">
          <FilterSidebar 
            totalValue={totalValueCalculated}
            totalCards={totalCards}
          />
        </aside>

        {/* COLUMNA DERECHA (Cuadrícula de Cartas) */}
        <main className="w-3/4">
          <CardGrid cards={cards} onRemove={handleRemove} />
        </main>
      
      </div>
    </div>
  );
// datos de ejemplo para las cartas (temporalmente mientras no haya backend
  
}





  
 