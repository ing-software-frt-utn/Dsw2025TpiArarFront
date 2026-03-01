interface Props {
  word: string; 
}

const WordContainer = ({ word }: Props) => {
  if (!word) return null;

  const characters = word.split("");

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-full">
      {characters.map((letter, index) => {
        if (letter === " ") {
          return <div key={index} className="w-6 md:w-10" />;
        }
        const isHidden = letter === "_";

        return (
          <div
            key={index}
            className={`
              w-12 h-16 md:w-16 md:h-20 
              border-b-8 
              flex items-center justify-center 
              text-3xl md:text-5xl font-black 
              transition-all duration-300 rounded-t-2xl
              ${
                !isHidden
                  ? "border-indigo-600 text-indigo-800 bg-white shadow-md transform -rotate-1 scale-105"
                  : "border-slate-300 text-transparent bg-slate-50/50"
              }
            `}
          >
            {!isHidden ? letter : ""}
          </div>
        );
      })}
    </div>
  );
};

export default WordContainer;