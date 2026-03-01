import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startGame, playTurn, GameMetadata } from "../services/ahorcaditoApi";

import LoadingOverlay from "../../../../shared/components/LoadingOverlay";
import GameDrawing from "../components/GameDrawing";
import HintButton from "../components/HintButton";
import Keyboard from "../components/Keyboard";
import WordContainer from "../components/WordContainer";

const Ahorcadito = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const [maskedWord, setMaskedWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [metadata, setMetadata] = useState<GameMetadata | null>(null);
  const [status, setStatus] = useState<"Continue" | "Won" | "Lost">("Continue");
  const [loading, setLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (!gameId || initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        setLoading(true);
        const data = await startGame(gameId);
        let finalMaskedWord = data.maskedWord;
        if (!finalMaskedWord || finalMaskedWord.trim() === "") {
          const retry = await startGame(gameId);
          finalMaskedWord = retry.maskedWord;
        }

        setMaskedWord(finalMaskedWord);
        setMetadata(data.metadata);
        const initialRevealed = finalMaskedWord
          .split("")
          .filter((c) => c !== "_" && c !== " " && c.trim() !== "");
        setGuessedLetters([...new Set(initialRevealed)]);

        setMistakes(0);
        setStatus("Continue");
        setTimeElapsed(0);
      } catch (error) {
        console.error("Error al iniciar el juego:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [gameId]);

  useEffect(() => {
    if (status !== "Continue" || loading) return;
    const interval = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [status, loading]);

  const formattedTime = `${Math.floor(timeElapsed / 60).toString().padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;

  const handleGuess = async (letter: string) => {
    if (status !== "Continue" || !gameId || guessedLetters.includes(letter)) return;
    setGuessedLetters((prev) => [...prev, letter]);
    try {
      const result = await playTurn(gameId, letter);
      setMaskedWord(result.maskedWord);
      setMistakes(result.currentAttempts);

      if (result.gameResult === "Won") setStatus("Won");
      else if (result.gameResult === "Lost") setStatus("Lost");
      
    } catch (error) {
      console.error("Error en el turno:", error);
      setGuessedLetters((prev) => prev.filter((l) => l !== letter));
    }
  };

  if (loading) return <LoadingOverlay message="CONECTANDO AL SERVIDOR..." />;
  const hintText = metadata?.instructions?.trim() || "";
  return (
    <div className="flex flex-col w-full h-full items-center px-6 overflow-y-auto scrollbar-hide pt-20 pb-10 bg-white text-slate-800 font-sans">

      {/* Cabecera */}
      <div className="w-full flex flex-col items-center max-w-6xl mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-indigo-600 uppercase tracking-tighter mb-4 text-center">
          {metadata?.title || "JUEGO DE AHORCADO"}
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
          <div className="bg-indigo-50 px-10 py-3 rounded-full border-2 border-indigo-100 shadow-sm">
            <p className="text-3xl font-mono font-black text-indigo-600 tracking-widest">
              ⏱️ {formattedTime}
            </p>
          </div>

          <HintButton
            hintText={hintText || "No hay pistas para esta palabra"}
            disabled={status !== "Continue"}
          />
        </div>
      </div>

      {/* Área Central: Dibujo y Juego */}
      <div className="flex flex-col lg:flex-row gap-12 w-full max-w-7xl justify-center items-center lg:items-start">

        {/* Lado Izquierdo: Horca */}
        <div className="shrink-0 flex flex-col items-center p-6 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm">
          <GameDrawing mistakes={mistakes} />
          <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            INTENTOS: {mistakes} / 6
          </p>
        </div>

        {/* Lado Derecho: Palabra y Teclado */}
        <div className="flex flex-col items-center flex-1 w-full gap-8">
          <div className="py-10 bg-white w-full rounded-[3rem] shadow-sm border border-indigo-50 flex justify-center">
            {/* WordContainer es mudo: solo dibuja el string del back */}
            <WordContainer word={maskedWord} />
          </div>

          <div className="w-full">
            <Keyboard
              guessedLetters={guessedLetters}
              isWinner={status === "Won"}
              isLoser={status === "Lost"}
              onGuess={handleGuess}
            />
          </div>
        </div>
      </div>

      {/* Modal de Resultado Final */}
      {status !== "Continue" && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-white rounded-[4rem] p-12 max-w-md w-full text-center border-b-[16px] shadow-2xl animate-in zoom-in duration-500 ${status === 'Won' ? 'border-green-500' : 'border-red-500'}`}>
            <div className="text-[8rem] mb-6 leading-none">
              {status === 'Won' ? "🏆" : "💀"}
            </div>

            <h2 className={`text-5xl font-black mb-4 uppercase italic tracking-tighter ${status === 'Won' ? 'text-green-600' : 'text-red-600'}`}>
              {status === 'Won' ? "¡LO LOGRASTE!" : "¡GAME OVER!"}
            </h2>

            <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
               <p className="text-slate-400 font-black text-xs uppercase mb-1 tracking-widest opacity-60">Tiempo total</p>
               <p className="text-4xl font-mono font-black text-slate-800">{formattedTime}</p>
            </div>

            <div className="flex flex-col gap-4">
              {status === "Lost" && (
                <button
                  onClick={() => {
                    initialized.current = false;
                    window.location.reload();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black uppercase text-lg shadow-xl shadow-indigo-200 transition-all active:scale-95"
                >
                  REINTENTAR
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
              >
                VOLVER AL AULA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ahorcadito;