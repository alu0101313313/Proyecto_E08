'use client';

import { useState } from 'react';
import AppHeader from '@/app/components/collection/AppHeader';
import UserCard from '@/app/components/userCard';

interface UserResult {
  _id: string;
  username: string;
  profileImageUrl?: string;
}

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <AppHeader />

      <main className="flex-grow w-full max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Explorar Coleccionistas</h1>
          <p className="text-gray-400">Encuentra a otros entrenadores y descubre sus cartas</p>
        </div>

        {/* Barra de Búsqueda Grande */}
        <form onSubmit={handleSearch} className="mb-12 relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Buscar por nombre de usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white text-lg rounded-full px-6 py-4 pl-14 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-xl transition-all"
            autoFocus
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Buscar'}
          </button>
        </form>

        {/* Resultados */}
        <div className="space-y-4">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((user) => (
                // CAMBIO: Usamos UserCard directamente. 
                // Ya no hay div wrapper con onClick, UserCard maneja el Link internamente.
                <UserCard 
                  key={user._id}
                  userId={user._id} 
                  username={user.username} 
                  avatarUrl={user.profileImageUrl} 
                />
              ))}
            </div>
          ) : (
            hasSearched && !loading && (
              <div className="text-center py-12 text-gray-500">
                <span className="text-4xl block mb-2">🤷‍♂️</span>
                <p>No encontramos ningún usuario con ese nombre.</p>
              </div>
            )
          )}

          {!hasSearched && (
            <div className="text-center py-12 text-gray-600">
              <p>Empieza a escribir para encontrar gente...</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}