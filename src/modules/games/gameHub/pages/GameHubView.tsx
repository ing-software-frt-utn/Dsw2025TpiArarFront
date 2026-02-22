import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaGamepad, FaEdit, FaTrash } from "react-icons/fa";
import TemplateSelector from "../components/TemplateSelector";
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

    const handleSelectTemplate = (id: string) => {
        setShowCreateModal(false);
        // Ajustamos la navegación para que coincida con la ruta definida en App.tsx
        navigate(`/juegos/nuevo?tipo=${id}`);
    };

    const handleEdit = (id: number) => console.log(id);
    const handleDelete = (id: number) => console.log(id);

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
                        <h1 className="text-3xl font-bold text-blue-600">Mis Juegos 🎮</h1>
                        <p className="text-gray-500 text-xl font-medium">Panel de gestión del profesor</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">Juegos Creados</h2>

            {isLoading ? (
                <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div 
                        onClick={() => setShowCreateModal(true)}
                        className="border-2 border-dashed border-blue-300 rounded-[2rem] p-6 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[280px] group shadow-sm"
                    >
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                            <FaPlus />
                        </div>
                        <h3 className="text-2xl font-black text-blue-800 text-center">Crear Nuevo</h3>
                    </div>

                    {games.map((juego) => (
                        <div 
                            key={juego.id} 
                            className="border-2 border-blue-50 rounded-[2rem] p-6 hover:shadow-2xl hover:border-blue-200 transition-all bg-white flex flex-col relative overflow-hidden group"
                        >
                            <div className={`absolute top-4 left-4 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${getDifficultyColor(juego.difficulty)}`}>
                                {juego.difficulty}
                            </div>
                            
                            <div className="absolute top-4 right-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-slate-100 text-slate-500 border border-slate-200">
                                {juego.type}
                            </div>

                            <div className="mt-10 mb-6 flex justify-center">
                                <img 
                                    src={juego.imageUrl} 
                                    alt={juego.title} 
                                    className="w-full h-28 object-contain" 
                                />
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-800 text-center line-clamp-1">
                                {juego.title}
                            </h3>
                            
                            <p className="text-slate-400 text-center mt-2 text-sm flex-grow line-clamp-2">
                                {juego.description}
                            </p>

                            <div className="flex justify-center gap-3 mt-6 pt-6 border-t border-slate-50">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleEdit(juego.id); }} 
                                    className="flex items-center gap-2 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-black transition-all"
                                >
                                    <FaEdit /> EDITAR
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(juego.id); }} 
                                    className="flex items-center gap-2 bg-slate-50 text-red-500 hover:bg-red-500 hover:text-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-black transition-all"
                                >
                                    <FaTrash /> BORRAR
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <TemplateSelector 
                    onClose={() => setShowCreateModal(false)} 
                    onSelect={handleSelectTemplate} 
                />
            )}
        </div>
    );
}