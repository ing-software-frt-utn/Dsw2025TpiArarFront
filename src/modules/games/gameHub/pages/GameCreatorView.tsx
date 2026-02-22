import { useLocation } from "react-router-dom";
import AhorcaditoCreator from "../../ahorcadito/pages/AhorcaditoCreator";

export default function GameCreatorView() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const tipo = queryParams.get("tipo")?.toLowerCase();

  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto pb-10">
      <div className="p-4 sm:p-8">
        {/* Renderiza el creador de Ahorcadito si el tipo es 'ahorcadito' o el ID es '2' */}
        {(tipo === "ahorcadito" || tipo === "2") && <AhorcaditoCreator />}
        
        {/* Placeholders para los otros juegos con sus respectivos IDs (1 para Memotest, 3 para Trivia) */}
        {(tipo === "memotest" || tipo === "1") && (
          <div className="text-center p-20 bg-white rounded-3xl shadow-md border-2 border-dashed border-blue-200">
            <h2 className="text-2xl font-bold text-blue-400">Constructor de Memotest</h2>
            <p className="text-gray-400 mt-2">Estamos trabajando en este módulo.</p>
          </div>
        )}
        
        {(tipo === "trivia" || tipo === "3") && (
          <div className="text-center p-20 bg-white rounded-3xl shadow-md border-2 border-dashed border-violet-200">
            <h2 className="text-2xl font-bold text-violet-400">Constructor de Trivia</h2>
            <p className="text-gray-400 mt-2">Estamos trabajando en este módulo.</p>
          </div>
        )}

        {/* Manejo de errores si no hay un tipo válido */}
        {!(tipo === "ahorcadito" || tipo === "2" || tipo === "memotest" || tipo === "1" || tipo === "trivia" || tipo === "3") && (
          <div className="text-center p-20 bg-white rounded-3xl shadow-md border-2 border-red-100">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-500">Error de acceso</h2>
            <p className="text-gray-500 mt-2">No se especificó un tipo de juego válido para crear.</p>
          </div>
        )}
      </div>
    </div>
  );
}