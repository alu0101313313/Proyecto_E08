"use client";
import Link from 'next/link';
import Image from 'next/image';

// Iconos (idealmente los reemplazarías por iconos reales de 'react-icons')
const BellIcon = () => <span>🔔</span>;
const UserIcon = () => <span>👤</span>; // esto se reemplazará por un icono real

export default function AppHeader() {
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
          <Link href="/collection" className="text-sm font-medium text-white">
            Mi colección
          </Link>
          <Link href="/wishlist" className="text-sm font-medium text-gray-400 hover:text-white">
            Lista de deseos
          </Link>
          <Link href="/explore" className="text-sm font-medium text-gray-400 hover:text-white">
            Explorar usuarios
          </Link>
          <Link href="/trades" className="text-sm font-medium text-gray-400 hover:text-white">
            Intercambios
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
        
        {/* Barra de Búsqueda (simplificada) */}
        <input 
          type="text" 
          placeholder="Search" 
          className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm w-48"
        />
        
        <button className="text-gray-400 hover:text-white">
          <UserIcon />
        </button>
      </div>
      
    </header>
  );
}