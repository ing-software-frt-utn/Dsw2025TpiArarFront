import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockClasses } from "../../../mockData";
import Memotest from "../../auth/components/Memotest";

const GameView = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const allGames = mockClasses.flatMap((clase) => clase.games);
  const gameFinded = allGames.find((g) => g.id === Number(gameId));

  if (!gameFinded) return <div className="text-white p-10 font-bold text-center">Juego no encontrado</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white relative font-sans">
      
      {/* Barra superior simplificada */}
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-yellow-400">
          {gameFinded.title}
        </h1>

        <button
          onClick={() => setShowExitConfirm(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full text-xl shadow-lg transition-all active:scale-95"
        >
          ❌ Salir
        </button>
      </div>

      {/* Área del Juego - Contenedor Gris */}
      <div className="flex-1 flex items-center justify-center bg-gray-700 m-4 rounded-3xl border-4 border-gray-500 relative overflow-y-auto">
        <div className="p-4 w-full">
           <Memotest />
        </div>
      </div>

      {/* Modal de Salida con Pictograma */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gray-800 p-8 rounded-[2rem] border-4 border-yellow-400 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="text-8xl mb-4">👋</div>
            <h3 className="text-2xl font-bold mb-6">¿Quieres dejar de jugar?</h3>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(-1)}
                className="bg-red-500 text-white font-bold py-4 rounded-2xl text-xl hover:bg-red-600 shadow-md"
              >
                SÍ, SALIR
              </button>
              
              <button
                onClick={() => setShowExitConfirm(false)}
                className="bg-gray-600 text-white font-bold py-3 rounded-2xl text-lg hover:bg-gray-500"
              >
                NO, SEGUIR JUGANDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;