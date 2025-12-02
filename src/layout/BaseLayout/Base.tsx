import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

function Base() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-1.5">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default Base;
