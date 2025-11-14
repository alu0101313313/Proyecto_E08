'use client';
import React from 'react';
import { useState } from 'react'; // esto es para manejar estados si es necesario
export default function FilterSidebar() {
  const totalValue = "124,32€"; // valor total de las cartas filtradas (es un ejemplo)
  const totalCards = "58"; // número total de cartas filtradas (es un ejemplo)
  // mapa para decir que filtros estan activos (si es necesario)
  // openFilter es el objeto que recuerda los filtros abiertos o seleccionados
  // setOpenFilter es la función para actualizar ese objeto
  type FilterKey = 'edicion' | 'rareza' | 'condicion' | 'tipo'; // claves posibles de filtros
  type Filters = Record<FilterKey, boolean>; // tipo del objeto de filtros (abierto/cerrado)

  const [openFilter, setOpenFilter] = useState<Filters>({
    edicion: false,
    rareza: false,
    condicion: false,
    tipo: false,
  })
  // por defecto todos los filtros estan cerrados (false)

  // funcion para manejar el click en un filtro
  const toggleFilter = (filterName: FilterKey) => {
    setOpenFilter((prev) => ({
      ...prev, // copia el estado previo
      [filterName]: !prev[filterName], // cambia el estado del filtro que tenia antes clickeado
    }));
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-4">Filtros</h2>
      {/* filtro de edicion/set*/}
      {/* 'justify-between' empuja el título a la izq. y la flecha a la der. */}


      <div className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleFilter('edicion')} // al clickar, cambia el estado del filtro 'edicion'
      >
        <h3 className={"text-md font-medium " + (openFilter.edicion ? 'text-white' : 'text-gray-400')}> Edicion/set</h3>

        
        <span className={`text-gray-500 text-xl transition-transform ${openFilter.edicion ? 'rotate-90' : ''}`}
          >{'>'}</span>
      </div>

      {/* Contenido del filtro de edicion (se muestra solo si openFilter.edicion es true) */}
      {openFilter.edicion && (
        <div className="mt-2 pl-4 text-gray-400">
          {/* Aquí irían las opciones específicas del filtro de edición */}
          <p className="text-sm hover:text-white cursor-pointer">Opción 1</p>
          <p className="text-sm hover:text-white cursor-pointer">Opción 2</p>
          <p className="text-sm hover:text-white cursor-pointer">Opción 3</p>
        </div>
      )}
      {/* Linea de separación */}
      <hr className="my-4 border-gray-700 mt-2" />


      {/* filtro de rareza*/}
      <div className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleFilter('rareza')}
      >
        <h3 className={"text-md font-medium " + (openFilter.rareza ? 'text-white ' : 'text-gray-400')}> Rareza</h3>

        <span className={`text-gray-500 text-xl transition-transform ${openFilter.rareza ? 'rotate-90' : ''}`}
          >{'>'}</span>
      </div>
      {/* Contenido del filtro de rareza (se muestra solo si openFilter.rareza es true) */}
      {openFilter.rareza && (
        <div className="mt-2 pl-4 text-gray-400">
          {/* Aquí irían las opciones específicas del filtro de rareza */}
          <p className="text-sm hover:text-white cursor-pointer">Común</p>
          <p className="text-sm hover:text-white cursor-pointer">Rara</p>
          <p className="text-sm hover:text-white cursor-pointer">Épica</p>
          <p className="text-sm hover:text-white cursor-pointer">Legendaria</p>
        </div>
      )}
      {/* Linea de separación */}
      <hr className="my-4 border-gray-700 mt-2" />


      {/* filtro de condicion*/}
      <div className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleFilter('condicion')}
      >
        <h3 className={"text-md font-medium " + (openFilter.condicion ? 'text-white ' : 'text-gray-400')}> Condición</h3>
        <span className={`text-gray-500 text-xl transition-transform ${openFilter.condicion ? 'rotate-90' : ''}`}
          >{'>'}</span>
      </div>
      {/* Contenido del filtro de condicion (se muestra solo si openFilter.condicion es true) */}
      {openFilter.condicion && (
        <div className="mt-2 pl-4 text-gray-400">
          {/* Aquí irían las opciones específicas del filtro de condición */}
          <p className="text-sm hover:text-white cursor-pointer">Nuevo</p>
          <p className="text-sm hover:text-white cursor-pointer">Usado - Bueno</p>
          <p className="text-sm hover:text-white cursor-pointer">Usado - Aceptable</p>
        </div>
      )}


      
      {/* Linea de separación */}
      <hr className="my-4 border-gray-700 mt-2" />
      {/* filtro de tipo*/}
      <div className="flex justify-between items-center cursor-pointer" 
        onClick={() => toggleFilter('tipo')}
      >
        <h3 className={"text-md font-medium " + (openFilter.tipo ? 'text-white ' : 'text-gray-400')}> Tipo</h3>
        <span className={`text-gray-500 text-xl transition-transform ${openFilter.tipo ? 'rotate-90' : ''}`}
          >{'>'}</span>
      </div>
      {/* Contenido del filtro de tipo (se muestra solo si openFilter.tipo es true) */}
      {openFilter.tipo && (
        <div className="mt-2 pl-4 text-gray-400">
          {/* Aquí irían las opciones específicas del filtro de tipo */}
          <p className="text-sm hover:text-white cursor-pointer">Pokemon</p>
          <p className="text-sm hover:text-white cursor-pointer">Entrenador</p>
          <p className="text-sm hover:text-white cursor-pointer">Energía</p>
          <p className="text-sm hover:text-white cursor-pointer">Objeto</p>
        </div>
      )}
    {/* Linea de separación */}
    <hr className="my-4 border-gray-700 mt-2" />

    {/* Estadisticas (numero de cartas, precio) */}

      {/* Fila de Valor Total */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Valor Total:</span>
        <span className="text-md font-semibold text-white">{totalValue}</span>
      </div>

      {/* Fila de Cartas */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Cartas:</span>
        <span className="text-md font-semibold text-white">{totalCards}</span>
      </div>
    </div>

    
  );
}
// my-4 es una clase de Tailwind CSS que aplica un margen vertical (arriba y abajo) de 1 rem (16 píxeles) a un elemento.
// mt-2 aplica un margen superior de 0.5 rem (8 píxeles).
// cursor-pointer hace que el cursor cambie a una mano cuando se pasa sobre el elemento, indicando que es clickeable.