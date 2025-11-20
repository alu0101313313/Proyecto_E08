

import AppHeader from '@/app/components/collection/AppHeader'; // <-- 1. Importa el Header
import FilterSidebar from '@/app/components/collection/FilterSidebar'; // <-- 2. Importa el Sidebar
import CardGrid from '@/app/components/collection/CardGrid';

const mockCardsData = [
  { 
    id: 1, 
    name: "Charizard Base Set", 
    value: 350.00, 
    imageUrl: "https://images.pokemontcg.io/base1/4.png" 
  },
  { 
    id: 2, 
    name: "Blastoise Base Set", 
    value: 120.00, 
    imageUrl: "https://images.pokemontcg.io/base1/2.png" 
  },
  { 
    id: 3, 
    name: "Venusaur Base Set", 
    value: 100.00, 
    imageUrl: "https://images.pokemontcg.io/base1/15.png" 
  },
  { 
    id: 4, 
    name: "Pikachu Base Set", 
    value: 15.00, 
    imageUrl: "https://images.pokemontcg.io/base1/58.png" 
  },
  { 
    id: 5, 
    name: "Mewtwo Base Set", 
    value: 25.00, 
    imageUrl: "https://images.pokemontcg.io/base1/10.png" 
  },
  { 
    id: 6, 
    name: "Gyarados Base Set", 
    value: 20.00, 
    imageUrl: "https://images.pokemontcg.io/base1/6.png" 
  },
  { 
    id: 7, 
    name: "Alakazam Base Set", 
    value: 18.00, 
    imageUrl: "https://images.pokemontcg.io/base1/1.png" 
  },
  { 
    id: 8, 
    name: "Zapdos Base Set", 
    value: 22.00, 
    imageUrl: "https://images.pokemontcg.io/base1/16.png" 
  },
];

// funcion que calcula el valor total de las cartas
const calculateTotalValue = (cards: { id: number; name: string; value: number }[]) => {
  const total = cards.reduce((sum, card) => sum + card.value, 0);
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total);
  // devuelve el total formateado en euros
}

export default function CollectionPage() {

  const totalValueCalculated = calculateTotalValue(mockCardsData);  
  const totalCards = mockCardsData.length;
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
          <CardGrid cards={mockCardsData} />
        </main>
      
      </div>
    </div>
  );
}