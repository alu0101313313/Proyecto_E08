'use client';
import React, { useState } from 'react';

interface FilterSidebarProps {
  totalValue: string;
  totalCards: number;
  onFiltersChange?: (cards: any[]) => void; // <- para devolver las cartas filtradas al padre
}

export default function FilterSidebar({ totalValue, totalCards, onFiltersChange }: FilterSidebarProps) {

  type FilterKey = 'edicion' | 'rareza' | 'condicion' | 'tipo';
  type Filters = Record<FilterKey, boolean>;

  const [openFilter, setOpenFilter] = useState<Filters>({
    edicion: false,
    rareza: false,
    condicion: false,
    tipo: false,
  });

  // Estado: valores seleccionados
  const [selectedFilters, setSelectedFilters] = useState({
    edition: [] as string[],
    rarity: [] as string[],
    condition: [] as string[],
    cardType: [] as string[],
  });

  // ===========================
  // Cambiar el filtro visual (abrir/cerrar)
  // ===========================
  const toggleFilter = (filterName: FilterKey) => {
    setOpenFilter((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // ===========================
  // Seleccionar o deseleccionar una opción
  // ===========================
  const toggleOption = (group: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const exists = prev[group].includes(value);

      return {
        ...prev,
        [group]: exists
          ? prev[group].filter((v) => v !== value)
          : [...prev[group], value],
      };
    });
  };

  // ===========================
  // Llamada al backend GET /collection/filter
  // ===========================
  const applyFilters = async () => {
    const params = new URLSearchParams();

    if (selectedFilters.edition.length > 0)
      params.append("edition", selectedFilters.edition.join(","));

    if (selectedFilters.rarity.length > 0)
      params.append("rarity", selectedFilters.rarity.join(","));

    if (selectedFilters.condition.length > 0)
      params.append("condition", selectedFilters.condition.join(","));

    if (selectedFilters.cardType.length > 0)
      params.append("cardType", selectedFilters.cardType.join(","));

    const response = await fetch(`/api/collection/filter?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    const cards = await response.json();
    onFiltersChange?.(cards);
  };


  // ===========================
  // UI principal
  // ===========================
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-4 flex justify-between">
        Filtros
        <button
          onClick={applyFilters}
          className="bg-blue-500 px-3 py-1 rounded text-white text-sm hover:bg-blue-600"
        >
          Aplicar
        </button>
      </h2>


      {/* ===========================
          Filtro RAREZA
      =========================== */}
      <div className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleFilter('rareza')}
      >
        <h3 className={`text-md font-medium ${openFilter.rareza ? 'text-white' : 'text-gray-400'}`}>
          Rareza
        </h3>
        <span className={`text-gray-500 text-xl transition-transform ${openFilter.rareza ? 'rotate-90' : ''}`}>
          {'>'}
        </span>
      </div>

      {openFilter.rareza && (
        <div className="mt-2 pl-4 text-gray-400 space-y-1">
          {[
            "Common",
            "Uncommon",
            "Rare",
            "Rare Double",
            "Rare Illustration",
            "Rare Special Illustration",
            "Rare Ultra",
            "Rare Hiper",
            "Reverse Holo",
            "Promo",
          ].map((ra) => (
            <p
              key={ra}
              onClick={() => toggleOption("rarity", ra)}
              className={`text-sm cursor-pointer hover:text-white ${
                selectedFilters.rarity.includes(ra) ? "text-white" : ""
              }`}
            >
              {ra}
            </p>
          ))}
        </div>
      )}

      <hr className="my-4 border-gray-700 mt-2" />

      {/* ===========================
          Filtro CONDICION
      =========================== */}
      <div className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleFilter('condicion')}
      >
        <h3 className={`text-md font-medium ${openFilter.condicion ? 'text-white' : 'text-gray-400'}`}>
          Condición
        </h3>
        <span className={`text-gray-500 text-xl transition-transform ${openFilter.condicion ? 'rotate-90' : ''}`}>
          {'>'}
        </span>
      </div>

      {openFilter.condicion && (
        <div className="mt-2 pl-4 text-gray-400 space-y-1">
          {[
            "Mint",
            "Near Mint",
            "Excellent",
            "Good",
            "Lightly Played",
            "Played",
            "Poor",
          ].map((co) => (
            <p
              key={co}
              onClick={() => toggleOption("condition", co)}
              className={`text-sm cursor-pointer hover:text-white ${
                selectedFilters.condition.includes(co) ? "text-white" : ""
              }`}
            >
              {co}
            </p>
          ))}
        </div>
      )}

      <hr className="my-4 border-gray-700 mt-2" />

      {/* ===========================
          Filtro TIPO
      =========================== */}
      <div className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleFilter('tipo')}
      >
        <h3 className={`text-md font-medium ${openFilter.tipo ? 'text-white' : 'text-gray-400'}`}>
          Tipo
        </h3>
        <span className={`text-gray-500 text-xl transition-transform ${openFilter.tipo ? 'rotate-90' : ''}`}>
          {'>'}
        </span>
      </div>

      {openFilter.tipo && (
        <div className="mt-2 pl-4 text-gray-400 space-y-1">
          {["Pokemon", "Trainer", "Energy"].map((tp) => (
            <p
              key={tp}
              onClick={() => toggleOption("cardType", tp)}
              className={`text-sm cursor-pointer hover:text-white ${
                selectedFilters.cardType.includes(tp) ? "text-white" : ""
              }`}
            >
              {tp}
            </p>
          ))}
        </div>
      )}

      <hr className="my-4 border-gray-700 mt-2" />

      {/* ===========================
          Estadísticas
      =========================== */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Valor Total:</span>
        <span className="text-md font-semibold text-white">{totalValue}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Cartas:</span>
        <span className="text-md font-semibold text-white">{totalCards}</span>
      </div>
    </div>
  );
}
