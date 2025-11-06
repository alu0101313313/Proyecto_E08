// // 'use client';

// // import React, { useState } from 'react';

// // // URL base de la API. IMPORTANTE: Asume que el backend correrá en el puerto 3001
// // const API_URL = 'http://localhost:3001/api/auth/register';

// // export default function LoginForm() { // formulario de inicio de sesión
// //   const [email, setEmail] = useState(''); // correo electronico 
// //   const [password, setPassword] = useState(''); // contraseña
// //   const [error, setError] = useState(''); // mensaje de error
// //   // esto del mensaje de error y loading es para mejorar la experiencia de usuario
// //   // el mensaje de error mostrará si hay algún problema al iniciar sesión
// //   // el loading mostrará un indicador de carga mientras se procesa la solicitud
// //   const [loading, setLoading] = useState(false); // estado de carga

// //   const handleSubmit = async (formE: React.FormEvent) => { // manejar el envio del formulario
// //     formE.preventDefault(); // prevenir el comportamiento por defecto del formulario
// //     setError(''); // limpiar errores previos
// //     setLoading(true); // activar estado de carga

// //     if (!email || !password) {
// //         setError("Todos los campos son obligatorios.");
// //         setLoading(false);
// //         return;
// //     }
// //     try {
// //       const response = await fetch(API_URL, { // hacer la solicitud al backend
// //         method: 'POST', // método POST para enviar datos
// //         headers: { 'Content-Type': 'application/json' }, // indicar que se envía JSON
// //         body: JSON.stringify({ email, password }), // convertir los datos a JSON
// //       });
// //       const data = await response.json(); 
// //       // parsear la respuesta JSON (esto es para leer mensajes de error del backend)
// //       if (!response.ok) {
// //         // Manejar errores devueltos por el backend
// //         setError(data.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
// //         return;
// //       }
// //       // Inicio de sesión exitoso: redirigir o mostrar mensaje
// //       alert('¡Inicio de sesión exitoso!'); 
// //       // Aquí podrías redirigir al usuario a otra página usando el router de Next.js
// //       // router.push('/dashboard'); // Ejemplo de redirección una vez logueado
    
// //     } catch (err) {
// //       // Manejar errores de red o inesperados
// //       setError('No se pudo conectar con el servidor API. Verifica que el Backend esté corriendo en el puerto 3001.');
// //       console.error(err);
// //     } finally {
// //       setLoading(false); // desactivar estado de carga
// //     }
// //   };
// //   // todo esto hasta aqui es para manejar el envío del formulario y la comunicación con el backend

// //   return (
// //     <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
// //       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
// //       <input
// //         type="email"
// //         placeholder="Correo Electrónico"
// //         value={email}
// //         onChange={(email) => setEmail(email.target.value)}
// //         style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
// //         required
// //         disabled={loading} // deshabilitar mientras carga
// //       />
// //       <input
// //         type="password"
// //         placeholder="Contraseña"
// //         value={password}
// //         onChange={(pass) => setPassword(pass.target.value)}
// //         style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
// //         required
// //         disabled={loading} // deshabilitar mientras carga
// //       />
// //       <button
// //         type="submit"
// //         disabled={loading} // deshabilitar mientras carga
// //         style={{ 
// //           backgroundColor: 'var(--color-primary)',
// //           color: 'white',
// //           padding: '10px',
// //           border: 'none',
// //           borderRadius: '4px',
// //           cursor: loading ? 'not-allowed' : 'pointer',
// //           opacity: loading ? 0.6 : 1
// //         }}
// //       >
// //         {loading ? 'Cargando...' : 'ENTRAR'}
// //       </button>
// //     </form>
        
      
// //   );


// // }

// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image'; // Para el logo
// import Link from 'next/link';   // Para la pestaña "Registrarse"
// import styles from './AuthForm.module.css'; // <-- Importamos los nuevos estilos

// // URL de la API (Corregida para apuntar a 'login')
// const API_URL = 'http://localhost:3001/api/auth/login';

// export default function LoginForm() {
  
