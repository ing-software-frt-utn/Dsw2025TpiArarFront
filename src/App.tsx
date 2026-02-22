import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import Base from "./layout/BaseLayout/Base";
import ClassDetailView from "./modules/classes/pages/ClassDetail";
import ClassCreatorView from "./modules/classes/pages/classCreatorView"; 
import DashboardStudentView from "./modules/dashboard/pages/StudentDashboard";
import ProfessorDashboard from "./modules/dashboard/pages/ProfessorDashboard"; 
import GameView from "./modules/games/pages/GamePlayer";
import GameHubView from "./modules/games/gameHub/pages/GameHubView";
import GameCreatorView from "./modules/games/gameHub/pages/GameCreatorView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<Base />}>
            <Route path="/alumno" element={<DashboardStudentView />} />
            <Route path="/profesor" element={<ProfessorDashboard />} />
            <Route path="/clases/:id" element={<ClassDetailView />} />
            <Route path="/clases/crear" element={<ClassCreatorView />} />
            <Route path="/juegos" element={<GameHubView />} />
            <Route path="/juegos/nuevo" element={<GameCreatorView />} />
            
            <Route path="/profesor/juegos" element={<Navigate to="/juegos" replace />} />
            <Route path="/profesor/juegos/nuevo" element={<Navigate to="/juegos/nuevo" replace />} />
          </Route>

          <Route path="/jugar/:gameId" element={<GameView />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;