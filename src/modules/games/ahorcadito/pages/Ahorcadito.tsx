import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import GameDrawing from "../components/GameDrawing";
import WordContainer from "../components/WordContainer";
import Keyboard from "../components/Keyboard";
import {
  startGame,
  playTurn,
  HangmanEvent
} from "../services/ahorcaditoApi";

const Ahorcadito = () => {
  const navigate = useNavigate();
  const { gameId: paramGameId } = useParams();
  const activeGameId = paramGameId || "2";

  const [maskedWord, setMaskedWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  
  const [isWinner, setIsWinner] = useState(false);
  const [isLoser, setIsLoser] = useState(false);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await startGame(activeGameId);
        setMaskedWord(data.maskedWord || "_ _ _ _ _ _"); 
        setHintText(data.hint);
        setMistakes(0);
        setGuessedLetters([]);
        setIsWinner(false);
        setIsLoser(false);
        setTimeElapsed(0);
        setIsTimerRunning(true);
      } catch (error) {
        console.error("Error al iniciar juego", error);
      }
    };
    init();
  }, [activeGameId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formattedTime = `${Math.floor(timeElapsed / 60).toString().padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;

  const handleGuess = async (letter: string) => {
    if (isWinner || isLoser) return;

    setGuessedLetters((prev) => [...prev, letter]);

    try {
      const events = await playTurn(activeGameId, letter);

      events.forEach((event: HangmanEvent) => {
        if (event.maskedWord) setMaskedWord(event.maskedWord);

        if (event.type === "LetterMissedEvent") {
          setMistakes((prev) => prev + 1);
        }
        
        if (event.type === "GameWonEvent") {
          setIsWinner(true);
          setIsTimerRunning(false);
        }
        
        if (event.type === "GameLostEvent") {
          setIsLoser(true);
          setIsTimerRunning(false);
        }
      });
      
      if (mistakes >= 5 && events.some(e => e.type === "LetterMissedEvent")) {
          setIsLoser(true);
          setIsTimerRunning(false);
      }

    } catch (error) {
      console.error("Error en jugada", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto items-center px-4 pt-4 pb-5 bg-sky-50 relative">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          Adivina la palabra
        </h1>
        <div className="mt-2 bg-blue-100 px-4 py-1 rounded-full border border-blue-200 text-blue-700 font-mono font-bold text-xl shadow-sm">
          ⏱️ {formattedTime}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl items-start justify-center flex-1">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-between p-6 bg-white/60 rounded-2xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-center p-4">
            <GameDrawing mistakes={mistakes} />
          </div>
          <div className="mt-6 ">
            <button
              onClick={() => setShowHint(true)}
              disabled={isWinner || isLoser}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showHint ? `Pista: ${hintText}` : "💡 Ver Pista"}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center gap-10 mt-4 md:mt-10 ">
          <div className="w-full mt-4 flex justify-center flex-wrap">
            <WordContainer word={maskedWord} guessedLetters={guessedLetters} />
          </div>
          <div className="flex justify-center flex-wrap">
            <Keyboard
              guessedLetters={guessedLetters}
              isWinner={isWinner}
              isLoser={isLoser}
              onGuess={handleGuess}
            />
          </div>
        </div>
      </div>

      {isWinner && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-green-400 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">¡GANASTE!</h2>
            <p className="text-gray-500 mb-4 font-bold">Tiempo: {formattedTime}</p>
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-md"
              >
                🏠 Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-red-400 text-center">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">¡Se acabaron los intentos!</h2>
            <p className="text-gray-500 mb-4 font-bold">Tiempo total: {formattedTime}</p>
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-md"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ahorcadito;