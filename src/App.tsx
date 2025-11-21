import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Base from "./layout/BaseLayout/Base";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
//<Route path="/dashboard" element={<Dashboard user={user} />} />
export default App;
