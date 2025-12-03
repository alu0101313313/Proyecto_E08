'use client';

import Image from 'next/image';
import NotFoundError from '../ui/notfoundError';
import Loader from '../ui/loader';
import { useState } from 'react';

// 1. ACTUALIZAMOS EL MOCK A ARRAYS
interface Card {
  id: number;
  name: string;
  image: string;
  value: number;
}

const MOCK_OFFER: { theirCards: Card[]; myCards: Card[] } = {
  theirCards: [
    {
      id: 1,
      name: 'Pikachu Base Set',
      image: 'https://images.pokemontcg.io/base1/58.png',
      value: 200
    },
    {
      id: 2,
      name: 'Squirtle Base Set',
      image: 'https://images.pokemontcg.io/base1/63.png',
      value: 50
    }
  ],
  myCards: [
    {
      id: 3,
      name: 'Charizard VMAX',
      image: 'https://images.pokemontcg.io/swsh3/20.png',
      value: 230
    },
    {
      id: 4,
      name: 'Darkness Energy',
      image: 'https://images.pokemontcg.io/base1/104.png',
      value: 5
    },
    {
      id: 5,
      name: 'Potion',
      image: 'https://images.pokemontcg.io/base1/94.png',
      value: 2
    }
  ]
};

// Icono de intercambio
const ExchangeIcon = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-900 p-2 rounded-full border border-gray-700 shadow-xl">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  </div>
);

interface TradeDetailProps {
  tradeId: string | number;
}

export default function TradesDetail({ tradeId }: TradeDetailProps) {
  // move hooks inside component
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. FUNCIÓN PARA CALCULAR TOTALES
  // const calculateTotal = (cards: Card[]): number => {
  //   return cards.reduce((acc, curr) => acc + curr.value, 0);
  // };
  

  if (loading) return <div className="p-4 flex justify-center"><Loader /></div>;
  if (error) return <div className="p-4"><NotFoundError /></div>;

  // const theirTotal = calculateTotal(MOCK_OFFER.theirCards);
  // const myTotal = calculateTotal(MOCK_OFFER.myCards);

  return (
    <div className="w-full max-w-5xl h-full flex flex-col justify-center">
      
      {/* Contenedor de comparación */}
      <div className="flex flex-row items-stretch justify-center gap-0 relative bg-gray-900/40 rounded-2xl border border-gray-800 p-2 min-h-[500px]">
        
        {/* ICONO CENTRAL */}
        <ExchangeIcon />

        {/* --- LADO IZQUIERDO (RECIBIR) --- */}
        <div className="flex-1 flex flex-col items-center gap-4 p-4 border-r border-gray-700/50 border-dashed">
          
          {/* Cabecera Usuario */}
          <div className="flex items-center gap-3 mb-2 bg-gray-800/50 px-4 py-2 rounded-full shadow-sm">
            <div className="relative w-8 h-8">
              <Image 
                src="https://i.pravatar.cc/150?u=1" 
                alt="Usuario" 
                fill
                className="rounded-full object-cover border border-gray-500"
                unoptimized
              />
            </div>
            <h3 className="text-lg font-bold text-gray-200">Recibir ({MOCK_OFFER.theirCards.length})</h3>
          </div>
          
          {/* 3. GRID DE CARTAS (SCROLLABLE) */}
          <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3 place-items-center">
              {MOCK_OFFER.theirCards.map((card) => (
                <div key={card.id} className="relative group w-full max-w-[140px]">
                  <div className="relative aspect-[2.5/3.5] w-full">
                    <Image 
                      src={card.image} 
                      alt={card.name} 
                      fill
                      className="object-contain drop-shadow-lg transition-transform group-hover:scale-105 cursor-pointer"
                      unoptimized
                    />
                  </div>
                  {/* Tooltip simple con el nombre al pasar el ratón */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] p-1 text-center rounded transition-opacity pointer-events-none">
                    {card.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Valor */}
          {/* <div className="bg-purple-900/30 text-purple-200 px-4 py-2 rounded-lg text-sm font-mono border border-purple-500/30 flex flex-col items-center w-full max-w-[200px]">
            <span className="text-xs text-purple-400 opacity-70 uppercase tracking-wider">Valor total</span>
            <span className="font-bold text-lg">{theirTotal}€</span>
          </div> */}
        </div>


        {/* --- LADO DERECHO (DAR) --- */}
        <div className="flex-1 flex flex-col items-center gap-4 p-4">
          
          {/* Cabecera Yo */}
          <div className="flex items-center gap-3 mb-2 bg-gray-800/50 px-4 py-2 rounded-full shadow-sm">
            <h3 className="text-lg font-bold text-gray-200">Dar ({MOCK_OFFER.myCards.length})</h3>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white border border-blue-400">
              YO
            </div>
          </div>

          {/* 3. GRID DE CARTAS (SCROLLABLE) */}
          <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3 place-items-center">
              {MOCK_OFFER.myCards.map((card) => (
                <div key={card.id} className="relative group w-full max-w-[140px]">
                  <div className="relative aspect-[2.5/3.5] w-full">
                    <Image 
                      src={card.image} 
                      alt={card.name} 
                      fill
                      className="object-contain drop-shadow-lg transition-transform group-hover:scale-105 cursor-pointer"
                      unoptimized
                    />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] p-1 text-center rounded transition-opacity pointer-events-none">
                    {card.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Valor */}
          {/* <div className="bg-blue-900/30 text-blue-200 px-4 py-2 rounded-lg text-sm font-mono border border-blue-500/30 flex flex-col items-center w-full max-w-[200px]">
            <span className="text-xs text-blue-400 opacity-70 uppercase tracking-wider">Valor total</span>
            <span className="font-bold text-lg">{myTotal}€</span>
          </div> */}
        </div>



      </div>

    </div>

  );
}