
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


// URL de la API (Asegúrate que apunta a 'register')
const API_URL = 'http://localhost:3001/api/auth/register';

export default function RegisterForm() {
  
  // --- LÓGICA DE ESTADOS (Con 'username', 'email', 'password') ---
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 

  // --- LÓGICA handleSubmit (Adaptada para 3 campos) ---
  const handleSubmit = async (formE: React.FormEvent) => {
    formE.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !email || !password) { 
        setError("Todos los campos son obligatorios.");
        setLoading(false);
        return;
    }
    try {
      const response = await fetch(API_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ username, email, password }), 
      });
      const data = await response.json(); 
      if (!response.ok) {
        setError(data.message || 'Error en el registro. Inténtalo de nuevo.');
        return;
      }
      alert('¡Registro exitoso! Ya puedes iniciar sesión.'); 
      // router.push('/login');
    
    } catch (err) {
      setError('No se pudo conectar con el servidor API.');
      console.error(err);
    } finally {
      setLoading(false); 
    }
  };
  // --- FIN DE LA LÓGICA ---


  // --- ESTRUCTURA JSX CON TAILWIND CSS ---
  return (
    // Contenedor de la "tarjeta"
    <div className="flex flex-col items-center p-8 bg-[#2c3138] rounded-xl w-full max-w-md shadow-lg text-white">
      
      {/* Logo */}
      <Image 
        src="/logo.png" // Asume que 'logo.png' está en 'client/public/'
        alt="Logo de Collector's Vault" 
        width={300} 
        height={300}
        className="mb-6"
      />

      {/* Pestañas de Navegación (Invertidas) */}
      <div className="flex gap-6 mb-6">
        <Link 
          href="/login" 
          className="text-gray-400 py-2 px-5 rounded-lg font-semibold hover:text-white"
        >
          Iniciar Sesión
        </Link>
        <button 
          className="bg-blue-600 text-white py-2 px-5 rounded-lg font-semibold"
        >
          Registrarse
        </button>
      </div>

      {/* Título */}
      <h1 className="text-white text-3xl font-bold mb-8">
        Crea tu colección
      </h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        
        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}

        {/* CAMPO NUEVO: Nombre de Usuario */}
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
          className="bg-[#1e1f22] text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        
        <input
          type="email" // Cambiado a 'email' para validación de navegador
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="bg-[#1e1f22] text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="bg-[#1e1f22] text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        
        {/* Botón "Fantasma" (con texto de Registro) */}
        <button 
          type="submit" 
          disabled={loading}
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
          {loading ? 'Creando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}