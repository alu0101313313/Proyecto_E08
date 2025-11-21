"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Iconos (idealmente los reemplazarías por iconos reales de 'react-icons')
const BellIcon = () => <span>🔔</span>;
const UserIcon = () => <span>👤</span>; // esto se reemplazará por un icono real


export default function AppHeader() {
 {/* estado para la barra de búsqueda (simplificada por ahora)*/} 
  const [SearchTerm, setSearchTerm] = useState('');
  
  {/* funcion para manejar tecla enter en la barra de búsqueda */}
  const handleSearch=(event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // aquí iría la lógica de búsqueda real
      console.log('Buscar:', SearchTerm);
      alert(`Buscar: ${SearchTerm}`); // alerta temporal para mostrar el término de búsqueda
    }
  };
  const pathname = usePathname(); // hook de Next.js para obtener la ruta actual
  const isActive = (path: string) => pathname === path; // función para verificar si una ruta es la activa  
  const linkClasses = "text-sm font-medium hover:text-white transition-colors"; // clases comunes para los enlaces
  const activeLinkClasses = "text-white underline underline-offset-4"; // clases para el enlace activo
  return (
    <header className="flex items-center justify-between w-full p-4 bg-gray-800 border-b border-gray-700">
      
      {/* Parte Izquierda: Logo y Navegación */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/collection" className="flex items-center gap-3 text-xl font-bold text-white">
          <Image src="/logo.png" alt="Collector's Vault logo" width={100} height={100} />
          <span>Collector&apos;s Vault</span>
        </Link>
        
        {/* Enlaces de Navegación */}
        
        <nav className="flex gap-4">
          <Link 
            href="/collection" 
            className={`${linkClasses} ${isActive('/collection') ? activeLinkClasses : ''}`}>
            Mi colección
          </Link>
          <Link 
            href="/wishlist" 
            className={`${linkClasses} ${isActive('/wishlist') ? activeLinkClasses : ''}`}>
            Lista de deseos
          </Link>
          <Link 
            href="/explore" 
            className={`${linkClasses} ${isActive('/explore') ? activeLinkClasses : ''}`}>
            Explorar usuarios
          </Link>
          <Link 
            href="/trades" 
            className={`${linkClasses} ${isActive('/trades') ? activeLinkClasses : ''}`}>
            Intercambio
          </Link>
        </nav>
      </div>

      {/* Parte Derecha: Acciones y Perfil */}
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Añadir carta
        </button>
        
        <button className="text-gray-400 hover:text-white">
          <BellIcon />
        </button>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search"
            value={SearchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="
              bg-gray-700 
              text-white 
              pl-4 pr-3 py-2
              rounded-lg
              text-sm
              w-64
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600
              focus:bg-gray-600
              placeholder-gray-400
              transition-all
            "
          />
        </div>
        
        {/* Icono de usuario /perfil (futura impementacion) */}
        <Link href="/profile">
          <button className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-ful transition-all">
            <UserIcon />
          </button>
        </Link>
      </div>
      
    </header>
  );
}