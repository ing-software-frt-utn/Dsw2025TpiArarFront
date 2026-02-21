import { FaEdit, FaTrash } from "react-icons/fa";

export interface GameInstance {
    id: number;
    title: string;
    type: string;
    status: "Activo" | "Borrador";
    students: number;
}

interface Props {
    game: GameInstance;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function GameInstanceCard({ game, onEdit, onDelete }: Props) {
    // Determinamos colores según el tipo de juego
    const typeColor = game.type === 'Memotest' ? 'bg-blue-500' : 'bg-green-500';
    
    // Determinamos colores según el estado
    const statusBadge = game.status === 'Activo' 
        ? 'bg-green-100 text-green-700' 
        : 'bg-yellow-100 text-yellow-700';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            {/* Cabecera de color */}
            <div className={`h-2 w-full ${typeColor}`}></div>
            
            {/* Cuerpo de la tarjeta */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {game.type}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge}`}>
                        {game.status}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {game.title}
                </h3>
                
                <p className="text-sm text-gray-500 mt-auto">
                    Alumnos que jugaron: <span className="font-semibold text-gray-700">{game.students}</span>
                </p>
            </div>

            {/* Botonera de acciones */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end gap-3">
                <button 
                    onClick={() => onEdit(game.id)}
                    className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50" 
                    title="Editar"
                >
                    <FaEdit size={18} />
                </button>
                <button 
                    onClick={() => onDelete(game.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50" 
                    title="Eliminar"
                >
                    <FaTrash size={18} />
                </button>
            </div>
        </div>
    );
}