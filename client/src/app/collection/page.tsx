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
import FilterSidebar from '@/app/components/collection/FilterSidebar';
import CardGrid from '@/app/components/collection/CardGrid';

const mockCardsData = [
  { id: 1, name: "Pikachu V", value: 4.50 },
  { id: 2, name: "Charizard VMAX", value: 85.00 },
  { id: 3, name: "Energía Fuego", value: 0.10 },
  { id: 4, name: "Darkrai VSTAR", value: 12.00 },
  { id: 5, name: "Mewtwo EX", value: 22.64 },
  { id: 6, name: "Bulbasaur", value: 300.78 },
]
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