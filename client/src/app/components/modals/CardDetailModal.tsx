'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Loader from '../ui/loader';
import NotFoundError from '../ui/notfoundError';

// Iconos
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

// Interfaz para dar seguridad de tipos (opcional pero recomendada)
interface CardDetail {
  id: string;
  name: string;
  image?: string;
  hp?: number;
  types?: string[];
  category?: string;
  rarity?: string;
  set?: { name: string; id: string };
  illustrator?: string;
  attacks?: any[];
  abilities?: any[];
  effect?: string;
  description?: string;
  pricing?: any;
  cardmarket?: any;
  tcgplayer?: any;
}

interface CardDetailModalProps {
  cardId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardDetailModal({ cardId, isOpen, onClose }: CardDetailModalProps) {
  const [card, setCard] = useState<CardDetail | null>(null); // Usamos la interfaz
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    if (!isOpen || !cardId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setCard(null);
      
      try {
        console.log(`🌍 Buscando en API Externa (TCGdex): ${cardId}`);
        
        let externalResponse = await fetch(`https://api.tcgdex.net/v2/en/cards/${cardId}`);
          
          if (!externalResponse.ok) {
             // INTENTO B: Búsqueda por query param (por si acaso)
             console.log("Reintentando con query param...");
             externalResponse = await fetch(`https://api.tcgdex.net/v2/en/cards?id=${cardId}`);
          }
        
        if (externalResponse.ok) {
          const result = await externalResponse.json();
          
          // --- CORRECCIÓN CRÍTICA ---
          // Si la API devuelve un array, cogemos el primer elemento.
          // Si devuelve un objeto, lo usamos tal cual.
          const cardData = Array.isArray(result) ? result[0] : result;
          
          if (cardData) {
            setCard(cardData);
          } else {
            console.error("La API devolvió una lista vacía");
          }
        } else {
          console.error("Error al obtener datos de TCGdex");
        }
      } catch (error) {
        console.error("Error de red:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [cardId, isOpen]);

  if (!isOpen) return null;

  // --- HELPERS ---
  const getImageUrl = () => {
    if (!card || !card.image) return '/placeholder.png';
    // Lógica para asegurar alta calidad si la URL viene base
    if (!card.image.includes('/high.png') && !card.image.endsWith('.png')) {
      return `${card.image}/high.png`;
    }
    return card.image;
  };

  const getPrice = () => {
    if (!card) return 0;
    // TCGdex a veces pone los precios en la raíz o dentro de 'pricing' dependiendo de la versión
    return card.cardmarket?.prices?.averageSellPrice 
        || card.tcgplayer?.prices?.normal?.market 
        || card.pricing?.cardmarket?.avgPrice // Fallback a estructura interna
        || 0;
  };

  const getSetInfo = () => {
    if (!card || !card.set) return "Set Desconocido";
    return `${card.set.name} (${card.set.id})`;
  };

  return (
    // 1. MEJORA UX: Añadido onClick={onClose} al fondo para cerrar al hacer clic fuera
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose} 
    >
      
      {/* Contenedor del Modal */}
      <div 
        className="bg-gray-900 border border-gray-700 w-full max-w-5xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // 2. MEJORA UX: Evita que el clic DENTRO del modal lo cierre
      >
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full transition-colors z-10"
        >
          <ArrowLeftIcon />
        </button>

        <div className="overflow-y-auto p-6 md:p-10">
          
          {loading ? (
            <div className="flex h-64 items-center justify-center text-white animate-pulse">
              Cargando información oficial...
            </div>
          ) : !card ? (
            <div className="text-center text-red-400 py-10">
              <p className="text-xl">⚠️</p>
              <p>No se encontró la carta.</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* IMAGEN */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative aspect-[2.5/3.5] w-full max-w-sm">
                  <Image 
                    src={getImageUrl()} 
                    alt={card.name || 'Carta'} 
                    fill 
                    className="object-contain drop-shadow-2xl rounded-xl"
                    unoptimized 
                  />
                </div>
                <span className="text-xs text-blue-400 mt-3 bg-blue-900/30 px-2 py-1 rounded border border-blue-800">
                  Fuente: TCGdex API
                </span>
              </div>

              {/* DATOS */}
              <div className="w-full md:w-2/3 text-gray-200 space-y-5">
                
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{card.name}</h2>
                  <div className="h-1 w-full bg-gray-700 rounded-full"></div>
                </div>

                {/* Precio */}
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Valor de Mercado</h3>
                    <span className="text-2xl font-bold text-white">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(getPrice())}
                    </span>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    Datos globales
                  </div>
                </div>

                {/* Info Base */}
                <div className="space-y-1 text-sm bg-gray-800/30 p-4 rounded-lg">
                  {card.hp && <p><span className="font-bold text-gray-400">HP:</span> {card.hp} {card.types && `⚡ ${card.types.join(", ")}`}</p>}
                  <p><span className="font-bold text-gray-400">Categoría:</span> {card.category} {card.rarity && `| ${card.rarity}`}</p>
                  <p><span className="font-bold text-gray-400">Set:</span> {getSetInfo()}</p>
                </div>

                {/* Renderizar ataques si existen */}
                {card.attacks?.map((at: any, i: number) => (
                  <div key={i} className="bg-gray-800 p-3 rounded border-l-4 border-red-500 text-sm">
                    <div className="flex justify-between">
                      <span className="font-bold text-white uppercase">{at.name}</span>
                      <span className="text-yellow-400 font-mono">{at.damage}</span>
                    </div>
                    {at.cost && <p className="text-gray-400 text-xs mt-1">Coste: {at.cost.join(" ")}</p>}
                    <p className="text-gray-300 mt-1">{at.effect}</p>
                  </div>
                ))}
                
                {/* Renderizar reglas/efecto si es Trainer/Energy */}
                {(card.effect || card.description) && (
                   <div className="bg-gray-800 p-3 rounded border-l-4 border-blue-500 text-sm">
                     <p className="text-gray-300">{card.effect || card.description}</p>
                   </div>
                )}
                {/* autor e ilustrador */}
                <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
                  <span>Ilustrador: {card.illustrator || "Desconocido"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}