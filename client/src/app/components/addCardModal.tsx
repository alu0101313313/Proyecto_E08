'use client';

import { useState } from 'react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cardId: string, category?: string) => Promise<void>; // Ahora también pasamos la categoría
}

interface SearchResult {
  id: string;
  name: string;
  image?: string;
  category?: string; // Pokemon, Trainer, Energy
}

export default function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null); // ID de la carta que se está añadiendo

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // Usamos la API pública de TCGdex directamente o tu propio endpoint de búsqueda si lo tienes
      // Aquí asumimos que usas la API oficial de TCGdex para buscar
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards?name=${searchTerm}`);
      const data = await response.json();
      
      // Filtramos y mapeamos los resultados (limitamos a 10 para no saturar)
      const mappedResults = data
        .filter((c: any) => c.image) // Solo cartas con imagen
        .slice(0, 12)
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          image: `${c.image}/low.png`, // Usamos la versión de baja calidad para la lista
          category: c.category
        }));

      setResults(mappedResults);
    } catch (error) {
      console.error("Error buscando cartas:", error);
      alert("Error al buscar cartas");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddClick = async (cardId: string, category?: string) => {
    setIsAdding(cardId);
    await onAdd(cardId, category);
    setIsAdding(null);
    // Opcional: Cerrar modal tras añadir o dejarlo abierto para añadir más
    // onClose(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-gray-700">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Añadir Nueva Carta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Buscador */}
        <div className="p-6 bg-gray-800/50">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Ej: Pikachu, Charizard, Energy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto p-6">
          {results.length === 0 && !isSearching ? (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-xl">🔍</p>
              <p>Busca una carta para empezar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((card) => (
                <div key={card.id} className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex flex-col gap-3 group hover:border-blue-500 transition-all">
                  <div className="relative aspect-[2.5/3.5] overflow-hidden rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={card.image} 
                      alt={card.name} 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-medium text-sm truncate" title={card.name}>{card.name}</h3>
                    <p className="text-gray-500 text-xs mb-3">{card.id}</p>
                    <button
                      onClick={() => handleAddClick(card.id, card.category)}
                      disabled={isAdding === card.id}
                      className="w-full bg-green-600 hover:bg-green-500 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {isAdding === card.id ? 'Añadiendo...' : '+ Añadir'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}