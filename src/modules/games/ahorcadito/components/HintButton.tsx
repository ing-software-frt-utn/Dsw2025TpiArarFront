import { useState } from "react";

interface Props {
  hintText: string;
  disabled: boolean;
}

const HintButton = ({ hintText, disabled }: Props) => {
  const [show, setShow] = useState(false);

  // Si no hay texto de pista, no mostramos nada
  if (!hintText) return null;

  return (
    <button
      onClick={() => setShow(true)}
      disabled={disabled || show} // Se deshabilita si el juego terminó o si ya se está mostrando
      className={`
        relative overflow-hidden font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300
        ${
          show
            ? "bg-yellow-100 text-yellow-800 cursor-default scale-100" // Estado Revelado (Pista visible)
            : "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:scale-105 active:scale-95 cursor-pointer" // Estado Botón
        }
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      <span className="flex items-center gap-2">
        {show ? (
          <>
            <span className="text-xl">💡</span>
            <span>{hintText}</span>
          </>
        ) : (
          <>
            <span className="text-xl">💡</span>
            <span>Ver Pista</span>
          </>
        )}
      </span>
    </button>
  );
};

export default HintButton;