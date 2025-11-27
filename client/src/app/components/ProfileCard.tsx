'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProfileCard() {
  // 1. ESTADO: Datos del usuario (simulados por ahora)
  const [user, setUser] = useState({
    username: 'AshKetchum1234',
    email: 'ash@pokedex.com',
    avatarUrl: 'https://images.pokemontcg.io/base1/4.png', // Usamos una carta como avatar temporal
  });

  // 2. ESTADO: ¿Estamos editando?
  const [isEditing, setIsEditing] = useState(false);

  // 3. ESTADO: Copia temporal para el formulario (para poder cancelar cambios)
  const [formData, setFormData] = useState(user);

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar cambios
  const handleSave = () => {
    setUser(formData); // Actualizamos el usuario real
    setIsEditing(false); // Salimos del modo edición
    alert("¡Perfil actualizado!"); // Feedback visual
  };

  // Cancelar cambios
  const handleCancel = () => {
    setFormData(user); // Revertimos al usuario original
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl text-white border border-gray-700">
      
      {/* CABECERA DEL PERFIL */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        
        {/* Foto de Perfil */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
            <Image 
              src={formData.avatarUrl} 
              alt="Avatar" 
              width={128} 
              height={128} 
              className="object-cover w-full h-full"
            />
          </div>
          {isEditing && ( // isEditing muestra la opción de cambiar URL del avatar 
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-200 font-bold">Cambiar URL</span>
            </div>
          )}
        </div>

        {/* Nombre y Estado */}
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">{user.username}</h2>
          <p className="text-gray-400">{user.email}</p>
          {!isEditing && (
             <span className="inline-block mt-2 px-3 py-1 bg-green-900 text-green-300 text-xs rounded-full border border-green-700">
               Coleccionista Activo
             </span>
          )}
        </div>

        {/* Botón de Acción Principal */}
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {/* FORMULARIO DE DATOS */}
      <div className="space-y-6">
        
        {/* Campo: Nombre de Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
            className={`
              w-full px-4 py-2 rounded-lg outline-none transition-all
              ${isEditing 
                ? 'bg-gray-700 border border-gray-600 focus:border-blue-500 text-white' 
                : 'bg-transparent border border-transparent text-gray-300 pl-0'
              }
            `}
          />
        </div>

        {/* Campo: Avatar URL (Solo visible al editar para no ensuciar) */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">URL del Avatar</label>
            <input
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 text-white outline-none"
              placeholder="https://..."
            />
          </div>
        )}


        {/* Campo: Email (Deshabilitado siempre, normalmente no se cambia fácil) */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-transparent border border-transparent text-gray-500 pl-0 cursor-not-allowed"
          />
        </div>

      </div>

      {/* BOTONES DE GUARDAR / CANCELAR */}
      {isEditing && (
        <div className="flex justify-end gap-4 mt-8 border-t border-gray-700 pt-6">
          <button 
            onClick={handleCancel}
            className="text-gray-300 hover:text-white px-4 py-2 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-all transform hover:scale-105"
          >
            Guardar Cambios
          </button>
        </div>
      )}

    </div>
  );
}