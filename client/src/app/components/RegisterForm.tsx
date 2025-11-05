'use client';
import React, { useState } from 'react';

// URL base de la API. IMPORTANTE: Asume que el backend correrá en el puerto 3001
const API_URL = 'http://localhost:3001/api/auth/register'; 

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        // Manejar errores devueltos por el backend
        setError(data.message || 'Error en el registro. Inténtalo de nuevo.');
        return;
      }

      // Registro exitoso: redirigir o mostrar mensaje
      alert('¡Registro exitoso! Ya puedes iniciar sesión.');
      // router.push('/login'); // Usar el router de Next.js para redirigir

    } catch (err) {
      setError('No se pudo conectar con el servidor API. Verifica que el Backend esté corriendo en el puerto 3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <input
        type="text"
        placeholder="Nombre de Usuario Pokémon"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={loading}
      />
      
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
      />
      
      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          backgroundColor: 'var(--color-accent-primary)', 
          color: 'black', 
          padding: '10px', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
}