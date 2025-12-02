import { mockClasses } from "../../../mockData";
import { useNavigate } from "react-router-dom";

const DashboardStudentView = () => {
  const navigate = useNavigate();
  return (
    <div className="p-7 h-full bg-indigo-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Mis Clases 📚
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {mockClasses.map((clase) => (
          <div
            key={clase.id}
            onClick={() => navigate(`/clases/${clase.id}`)}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer border-5 border-transparent hover:border-blue-300"
          >
            <img
              src={clase.imageUrl}
              alt={clase.name}
              className="w-24 h-24 mx-auto mt-4 object-contain"
            />
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800">{clase.name}</h2>
              <p className="text-gray-500 text-lg">{clase.professorName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStudentView;
