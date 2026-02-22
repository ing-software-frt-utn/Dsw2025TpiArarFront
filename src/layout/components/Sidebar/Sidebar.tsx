import { useNavigate } from "react-router-dom";
import { FaHome, FaGamepad, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import Button from "../../../shared/components/Button";

function Sidebar() {
  const navigate = useNavigate();

  const getRoleFromToken = (): "professor" | "student" => {
    const token = localStorage.getItem("token");
    if (!token) return "student";

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      
      const role = 
        decoded.role || 
        decoded.Role || 
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      return (
        role === "Professor" || 
        role === "profesor" || 
        role === "professor" || 
        role === "Teacher" || 
        role === "teacher"
      ) ? "professor" : "student";
    } catch (error) {
      return "student";
    }
  };

  const userRole = getRoleFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleHome = () => {
    if (userRole === "professor") navigate("/profesor");
    else navigate("/alumno");
  };

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300">
      
      <div className="flex flex-col gap-2 p-4 mt-4">
        
        <Button
          label="Home"
          imgSrc={<FaHome className="mr-3 text-lg" />}
          onClick={handleHome}
          className="w-full flex items-center justify-start hover:bg-violet-50 hover:text-violet-600 text-gray-700 font-medium px-4 py-3 rounded-lg transition-colors"
        />

        <Button
          label="Juegos"
          imgSrc={<FaGamepad className="mr-3 text-lg" />}
          onClick={() => navigate("/juegos")} 
          className="w-full flex items-center justify-start hover:bg-violet-50 hover:text-violet-600 text-gray-700 font-medium px-4 py-3 rounded-lg transition-colors"
        />

        <Button
          label="Estadísticas"
          imgSrc={<FaChartBar className="mr-3 text-lg" />}
          onClick={() => navigate("/estadisticas")}
          className="w-full flex items-center justify-start hover:bg-violet-50 hover:text-violet-600 text-gray-700 font-medium px-4 py-3 rounded-lg transition-colors"
        />
      </div>

      <div className="flex-1"></div>

      <div className="p-4 mb-2 border-t border-gray-100">
        <Button
          label="Cerrar Sesión"
          imgSrc={<FaSignOutAlt className="mr-3 text-lg" />}
          onClick={handleLogout}
          className="w-full flex items-center justify-start bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-3 rounded-lg transition-colors"
        />
      </div>
    </div>
  );
}

export default Sidebar;