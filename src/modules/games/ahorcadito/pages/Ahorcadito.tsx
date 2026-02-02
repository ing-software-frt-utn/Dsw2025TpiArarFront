import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GameDrawing from "../components/GameDrawing";
import WordContainer from "../components/WordContainer";
import Keyboard from "../components/Keyboard";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

const WORDS = {
  EASY: ["CASA", "PERRO", "PATO", "LUNA"],
  MEDIUM: ["AUTO ROJO", "PERRO GRANDE", "SOL AMARILLO"],
  HARD: ["LA VACA COME PASTO", "EL CIELO ES AZUL"],
};

interface Props {
  level?: Difficulty;
}

const Ahorcadito = ({ level = "MEDIUM" }: Props) => {
  const navigate = useNavigate();
  {
    /*la palabra que tiene que adivinar*/
  }
  const [word, setWord] = useState("");

  {
    /* letras que el nene ya tocó */
  }
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  {
    /* contador de cuantos errores tuvo */
  }
  const [mistakes, setMistakes] = useState(0);

  {
    /* si mostramos la pista o no */
  }
  const [showHint, setShowHint] = useState(false);

  {
    /* logica principal: que pasa si un nene toca una tecla */
  }
  const handleGuess = (letter: string) => {
    {
      /* agrego la letra a la lista de ya usadas */
    }
    setGuessedLetters([...guessedLetters, letter]);
    {
      /* si falló, aumento el contador de errores */
    }
    if (!word.includes(letter)) {
      setMistakes(mistakes + 1);
    }
  };

  {
    /* estado para saber si cerro el modal */
  }
  const [viewResult, setViewResult] = useState(false);

  {
    /* Funcion para obtener palabra segun nivel */
  }
  const getRandomWord = () => {
    const list = WORDS[level];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  };

  useEffect(() => {
    resetGame();
  }, [level]);

  {
    /* Condiciones de fin de juego -  basico */
  }
  const isLoser = mistakes >= 6;
  const isWinner =
    word.length > 0 &&
    word
      .split("")
      .filter((char) => char !== " ")

      .every((char) => guessedLetters.includes(char));

  {
    /* funcion para reiniciar el juego */
  }
  const resetGame = () => {
    setMistakes(0);
    setGuessedLetters([]);
    setViewResult(false);
    setShowHint(false);
    setWord(getRandomWord());
    {
      /*aqui poner setWord(otras palabras) cuadno tengamos la lista */
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-4 pt-4 pb-5 bg-sky-50 relative">
      <h1 className="text-3xl font-bold text-blue-600 my-3 mt-0 text-center">
        Adivina la palabra
      </h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl items-start justify-center">
        {/* dibujo de como va el ahorcadito */}
        {/* 'md:w-1/2' hace que ocupe la mitad del ancho en pantallas grandes */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-between p-6 bg-white/60 rounded-2xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-center p-4">
            <GameDrawing mistakes={mistakes} />
          </div>
          {/* Botón de Pista */}
          <div className="mt-6 ">
            <button
              onClick={() => setShowHint(true)}
              disabled={isWinner || isLoser}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showHint
                ? "Pista: seleccionar pista segun palabra"
                : "💡 Ver Pista"}
            </button>
          </div>
        </div>

        {/*columna derecha */}
        <div className="w-full md:w-1/2 flex flex-col items-center gap-10 mt-4 md:mt-10 ">
          {/* la palabra que tiene que adivinar */}
          <div className="w-full mt-4 flex justify-center flex-wrap">
            <WordContainer word={word} guessedLetters={guessedLetters} />
          </div>
          {/* teclado */}
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

      {/* modales*/}
      {isWinner && !viewResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-green-400 text-center">
            <div className="text-3xl mb-4"> 🏆</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              ¡GANASTE!
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-md transition-transform active:scale-95"
              >
                🏠 Volver a Juegos
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-red-400 text-center">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">
              ¡Se acabaron los intentos!
            </h2>
            <p className="text-gray-600 mb-8">¿Quieres intentar de nuevo?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={resetGame}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-md transition-transform active:scale-95"
              >
                Sí, intentar de nuevo
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-6 rounded-xl text-lg transition-colors"
              >
                No, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ahorcadito;
