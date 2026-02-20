import { useMemo, useState } from "react";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  question: string;
  options: Option[];
  explanation?: string;
};

const Trivia = () => {
  // Preguntas predeterminadas (simulación)
  const questions = useMemo<Question[]>(
    () => [
      {
        id: "q1",
        question: "¿Cuánto es 7 + 5?",
        options: [
          { id: "a", text: "10", isCorrect: false },
          { id: "b", text: "11", isCorrect: false },
          { id: "c", text: "12", isCorrect: true },
          { id: "d", text: "13", isCorrect: false },
        ],
        explanation: "7 + 5 = 12",
      },
      {
        id: "q2",
        question: "¿Cuál es el resultado de 9 × 3?",
        options: [
          { id: "a", text: "18", isCorrect: false },
          { id: "b", text: "27", isCorrect: true },
          { id: "c", text: "21", isCorrect: false },
          { id: "d", text: "24", isCorrect: false },
        ],
        explanation: "9 por 3 es 27",
      },
      {
        id: "q3",
        question: "¿Qué número es par?",
        options: [
          { id: "a", text: "15", isCorrect: false },
          { id: "b", text: "19", isCorrect: false },
          { id: "c", text: "22", isCorrect: true },
          { id: "d", text: "31", isCorrect: false },
        ],
        explanation: "Un número par termina en 0,2,4,6 u 8.",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [lastWasCorrect, setLastWasCorrect] = useState<boolean | null>(null);

  const current = questions[index];

  const onPick = (opt: Option) => {
    if (selected) return; // ya respondió
    setSelected(opt.id);
    setLastWasCorrect(opt.isCorrect);
    if (opt.isCorrect) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLastWasCorrect(null);
  };

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setLastWasCorrect(null);
  };

  if (finished) {
    const won = score >= Math.ceil(questions.length / 2);
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-3xl border-4 border-yellow-400 p-6 sm:p-10 text-center shadow-2xl">
          <div className="text-7xl mb-4">{won ? "🏆" : "🎯"}</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
            {won ? "¡GANASTE!" : "¡Buen intento!"}
          </h2>
          <p className="text-white/80 text-lg">
            Puntaje: <span className="font-bold text-yellow-300">{score}</span> / {questions.length}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-2xl hover:bg-yellow-300 active:scale-95"
            >
              🔁 Jugar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-3xl border-4 border-yellow-400 p-5 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="text-sm sm:text-base text-white/80">
            Pregunta <span className="font-bold text-white">{index + 1}</span> de {questions.length}
          </div>
          <div className="text-sm sm:text-base">
            Puntaje: <span className="font-extrabold text-yellow-300">{score}</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">{current.question}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {current.options.map((opt) => {
            const isPicked = selected === opt.id;
            const showResult = selected !== null;
            const isCorrect = opt.isCorrect;

            let btnClass =
              "bg-gray-700 hover:bg-gray-600 border-2 border-gray-500 text-white font-bold py-4 px-4 rounded-2xl text-lg transition-all active:scale-95";

            if (showResult) {
              if (isCorrect) {
                btnClass =
                  "bg-green-600 border-2 border-green-300 text-white font-bold py-4 px-4 rounded-2xl text-lg transition-all";
              } else if (isPicked) {
                btnClass =
                  "bg-red-600 border-2 border-red-300 text-white font-bold py-4 px-4 rounded-2xl text-lg transition-all";
              } else {
                btnClass =
                  "bg-gray-700 border-2 border-gray-600 text-white/70 font-bold py-4 px-4 rounded-2xl text-lg transition-all";
              }
            }

            return (
              <button key={opt.id} onClick={() => onPick(opt)} className={btnClass}>
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {selected && (
          <div className="mt-6 bg-gray-900/40 border border-gray-700 rounded-2xl p-4">
            <div className="text-xl font-extrabold">
              {lastWasCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto"}
            </div>
            {current.explanation && <div className="text-white/80 mt-1">{current.explanation}</div>}

            <div className="mt-4 flex justify-end">
              <button
                onClick={next}
                className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-2xl hover:bg-yellow-300 active:scale-95"
              >
                {index + 1 === questions.length ? "Finalizar" : "Siguiente"} ➜
              </button>
            </div>
          </div>
        )}

        {/* Ayuda (simulación) */}
        {!selected && (
          <div className="mt-6 text-white/70 text-sm">
            Tip: tocá una opción para simular la respuesta 😉
          </div>
        )}
      </div>
    </div>
  );
};

export default Trivia;
