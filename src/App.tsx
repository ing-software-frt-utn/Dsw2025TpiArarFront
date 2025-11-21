//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import LoginView from "./views/LoginView";
//import RegisterView from "./views/RegisterView";
//import Dashboard from "./views/Dashboard";
import Base from "./layout/BaseLayout/Base";
import LoginSignUpView from "./views/LoginSignUpView";

function App() {
  return (
    <div>
      <Base></Base>
    </div>

    /* <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="*" element={<LoginView />} />
      </Routes>
    </Router> */
  );
}

export default App;
