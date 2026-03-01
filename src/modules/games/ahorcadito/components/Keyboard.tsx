interface KeyboardProps {
  guessedLetters: string[];
  isWinner: boolean;
  isLoser: boolean;
  onGuess: (letter: string) => void;
}

export const Keyboard = ({ guessedLetters, isWinner, isLoser, onGuess }: KeyboardProps) => {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  const renderButton = (letter: string) => {
    const isGuessed = guessedLetters.includes(letter);
    const isDisabled = isGuessed || isWinner || isLoser;

    let className = "w-10 h-12 sm:w-12 sm:h-14 font-black rounded-xl shadow-md transition-all flex items-center justify-center text-lg ";

    if (isGuessed) {
      className += "bg-slate-200 text-slate-400 cursor-not-allowed border-b-0 translate-y-1";
    } else {
      className += "bg-white text-indigo-600 hover:bg-indigo-50 hover:scale-105 active:scale-95 border-b-4 border-indigo-200 active:border-b-0 active:translate-y-1";
    }

    return (
      <button
        key={letter}
        disabled={isDisabled}
        onClick={() => onGuess(letter)}
        className={className}
      >
        {letter}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <div className="flex gap-2">{row1.map(renderButton)}</div>
      <div className="flex gap-2">{row2.map(renderButton)}</div>
      <div className="flex gap-2">{row3.map(renderButton)}</div>
    </div>
  );
};

export default Keyboard;