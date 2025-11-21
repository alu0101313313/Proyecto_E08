import AppHeader from '@/app/components/collection/AppHeader'; 
import FilterSidebar from '@/app/components/collection/FilterSidebar';
import CardGridWishlist from '@/app/components/CardGridWishlist';

const mockWishlistData = [
  { 
    id: 101, 
    name: "Umbreon VMAX (Moonbreon)", 
    value: 650.00, 
    imageUrl: "https://images.pokemontcg.io/swsh7/215.png" 
  },
  { 
    id: 102, 
    name: "Giratina V (Lost Origin)", 
    value: 300.00, 
    imageUrl: "https://images.pokemontcg.io/swsh11/186.png" 
  },
  { 
    id: 103, 
    name: "Lugia V (Silver Tempest)", 
    value: 180.00, 
    imageUrl: "https://images.pokemontcg.io/swsh12/186.png" 
  },
  { 
    id: 104, 
    name: "Rayquaza VMAX (Evolving Skies)", 
    value: 280.00, 
    imageUrl: "https://images.pokemontcg.io/swsh7/218.png" 
  },
  { 
    id: 105, 
    name: "Gengar VMAX (Fusion Strike)", 
    value: 220.00, 
    imageUrl: "https://images.pokemontcg.io/swsh8/271.png" 
  },
  { 
    id: 106, 
    name: "Sylveon VMAX (Alt Art)", 
    value: 140.00, 
    imageUrl: "https://images.pokemontcg.io/swsh7/212.png" 
  },
  { 
    id: 107, 
    name: "Charizard ex (Obsidian Flames)", 
    value: 60.00, 
    imageUrl: "https://images.pokemontcg.io/sv3/223.png" 
  },
  { 
    id: 108, 
    name: "Magikarp (Paldea Evolved)", 
    value: 45.00, 
    imageUrl: "https://images.pokemontcg.io/sv2/203.png" 
  },
];

const calculateTotalValue = (cards: { id: number; name: string; value: number }[]) => {
  const total = cards.reduce((sum, card) => sum + card.value, 0);
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total);
}

export default function CollectionPage() {

  const totalValueCalculated = calculateTotalValue(mockWishlistData);  
  const totalCards = mockWishlistData.length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      
      <AppHeader />

      <div className="flex flex-row gap-8 p-8">
        
        <aside className="w-1/4">
          {/* 2. CORRECCIÓN: Nombres de props en español para coincidir con el componente */}
          <FilterSidebar 
            totalValue={totalValueCalculated} // Antes: totalValue
            totalCards={totalCards}          // Antes: totalCards
          />
        </aside>

        <main className="w-3/4">
          <CardGridWishlist cards={mockWishlistData} />
        </main>
      
      </div>
    </div>
  );
}