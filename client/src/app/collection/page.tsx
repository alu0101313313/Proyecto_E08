'use client';
import  { useState, useEffect, use } from 'react';
import { useRouter } from 'next/router';

import AppHeader from '@/app/components/collection/AppHeader'; // <-- 1. Importa el Header
import FilterSidebar from '@/app/components/collection/FilterSidebar'; // <-- 2. Importa el Sidebar
import CardGrid from '@/app/components/collection/CardGrid';
import Loader from '@/app/components/ui/loader';
import NotFoundError from '@/app/components/ui/notfoundError';

interface Card {
  id: number;
  name: string;
  value: number;
  imageUrl: string;
}

// funcion que calcula el valor total de las cartas
const calculateTotalValue = (cards: { id: number; name: string; value: number }[]) => {
  const total = cards.reduce((sum, card) => sum + card.value, 0);
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
        // peticion al backend (puerto 5000)
        const response = await fetch('http://localhost:5000/api/collection', {
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
        // guardar cartas reales en el estado
        setCards(data || []); // guarda las cartas en el estado
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
          <CardGrid cards={cards} />
        </main>
      
      </div>
    </div>
  );
// datos de ejemplo para las cartas (temporalmente mientras no haya backend
  
}





  
 