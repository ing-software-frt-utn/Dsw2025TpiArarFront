//lee el id de la URL usando useParams para saber que clase mostrar

import { useParams, useNavigate } from "react-router-dom";
import { mockClasses } from "../../../mockData";

const ClassDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classSelected = mockClasses.find((clase) => clase.id === Number(id)); //porque useParams devuelve string y el id es un num

  if (!classSelected) {
    <div className="p-10 text-center">
      <h2 className="text-2xl text-red-500">Clase no encontrada 😕</h2>
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver al inicio
      </button>
    </div>;
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        <img
          src={classSelected?.imageUrl}
          alt={classSelected?.name}
          className="w-20 h-20 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            {classSelected?.name}
          </h1>
          <p className="text-gray-500 text-xl">
            Profesor: {classSelected?.professorName}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Juegos Disponibles 🎮
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classSelected?.games.map((juego) => (
          <div
            key={juego.id}
            className="border-2 border-blue-100 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer bg-blue-50"
            onClick={() => navigate(`/jugar/${juego.id}`)}
          >
            <img
              src={juego.imageUrl}
              alt={juego.title}
              className="w-full h-32 object-contain mb-3"
            />
            <h3 className="text-xl font-bold text-blue-800 text-center">
              {juego.title}
            </h3>
            <p className="text-gray-600 text-center mt-2 text-sm">
              {juego.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassDetailView;
