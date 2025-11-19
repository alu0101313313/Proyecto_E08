// Componente de la cuadrícula de cartas (vacío por ahora)

interface Card {
  id: number;
  name: string;
  value: number;
  imageUrl: string;
}

interface CardGridProps {
  cards?: Card[]; // opcional, por si queremos pasar cartas como props en el futuro
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">

      {/* <h2 className="text-white text-lg font-semibold mb-4">Mi colección</h2>
      <p className="text-gray-400">Aquí irá la cuadrícula de cartas...</p> */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-lg font-semibold">Mi colección</h2>
        <div className="text-gray-400">
          Total cartas: {cards ? cards.length : 0}
        </div>
      </div>
    </div>
  );
}