//   // TUS ESTADOS (MODIFICADOS PARA USAR 'username' COMO EN LA IMAGEN)
//   const [username, setUsername] = useState(''); // <-- CAMBIADO de 'email' a 'username'
//   const [password, setPassword] = useState(''); // contraseña
//   const [error, setError] = useState(''); // mensaje de error
//   // esto del mensaje de error y loading es para mejorar la experiencia de usuario
//   // el mensaje de error mostrará si hay algún problema al iniciar sesión
//   // el loading mostrará un indicador de carga mientras se procesa la solicitud
//   const [loading, setLoading] = useState(false); // estado de carga

//   // TU LÓGICA 'handleSubmit' (MODIFICADA PARA ENVIAR 'username')
//   const handleSubmit = async (formE: React.FormEvent) => { // manejar el envio del formulario
//     formE.preventDefault(); // prevenir el comportamiento por defecto del formulario
//     setError(''); // limpiar errores previos
//     setLoading(true); // activar estado de carga

//     if (!username || !password) { // <-- CAMBIADO de 'email' a 'username'
//         setError("Todos los campos son obligatorios.");
//         setLoading(false);
//         return;
//     }
//     try {
//       const response = await fetch(API_URL, { // hacer la solicitud al backend
//         method: 'POST', // método POST para enviar datos
//         headers: { 'Content-Type': 'application/json' }, // indicar que se envía JSON
//         body: JSON.stringify({ username, password }), // <-- CAMBIADO de 'email' a 'username'
//       });
//       const data = await response.json(); 
//       // parsear la respuesta JSON (esto es para leer mensajes de error del backend)
//       if (!response.ok) {
//         // Manejar errores devueltos por el backend
//         setError(data.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
//         return;
//       }
//       // Inicio de sesión exitoso: redirigir o mostrar mensaje
//       alert('¡Inicio de sesión exitoso!'); 
//       // Aquí podrías redirigir al usuario a otra página usando el router de Next.js
//       // router.push('/collection'); // Ejemplo de redirección una vez logueado
    
//     } catch (err) {
//       // Manejar errores de red o inesperados
//       setError('No se pudo conectar con el servidor API. Verifica que el Backend esté corriendo en el puerto 3001.');
//       console.error(err);
//     } finally {
//       setLoading(false); // desactivar estado de carga
//     }
//   };
//   // todo esto hasta aqui es para manejar el envío del formulario y la comunicación con el backend

//   // NUEVA ESTRUCTURA JSX (USANDO TUS ESTADOS Y CSS MODULES)
//   return (
//     <div className={styles.container}>
//       {/* Logo */}
//       <Image 
//         src="/logo.png" // Asegúrate que 'logo.png' esté en la carpeta 'public/'
//         alt="Logo de Collector's Vault" 
//         width={100} 
//         height={100}
//         className={styles.logo}
//       />

//       {/* Pestañas de Navegación */}
//       <div className={styles.tabs}>
//         <button className={styles.tabActive}>
//           Iniciar Sesión
//         </button>
//         <Link href="/register" className={styles.tabInactive}>
//           Registrarse
//         </Link>
//       </div>

//       {/* Título */}
//       <h1 className={styles.title}>Acceder a tu colección</h1>

//       {/* Formulario (aquí vinculamos tu lógica) */}
//       <form onSubmit={handleSubmit} className={styles.form}>
        
//         {/* Tu lógica de error */}
//         {error && <p className={styles.error}>{error}</p>}

//         <input
//           type="text"
//           placeholder="Nombre de Usuario" // <-- Coincide con la imagen y el estado 'username'
//           value={username}
//           onChange={(e) => setUsername(e.target.value)} // <-- Vinculado a 'username'
//           required
//           disabled={loading} // Tu lógica de 'loading'
//           className={styles.input} // <-- Estilo de CSS Module
//         />
        
//         <input
//           type="password"
//           placeholder="Contraseña"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           disabled={loading} // Tu lógica de 'loading'
//           className={styles.input} // <-- Estilo de CSS Module
//         />
        
