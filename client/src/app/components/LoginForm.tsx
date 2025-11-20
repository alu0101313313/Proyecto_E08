'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // <-- 1. IMPORTAR EL ROUTER

export default function LoginForm() {
  
  // --- Estados (Tu lógica está perfecta) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  
  const router = useRouter(); // <-- 2. INICIALIZAR EL ROUTER

  const handleSubmit = async (formE: React.FormEvent) => {
    formE.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
        setError("Todos los campos son obligatorios.");
        setLoading(false);
        return;
    }
    try {
      // --- 3. CAMBIO CLAVE: Usar la ruta relativa para el proxy ---
      const response = await fetch('/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password }), 
      });

      const data = await response.json(); 
      
      if (!response.ok) {
        setError(data.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
        setLoading(false); // Asegúrate de parar el loading en caso de error
        return;
      }
      
      // --- 4. CAMBIO CLAVE: Usar el router en lugar de alert() ---
      // ¡Inicio de sesión exitoso!
      router.push('/profile'); // Redirige al usuario a su colección
    
    } catch (err) {
      setError('No se pudo conectar con el servidor API.');
      console.error(err);
    } finally {
      setLoading(false); 
    }
  };


  // --- ESTRUCTURA JSX CON TAILWIND CSS (SIN CAMBIOS) ---
  // Tu diseño se mantiene intacto
  return (
    // Contenedor de la "tarjeta"
    <div className="flex flex-col items-center p-8 bg-[#2c3138] rounded-xl w-full max-w-md shadow-lg text-white">
      
      {/* Logo */}
      <Image 
        src="/logo.png" // Asume que 'logo.png' está en 'client/public/'
        alt="Logo de Collector's Vault" 
        width={300} // Tamaño visual (Tailwind 'w-24' es 96px)
        height={300}
        className="mb-6" // Margen inferior
      />

      {/* Pestañas de Navegación */}
      <div className="flex gap-6 mb-6">
        <button 
          className="bg-blue-600 text-white py-2 px-5 rounded-lg font-semibold"
        >
          Iniciar Sesión
        </button>
        <Link 
          href="/register" 
          className="text-gray-400 py-2 px-5 rounded-lg font-semibold hover:text-white"
        >
          Registrarse
        </Link>
      </div>

      {/* Título */}
      <h1 className="text-white text-3xl font-bold mb-8">
        Acceder a tu colección
      </h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        
        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Email" // <-- Tu estado usa 'email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          // Clases de Tailwind para el input
          className="bg-[#1e1f22] text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          // Clases de Tailwind para el input
          className="bg-[#1e1f22] text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        
       <button 
          type="submit" 
          disabled={loading}
          // --- CLASES DE TAILWIND MODIFICADAS ---
          className="
            bg-transparent                   
            border border-blue-600          
            text-blue-600                   
            font-bold p-3 rounded-md        
            hover:bg-blue-600               
            hover:text-white                
            disabled:opacity-50             
            mt-4                            
            transition-colors
            text-center                     
          "
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}