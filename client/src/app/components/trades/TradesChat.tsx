'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TradeChatProps {
  userId: string;
  username: string;

}

export default function TradesChat({ userId, username }: TradeChatProps) {
  const [message, setMessage] = useState('');
  
  // Mensajes Mock (Simulados)
  const [messages, setMessages] = useState([
    { id: 1, text: "Tu charizard está de locos tio. Te interesaría cambiarlo por un pikachu de 2a??", isMe: false },
    { id: 2, text: "Hola! Déjame echarle un ojo a ver qué estado tiene.", isMe: true },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, isMe: true }]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      
      {/* 1. Cabecera del Chat */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3 bg-gray-800/50">
        <div className="relative w-8 h-8">
          <Image 
            src={`https://i.pravatar.cc/150?u=${userId}`} 
            alt={username}
            fill
            className="rounded-full object-cover"
            unoptimized
          />
        </div>
        <span className="font-bold text-gray-200">{username}</span>
      </div>

      {/* 2. Área de Mensajes */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`max-w-[85%] p-3 rounded-xl text-sm ${
              msg.isMe 
                ? 'bg-blue-600 text-white self-end rounded-br-none' 
                : 'bg-gray-800 text-gray-300 self-start rounded-bl-none border border-gray-700'
            }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* 3. Área de Acciones (Botones de Negociación) */}
      <div className="p-4 bg-gray-800/30 border-t border-gray-700 space-y-3">
        
        {/* Botones Aceptar / Rechazar */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition shadow-lg shadow-green-900/20 text-sm transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400">
            Aceptar
          </button>
          <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition shadow-lg shadow-red-900/20 text-sm transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400">
            Rechazar
          </button>
        </div>

        {/* Contrapropuesta */}
        <button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg transition shadow-lg shadow-yellow-900/20 text-sm transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400">
          Contrapropuesta
        </button>

        {/* Input de Mensaje */}
        <div className="flex gap-2 mt-2 pt-3 border-t border-gray-700/50">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-900 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700"
          />
          <button 
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
          >
            ➤
          </button>
        </div>

      </div>
    </div>
  );
}