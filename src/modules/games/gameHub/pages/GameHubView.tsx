import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaGamepad, FaEdit, FaTrash } from "react-icons/fa";
import TemplateSelectorModal from "../components/TemplateSelector";
import { mockClasses } from "../../../../mockData";

export interface GameInstance {
    id: number;
    title: string;
    description: string;
    type: string;
    difficulty: "Fácil" | "Medio" | "Difícil";
    imageUrl: string;
}

export default function GameHubView() {
    const navigate = useNavigate();
    
    const [games, setGames] = useState<GameInstance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            setTimeout(() => {
                const extractedGames = mockClasses.flatMap((clase) => clase.games).map((g) => ({
                    id: g.id,
                    title: g.title,
                    description: g.description,
                    type: g.type.charAt(0).toUpperCase() + g.type.slice(1),
                    difficulty: "Medio" as const, 
                    imageUrl: g.imageUrl,
                }));
                
                setGames(extractedGames);
                setIsLoading(false);
            }, 500);
        };
        fetchGames();
    }, []);

    const handleSelectTemplate = (templateType: string) => {
        setShowCreateModal(false);
        navigate(`/profesor/juegos/nuevo?tipo=${templateType.toLowerCase()}`);
    };

    const handleEdit = (id: number) => {
        console.log("Editar:", id);
    };

    const handleDelete = (id: number) => {
        console.log("Eliminar:", id);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Fácil": return "bg-green-100 text-green-700 border-green-200";
            case "Medio": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Difícil": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="p-6 min-h-screen bg-white">
            <div className="flex items-center justify-between gap-4 mb-8 border-b pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl">
                        <FaGamepad />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600">
                            Mis Juegos 🎮
                        </h1>
                        <p className="text-gray-500 text-xl">
                            Panel de gestión del profesor
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Juegos Creados
            </h2>

            {isLoading ? (
                <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div 
                        onClick={() => setShowCreateModal(true)}
                        className="border-2 border-dashed border-blue-300 rounded-xl p-4 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[250px] group"
                    >
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                            <FaPlus />
                        </div>
                        <h3 className="text-xl font-bold text-blue-800 text-center">
                            Crear Nuevo Juego
                        </h3>
                        <p className="text-gray-500 text-center mt-2 text-sm">
                            Haz clic aquí para elegir una plantilla.
                        </p>
                    </div>

                    {games.map((juego) => (
                        <div
                            key={juego.id}
                            className="border-2 border-blue-100 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all bg-blue-50 flex flex-col relative"
                        >
                            <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full border ${getDifficultyColor(juego.difficulty)}`}>
                                {juego.difficulty}
                            </div>
                            
                            <div className="absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded bg-white text-gray-500 shadow-sm border border-gray-200">
                                {juego.type}
                            </div>

                            <img
                                src={juego.imageUrl}
                                alt={juego.title}
                                className="w-full h-24 object-contain mt-8 mb-3 opacity-80"
                            />
                            
                            <h3 className="text-xl font-bold text-blue-800 text-center line-clamp-1">
                                {juego.title}
                            </h3>
                            
                            <p className="text-gray-600 text-center mt-2 text-sm flex-grow line-clamp-2">
                                {juego.description}
                            </p>

                            <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-blue-200/50">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleEdit(juego.id); }}
                                    className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    <FaEdit /> Editar
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(juego.id); }}
                                    className="flex items-center gap-2 bg-white text-red-500 hover:bg-red-500 hover:text-white border border-red-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    <FaTrash /> Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <TemplateSelectorModal 
                    onClose={() => setShowCreateModal(false)}
                    onSelect={handleSelectTemplate}
                />
            )}
        </div>
    );
}