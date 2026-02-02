import { mockClasses } from "../../../mockData";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { FaPlus } from "react-icons/fa6";

const DashboardProfessorView = () => {
  const navigate = useNavigate();
  return (
    <div className="p-7 h-full bg-indigo-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Mis Clases 📚
      </h1>

      <div className="flex justify-center mb-10">
        <Button
          label="Crear Nueva Clase"
          imgSrc={<FaPlus className="text-white" />}
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-full shadow-lg font-bold text-lg transform hover:scale-105 transition-all"
        />
      </div>

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardProfessorView;
