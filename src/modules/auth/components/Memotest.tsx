import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MixingAnimation from './MixingAnimation';

interface Card {
  id: number;
  content: string;
  groupId: string;
  isFlipped: boolean;
  isSolved: boolean;
}

const Memotest: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isPreventClick, setIsPreventClick] = useState<boolean>(false);
  const [matches, setMatches] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);

  // Definimos 4 parejas + 1 carta extra para completar las 9
  const cardPairs = [
    { id: 1, content: "1", groupId: "uno" }, { id: 2, content: "🍎", groupId: "uno" },
    { id: 3, content: "2", groupId: "dos" }, { id: 4, content: "🍎🍎", groupId: "dos" },
    { id: 5, content: "3", groupId: "tres" }, { id: 6, content: "🍎🍎🍎", groupId: "tres" },
    { id: 7, content: "4", groupId: "cuatro" }, { id: 8, content: "🍎🍎🍎🍎", groupId: "cuatro" },
     
  ];

  const prepareGame = () => {
    setShowInstructions(false);
    setShowWinModal(false);
    setIsPreventClick(true);
    setMatches(0);
    setFlippedCards([]);
    
    // 1. Mostrar cartas 
    const initial = cardPairs.map(c => ({ ...c, isFlipped: true, isSolved: false }));
    setCards(initial);

    // 2. Mezcla Fluida 
    setTimeout(() => {
      setCards(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 700);

    setTimeout(() => {
      setCards(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 1100);

    // 3. Ocultar y empezar
    setTimeout(() => {
      setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
      setIsPreventClick(false);
    }, 1700);
  };

  useEffect(() => {
    // Si llegamos a 4 parejas 
    if (matches === 4) {
      setTimeout(() => setShowWinModal(true), 600);
    }
  }, [matches]);

  const handleFlip = (index: number) => {
    if (isPreventClick || cards[index].isFlipped || cards[index].isSolved) return;
    if (cards[index].groupId === "extra") {
       
        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);
        setIsPreventClick(true);
        setTimeout(() => {
            newCards[index].isFlipped = false;
            setCards([...newCards]);
            setIsPreventClick(false);
        }, 800);
        return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsPreventClick(true);
      const [first, second] = newFlipped;
      if (newCards[first].groupId === newCards[second].groupId) {
        newCards[first].isSolved = true;
        newCards[second].isSolved = true;
        setMatches(m => m + 1);
        setFlippedCards([]);
        setIsPreventClick(false);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
          setIsPreventClick(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative min-h-[600px] justify-center">
      
      {/* Manual del Juego */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-md rounded-3xl p-4"
          >
            <div className="bg-gray-800 border-4 border-yellow-400 rounded-[2rem] p-8 shadow-2xl text-center max-w-sm">
              <h2 className="text-3xl font-black text-yellow-400 mb-4">¿CÓMO JUGAR?</h2>
              <MixingAnimation />
              <div className="space-y-4 my-6 text-left font-bold text-white">
                <p>👀 Mira las cartas antes de que se volteen.</p>
                <p>🌪️ ¡Sigue las cartas! Se mezclan rápido.</p>
                <p>🎯 Encuentra las parejas iguales.</p>
              </div>
              <button onClick={prepareGame} className="bg-green-500 w-full py-4 rounded-2xl text-2xl font-black shadow-lg">¡ENTENDIDO! 🚀</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VENTANA DE GANASTE */}
      <AnimatePresence>
        {showWinModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md rounded-3xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 border-4 border-green-400 rounded-[2.5rem] p-8 shadow-2xl text-center max-w-sm w-full"
            >
              <div className="text-7xl mb-4">🏆</div>
              <h2 className="text-4xl font-black text-white mb-2">¡GANASTE!</h2>
              <div className="flex flex-col gap-4 mt-8">
                <button onClick={prepareGame} className="bg-green-500 py-4 rounded-2xl text-xl font-black">REPETIR 🔄</button>
                <button onClick={() => window.history.back()} className="bg-gray-600 py-3 rounded-2xl text-lg font-bold text-white">SALIR 🚪</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRILLA DE 3x3 (9 CARTAS) */}
      <div className={`grid grid-cols-3 gap-6 transition-opacity duration-500 ${showInstructions || showWinModal ? 'opacity-10' : 'opacity-100'}`}>
        {cards.map((card, index) => (
          <motion.div
            key={card.id} layout
            transition={{ layout: { type: "spring", stiffness: 200, damping: 25, mass: 1.2 } }}
            onClick={() => handleFlip(index)}
            className={`w-24 h-32 sm:w-32 sm:h-44 flex items-center justify-center text-5xl cursor-pointer rounded-3xl shadow-lg border-b-8 ${
              card.isFlipped || card.isSolved ? 'bg-white border-yellow-500 text-gray-800' : 'bg-blue-600 border-blue-800 text-white'
            }`}
          >
            {card.isFlipped || card.isSolved ? card.content : "?"}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Memotest;