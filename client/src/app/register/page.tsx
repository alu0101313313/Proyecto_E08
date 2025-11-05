'use client'; 
import RegisterForm from '@/app/components/RegisterForm'; // Lo crearemos en el siguiente paso

export default function RegisterPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ 
        backgroundColor: 'var(--color-dark-bg-secondary)', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        minWidth: '350px'
      }}>
        <h1 style={{ textAlign: 'center', color: 'var(--color-text-primary)' }}>Registro de Coleccionista</h1>
        <RegisterForm />
      </div>
    </div>
  );
}