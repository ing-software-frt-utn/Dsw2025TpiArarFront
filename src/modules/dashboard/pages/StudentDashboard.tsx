import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import Popup from "../../../shared/components/Popup";
import { useStudentClassrooms, useClassActions } from "../../classes/hooks/useClasses";
// Importamos las clases mockeadas
import { mockStudentClasses } from "../../classes/services/mockClasses";

const DashboardStudentView = () => {
  const navigate = useNavigate();
  const { classrooms, loading, error: fetchError, refresh } = useStudentClassrooms();
  const { join, loading: joining, error: joinError, clearError } = useClassActions();
  
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState<string>("");

  // Combinamos las clases reales con las mockeadas
  const allClassrooms = [...classrooms, ...mockStudentClasses];

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode) return;

    try {
      await join(parseInt(accessCode));
      setShowJoinModal(false);
      setAccessCode("");
      refresh();
    } catch (err) {
      // El error se maneja a través de joinError en el hook
    }
  };

  const formatDescription = (desc: string) => {
    if (!desc || !desc.includes("-")) return <span className="text-slate-500 font-bold">{desc || "Sin datos"}</span>;
    const [nivel, curso] = desc.split("-");
    return (
      <div className="flex flex-col gap-0.5 text-[11px]">
        <div className="font-black text-slate-500 uppercase tracking-tighter text-xs">
          Nivel: <span className="text-indigo-600">{nivel}</span>
        </div>
        <div className="font-black text-slate-500 uppercase tracking-tighter text-xs">
          Curso: <span className="text-indigo-600">{curso}</span>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingOverlay message="Buscando tus aulas..." />;

  return (
    <div className="p-7 min-h-screen bg-indigo-50 font-sans">
      <h1 className="text-4xl font-black mb-12 text-slate-800 text-center uppercase tracking-tighter">
        Mis Clases 🎒
      </h1>

      <div className="flex justify-center mb-10">
        <Button
          label="Unirse a una clase"
          onClick={() => setShowJoinModal(true)}
          imgSrc={<FaPlus />}
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-4 rounded-2xl shadow-xl font-black text-lg transform hover:scale-105 transition-all flex items-center gap-3"
        />
      </div>

      {allClassrooms.length === 0 && !loading ? (
        <div className="max-w-2xl mx-auto text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-indigo-200">
          <div className="text-6xl mb-6">📭</div>
          <p className="text-xl text-indigo-400 font-bold italic px-10">
            Aún no perteneces a ninguna clase. ¡Pedile el código a tu profesor!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {allClassrooms.map((clase) => (
            <div
              key={clase.id}
              onClick={() => navigate(`/alumno/clases/${clase.id}`)}
              className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden hover:scale-105 transition-all cursor-pointer border-4 border-transparent hover:border-indigo-300 flex flex-col group"
            >
              <div className="h-32 bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                 <span className="text-6xl" role="img" aria-label="libro">📚</span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tight text-center truncate group-hover:text-indigo-600 transition-colors">
                  {clase.name}
                </h2>
                <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100 mt-auto">
                   {formatDescription(clase.description)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight text-center">Unirse al Aula</h2>
            <p className="text-slate-500 text-center mb-8 font-medium italic text-sm">Ingresá el código numérico de tu clase.</p>
            
            <form onSubmit={handleJoinClass} className="space-y-6">
              <input
                type="number"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="000000"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-mono text-3xl text-center tracking-[0.3em] font-black text-indigo-700"
                required
              />
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    clearError();
                  }}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase hover:bg-slate-200 transition-all text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={joining}
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 text-xs"
                >
                  {joining ? "Entrando..." : "¡Unirme!"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(fetchError || joinError) && (
        <Popup 
          message={fetchError || joinError || ""} 
          onClose={() => clearError()} 
        />
      )}
    </div>
  );
};

export default DashboardStudentView;