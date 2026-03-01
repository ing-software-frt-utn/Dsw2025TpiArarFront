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
      
      const isTeacher = ["Professor", "profesor", "professor", "Teacher", "teacher"].includes(role);
      return isTeacher ? "/profesor" : "/alumno";
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
        setSatisfactorio("¡Ingreso Exitoso!");
        
        const nextRoute = getTargetRoute(tokenRecibido);
        setTimeout(() => {
          navigate(nextRoute); 
        }, 1500);
      } else {
        setError("Error: No se recibió un token válido.");
      }
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas.");
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
        setSatisfactorio(`¡Bienvenido, ${userName}!`);

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

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-transparent font-sans">
      {isLoading && <LoadingOverlay message="Verificando credenciales..." />}
      {satisfactorio && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-white/60 backdrop-blur-md">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-violet-100 flex flex-col items-center">
            <div className="text-7xl mb-4">✅</div>
            <p className="text-2xl font-black text-gray-800 uppercase tracking-tight text-center">
              {satisfactorio}
            </p>
            <p className="text-violet-500 font-bold text-xs mt-2 uppercase tracking-widest opacity-60">Redirigiendo...</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl w-full max-w-sm border border-gray-100 flex flex-col relative my-auto">
        <div className="flex flex-col items-center mb-6">
          <img className="h-14 w-auto mb-2 drop-shadow-sm" src={logo} alt="Logo" />
          <h1 className="text-3xl font-black text-gray-800 tracking-tight text-center uppercase">
            Bienvenido
          </h1>
          <div className="h-1 w-10 bg-violet-500 rounded-full mt-1"></div>
        </div>
        
        <Form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <TextField
              className="w-full px-5 py-3 border-2 border-gray-50 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-medium"
              type="email"
              id="email"
              label="Email"
              placeholder="tu@email.com"
              disabled={isLoading || !!satisfactorio}
              {...register("email", { required: true })}
            />
            <TextField
              className="w-full px-5 py-3 border-2 border-gray-50 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-medium"
              type="password"
              id="password"
              label="Contraseña"
              placeholder="********"
              disabled={isLoading || !!satisfactorio}
              {...register("password", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-3 mt-1">
            <button
              disabled={isLoading || !!satisfactorio}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-bold rounded-[1.25rem] shadow-xl shadow-violet-200 transition-all active:scale-[0.98] text-lg uppercase"
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
        </Form>
      </div>

      <div className="fixed bottom-6 right-6 z-9999">
        {error && <Popup message={error} onClose={() => setError("")} />}
      </div>
    </div>
  );
}

export default LoginTemplate;