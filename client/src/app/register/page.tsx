// 'use client'; 
// import RegisterForm from '@/app/components/RegisterForm'; // Lo crearemos en el siguiente paso

// export default function RegisterPage() {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//       <div style={{ 
//         backgroundColor: 'var(--color-dark-bg-secondary)', 
//         padding: '2rem', 
//         borderRadius: '8px',
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
//         minWidth: '350px'
//       }}>
//         <h1 style={{ textAlign: 'center', color: 'var(--color-text-primary)' }}>Registro de Coleccionista</h1>
//         <RegisterForm />
//       </div>
//     </div>
//   );
// }

import RegisterForm from '@/app/components/RegisterForm'; // <-- 1. CAMBIO AQUÍ

// Estilos para centrar el contenido en la página (igual que en login)
const pageStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh', // Ocupa toda la altura
  width: '100%',
  backgroundColor: '#121212' // Fondo oscuro principal
};

export default function RegisterPage() {
  return (
    <div style={pageStyle}>
      {/* 2. CAMBIO AQUÍ */}
      <RegisterForm />
    </div>
  );
}