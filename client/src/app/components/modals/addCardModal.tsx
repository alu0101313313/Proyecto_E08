'use client';

import { useState } from 'react';
// 1. IMPORTAR LOS COMPONENTES DE UI
import Loader from '../ui/loader';
import NotFoundError from '../ui/notfoundError';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cardId: string, category?: string) => Promise<void>;
}

interface SearchResult {
  id: string;
  name: string;
  image?: string;
  category?: string;
}

export default function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  // 2. AÑADIR EL ESTADO 'hasSearched'
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true); // 3. MARCAR QUE SE HA BUSCADO

    try {
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards?name=${searchTerm}`);
      const data = await response.json();
      
      const mappedResults = (data || [])
        .filter((c: any) => c.image)
        .slice(0, 12)
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          image: `${c.image}/low.png`,
          category: c.category
        }));

      setResults(mappedResults);
    } catch (error) {
      console.error("Error buscando cartas:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddClick = async (cardId: string, category?: string) => {
    setIsAdding(cardId);
    await onAdd(cardId, category);
    setIsAdding(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-gray-700 overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">Añadir Nueva Carta</h2>
            <p className="text-gray-400 text-sm">Busca y añade cartas a tu colección</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg">
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="p-6 bg-gray-800 border-b border-gray-700">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Ej: Pikachu, Charizard, Energy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>

        {/* 4. ACTUALIZAR LA LÓGICA DE RENDERIZADO (Igual que Wishlist) */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900/30">
          
          {isSearching ? (
            // ESTADO: CARGANDO
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          ) : results.length === 0 ? (
            hasSearched ? (
              // ESTADO: NO ENCONTRADO (La tele)
              <div className="flex justify-center items-center h-full">
                <NotFoundError />
              </div>
            ) : (
              // ESTADO: INICIAL
              <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
                <span className="text-6xl mb-4">🔍</span>
                <p className="text-lg">Busca una carta para empezar</p>
              </div>
            )
          ) : (
            // ESTADO: RESULTADOS
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((card) => (
                <div key={card.id} className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex flex-col gap-3 group hover:border-blue-500/50 hover:shadow-lg transition-all">
                  <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-lg bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={card.image} 
                      alt={card.name} 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="text-center mt-auto">
                    <h3 className="text-white font-medium text-sm truncate mb-2" title={card.name}>{card.name}</h3>
                    <button
                      onClick={() => handleAddClick(card.id, card.category)}
                      disabled={isAdding === card.id}
                      className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-green-900/20"
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