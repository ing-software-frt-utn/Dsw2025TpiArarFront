import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, 
  FaGamepad, 
  FaPenToSquare, 
  FaTrash, 
  FaSchool, 
  FaLayerGroup 
} from "react-icons/fa6";
import TemplateSelector from "../components/TemplateSelector";
import { mockClasses } from "../../../../mockData";
import { getRealHangmanGames, GameInstance } from "../services/gameHubApi";
import { getTeacherClassrooms } from "../../../classes/services/classService";
import { Classroom } from "../../../classes/types/classroom.types";

function normalizeList<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.$values && Array.isArray(data.$values)) return data.$values;
  return [];
}

export default function GameHubView() {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Icono predeterminado solicitado
  const DEFAULT_HANGMAN_IMAGE = "/ahorcadito.png";

  const hangmanImageUrl = useMemo(() => {
    try {
      const allMockGames = (mockClasses || []).flatMap((clase) => clase.games || []);
      const mockedHangman = allMockGames.find((g) => (g.type || "").toLowerCase() === "hangman");
      return mockedHangman?.imageUrl || DEFAULT_HANGMAN_IMAGE;
    } catch {
      return DEFAULT_HANGMAN_IMAGE;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [realGamesResult, classroomsResult] = await Promise.allSettled([
          getRealHangmanGames(hangmanImageUrl),
          getTeacherClassrooms()
        ]);

        const realGames = realGamesResult.status === 'fulfilled' ? realGamesResult.value : [];
        const classrooms = classroomsResult.status === 'fulfilled' ? classroomsResult.value : [];

        const enrichedGames = realGames.map((game: GameInstance) => {
          const gameId = String(game.id || (game as any).Id || "").toLowerCase().trim();
          const assignedClass = classrooms.find((c: Classroom) => {
            const rawPublished = c.publishedGames || (c as any).PublishedGames;
            const publishedList = normalizeList<any>(rawPublished);
            return publishedList.some((pg: any) => {
              const pgGameId = String(pg.gameId || pg.GameId || "").toLowerCase().trim();
              return pgGameId === gameId;
            });
          });

          if (assignedClass) {
            const desc = assignedClass.description || (assignedClass as any).Description || "";
            const [nivel, division] = desc.includes("-") ? desc.split("-") : [desc, ""];
            
            return {
              ...game,
              imageUrl: game.imageUrl || hangmanImageUrl,
              course: nivel.trim(),
              division: division.trim(),
              assignedClass: assignedClass.name || (assignedClass as any).Name
            };
          }
          return {
            ...game,
            imageUrl: game.imageUrl || hangmanImageUrl
          };
        });

        //Cargamos Mocks de Trivia/Memotest
        const mockedGames: GameInstance[] = (mockClasses || [])
          .flatMap((clase) => clase.games || [])
          .filter((g) => {
            const type = (g.type || "").toLowerCase();
            return type === "trivia" || type === "memotest";
          })
          .map((g) => ({
            id: String(g.id),
            title: g.title,
            description: g.description,
            type: g.type.charAt(0).toUpperCase() + g.type.slice(1),
            difficulty: "Medio" as const,
            imageUrl: g.imageUrl || (g.type.toLowerCase() === 'memotest' ? "https://cdn-icons-png.flaticon.com/512/3965/3965108.png" : "/trivia.webp"),
            course: "Demo",
            division: "M",
            assignedClass: "Clase de Prueba"
          }));

        const finalGamesList = [...enrichedGames];
        mockedGames.forEach(mock => {
          if (!finalGamesList.some(real => String(real.id).toLowerCase() === String(mock.id).toLowerCase())) {
            finalGamesList.push(mock);
          }
        });

        setGames(finalGamesList);
      } catch (error) {
        console.error("Error al sincronizar la biblioteca:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hangmanImageUrl]);

  const handleSelectTemplate = (type: string) => {
    setShowCreateModal(false);
    navigate(`/juegos/nuevo?tipo=${type}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-700 border-green-200";
      case "Medio": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Difícil": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-gray-200";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white font-sans text-slate-900">
      <div className="flex items-center justify-between gap-4 mb-10 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl shadow-inner">
            <FaGamepad />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">Mi Biblioteca</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">
              Gestión de juegos y asignaciones
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando biblioteca...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div
            onClick={() => setShowCreateModal(true)}
            className="border-4 border-dashed border-indigo-100 rounded-[2.5rem] p-6 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[380px] group shadow-sm"
          >
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              <FaPlus />
            </div>
            <h3 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter">Crear Nuevo</h3>
          </div>

          {games.map((juego) => (
            <div
              key={juego.id}
              className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 hover:shadow-2xl hover:border-indigo-100 transition-all flex flex-col relative overflow-hidden group"
            >
              <div className={`absolute top-4 left-4 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border shadow-sm ${getDifficultyColor(juego.difficulty || "Medio")}`}>
                {juego.difficulty || "Medio"}
              </div>

              <div className="absolute top-4 right-4 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded bg-slate-800 text-white shadow-sm">
                {juego.type}
              </div>

              <div className="mt-10 mb-4 flex justify-center h-28">
                <img
                  src={juego.imageUrl || hangmanImageUrl}
                  alt={juego.title}
                  className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="text-center mb-4">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight line-clamp-1">
                  {juego.title}
                </h3>
                <p className="text-slate-400 text-[10px] font-medium leading-relaxed line-clamp-2 mt-1">
                  {juego.description}
                </p>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex flex-wrap justify-center gap-2">
                  {(juego.course || juego.division) && (
                    <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-[9px] font-black px-3 py-1.5 rounded-lg border border-indigo-100 uppercase tracking-tighter">
                      <FaLayerGroup className="opacity-50" />
                      {juego.course} {juego.division}
                    </div>
                  )}
                  {juego.assignedClass ? (
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-tighter">
                      <FaSchool className="opacity-50" />
                      {juego.assignedClass}
                    </div>
                  ) : (
                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest py-1.5">
                      Sin asignar
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2 pt-4 border-t border-slate-50">
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white border border-slate-100 px-3 py-2.5 rounded-xl text-[10px] font-black transition-all"
                  >
                    <FaPenToSquare /> EDITAR
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="flex items-center justify-center bg-slate-50 text-red-400 hover:bg-red-500 hover:text-white border border-slate-100 px-4 py-2.5 rounded-xl text-[10px] font-black transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
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