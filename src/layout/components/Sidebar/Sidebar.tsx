import { useNavigate } from "react-router";
import { useState } from "react";
import { FaHome, FaChalkboardTeacher, FaPlusCircle } from "react-icons/fa";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/layout/Modal"; // importa tu Modal

interface Props {}

function Sidebar() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  //simulo el rol de alumno y profesor, despues cambiarlo cuando se conecte con el back
  const userRole: "professor" | "student" = "professor";

  return (
    <div className="md:flex flex-col w-2/15 h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col gap-2 p-4 mt-2">
        <Button
          label="Home"
          imgSrc={<FaHome className="mr-2" />} // ícono antes del texto
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-start hover:bg-gray-50 text-gray-700 px-4 py-2"
        />
        {userRole === "student" && (
          <Button
            label="Join to Class"
            imgSrc={<FaChalkboardTeacher className="mr-2" />} // ícono antes del texto
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-start hover:bg-gray-50 text-gray-700 px-4 py-2"
          />
        )}

        {userRole === "professor" && (
          <Button
            label="Juegos"
            imgSrc={<FaPlusCircle className="mr-2" />}
            //aqui poner para que se abra la page de juegos
            className="w-full flex items-center justify-start hover:bg-gray-50 text-gray-700 px-4 py-2"
          />
        )}
      </div>

      {/* Modal renderizado dentro del Sidebar */}
      <Modal
        label="Unirme a una Clase"
        content="Ingresa el Codigo de la Clase para unirte."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Sidebar;
