// // 'use client';
// // import React, { useState } from 'react';

// // // URL base de la API. IMPORTANTE: Asume que el backend correrá en el puerto 3001
// // const API_URL = 'http://localhost:3001/api/auth/register'; 

// // export default function RegisterForm() {
// //   const [username, setUsername] = useState(''); // nombre de usuario
// //   const [email, setEmail] = useState(''); // correo electronico 
// //   const [password, setPassword] = useState(''); // contraseña
// //   const [error, setError] = useState(''); // mensaje de error
// //   const [loading, setLoading] = useState(false); // estado de carga

// //   const handleSubmit = async (formE: React.FormEvent) => { // manejar el envio del formulario
// //     // formE es el evento del formulario
// //     formE.preventDefault(); 
// //     setError('');
// //     setLoading(true);

// //     if (!username || !email || !password) {
// //         setError("Todos los campos son obligatorios.");
// //         setLoading(false);
// //         return;
// //     }

// //     try {
// //       const response = await fetch(API_URL, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ username, email, password }),
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         // Manejar errores devueltos por el backend
// //         setError(data.message || 'Error en el registro. Inténtalo de nuevo.');
// //         return;
// //       }

// //       // Registro exitoso: redirigir o mostrar mensaje
// //       alert('¡Registro exitoso! Ya puedes iniciar sesión.');
// //       // router.push('/login'); // Usar el router de Next.js para redirigir

// //     } catch (err) {
// //       setError('No se pudo conectar con el servidor API. Verifica que el Backend esté corriendo en el puerto 3001.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
// //       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
// //       <input
// //         type="text"
// //         placeholder="Nombre de Usuario Pokémon"
// //         value={username}
// //         onChange={(e) => setUsername(e.target.value)}
// //         required
// //         disabled={loading}
// //       />
      
// //       <input
// //         type="email"
// //         placeholder="Correo Electrónico"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //         required
// //         disabled={loading}
// //       />
      
// //       <input
// //         type="password"
// //         placeholder="Contraseña"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //         required
// //         disabled={loading}
// //       />
      
// //       <button 
// //         type="submit" 
// //         disabled={loading}
// //         style={{ 
// //           backgroundColor: 'var(--color-accent-primary)', 
// //           color: 'black', 
// //           padding: '10px', 
// //           border: 'none', 
// //           borderRadius: '4px', 
// //           cursor: loading ? 'not-allowed' : 'pointer'
// //         }}
// //       >
// //         {loading ? 'Registrando...' : 'Registrarse'}
// //       </button>
// //     </form>
// //   );
// // }

// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// // --- ESTILOS EN LÍNEA ---
// // (Son los mismos estilos que usaste en LoginForm.tsx)
// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     width: '100%',
//     maxWidth: '400px',
//     padding: '2rem',
//     color: '#fff',
//     backgroundColor: '#2c3138',
//     borderRadius: '12px',
//     boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
//   },
//   logo: {
//     width: '200px',
//     height: '140px',
//     marginBottom: '1.5rem',
//   },
//   tabs: {
//     display: 'flex',
//     gap: '1.5rem',
//     marginBottom: '1rem',
//     fontSize: '1.1rem',
//   },
//   tabActive: {
//     color: '#ffffff',
//     fontWeight: '600',
//     padding: '0.5rem',
//     backgroundColor: '#3b82f6', 
//     textDecoration: 'none',
//   },
//   tabInactive: {
//     color: '#888',
//     padding: '0.5rem',
//     textDecoration: 'none',
//   },
//   title: {
//     color: '#ffffff',
//     fontSize: '1.75rem',
//     fontWeight: '700',
//     marginBottom: '2rem',
//     textAlign: 'center',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '100%',
//     gap: '1.25rem',
//   },
//   input: {
//     backgroundColor: 'transparent',
//     border: '1px solid #fff',
//     color: '#fff',
//     padding: '0.9rem 1rem',
//     borderRadius: '6px',
//     fontSize: '1rem',
//   },
//   button: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: '1rem',
//     padding: '0.9rem',
//     border: 'none',
//     backgroundColor: 'transparent', 
//     borderRadius: '6px',
//     transition: 'background-color 150ms ease, transform 120ms ease',
//     cursor: 'pointer',
//     textAlign: 'center',
//     marginTop: '0.5rem',
//   },
//   error: {
//     color: '#e5484d',
//     textAlign: 'center',
//     fontSize: '0.9rem',
//   }
// };
// // --- FIN DE ESTILOS ---


