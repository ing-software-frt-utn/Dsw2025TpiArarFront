import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Importaciones según tu estructura local: src/modules/classes/services/classService
import { getClassroomById, getPublishedGames } from "../services/classService";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import Popup from "../../../shared/components/Popup";

// Definición de interfaces para TypeScript
export interface Classroom {
  id: string;
  name: string;
  description: string;
  accessCode: number;
}

export interface PublishedGame {
  id: string;
  title: string;
  description: string;
  level: string;
  gameId: string;
}

const ClassDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clase, setClase] = useState<Classroom | null>(null);
  const [games, setGames] = useState<PublishedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Ejecutamos ambas peticiones en paralelo usando tu classService
        const [classData, gamesData] = await Promise.all([
          getClassroomById(id),
          getPublishedGames(id)
        ]);
        
        setClase(classData);
        setGames(gamesData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatTitle = (name?: string, desc?: string) => {
    if (!name) return "";
    if (!desc || !desc.includes("-")) return name;
    const [year, section] = desc.split("-");
    return `${name} ${year} ${section}`;
  };

  if (error) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl text-red-500 font-bold mb-4">Clase no encontrada 😕</h2>
        <button
          onClick={() => navigate("/profesor")}
          className="px-6 py-2 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all"
        >
          Volver al inicio
        </button>
        <Popup message={error} onClose={() => setError("")} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      {loading && <LoadingOverlay message="Cargando detalles..." />}
      
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 text-4xl shadow-inner">
          🏫
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            {formatTitle(clase?.name, clase?.description)}
          </h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">
            Gestión de actividades y juegos | Código de acceso: {clase?.accessCode}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-black mb-6 text-slate-800">
        Juegos Disponibles 🎮
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Renderizado de los juegos publicados reales desde el backend */}
        {games.map((game) => (
          <div 
            key={game.id}
            className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-4">🕹️</div>
            <h3 className="font-bold text-slate-800">{game.title}</h3>
            <p className="text-slate-500 text-sm mt-2 line-clamp-2">{game.description}</p>
            <div className="mt-4">
              <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Nivel {game.level}
              </span>
            </div>
          </div>
        ))}

        {/* Botón para asignar nuevo juego */}
        <div 
          onClick={() => navigate(`/clases/${id}/asignar`)}
          className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <span className="text-4xl mb-2">+</span>
          <span className="font-bold text-sm uppercase">Asignar Juego</span>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailView;