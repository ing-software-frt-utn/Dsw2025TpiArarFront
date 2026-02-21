import { useMemo, useState, useEffect } from "react";

type TriviaQuestion = {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
};

export default function Trivia() {
    const questions: TriviaQuestion[] = useMemo(
        () => [
            {
                id: 1,
                question: "¿Cuál palabra está correctamente acentuada?",
                options: ["arbol", "árbol", "arból", "arboĺ"],
                correctIndex: 1,
                explanation: "En español, 'árbol' lleva tilde por ser palabra grave terminada en consonante distinta de n o s.",
            },
            {
                id: 2,
                question: "¿Cuál es un sinónimo de “feliz”?",
                options: ["triste", "contento", "enojado", "cansado"],
                correctIndex: 1,
                explanation: "“Contento” es sinónimo de “feliz”.",
            },
            {
                id: 3,
                question: "¿Qué tipo de texto suele contar una historia con personajes?",
                options: ["Instructivo", "Narrativo", "Expositivo", "Argumentativo"],
                correctIndex: 1,
                explanation: "El texto narrativo relata hechos con personajes, tiempo y lugar.",
            },
        ],
        []
    );

    const total = questions.length;
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && !finished) {
            interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, finished]);

    const formattedTime = `${Math.floor(timeElapsed / 60).toString().padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;

    const q = questions[idx];

    const choose = (optIndex: number) => {
        if (selected !== null) return;
        setSelected(optIndex);
        const ok = optIndex === q.correctIndex;
        setIsCorrect(ok);
        if (ok) setScore((s) => s + 1);
    };

    const next = () => {
        if (idx + 1 >= total) {
            setFinished(true);
            setIsTimerRunning(false);
            return;
        }
        setIdx((i) => i + 1);
        setSelected(null);
        setIsCorrect(null);
    };

    const restart = () => {
        setIdx(0);
        setSelected(null);
        setIsCorrect(null);
        setScore(0);
        setFinished(false);
        setTimeElapsed(0);
        setIsTimerRunning(true);
    };

    if (finished) {
        const win = score >= Math.ceil(total / 2);
        return (
            <div className="w-full max-w-3xl mx-auto p-6">
                <div className="bg-gray-800 border-4 border-yellow-400 rounded-[2rem] p-8 text-center shadow-2xl">
                    <div className="text-7xl mb-4">{win ? "🏆" : "🙂"}</div>
                    <h2 className="text-3xl font-black text-yellow-400 mb-2">
                        {win ? "¡GANASTE!" : "¡Buen intento!"}
                    </h2>
                    <div className="space-y-2 mb-6 text-gray-200">
                        <p className="text-lg">Puntaje: <span className="font-bold text-white">{score} / {total}</span></p>
                        <p className="text-lg">Tiempo total: <span className="font-bold text-yellow-400">{formattedTime}</span></p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={restart}
                            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black py-3 px-6 rounded-2xl text-lg shadow-md active:scale-95 transition-all"
                        >
                            🔁 Jugar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            <div className="bg-gray-800 border-4 border-yellow-400 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="text-sm sm:text-base text-gray-200 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                        Pregunta <span className="font-bold text-yellow-400">{idx + 1}</span> de {total}
                    </div>
                    <div className="flex gap-3">
                        <div className="text-sm sm:text-base text-gray-200 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                            ⏱️ <span className="font-mono">{formattedTime}</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-200 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                            ⭐ Puntos: <span className="font-bold text-green-400">{score}</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
                    {q.question}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, i) => {
                        const picked = selected === i;
                        const showState = selected !== null;
                        const ok = i === q.correctIndex;

                        let cls = "w-full text-left px-5 py-4 rounded-2xl font-bold text-lg transition-all shadow-md active:scale-[0.99] ";
                        if (!showState) {
                            cls += "bg-gray-700 hover:bg-gray-600 text-white";
                        } else if (picked && ok) {
                            cls += "bg-green-600 text-white";
                        } else if (picked && !ok) {
                            cls += "bg-red-600 text-white";
                        } else if (!picked && ok) {
                            cls += "bg-green-900/40 text-green-400 border border-green-600/50";
                        } else {
                            cls += "bg-gray-700 opacity-40 text-gray-400";
                        }

                        return (
                            <button key={i} onClick={() => choose(i)} className={cls}>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {selected !== null && (
                    <div className="mt-6 bg-gray-900/60 border border-gray-700 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className={`text-xl font-black mb-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                            {isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto"}
                        </div>
                        {q.explanation && (
                            <div className="text-gray-300 text-sm sm:text-base italic">{q.explanation}</div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={next}
                                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black py-3 px-8 rounded-2xl text-lg shadow-md active:scale-95 transition-all"
                            >
                                {idx + 1 === total ? "Finalizar 🏁" : "Siguiente ➡️"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}