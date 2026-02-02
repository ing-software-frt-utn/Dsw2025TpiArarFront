// defino las partes del cuerpo como piezas de svg
// Uso líneas gruesas (strokeWidth="4") y colores fuertes para accesibilidad
const BODY_PARTS = [
  <circle
    cx="100"
    cy="50"
    r="20"
    stroke="black"
    strokeWidth="4"
    fill="transparent"
    key="head"
  />, // Cabeza
  <line
    x1="100"
    y1="70"
    x2="100"
    y2="130"
    stroke="black"
    strokeWidth="4"
    key="body"
  />, // Tronco
  <line
    x1="100"
    y1="90"
    x2="70"
    y2="110"
    stroke="black"
    strokeWidth="4"
    key="armL"
  />, // Brazo Izq
  <line
    x1="100"
    y1="90"
    x2="130"
    y2="110"
    stroke="black"
    strokeWidth="4"
    key="armR"
  />, // Brazo Der
  <line
    x1="100"
    y1="130"
    x2="70"
    y2="160"
    stroke="black"
    strokeWidth="4"
    key="legL"
  />, // Pierna Izq
  <line
    x1="100"
    y1="130"
    x2="130"
    y2="160"
    stroke="black"
    strokeWidth="4"
    key="legR"
  />, // Pierna Der
];

interface Props {
  mistakes: number;
}

const GameDrawing = ({ mistakes }: Props) => {
  return (
    <div className="relative flex justify-center items-center p-4">
      {/* la horca */}
      <svg height="250" width="200" className="stroke-gray-800">
        <line x1="10" y1="240" x2="150" y2="240" strokeWidth="4" />
        <line x1="50" y1="240" x2="50" y2="20" strokeWidth="4" />
        <line x1="50" y1="20" x2="100" y2="20" strokeWidth="4" />
        <line x1="100" y1="20" x2="100" y2="30" strokeWidth="4" />

        {/* uso el .slice() para ir haciendo el dibujito a medida que se equivoque */}
        <g className="stroke-orange-950">{BODY_PARTS.slice(0, mistakes)}</g>
      </svg>
    </div>
  );
};

export default GameDrawing;
