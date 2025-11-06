'use client';

import React, { useState } from 'react';

// URL base de la API. IMPORTANTE: Asume que el backend correrá en el puerto 3001
const API_URL = 'http://localhost:3001/api/auth/register';

export default function LoginForm() { // formulario de inicio de sesión
  const [email, setEmail] = useState(''); // correo electronico 
  const [password, setPassword] = useState(''); // contraseña
  const [error, setError] = useState(''); // mensaje de error
  // esto del mensaje de error y loading es para mejorar la experiencia de usuario
  // el mensaje de error mostrará si hay algún problema al iniciar sesión
  // el loading mostrará un indicador de carga mientras se procesa la solicitud
  const [loading, setLoading] = useState(false); // estado de carga

  const handleSubmit = async (formE: React.FormEvent) => { // manejar el envio del formulario
    formE.preventDefault(); // prevenir el comportamiento por defecto del formulario
    setError(''); // limpiar errores previos
    setLoading(true); // activar estado de carga

    if (!email || !password) {
        setError("Todos los campos son obligatorios.");
        setLoading(false);
        return;
    }
    try {
      const response = await fetch(API_URL, { // hacer la solicitud al backend
        method: 'POST', // método POST para enviar datos
        headers: { 'Content-Type': 'application/json' }, // indicar que se envía JSON
        body: JSON.stringify({ email, password }), // convertir los datos a JSON
      });
      const data = await response.json(); 
      // parsear la respuesta JSON (esto es para leer mensajes de error del backend)
      if (!response.ok) {
        // Manejar errores devueltos por el backend
        setError(data.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
        return;
      }
      // Inicio de sesión exitoso: redirigir o mostrar mensaje
      alert('¡Inicio de sesión exitoso!'); 
      // Aquí podrías redirigir al usuario a otra página usando el router de Next.js
      // router.push('/dashboard'); // Ejemplo de redirección una vez logueado
    
    } catch (err) {
      // Manejar errores de red o inesperados
      setError('No se pudo conectar con el servidor API. Verifica que el Backend esté corriendo en el puerto 3001.');
      console.error(err);
    } finally {
      setLoading(false); // desactivar estado de carga
    }
  };
  // todo esto hasta aqui es para manejar el envío del formulario y la comunicación con el backend

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(email) => setEmail(email.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        required
        disabled={loading} // deshabilitar mientras carga
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(pass) => setPassword(pass.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        required
        disabled={loading} // deshabilitar mientras carga
      />
      <button
        type="submit"
        disabled={loading} // deshabilitar mientras carga
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Cargando...' : 'ENTRAR'}
      </button>
    </form>
        
      
  );


}