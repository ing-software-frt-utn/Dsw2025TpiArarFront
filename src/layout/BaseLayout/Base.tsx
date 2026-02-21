import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar"; // Verifica que la ruta de importación sea correcta según tu estructura
import Header from "../components/Header/Header";

function Base() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gray-50 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Base;