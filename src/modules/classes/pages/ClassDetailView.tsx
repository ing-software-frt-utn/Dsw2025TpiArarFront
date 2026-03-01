import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUsers,
  FaGamepad,
  FaPlay,
  FaTrashCan,
  FaCircleInfo,
  FaPlus,
  FaUserPlus,
} from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import Popup from "../../../shared/components/Popup";
import { useClassroomDetail } from "../hooks/useClasses";

// Helpers
const parseDescription = (desc?: string) => {
  if (!desc?.includes("-")) return { nivel: desc || "N/A", curso: "N/A" };
  const [nivel, curso] = desc.split("-");
  return { nivel, curso };
};

const ClassDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"juegos" | "alumnos">("juegos");

  const { classroom, students, games, loading, error, refresh } = useClassroomDetail(id);

  if (loading) return <LoadingOverlay message="Cargando información del aula..." />;

  const classroomName = classroom?.name ?? (classroom as any)?.Name;
  const classroomDesc = classroom?.description ?? (classroom as any)?.Description;
  const classroomCode = classroom?.accessCode ?? (classroom as any)?.AccessCode;
  const { nivel, curso } = parseDescription(classroomDesc);

  return (
    <div className="p-6 min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/profesor")}
          className="flex items-center gap-2 text-indigo-600 font-black hover:translate-x-1 transition-all uppercase text-xs tracking-widest"
        >
          <FaArrowLeft /> Volver a Mis Clases
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner">🏫</div>
        <div className="flex-grow text-center lg:text-left">
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-none">
            {classroomName}
          </h1>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-3">
            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">NIVEL: {nivel}</span>
            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">CURSO: {curso}</span>
            <div className="bg-slate-800 text-white px-4 py-1.5 rounded-xl text-xs font-mono font-black tracking-[0.2em] shadow-sm flex items-center gap-2">
              <span className="opacity-50 text-[10px]">CÓDIGO:</span> {classroomCode}
            </div>
          </div>
        </div>
        <div className="flex gap-8 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-10 border-slate-100 w-full lg:w-auto justify-center">
          <div className="text-center">
            <p className="text-4xl font-black text-slate-800 leading-none">{students.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Alumnos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-slate-800 leading-none">{games.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Juegos</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-8 border-b border-slate-200 gap-4">
        <div className="flex gap-8">
          {(["juegos", "alumnos"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
                activeTab === tab
                  ? "border-b-4 border-indigo-600 text-indigo-600 scale-105"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "juegos" ? <FaGamepad className="text-lg" /> : <FaUsers className="text-lg" />}
              {tab === "juegos" ? "Juegos Enlazados" : "Lista de Alumnos"}
            </button>
          ))}
        </div>
        <div className="pb-3">
          {activeTab === "juegos" ? (
            <Button
              label="Asociar Juego"
              onClick={() => navigate(`/clases/${id}/asignar`)}
              imgSrc={<FaPlus />}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm uppercase tracking-widest"
            />
          ) : (
            <Button
              label="Código de Clase"
              onClick={() => {}}
              imgSrc={<FaUserPlus />}
              className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-black shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2 text-sm uppercase tracking-widest"
            />
          )}
        </div>
      </div>

      <div className="min-h-[300px]">
        {activeTab === "juegos" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.length > 0 ? (
              games.map((game: any) => {
                const gId = game.id ?? game.Id;
                const gTitle = game.title ?? game.Title;
                const gDesc = game.description ?? game.Description;
                const gLevel = game.level ?? game.Level;
                const realGameId = game.gameId ?? game.GameId ?? gId;

                return (
                  <div key={gId} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors">🕹️</div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-lg self-center border border-amber-200">
                        {gLevel ?? "MEDIA"}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{gTitle}</h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed mb-6 flex-grow line-clamp-2">{gDesc ?? "Actividad de refuerzo."}</p>
                    <div className="flex gap-2 pt-5 border-t border-slate-50 mt-auto">
                      <button
                        onClick={() => navigate(`/jugar/${realGameId}/test`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2.5 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95 uppercase tracking-widest"
                      >
                        <FaPlay /> PROBAR
                      </button>
                      <button className="text-slate-300 hover:text-red-500 p-2.5 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">
                        <FaTrashCan />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 shadow-inner">
                <FaCircleInfo className="mx-auto text-5xl mb-4 opacity-20" />
                <p className="font-black text-lg uppercase tracking-tight">El aula está vacía de juegos</p>
                <p className="text-xs mt-1">Hacé clic en "Asociar Juego" para empezar.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alumno</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Legajo</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student: any) => {
                    const sId = student.id ?? student.Id;
                    const sName = student.name ?? student.Name;
                    const sLastname = student.lastname ?? student.LastName ?? student.Lastname;
                    const sFile = student.file ?? student.File ?? "none";

                    return (
                      <tr key={sId} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm">
                              {sName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-700 uppercase tracking-tight text-sm leading-none mb-1">{sName} {sLastname}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Estudiante Activo</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-slate-500 font-bold text-sm italic">{sFile}</td>
                        <td className="p-6 text-center">
                          <button className="text-slate-300 hover:text-red-500 p-3 hover:bg-red-50 rounded-xl transition-all">
                            <FaTrashCan />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {students.length === 0 && (
              <div className="p-20 text-center text-slate-400">
                <p className="font-bold uppercase tracking-widest text-[10px] opacity-50">No hay alumnos registrados en esta aula</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <Popup message={error} onClose={refresh} />}
    </div>
  );
};

export default ClassDetailView;