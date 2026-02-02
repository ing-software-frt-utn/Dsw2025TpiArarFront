interface Props {
  word: string;
  guessedLetters: string[];
}

const WordContainer = ({ word, guessedLetters }: Props) => {
  if (!word) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-full">
      {word.split("").map((letter, index) => {
        {
          /*si es un espacio vacio separa las palabras */
        }
        if (letter === " ") {
          return (
            <div
              key={index}
              className="w-4 md:w-8 h-12 flex items-center justify-center"
            >
              {/* Espacio transparente */}
            </div>
          );
        }

        {
          /*si es una letra real*/
        }
        const isGuessed = guessedLetters.includes(letter);

        return (
          <div
            key={index}
            className={`
              w-10 h-12 md:w-14 md:h-16 
              border-b-4 
              flex items-center justify-center 
              text-2xl md:text-4xl font-bold 
              transition-all duration-300
              ${
                isGuessed
                  ? "border-blue-500 text-blue-800 bg-white shadow-sm rounded-t-lg"
                  : "border-gray-400 text-transparent"
              }
            `}
          >
            {/* Muestra la letra solo si ya la adivinó */}
            {isGuessed ? letter : ""}
          </div>
        );
      })}
    </div>
  );
};

export default WordContainer;
