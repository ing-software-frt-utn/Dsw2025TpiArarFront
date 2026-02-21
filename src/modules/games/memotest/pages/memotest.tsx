import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MixingAnimation from "../components/MixingAnimation";
import MatchFeedback from "../components/MatchFeedback";

interface Card {
  id: number;
  content: string;
  groupId: string;
  isFlipped: boolean;
  isSolved: boolean;
}

const cardPairs = [
  { id: 1, content: "1", groupId: "uno" }, { id: 2, content: "🍎", groupId: "uno" },
  { id: 3, content: "2", groupId: "dos" }, { id: 4, content: "🍎🍎", groupId: "dos" },
  { id: 5, content: "3", groupId: "tres" }, { id: 6, content: "🍎🍎🍎", groupId: "tres" },
  { id: 7, content: "4", groupId: "cuatro" }, { id: 8, content: "🍎🍎🍎🍎", groupId: "cuatro" }
];

const StatBadge: React.FC<{ label: string; value: string | number; colorClass?: string }> = ({ label, value, colorClass = "text-white" }) => (
  <div className="text-center">
    <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">{label}</p>
    <div className={`bg-gray-900 border-2 border-gray-700 px-4 py-2 rounded-xl text-2xl sm:text-3xl font-black ${colorClass} w-24 sm:w-32 mx-auto shadow-inner`}>
      {value}
    </div>
  </div>
);

const MemoryCard: React.FC<{ card: Card; onClick: () => void }> = ({ card, onClick }) => {
  const isVisible = card.isFlipped || card.isSolved;
  const chars = Array.from(card.content);

  return (
    <motion.div
      layout
      transition={{ layout: { type: "spring", stiffness: 200, damping: 25, mass: 1.2 } }}
      onClick={onClick}
      className={`w-20 h-28 sm:w-24 sm:h-36 md:w-32 md:h-44 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl cursor-pointer rounded-xl sm:rounded-2xl shadow-lg border-b-8 ${
        isVisible ? "bg-white border-yellow-500 text-gray-800" : "bg-blue-600 border-blue-800 text-white"
      }`}
    >
      {isVisible ? (
        chars.length > 1 ? (
          <div className="grid grid-cols-2 place-items-center gap-1 sm:gap-2">
            {chars.map((char, i) => <span key={i} className="text-2xl sm:text-3xl md:text-4xl leading-none">{char}</span>)}
          </div>
        ) : card.content
      ) : "?"}
    </motion.div>
  );
};

const Memotest: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isPreventClick, setIsPreventClick] = useState<boolean>(false);
  const [matches, setMatches] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);
  const [matchStatus, setMatchStatus] = useState<"success" | "error" | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const prepareGame = () => {
    setShowInstructions(false);
    setShowWinModal(false);
    setIsPreventClick(true);
    setMatchStatus(null);
    setMatches(0);
    setFlippedCards([]);
    setTimeElapsed(0);
    setIsTimerRunning(false);

    setCards(cardPairs.map((c) => ({ ...c, isFlipped: true, isSolved: false })));

    setTimeout(() => setCards((prev) => [...prev].sort(() => Math.random() - 0.5)), 700);
    setTimeout(() => setCards((prev) => [...prev].sort(() => Math.random() - 0.5)), 1100);
    setTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
      setIsPreventClick(false);
      setIsTimerRunning(true);
    }, 1700);
  };

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (matches === 4) {
      setIsTimerRunning(false);
      setTimeout(() => setShowWinModal(true), 600);
    }
  }, [matches]);

  const handleFlip = (index: number) => {
    if (isPreventClick || cards[index].isFlipped || cards[index].isSolved) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsPreventClick(true);
      const [first, second] = newFlipped;
      const isMatch = newCards[first].groupId === newCards[second].groupId;
      
      setMatchStatus(isMatch ? "success" : "error");

      if (isMatch) {
        newCards[first].isSolved = true;
        newCards[second].isSolved = true;
      }

      setTimeout(() => {
        setMatchStatus(null);
        if (isMatch) {
          setMatches((m) => m + 1);
        } else {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards([...newCards]);
        }
        setFlippedCards([]);
        setIsPreventClick(false);
      }, 1000);
    }
  };

  const formattedTime = `${Math.floor(timeElapsed / 60).toString().padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-full flex-1 p-2 sm:p-4 gap-6 relative">
        <AnimatePresence>
        {showInstructions && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-800 border-4 border-yellow-400 rounded-[2rem] p-6 sm:p-8 shadow-2xl text-center w-full max-w-sm">
                <h2 className="text-3xl font-black text-yellow-400 mb-4">¿CÓMO JUGAR?</h2>
                <MixingAnimation />
                <div className="space-y-4 my-6 text-left font-bold text-white">
                <p>👀 Mira las cartas antes de que se volteen.</p>
                <p>🌪️ ¡Sigue las cartas! Se mezclan rápido.</p>
                <p>🎯 Encuentra las parejas iguales.</p>
                </div>
                <button onClick={prepareGame} className="bg-green-500 w-full py-4 rounded-2xl text-2xl font-black shadow-lg hover:bg-green-400 transition-colors">¡ENTENDIDO! 🚀</button>
            </div>
            </motion.div>
        )}

        {showWinModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-gray-800 border-4 border-green-400 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-center w-full max-w-sm">
                <div className="text-7xl mb-4">🏆</div>
                <h2 className="text-4xl font-black text-white mb-2">¡GANASTE!</h2>
                <p className="text-lg text-gray-200 mb-6 font-medium">Tu tiempo: <span className="font-bold text-yellow-400">{formattedTime}</span></p>
                <div className="flex flex-col gap-4 mt-2">
                <button onClick={prepareGame} className="bg-green-500 hover:bg-green-400 transition-colors py-4 rounded-2xl text-xl font-black">REPETIR 🔄</button>
                <button onClick={() => window.history.back()} className="bg-gray-600 hover:bg-gray-500 transition-colors py-3 rounded-2xl text-lg font-bold text-white">SALIR 🚪</button>
                </div>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>

        <MatchFeedback status={matchStatus} />

        <div className={`flex flex-row md:flex-col gap-6 md:gap-8 bg-gray-800 border-4 border-gray-600 p-4 sm:p-6 rounded-3xl shadow-xl transition-opacity duration-500 ${showInstructions ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <StatBadge label="Tiempo" value={formattedTime} />
        <StatBadge label="Aciertos" value={`${matches} / 4`} colorClass="text-green-400" />
        </div>

        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5 transition-opacity duration-500 ${showInstructions || showWinModal ? "opacity-10" : "opacity-100"}`}>
        {cards.map((card, index) => (
            <MemoryCard key={card.id} card={card} onClick={() => handleFlip(index)} />
        ))}
        </div>

    </div>
    );
};

export default Memotest;