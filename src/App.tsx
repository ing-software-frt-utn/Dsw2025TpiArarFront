import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import Base from "./layout/BaseLayout/Base";
import ClassDetailView from "./modules/classes/pages/ClassDetail";
import DashboardStudentView from "./modules/dashboard/pages/StudentDashboard";
import GameView from "./modules/games/pages/GamePlayer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<LoginPage />} />
          {/* Rutas protegidas */}
          <Route element={<Base />}>
            <Route path="/" element={<DashboardStudentView />} />
            <Route path="/clases/:id" element={<ClassDetailView />} />
          </Route>
          <Route path="/jugar/:gameId" element={<GameView />} /> //está
          apropósito así para que no tenga sidebar ni header
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
