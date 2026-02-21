import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import logo from "../../../assets/images/plataformarar.png";
import { Link, useNavigate } from "react-router-dom"; // 1. Importamos useNavigate
import Popup from "../../../shared/components/Popup";
import Form from "../../../shared/components/Form";
import "./LoginTemplate.css";
import { useForm } from "react-hook-form";
import { User } from "../types/auth";
import TextField from "../../../shared/components/TextField";

// Importamos Google
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
// Modificado: Traemos logIn directamente del servicio
import { googleLogin, logIn } from "../services/authService";

function LoginTemplate() {
  // Eliminamos el const { logIn } = useAuth(); para que el error no se silencie
  const [error, setError] = useState<string>("");
  const [satisfactorio, setSatisfactorio] = useState<string>("");
  
  // 2. Inicializamos el hook de navegación
  const navigate = useNavigate();
  
  const { register, handleSubmit } = useForm<User>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (user: User) => {
    try {
      // Llamamos directo al servicio que sí dispara el throw error correctamente
      const response = await logIn(user);
      
      // Atrapamos el token sin importar si C# lo manda en mayúscula o minúscula
      const tokenRecibido = response?.token || response?.Token;
      
      // Verificamos de forma segura si la respuesta trajo el token
      if (tokenRecibido) {
        // ¡CRUCIAL! Faltaba guardar el token en el login normal
        localStorage.setItem("token", tokenRecibido); 
        
        setSatisfactorio("Inicio de sesión exitoso");
        
        // 3. Redirección automática tras login normal hacia /profesor
        setTimeout(() => {
          navigate("/profesor"); 
        }, 1500);
      } else {
        // Si el backend devolvió un 200 pero sin token (raro, pero seguro)
        setError("Error: Credenciales inválidas.");
      }
    } catch (err: any) {
      // Ahora SÍ va a caer en este catch cuando el backend mande el 401
      const backendMessage = err?.response?.data?.title || err?.response?.data?.detail || "Credenciales inválidas o error de conexión.";
      setError(backendMessage);
    }
  };

  // Handler de Google
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) { setError("Error token Google."); return; }

    try {
      const response = await googleLogin(idToken);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        // Si el backend manda el usuario, lo usamos, si no, un genérico
        const userName = response.user?.name || "Usuario"; 
        setSatisfactorio(`¡Bienvenido ${userName}!`);

        // 4. Redirección automática tras login con Google hacia /profesor
        setTimeout(() => {
            navigate("/profesor"); 
        }, 1500);

      } else {
        setError("Error en inicio de sesión.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error de conexión.");
    }
  };

  // --- BOTÓN TEMPORAL MOCK ---
  const handleMockLogin = () => {
    localStorage.setItem("token", "fake-token-desarrollo-12345");
    setSatisfactorio("Inicio de sesión simulado (Modo Desarrollo)");
    setTimeout(() => {
      navigate("/profesor");
    }, 1500);
  };

  return (
    <div className="bg-gray-100 rounded-2xl p-6 md:p-8 shadow-lg w-full max-w-sm mx-auto mt-10">
      <div className="flex flex-col items-center mb-6">
        <img className="h-16 w-auto mb-2" src={logo} alt="Logo" />
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Bienvenido
        </h1>
        <div className="h-1 w-12 bg-violet-500 rounded mt-1"></div>
      </div>
      
      <Form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-3">
          <TextField
            className="text-field-auth w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200"
            type="email"
            id="email"
            label="Email"
            placeholder="username@email.com"
            {...register("email", { required: true })}
          />
          <TextField
            className="text-field-auth w-full px-4 py-3 border border-gray-300 rounded bg-gray-50 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200"
            type="password"
            id="password"
            label="Contraseña"
            placeholder="********"
            {...register("password", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-3 mt-2 w-full">
          <button
            className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded shadow-md transition duration-200 ease-in-out transform hover:scale-[1.02]"
            type="submit"
          >
            Iniciar Sesión
          </button>
          
          <Link to="/register" className="w-full">
            <button
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-md transition duration-200 ease-in-out transform hover:scale-[1.02]"
              type="button"
            >
              Registrarse
            </button>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-4 w-full mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase">O ingresa con</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <div className="w-full flex justify-center">
              {/* Le quitamos la propiedad locale="es" */}
              <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Falló Google Login")}
                  theme="outline"
                  shape="pill"
                  text="continue_with"
                  width="250"
              />
            </div>
        </div>

        {/* BOTON MOCK TEMPORAL */}
        <div className="w-full flex justify-center mt-2">
          <button
            type="button"
            onClick={handleMockLogin}
            className="text-xs bg-gray-200 text-gray-600 hover:bg-gray-300 py-1.5 px-4 rounded-full transition-colors font-medium border border-gray-300 shadow-sm"
          >
            🧪 Login de Prueba (Mock)
          </button>
        </div>

      </Form>

      <div className="mt-4">
        {error && <Popup message={error} onClose={() => setError("")} />}
        {satisfactorio && (
          <Popup message={satisfactorio} onClose={() => setSatisfactorio("")} />
        )}
      </div>
    </div>
  );
}

export default LoginTemplate;