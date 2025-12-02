//oculto el sidebar en la vista del juego, para que si es un nene con tdah o autista no se distraiga

import { useParams, useNavigate } from "react-router-dom";
import { mockClasses } from "../mockData";

const GameView = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  //busco el juego por las clases manual, hay que meter el back aqui, que de el juego directamente por el id
  const allGames = mockClasses.flatMap((clase) => clase.games);
  const gameFinded = allGames.find((g) => g.id === Number(gameId));

  if (!gameFinded) return <div>Juego no encontrado</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Barra superior simple para no distraer */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-2xl font-bold text-yellow-400">
          {gameFinded.title}
        </h1>

        {/* Botón de Salir Grande y Claro porque son nenes con discapacidad */}
        <button
          onClick={() => navigate(-1)} // -1 vuelve a la página anterior
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all"
        >
          ❌ Salir
        </button>
      </div>

      {/* Área del Juego */}
      <div className="flex-1 flex items-center justify-center bg-gray-700 m-4 rounded-3xl border-4 border-gray-500 relative overflow-hidden">
        {/* AQUÍ IRÍA LA LÓGICA DEL JUEGO */}
        <div className="text-center">
          <img
            src={gameFinded.imageUrl}
            alt="Logo del juego"
            className="w-32 h-32 mx-auto mb-4 animate-bounce"
          />
          <h2 className="text-3xl">Aquí va el juego: {gameFinded.title}</h2>
          <p className="mt-4 text-gray-400">Presiona 'Salir' para volver.</p>
        </div>
      </div>
    </div>
  );
};

export default GameView;
