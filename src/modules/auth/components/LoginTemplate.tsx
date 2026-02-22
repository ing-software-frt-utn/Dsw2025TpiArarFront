import { useState } from "react";
import logo from "../../../assets/images/plataformarar.png";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../../../shared/components/Popup";
import Form from "../../../shared/components/Form";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import "./LoginTemplate.css";
import { useForm } from "react-hook-form";
import { User } from "../types/auth";
import TextField from "../../../shared/components/TextField";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { googleLogin, logIn } from "../services/authService";

function LoginTemplate() {
  const [error, setError] = useState<string>("");
  const [satisfactorio, setSatisfactorio] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit } = useForm<User>({
    defaultValues: { email: "", password: "" },
  });

  const getTargetRoute = (token: string) => {
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
      const role = decoded.role || decoded.Role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      
      if (
        role === "Professor" || 
        role === "profesor" || 
        role === "professor" || 
        role === "Teacher" || 
        role === "teacher"
      ) {
        return "/profesor";
      }
      return "/alumno";
    } catch (e) {
      return "/alumno";
    }
  };

  const onSubmit = async (user: User) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await logIn(user);
      const tokenRecibido = response?.token || response?.Token;
      
      if (tokenRecibido) {
        localStorage.setItem("token", tokenRecibido); 
        setSatisfactorio("Inicio de sesión exitoso");
        
        const nextRoute = getTargetRoute(tokenRecibido);
        setTimeout(() => {
          navigate(nextRoute); 
        }, 1500);
      } else {
        setError("Error: No se recibió un token válido.");
      }
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas o error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) { setError("Error token Google."); return; }

    setIsLoading(true);
    setError("");
    try {
      const response = await googleLogin(idToken);
      const token = response?.token || response?.Token;

      if (token) {
        localStorage.setItem("token", token);
        const userName = response.user?.name || "Usuario"; 
        setSatisfactorio(`¡Bienvenido ${userName}!`);

        const nextRoute = getTargetRoute(token);
        setTimeout(() => {
            navigate(nextRoute); 
        }, 1500);

      } else {
        setError("Error en inicio de sesión con Google.");
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión con Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockLogin = () => {
    setIsLoading(true);
    localStorage.setItem("token", "fake-token-desarrollo-12345");
    setSatisfactorio("Inicio de sesión simulado (Modo Desarrollo)");
    setTimeout(() => {
      setIsLoading(false);
      navigate("/profesor");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-transparent">
      {isLoading && <LoadingOverlay message="Verificando credenciales..." />}
      
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl w-full max-w-sm border border-gray-100 flex flex-col relative my-auto">
        <div className="flex flex-col items-center mb-6">
          <img className="h-14 w-auto mb-2 drop-shadow-sm" src={logo} alt="Logo" />
          <h1 className="text-3xl font-black text-gray-800 tracking-tight text-center">
            Bienvenido
          </h1>
          <div className="h-1 w-10 bg-violet-500 rounded-full mt-1"></div>
        </div>
        
        <Form
          className="flex flex-col gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-3">
            <TextField
              className="w-full px-5 py-3 border-2 border-gray-50 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-medium"
              type="email"
              id="email"
              label="Email"
              placeholder="tu@email.com"
              disabled={isLoading}
              {...register("email", { required: true })}
            />
            <TextField
              className="w-full px-5 py-3 border-2 border-gray-50 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-medium"
              type="password"
              id="password"
              label="Contraseña"
              placeholder="********"
              disabled={isLoading}
              {...register("password", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-3 mt-1">
            <button
              disabled={isLoading}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-bold rounded-[1.25rem] shadow-xl shadow-violet-200 transition-all active:scale-[0.98] text-lg"
              type="submit"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
            <Link to="/register" className="w-full text-center">
              <span className="text-gray-400 text-xs font-medium">¿No tienes cuenta? </span>
              <span className="text-violet-600 text-xs font-black hover:underline">Regístrate</span>
            </Link>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest text-gray-300">
              <span className="px-4 bg-white">O usa tus redes</span>
            </div>
          </div>
          
          <div className="w-full flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Falló Google Login")}
                theme="outline"
                shape="pill"
                text="continue_with"
                width="100%"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleMockLogin}
              className="text-[9px] bg-gray-50 text-gray-400 hover:bg-gray-100 py-1.5 px-6 rounded-full transition-colors font-black border border-gray-100 uppercase tracking-widest disabled:opacity-50"
            >
              🧪 Developer Mock Login
            </button>
          </div>
        </Form>
      </div>

      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        {error && <Popup message={error} onClose={() => setError("")} />}
        {satisfactorio && (
          <Popup message={satisfactorio} onClose={() => setSatisfactorio("")} />
        )}
      </div>
    </div>
  );
}

export default LoginTemplate;