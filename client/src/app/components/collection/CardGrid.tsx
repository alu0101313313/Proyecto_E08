'use client';
import Image from 'next/image';
import { useState } from 'react';
import NotFoundError from '../ui/notfoundError';
import Loader from '../ui/loader';

interface Card {
  id: string | number;
  name?: string;
  value?: number;
  imageUrl?: string;
}

interface CardGridProps {
  cards?: Card[];
  onRemove?: (cardId: string | number) => Promise<void> | void;
  onCardClick?: (cardId: string | number) => void;
}

export default function CardGrid({ cards, onRemove, onCardClick }: CardGridProps) {
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');

  const sortedCards = cards ? [...cards].sort((a, b) => {
    if (sortBy === 'price') {
      return (b.value ?? 0) - (a.value ?? 0);
    } else {
      return (a.name ?? '').localeCompare(b.name ?? '');
    }
  }) : [];

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      {/* Cabecera... (sin cambios) */}
      <div className="text-xl justify-between items-center mb-6 flex">
        <h2 className="text-xl font-semibold">Mi Colección</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Ordenar por:</span>
          <button 
            data-testid="sort-price-button"
            onClick={() => setSortBy('price')} 
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'price' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}>
            Precio
          </button>
          <button
            data-testid="sort-name-button"
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'name' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}>
            Nombre
          </button>
        </div>
      </div>

      {/* Cuadrícula de cartas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"> {/* Ajustado gap a 6 para más espacio vertical */}
        {sortedCards.length > 0 ? (
          sortedCards.map((card, idx) => (
            <div 
              key={card.id ?? idx}
              data-testid={`card-${card.id ?? idx}`}
              className="flex flex-col items-center" // Usamos flex-col para apilar imagen y botón
            >
              
              {/* --- 1. ZONA DE DETALLES (Abre el Modal) --- */}
              {/* Al hacer clic AQUÍ, se abre el modal. El botón de eliminar está FUERA de este div. */}
              <div 
                className="group cursor-pointer flex flex-col items-center w-full"
                onClick={() => onCardClick && onCardClick(String(card.id))}
              >
                <div className="relative">
                  <Image
                    src={card.imageUrl ?? '/placeholder.png'}
                    alt={card.name ?? 'Carta'}
                    width={200}
                    height={280}
                    className="rounded-lg w-full h-auto transition-transform duration-200 group-hover:scale-105 shadow-md"
                  />
                </div>
                
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-gray-300 truncate w-full px-1">{card.name}</p>
                  <p className="text-xs text-blue-300 font-mono mt-1">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(card.value ?? 0)}
                  </p>
                </div>
              </div>

              {/* --- 2. ZONA DE ACCIONES (No abre el Modal) --- */}
              {/* Este botón ahora es un hermano del div de arriba, no un hijo. */}
              {onRemove && (
                <button
                  onClick={() => onRemove(card.id ?? idx)}
                  className="mt-3 w-full bg-red-900/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-800 py-1.5 px-3 rounded text-xs font-medium transition-colors"
                >
                  Eliminar
                </button>
              )}

            </div>
          ))
        ) : (
          <p className="col-span-6 text-center text-gray-400 py-10">No hay cartas en tu colección.</p>
        )}
      </div>
    </div>  
  );
}