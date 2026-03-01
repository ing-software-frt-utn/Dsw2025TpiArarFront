import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Student, Classroom, PublishedGame } from "../types/classroom.types";
import { getClassroomById, getPublishedGames, getStudentsByClassroom } from "../services/classService";
import Button from "../../../shared/components/Button";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import Popup from "../../../shared/components/Popup";

interface IconProps {
  className?: string;
}

const FaArrowLeft = ({ className }: IconProps) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" className={className}>
    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
  </svg>
);

const FaUsers = ({ className }: IconProps) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" className={className}>
    <path d="M144 160c-44.2 0-80-35.8-80-80S99.8 0 144 0s80 35.8 80 80s-35.8 80-80 80zm368 0c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80zM0 298.1C0 244.9 43.1 202 96.3 202H192c30.1 0 57.3 13.8 75.3 35.5c20.3-20.4 48.2-33 79.1-33h95.6c30.8 0 58.7 12.6 79 32.9c18-21.7 45.2-35.4 75.3-35.4h95.8c53.2 0 96.2 42.9 96.2 96.1V432c0 44.2-35.8 80-80 80H80c-44.2 0-80-35.8-80-80V298.1z"></path>
  </svg>
);

const FaGamepad = ({ className }: IconProps) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" className={className}>
    <path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 280a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM176 176c0-13.3 10.7-24 24-24s24 10.7 24 24v40h40c13.3 0 24 10.7 24 24s-10.7 24-24 24H224v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V288H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h40V176z"></path>
  </svg>
);

const FaTrashCan = ({ className }: IconProps) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" className={className}>
    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
  </svg>
);

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [clase, setClase] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [games, setGames] = useState<PublishedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"juegos" | "alumnos">("juegos");

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");

        const [classData, gamesData, studentsData] = await Promise.all([
          getClassroomById(id),
          getPublishedGames(id),
          getStudentsByClassroom(id)
        ]);
        
        setClase(classData);

        const normalizedGames = Array.isArray(gamesData) 
          ? gamesData 
          : (gamesData as any)?.$values || (gamesData ? [gamesData] : []);
        setGames(normalizedGames);

        const sRaw = Array.isArray(studentsData) ? studentsData : (studentsData as any)?.$values || [];
        const mappedStudents = sRaw.map((s: any): Student => ({
          id: s.id || s.Id,
          name: s.name || s.Name,
          lastname: s.lastname || s.LastName || s.Lastname || "",
          file: s.file || s.File || "none",
          email: s.email || s.Email || ""
        }));
        
        setStudents(mappedStudents);

      } catch (err: any) {
        setError(err.message || "Error al cargar los datos del aula.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  const formatTitle = (name?: string, desc?: string) => {
    if (!name) return "";
    if (!desc || !desc.includes("-")) return name;
    const [year, section] = desc.split("-");
    return `${name} ${year} ${section}`;
  };

  if (loading) return <LoadingOverlay message="Sincronizando información..." />;

  const classroomName = clase?.name || (clase as any)?.Name;
  const classroomCode = clase?.accessCode || (clase as any)?.AccessCode;
  const classroomDesc = clase?.description || (clase as any)?.Description;

  return (
    <div className="p-6 min-h-screen bg-slate-50 font-sans">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate("/profesor")}
          className="flex items-center gap-2 text-indigo-600 font-black hover:translate-x-1 transition-all group uppercase text-xs tracking-widest"
        >
          <FaArrowLeft className="text-sm" /> Volver a Mis Clases
        </button>
      </div>
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner">🏫</div>
        <div className="flex-grow text-center lg:text-left">
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2">
            {formatTitle(classroomName, classroomDesc)}
          </h1>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-2">
            Código: <span className="bg-slate-800 text-white px-3 py-1 rounded-lg font-mono tracking-tighter">{classroomCode}</span>
          </p>
        </div>
        
        <div className="flex gap-10 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-10 border-slate-100 w-full lg:w-auto justify-center">
          <div className="text-center">
            <p className="text-4xl font-black text-slate-800">{students.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Alumnos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-slate-800">{games.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Juegos</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-8 border-b border-slate-200 gap-4">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab("juegos")}
            className={`pb-4 px-2 font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === 'juegos' ? 'border-b-4 border-indigo-600 text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FaGamepad className="text-lg" /> Juegos Enlazados
          </button>
          <button 
            onClick={() => setActiveTab("alumnos")}
            className={`pb-4 px-2 font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === 'alumnos' ? 'border-b-4 border-indigo-600 text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FaUsers className="text-lg" /> Lista de Alumnos ({students.length})
          </button>
        </div>

        <div className="pb-3 text-right">
          {activeTab === "juegos" && (
            <Button 
              label="Asociar Juego" 
              onClick={() => navigate(`/clases/${id}/asignar`)} 
              className="bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 text-sm uppercase tracking-widest px-6" 
            />
          )}
        </div>
      </div>

      <div className="min-h-[300px]">
        {activeTab === "juegos" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.length > 0 ? (
              games.map((game: any) => (
                <div key={game.id || game.Id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors duration-300">🕹️</div>
                    <button className="text-slate-200 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"><FaTrashCan className="text-lg" /></button>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{game.title || game.Title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow line-clamp-2">{game.description || game.Description || "Actividad de refuerzo."}</p>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-lg">{game.level || game.Level || "MEDIA"}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase italic">Activo</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
                <p className="font-black text-lg uppercase tracking-tight">El aula está vacía de juegos</p>
              </div>
            )}
            <div 
              onClick={() => navigate(`/clases/${id}/asignar`)}
              className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-300 hover:bg-white hover:border-indigo-300 hover:text-indigo-400 transition-all cursor-pointer group"
            >
              <span className="text-5xl mb-3 group-hover:scale-125 transition-transform">+</span>
              <span className="font-black text-xs uppercase tracking-widest text-center">Asignar Juego</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alumno</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Legajo (File)</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student: any) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm uppercase">
                                {student.name ? student.name.charAt(0) : "?"}
                          </div>
                          <div>
                            <p className="font-black text-slate-700 uppercase tracking-tight text-sm">{student.name} {student.lastname}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Estudiante Activo</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-slate-500 font-bold text-sm tracking-tight italic">{student.file}</td>
                      <td className="p-6 text-center">
                        <button className="text-slate-300 hover:text-red-500 transition-colors p-3 hover:bg-red-50 rounded-xl">
                            <FaTrashCan className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {students.length === 0 && (
              <div className="p-24 text-center text-slate-400">
                <FaUsers className="mx-auto text-5xl mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs opacity-50">No hay alumnos registrados en esta aula</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <Popup message={error} onClose={() => setError("")} />}
    </div>
  );
};

export default ClassDetail;