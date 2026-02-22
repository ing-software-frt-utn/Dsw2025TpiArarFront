import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import Button from "../../../shared/components/Button";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import Popup from "../../../shared/components/Popup";
import { createClassroom } from "../services/classService";

const ClassCreatorView = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [level, setLevel] = useState("1ro");
  const [division, setDivision] = useState("A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const levels = ["1ro", "2do", "3ro", "4to", "5to", "6to"];
  const divisions = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("El nombre de la clase es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      // Formateamos la descripción como 'Nivel-Division' para el backend
      const descriptionToSend = `${level}-${division}`;
      
      await createClassroom(name, descriptionToSend);
      
      // Navegamos de vuelta al dashboard al terminar con éxito
      navigate("/profesor");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al intentar crear la clase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-indigo-50">
      {loading && <LoadingOverlay message="Creando tu aula..." />}
      
      <div className="max-w-2xl mx-auto mb-6">
        <button 
          onClick={() => navigate("/profesor")}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
        >
          <FaArrowLeft />
          Volver al Dashboard
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-black tracking-tight uppercase">Crear Nueva Clase</h1>
          <p className="text-indigo-100 font-medium mt-2">
            Configura el espacio para tus alumnos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Nombre de la Clase */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
              Nombre de la Clase
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Matemática"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
              required
            />
          </div>

          {/* Selectores de Nivel y División */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                Nivel
              </label>
              <div className="relative">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                División
              </label>
              <div className="relative">
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                >
                  {divisions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              label="Confirmar y Crear Aula"
              type="submit"
              imgSrc={<FaCheck className="text-white" />}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl shadow-xl hover:bg-indigo-700 font-black text-xl transform hover:scale-[1.02] transition-all flex justify-center items-center gap-3"
            />
          </div>
        </form>
      </div>

      {error && <Popup message={error} onClose={() => setError("")} />}
    </div>
  );
};

export default ClassCreatorView;