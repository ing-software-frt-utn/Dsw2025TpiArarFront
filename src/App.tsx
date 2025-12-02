import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import Base from "./layout/BaseLayout/Base";
import ClassDetailView from "./views/ClassDetailView";
import DashboardStudentView from "./views/DashboardStudentView";

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

          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
