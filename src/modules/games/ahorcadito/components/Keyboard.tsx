interface Props {
  guessedLetters: string[];
  isWinner: boolean;
  isLoser: boolean;
  onGuess: (letter: string) => void;
}

const Keyboard = ({ guessedLetters, isWinner, isLoser, onGuess }: Props) => {
  // Defino teclado
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  const renderButton = (letter: string) => {
    const isGuessed = guessedLetters.includes(letter);

    // - Si ya se usó: gris y desactivado
    // - Si no: azul y "presionable"
    let className =
      "w-8 h-10 sm:w-10 sm:h-12 font-bold rounded shadow-md transition-all ";

    if (isGuessed) {
      className += "bg-gray-300 text-gray-500 cursor-not-allowed";
    } else {
      className +=
        "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105 active:scale-95 border-b-4 border-blue-300";
    }

    return (
      <button
        key={letter}
        disabled={isGuessed || isWinner || isLoser}
        onClick={() => onGuess(letter)}
        className={className}
      >
        {letter}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex gap-1 sm:gap-2">{row1.map(renderButton)}</div>

      <div className="flex gap-1 sm:gap-2">{row2.map(renderButton)}</div>

      <div className="flex gap-1 sm:gap-2">{row3.map(renderButton)}</div>
    </div>
  );
};

export default Keyboard;
