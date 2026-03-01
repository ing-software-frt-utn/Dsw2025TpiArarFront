import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import { getTeacherClassrooms } from "../../classes/services/classService";
// Importamos los mocks
import { mockStudentClasses } from "../../classes/services/mockClasses";

const FaPlus = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em">
    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
  </svg>
);

const FaUsers = ({ className }: { className?: string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" className={className}>
    <path d="M144 160c-44.2 0-80-35.8-80-80S99.8 0 144 0s80 35.8 80 80s-35.8 80-80 80zm368 0c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80zM0 298.1C0 244.9 43.1 202 96.3 202H192c30.1 0 57.3 13.8 75.3 35.5c20.3-20.4 48.2-33 79.1-33h95.6c30.8 0 58.7 12.6 79 32.9c18-21.7 45.2-35.4 75.3-35.4h95.8c53.2 0 96.2 42.9 96.2 96.1V432c0 44.2-35.8 80-80 80H80c-44.2 0-80-35.8-80-80V298.1z"></path>
  </svg>
);

const FaGamepad = ({ className }: { className?: string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" className={className}>
    <path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 280a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM176 176c0-13.3 10.7-24 24-24s24 10.7 24 24v40h40c13.3 0 24 10.7 24 24s-10.7 24-24 24H224v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V288H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h40V176z"></path>
  </svg>
);

const DashboardProfessorView = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const normalize = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values && Array.isArray(data.$values)) return data.$values;
    return [];
  };

  const fetchClassrooms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeacherClassrooms();
      const list = normalize(data);
      
      // JUNTAMOS LAS CLASES REALES CON LAS CLASES MOCKEADAS
      setClassrooms([...list, ...mockStudentClasses]);
      
    } catch (err) {
      console.error("Error al cargar las clases:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const formatDescription = (desc: string) => {
    if (!desc) return <span className="text-slate-400 italic text-[10px]">Sin descripción</span>;
    if (!desc.includes("-")) return <span className="text-slate-500 font-bold text-[10px]">{desc}</span>;
    
    const [nivel, division] = desc.split("-");
    return (
      <div className="flex flex-col gap-0.5 text-[10px]">
        <div className="font-black text-slate-500 uppercase tracking-tighter">
          Nivel: <span className="text-indigo-600">{nivel}</span>
        </div>
        <div className="font-black text-slate-500 uppercase tracking-tighter">
          Curso: <span className="text-indigo-600">{division}</span>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingOverlay message="Sincronizando clases..." />;

  return (
    <div className="p-7 min-h-full bg-indigo-50 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center uppercase tracking-tighter">
        Mis Clases 📚
      </h1>

      <div className="flex justify-center mb-10">
        <Button
          label="Crear Nueva Clase"
          onClick={() => navigate("/clases/crear")}
          imgSrc={<FaPlus />}
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-full shadow-lg font-bold text-lg transform hover:scale-105 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {classrooms.map((clase) => {
          const classId = clase.id || clase.Id;
          const className = clase.name || clase.Name;
          const classDesc = clase.description || clase.Description;
          // Agregamos "MOCK" como fallback por si la clase viene de mockStudentClasses
          const code = clase.accessCode || clase.AccessCode || "MOCK"; 
          const students = normalize(clase.classroomStudents || clase.ClassroomStudents);
          const publishedGames = normalize(clase.publishedGames || clase.PublishedGames);

          return (
            <div
              key={classId}
              onClick={() => navigate(`/clases/${classId}`)}
              className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden hover:scale-105 transition-all cursor-pointer border-4 border-transparent hover:border-indigo-300 group flex flex-col"
            >
              <div className="h-28 bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <span className="text-5xl" role="img" aria-label="escuela">🏫</span>
              </div>
              
              <div className="p-5 flex flex-col flex-grow text-center">
                <h2 className="text-xl font-black text-slate-800 mb-2 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                  {className}
                </h2>
                
                <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {formatDescription(classDesc)}
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col items-center text-gray-600">
                    <FaUsers className="text-indigo-500 text-lg mb-1" />
                    <span className="text-[9px] uppercase font-black text-slate-400">Alumnos</span>
                    <span className="text-sm font-bold text-slate-700">{students.length}</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-600">
                    <FaGamepad className="text-indigo-500 text-lg mb-1" />
                    <span className="text-[9px] uppercase font-black text-slate-400">Juegos</span>
                    <span className="text-sm font-bold text-slate-700">{publishedGames.length}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-50 flex justify-center">
                  <span className="bg-slate-800 text-white text-[10px] px-4 py-1.5 rounded-xl font-mono font-black tracking-[0.2em] shadow-sm uppercase">
                    ID: {code}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardProfessorView;