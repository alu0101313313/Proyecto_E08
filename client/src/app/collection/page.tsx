// import FilterSidebar from "../components/collection/FilterSidebar";
// import CardGrid from "../components/collection/CardGrid";


// export default function CollectionPage() {
//   return (
//     // contenedor principal de la página de colección
//     // Usamos flexbox para diseño de dos columnas que contienen la barra lateral y la cuadrícula de cartas
//     <div className="flex flex-row gap-8 p-8"> 
//       {/* Barra lateral de filtros (sidebar) */}
//       <aside className="w-1/4">
//         <FilterSidebar />
//       </aside>
//       <main className="w-3/4">
//         <CardGrid />
//       </main>

//     </div>
//   )
// }

import AppHeader from '@/app/components/collection/AppHeader'; // <-- 1. Importa el Header
import FilterSidebar from '@/app/components/collection/FilterSidebar'; // <-- 2. Importa el Sidebar
import CardGrid from '@/app/components/collection/CardGrid';

const mockCardsData = [
  { id: 1, name: "Pikachu Celebrations", value: 4.50, imageUrl: "https://images.pokemontcg.io/cel/25.png" },
  { id: 2, name: "Pikachu Base Set", value: 85.00, imageUrl: "https://images.pokemontcg.io/base1/58.png" },
  { id: 3, name: "Fire Energy", value: 0.10, imageUrl: "https://images.pokemontcg.io/base1/105.png" },
  { id: 4, name: "Darkrai VSTAR", value: 12.00, imageUrl: "https://images.pokemontcg.io/swsh9/88_ptcgo1.png" },
  { id: 5, name: "Zoroark VSTAR", value: 22.64, imageUrl: "https://images.pokemontcg.io/swsh11/147_ptcgo1.png" },
  { id: 6, name: "Lucario V", value: 3.00, imageUrl: "https://images.pokemontcg.io/swsh9/78_ptcgo1.png" },
  { id: 7, name: "Darkness Ablaze Charizard", value: 15.00, imageUrl: "https://images.pokemontcg.io/swsh3/20_ptcgo1.png" },
  { id: 8, name: "Arceus V", value: 9.50, imageUrl: "https://images.pokemontcg.io/swsh9/122_ptcgo1.png" },
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
          <CardGrid />
        </main>
      
      </div>
    </div>
  );
}