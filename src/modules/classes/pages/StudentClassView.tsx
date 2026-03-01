import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaPlay, 
  FaCircleInfo, 
  FaLayerGroup,
  FaMagnifyingGlass
} from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import Popup from "../../../shared/components/Popup";
import { useClassroomDetailStudent } from "../hooks/useClasses";

const HangmanIcon = ({ className }: { className?: string }) => (
  <img 
    src="/ahorcadito.png" 
    alt="Icono Ahorcadito" 
    className={className || "w-full h-full object-contain drop-shadow-sm"} 
  />
);

const StudentClassView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { classroom, games, loading, error, refresh } = useClassroomDetailStudent(id);

  const groupedGames = useMemo(() => {
    if (!games || games.length === 0) return {};
    const gamesList = Array.isArray(games) ? games : [games];
    
    const filtered = gamesList.filter((g: any) => {
      const title = (g.title || g.Title || "").toLowerCase();
      return title.includes(searchTerm.toLowerCase());
    });

    return filtered.reduce((acc: any, game: any) => {
      const topicName = game.topicName || game.TopicName || "Juegos de la Clase";
      if (!acc[topicName]) acc[topicName] = [];
      acc[topicName].push(game);
      return acc;
    }, {});
  }, [games, searchTerm]);

  /**
   * handlePlay: Corrección de ID para evitar Error 500.
   * Usamos 'gameId' (FK al juego real) en lugar de 'id' (PK de la publicación).
   */
  const handlePlay = (game: any) => {
    const realGameId = game.gameId || game.GameId || game.id || game.Id;
    const type = (game.type || game.Type || "").toLowerCase();

    if (type === "memotest") return navigate("/jugar/1");
    if (type === "trivia") return navigate("/jugar/3");

    navigate(`/jugar/${realGameId}`);
  };

  const parseDescription = (desc?: string) => {
    if (!desc || !desc.includes("-")) return { nivel: desc || "N/A", curso: "N/A" };
    const [nivel, curso] = desc.split("-");
    return { nivel, curso };
  };

  if (loading) return <LoadingOverlay message="Sincronizando tus juegos..." />;

  const classroomName = classroom?.name ?? (classroom as any)?.Name ?? "Mi Clase";
  const classroomDesc = classroom?.description ?? (classroom as any)?.Description;
  const { nivel, curso } = parseDescription(classroomDesc);

  return (
    <div className="p-6 min-h-screen bg-indigo-50 font-sans text-slate-900">
      <div className="mb-8">
        <button
          onClick={() => navigate("/alumno")}
          className="flex items-center gap-2 text-indigo-600 font-black hover:translate-x-1 transition-all uppercase text-[10px] tracking-widest w-fit"
        >
          <FaArrowLeft /> Mis Aulas
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row gap-8 items-center animate-fadeIn">
        <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0 duration-500 text-5xl">
          🎮
        </div>
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-none">
            {classroomName}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
              NIVEL: {nivel}
            </span>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
              CURSO: {curso}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {Object.keys(groupedGames).length > 0 ? (
          Object.entries(groupedGames).map(([topicName, topicGames]: [string, any], index) => (
            <section key={topicName} className="animate-slideUp">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b-4 border-indigo-100/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center text-sm shadow-sm">
                    <FaLayerGroup />
                  </div>
                  <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest">
                    {topicName}
                  </h2>
                </div>

                {index === 0 && (
                  <div className="relative w-full md:w-80">
                    <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input 
                      type="text"
                      placeholder="Buscar un juego..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {topicGames.map((game: any) => {
                  const gTitle = game.title ?? game.Title ?? "Sin Título";
                  const gLevel = game.level ?? game.Level ?? "Media";
                  const gImg = game.imageUrl || game.ImageUrl; 

                  return (
                    <div key={Math.random()} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                      <div className="h-2 w-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors"></div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-16 h-16 flex items-center justify-center">
                            {gImg ? (
                              <img src={gImg} alt={gTitle} className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300">
                                <HangmanIcon />
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                            {gLevel}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{gTitle}</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed mb-6 flex-grow line-clamp-2 italic font-medium">
                          {game.description ?? (game as any).Description ?? "¡Es momento de jugar y aprender!"}
                        </p>
                        <Button
                          label="¡JUGAR!"
                          onClick={() => handlePlay(game)}
                          imgSrc={<FaPlay className="text-[10px]" />}
                          className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-[10px] uppercase tracking-[0.2em] mt-auto active:scale-95"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="max-w-2xl mx-auto py-24 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-indigo-200 text-slate-400 shadow-inner">
            <FaCircleInfo className="mx-auto text-6xl mb-4 opacity-20" />
            <p className="font-black text-2xl uppercase tracking-tight">
              {searchTerm ? "No se encontraron juegos" : "Todavía no hay juegos"}
            </p>
          </div>
        )}
      </div>
      {error && <Popup message={error} onClose={refresh} />}
    </div>
  );
};

export default StudentClassView;