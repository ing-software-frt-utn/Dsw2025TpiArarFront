//oculto el sidebar en la vista del juego, para que si es un nene con tdah o autista no se distraiga

import { useParams, useNavigate } from "react-router-dom";
import { mockClasses } from "../../../mockData";
import Ahorcadito from "../ahorcadito/pages/Ahorcadito";

const GameView = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  //busco el juego por las clases manual, hay que meter el back aqui, que de el juego directamente por el id
  const allGames = mockClasses.flatMap((clase) => clase.games);
  const gameFinded = allGames.find((g) => g.id === Number(gameId));

  if (!gameFinded) return <div>Juego no encontrado</div>;

  {
    /* elegir juego segun id */
  }
  const renderGameContent = () => {
    switch (gameFinded.id) {
      case 2:
        return <Ahorcadito level="MEDIUM" />;
        {
          /*simulo asignacion de nivel del profesor*/
        }
        {
          /*poner los otros juegos, en mockData estan los id */
        }
      default:
        return <div>Juego no implementado</div>;
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Barra superior simple para no distraer */}
      <div className="flex-none flex justify-between items-center p-4 bg-gray-800 shadow-md z-10">
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
      <div className="flex-1 w-full bg-white relative overflow-y-auto overscroll-y-contain">
        {renderGameContent()}
      </div>
    </div>
  );
};

export default GameView;
