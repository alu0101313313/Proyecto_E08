// No necesitamos 'use client' aquí, ya que solo es un contenedor.
// El formulario que importamos SÍ será un 'use client'.
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh' 
    }}>
      <div style={{ 
        backgroundColor: 'var(--color-dark-bg-secondary)', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        minWidth: '350px'
      }}>
        <h1 style={{ textAlign: 'center', color: 'var(--color-text-primary)' }}>ACCEDER A TU COLECCIÓN</h1>
        {/* salto de linea */}
        <br />
        {/* Aquí renderizamos el formulario interactivo */}
        <LoginForm />
      </div>
    </div>
  );
}