// // URL de la API (CAMBIADA para apuntar a 'register')
// const API_URL = 'http://localhost:3001/api/auth/register';

// export default function RegisterForm() {
  
//   // --- LÓGICA DE ESTADOS (Añadimos 'username') ---
//   const [username, setUsername] = useState(''); // <-- CAMPO NUEVO
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState(''); 
//   const [error, setError] = useState(''); 
//   const [loading, setLoading] = useState(false); 
//   const [hover, setHover] = useState(false); // Para el efecto del botón

//   // --- LÓGICA handleSubmit (Adaptada para Registro) ---
//   const handleSubmit = async (formE: React.FormEvent) => {
//     formE.preventDefault();
//     setError('');
//     setLoading(true);

//     // Verificamos los 3 campos
//     if (!username || !email || !password) { 
//         setError("Todos los campos son obligatorios.");
//         setLoading(false);
//         return;
//     }
//     try {
//       const response = await fetch(API_URL, { 
//         method: 'POST', 
//         headers: { 'Content-Type': 'application/json' }, 
//         // Enviamos los 3 campos
//         body: JSON.stringify({ username, email, password }), 
//       });
//       const data = await response.json(); 
//       if (!response.ok) {
//         setError(data.message || 'Error en el registro. Inténtalo de nuevo.');
//         return;
//       }
//       // Mensaje de éxito
//       alert('¡Registro exitoso! Ya puedes iniciar sesión.'); 
//       // router.push('/login'); // Podrías redirigir a login
    
//     } catch (err) {
//       setError('No se pudo conectar con el servidor API.');
//       console.error(err);
//     } finally {
//       setLoading(false); 
//     }
//   };
//   // --- FIN DE LA LÓGICA ---


//   // --- ESTRUCTURA JSX (Adaptada para Registro) ---
//   return (
//     <div style={styles.container as React.CSSProperties}>
      
//       {/* Logo */}
//       <Image 
//         src="/logo.png" 
//         alt="Logo de Collector's Vault" 
//         width={200} 
//         height={200}
//         className="mb-6 w-24 h-24"
//         style={styles.logo as React.CSSProperties}
//       />

//       {/* Pestañas de Navegación (Invertidas) */}
//       <div style={styles.tabs as React.CSSProperties}>
//         <Link href="/login" style={styles.tabInactive as React.CSSProperties}>
//           Iniciar Sesión
//         </Link>
//         <button style={styles.tabActive as React.CSSProperties}>
//           Registrarse
//         </button>
//       </div>

//       {/* Título (Cambiado) */}
//       <h1 style={styles.title as React.CSSProperties}>
//         Crea tu colección
//       </h1>

//       {/* Formulario */}
//       <form onSubmit={handleSubmit} style={styles.form as React.CSSProperties}>
        
//         {error && <p style={styles.error as React.CSSProperties}>{error}</p>}

//         {/* CAMPO NUEVO: Nombre de Usuario */}
//         <input
//           type="text"
//           placeholder="Nombre de Usuario"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//           disabled={loading}
//           style={styles.input as React.CSSProperties}
//         />
        
//         <input
//           type="text"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           disabled={loading}
//           style={styles.input as React.CSSProperties}
//         />
        
//         <input
//           type="password"
//           placeholder="Contraseña"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           disabled={loading}
//           style={styles.input as React.CSSProperties}
//         />
        
//         {/* Botón con handlers (Texto cambiado) */}
//         <button
//           type="submit"
//           disabled={loading}
//           onMouseEnter={() => setHover(true)}
//           onMouseLeave={() => setHover(false)}
//           onFocus={() => setHover(true)}
//           onBlur={() => setHover(false)}
//           style={{
//             ...(styles.button as React.CSSProperties),
//             ...(hover
//               ? { backgroundColor: 'rgba(88,101,242,0.18)', transform: 'scale(0.98)' }
//               : {}),
//           }}
//         >
//           {loading ? 'Creando...' : 'Registrarse'}
//         </button>
//       </form>
//     </div>
//   );
// }
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ¡Ya no se necesita un objeto 'styles' ni un archivo .css!

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
      const response = await fetch('/api/auth/register', { 
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
        width={100} 
        height={100}
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