//         <button 
//           type="submit" 
//           disabled={loading} // Tu lógica de 'loading'
//           className={styles.button} // <-- Estilo de CSS Module
//         >
//           {/* Tu lógica de texto condicional */}
//           {loading ? 'Entrando...' : 'Entrar'}
//         </button>
//       </form>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- ESTILOS EN LÍNEA ---
// Definimos todos los estilos aquí para evitar un archivo CSS
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    color: '#fff',
    backgroundColor: '#2c3138',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
  },
  logo: {
    width: '200px',
    height: '140px',
    marginBottom: '1.5rem',
  },
  tabs: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1rem',
    fontSize: '1.1rem',
  },
  tabActive: {
    color: '#ffffff',
    fontWeight: '600',
    padding: '0.5rem',
    backgroundColor: '#3b82f6', // <-- 1. CAMBIO AQUÍ
    textDecoration: 'none',
  },
  tabInactive: {
    color: '#888',
    padding: '0.5rem',
    textDecoration: 'none',
  },
  title: {
    color: '#ffffff',
    fontSize: '1.75rem',
    fontWeight: '700',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '1.25rem',
  },
  input: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.9rem 1rem',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  button: {
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
    padding: '0.9rem',
    border: 'none',
    backgroundColor: 'transparent', // <-- 2. CAMBIO AQUÍ
    borderRadius: '6px',
    transition: 'background-color 150ms ease, transform 120ms ease',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  error: {
    color: '#e5484d',
    textAlign: 'center',
    fontSize: '0.9rem',
  }
};
// --- FIN DE ESTILOS ---


// URL de la API (Corregida para apuntar a 'login')
const API_URL = 'http://localhost:3001/api/auth/login';

export default function LoginForm() {
  
  // --- TU LÓGICA DE ESTADOS (SIN CAMBIOS) ---
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  // Estado para controlar si el botón está en hover/focus
  const [hover, setHover] = useState(false);

  // --- TU LÓGICA handleSubmit (SIN CAMBIOS) ---
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
      const response = await fetch(API_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password }), 
      });
      const data = await response.json(); 
      if (!response.ok) {
        setError(data.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
        return;
      }
      alert('¡Inicio de sesión exitoso!'); 
      // router.push('/collection');
    
    } catch (err) {
      setError('No se pudo conectar con el servidor API.');
      console.error(err);
    } finally {
      setLoading(false); 
    }
  };
  // --- FIN DE LA LÓGICA ---


  // --- ESTRUCTURA JSX CON ESTILOS EN LÍNEA ---
  return (
    // Usamos 'as React.CSSProperties' para que TypeScript entienda los estilos
    <div style={styles.container as React.CSSProperties}>
      
      {/* Logo */}
      <Image 
        src="/logo.png" // Asume que 'logo.png' está en 'client/public/'
        alt="Logo de Collector's Vault" 
        width={200} 
        height={200}
        className="mb-6 w-24 h-24"
        style={styles.logo as React.CSSProperties}
      />

      {/* Pestañas de Navegación */}
      <div style={styles.tabs as React.CSSProperties}>
        <button style={styles.tabActive as React.CSSProperties}>
          Iniciar Sesión
        </button>
        <Link href="/register" style={styles.tabInactive as React.CSSProperties}>
          Registrarse
        </Link>
      </div>

      {/* Título */}
      <h1 style={styles.title as React.CSSProperties}>
        Acceder a tu colección
      </h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={styles.form as React.CSSProperties}>
        
        {error && <p style={styles.error as React.CSSProperties}>{error}</p>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          style={styles.input as React.CSSProperties}
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          style={styles.input as React.CSSProperties}
        />
        
        {/* Botón con handlers para hover y focus (accesible por teclado) */}
        <button
          type="submit"
          disabled={loading}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          style={{
            ...(styles.button as React.CSSProperties),
            // En hover/focus aplicamos un fondo de color y un pequeño scale
            ...(hover
              ? { backgroundColor: 'rgba(88,101,242,0.18)', transform: 'scale(0.98)' }
              : {}),
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}