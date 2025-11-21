'use client';
// Componente de la cuadrícula de cartas (vacío por ahora)
import Image from 'next/image'; // librería para optimizar imágenes
import { useState } from 'react'; // hook de React para manejar estado
interface Card {
  id: number;
  name: string;
  value: number;
  imageUrl: string;
}

interface CardGridProps {
  cards?: Card[]; // opcional, por si queremos pasar cartas como props en el futuro
}

export default function CardGrid({ cards }: CardGridProps) {
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');
  // esto es para manejar el estado de la ordenación (por precio o por nombre) mediante un hook de React
  // funciona como una variable reactiva que actualiza el componente cuando cambia su valor

  // función para ordenar las cartas según el criterio seleccionado
  const sortedCards = cards ? [...cards].sort((a, b) => {
    if (sortBy === 'price') {
      return b.value - a.value; // ordenar por valor (precio)
    } else {

      return a.name.localeCompare(b.name); // ordenar por nombre
      // localeCompare es un método de strings que compara dos cadenas según las reglas del idioma
    }
  }) : []; // cartas ordenadas según el criterio seleccionado. Devuelve un array vacío si no hay cartas.
  return (
    // Contenedor de la cuadrícula de cartas
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      { /* Cabecera (titulo y ordenacion) */ }
      <div className="text-xl justify-between items-center mb-6 flex">
        <h2 className="text-xl font-semibold">Mi Colección</h2>

        {/* Selector de ordenación (dropdown) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Ordenar por:</span>
          <button 
            // boton ordenar por precio
            data-testid="sort-price-button"
            onClick={() => setSortBy('price')} 
            // al hacer click, cambia el estado de ordenación a 'price' y se llama a la función setSortBy

            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'price' 
              // en caso de estar seleccionado, cambia el color del boton. Si no, otro color
              ? 'bg-blue-600 text-white hover:bg-blue-500' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}>
            Precio
          </button>
          <button
            // boton ordenar por nombre
            data-testid="sort-name-button"
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'name' 
              ? 'bg-blue-600 text-white hover:bg-blue-500'  
              : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}>
            Nombre
          </button>
        </div>
      </div>
      { /* Cuadrícula de cartas */ }
      <div className="grid grid-cols-6 gap-4">
        { /* Mapeo de las cartas ordenadas */ }
        {sortedCards.length > 0 ? (
          sortedCards.map(card => (
            <div key={card.id}
            data-testid={`card-${card.id}`}
            className="relative group"> 
            {/* relative group por si queremos añadir efectos o elementos superpuestos */ }
              <Image
                src={card.imageUrl}
                alt={card.name}
                width={200}
                height={280}
                className="
                  rounded-lg
                  w-full h-auto
                  transition-transform duration-200
                  hover:scale-105
                  cursor-pointer
                "
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-light text-gray-400">{card.name}</p>
                <p className="text-xs text-gray-200 font-mono">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(card.value)}
                </p>
                  
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-6 text-center text-gray-400">No hay cartas en tu colección.</p>
        )}
      </div>
    </div>  
  );
}