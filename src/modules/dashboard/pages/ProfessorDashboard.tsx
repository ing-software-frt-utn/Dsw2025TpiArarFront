import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUsers, FaGamepad } from "react-icons/fa6";
import Button from "../../../shared/components/Button";
// Importación corregida para cruzar del módulo 'dashboards' al módulo 'classes'
import { getTeacherClassrooms } from "../../classes/services/classService";

const DashboardProfessorView = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        // Llamada al endpoint real: GET api/classroom/classes
        const data = await getTeacherClassrooms();
        setClassrooms(data || []);
      } catch (err) {
        // Captura el mensaje detallado según tu patrón de handleConnectionError
        setError(err.message || "No se pudieron cargar las clases.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-indigo-50 min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-indigo-600 font-bold tracking-tight">Cargando tus clases...</p>
      </div>
    );
  }

  return (
    <div className="p-7 min-h-full bg-indigo-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Mis Clases 📚
      </h1>

      <div className="flex justify-center mb-10">
        <Button
          label="Crear Nueva Clase"
          // Aseguramos que solo dispare la navegación
          onClick={(e) => {
            e.preventDefault();
            navigate("/clases/crear");
          }}
          imgSrc={<FaPlus className="text-white" />}
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-full shadow-lg font-bold text-lg transform hover:scale-105 transition-all"
        />
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 shadow-md rounded-lg">
          <p className="font-bold tracking-tight text-lg">⚠️ Error de conexión</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {classrooms.length === 0 && !error ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-indigo-200">
          <p className="text-xl text-indigo-400 font-medium italic">
            No tenés clases creadas todavía. ¡Empezá creando la primera!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {classrooms.map((clase) => (
            <div
              key={clase.id}
              onClick={() => navigate(`/clases/${clase.id}`)}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-all cursor-pointer border-4 border-transparent hover:border-indigo-300 group"
            >
              {/* Header Visual */}
              <div className="h-32 bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                 <span className="text-6xl" role="img" aria-label="escuela">🏫</span>
              </div>
              
              <div className="p-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-1 truncate group-hover:text-indigo-600 transition-colors text-center">
                  {clase.name}
                </h2>
                
                <p className="text-gray-400 text-xs text-center mb-4 line-clamp-1 italic">
                  {clase.description || "Sin descripción adicional"}
                </p>

                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                  <div className="flex flex-col items-center text-gray-600">
                    <FaUsers className="text-indigo-500 text-lg mb-1" />
                    <span className="text-[10px] uppercase font-black text-slate-400">Alumnos</span>
                    <span className="text-sm font-bold text-slate-700">{clase.studentCount || 0}</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-600">
                    <FaGamepad className="text-indigo-500 text-lg mb-1" />
                    <span className="text-[10px] uppercase font-black text-slate-400">Juegos</span>
                    <span className="text-sm font-bold text-slate-700">{clase.publishedGamesCount || 0}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-50 flex justify-center">
                  <span className="bg-slate-800 text-white text-[11px] px-3 py-1 rounded-lg font-mono font-bold tracking-widest shadow-sm border border-slate-700">
                    CÓDIGO: {clase.accessCode}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardProfessorView;