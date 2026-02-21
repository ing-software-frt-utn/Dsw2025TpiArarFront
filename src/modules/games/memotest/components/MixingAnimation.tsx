import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MixingAnimation: React.FC = () => {
  const [demoCards, setDemoCards] = useState([
    { id: 1, content: "1", isFlipped: true, pos: 0 },
    { id: 2, content: "🍎", isFlipped: true, pos: 1 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Mezclar posiciones
      setDemoCards(prev => [...prev].reverse().map((c, i) => ({ ...c, pos: i, isFlipped: true })));
      
      // 2. Ocultar rápido tras mover
      setTimeout(() => {
        setDemoCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
      }, 600);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 justify-center items-center h-20 w-full relative">
      {demoCards.map((card) => (
        <motion.div
          key={card.id}
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
    rotate: [0, -5, 5, 0],
  }}
          transition={{
    rotate: { duration: 0.5, ease: "easeInOut" },
    type: "spring", stiffness: 180, damping: 25, mass: 1.2
  }}
          className={`w-16 h-20 flex items-center justify-center rounded-xl border-2 shadow-sm ${
            card.isFlipped ? 'bg-white border-yellow-400 text-gray-800' : 'bg-blue-600 border-blue-800 text-white'
          }`}
        >
          {card.isFlipped ? card.content : "?"}
        </motion.div>
      ))}
    </div>
  );
};

export default MixingAnimation;