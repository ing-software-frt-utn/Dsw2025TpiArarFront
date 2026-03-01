import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockClasses } from "../../../mockData";
import Memotest from "../memotest/pages/memotest";
import Ahorcadito from "../ahorcadito/pages/Ahorcadito"; 
import Trivia from "../trivia/pages/trivia";

const GameView = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const isMock = !isNaN(Number(gameId));
  const gameIdNum = Number(gameId);

  const allGames = mockClasses.flatMap((clase) => clase.games);
  const gameFinded = isMock 
    ? allGames.find((g) => Number(g.id) === gameIdNum)
    : { title: "Cargando Juego..." }; 

  if (isMock && !gameFinded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white font-sans">
        <div className="text-center p-10 bg-gray-800 rounded-3xl border-2 border-red-500 shadow-2xl">
          <p className="text-2xl font-black mb-6 uppercase tracking-tighter">Juego no encontrado</p>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white relative font-sans overflow-hidden">
      <header className="h-[80px] flex justify-between items-center px-6 bg-gray-800 border-b-4 border-gray-700 w-full shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 text-gray-900 rounded-xl flex items-center justify-center text-2xl shadow-lg transform -rotate-3">
            🎮
          </div>
          <h1 className="text-xl md:text-3xl font-black text-yellow-400 uppercase tracking-tighter truncate max-w-[200px] md:max-w-md">
            {gameFinded?.title}
          </h1>
        </div>

        <button
          onClick={() => setShowExitConfirm(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-black py-2 px-6 rounded-2xl text-sm md:text-base shadow-lg transition-all active:scale-95 border-b-4 border-red-800 active:border-b-0 uppercase tracking-widest"
        >
          ❌ Salir
        </button>
      </header>
      <main className="flex-1 overflow-y-auto bg-gray-700 relative flex items-center justify-center p-2 md:p-8">
        <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-center">
            {isMock && gameIdNum === 1 && <Memotest />}
            {isMock && gameIdNum === 3 && <Trivia />}
            {(gameIdNum === 2 || !isMock) && <Ahorcadito />}
        </div>
      </main>
      {showExitConfirm && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-gray-800 p-10 rounded-[3rem] border-t-8 border-yellow-400 max-w-sm w-full text-center shadow-2xl transform animate-zoomIn">
            <div className="text-8xl mb-6">👋</div>
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter text-white">¿Te vas?</h3>
            <p className="text-gray-400 font-bold mb-8 text-sm uppercase tracking-widest">Tu progreso de este juego podría perderse</p>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-red-600 text-white font-black py-5 rounded-3xl text-lg hover:bg-red-700 shadow-xl border-b-4 border-red-900 active:border-0 transition-all uppercase tracking-widest"
              >
                SÍ, SALIR
              </button>
              
              <button
                onClick={() => setShowExitConfirm(false)}
                className="bg-gray-600 text-white font-black py-4 rounded-3xl text-sm hover:bg-gray-500 uppercase tracking-widest transition-all"
              >
                CONTINUAR JUGANDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;