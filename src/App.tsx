import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import Base from "./layout/BaseLayout/Base";
import ClassDetailView from "./modules/classes/pages/ClassDetail";
import DashboardStudentView from "./modules/dashboard/pages/StudentDashboard";
import DashboardProfessorView from "./modules/dashboard/pages/ProfessorDashboard";
import GameView from "./modules/games/pages/GamePlayer";
import Ahorcadito from "./modules/games/ahorcadito/pages/Ahorcadito";
import GameHubView from "./modules/games/gameHub/pages/GameHubView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<Base />}>
            <Route path="/alumno" element={<DashboardStudentView />} />
            <Route path="/profesor" element={<DashboardProfessorView />} />
            <Route path="/clases/:id" element={<ClassDetailView />} />
            <Route path="/profesor/gameHub" element={<GameHubView />} />
          </Route>
          <Route path="/juego/ahorcadito" element={<Ahorcadito />} />
          <Route path="/jugar/:gameId" element={<GameView />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;