import { instance } from "../../../shared/api/axiosInstance";
import { User, UserRegister } from "../types/auth";

const authApi = `api/auth`;

// --- Helper para errores de conexión y depuración detallada ---
const handleConnectionError = (error: any, context: string) => {
  console.error(`--- DEBUG ERROR EN ${context.toUpperCase()} ---`);
  
  if (error.response) {
    // El servidor respondió con un código fuera del rango 2xx
    const serverData = error.response.data;
    console.error("Status:", error.response.status);
    console.error("Data del servidor:", serverData);

    // Extraemos el mensaje más detallado posible
    // .NET suele enviar errores en 'detail', 'title' o un objeto 'errors'
    const detailedMessage = 
      serverData?.detail || 
      serverData?.message || 
      serverData?.title ||
      (serverData?.errors ? JSON.stringify(serverData.errors) : null);

    if (detailedMessage) {
      throw new Error(detailedMessage);
    }
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta (CORS o Servidor caído)
    console.error("No se recibió respuesta del servidor. Revisa CORS o si el puerto 5073 está abierto.");
    throw new Error("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
  } else {
    // Error al configurar la petición
    console.error("Error de configuración:", error.message);
  }

  throw error;
};

// --- Login Normal (REAL) ---
export const logIn = async (user: User) => {
  try {
    const response = await instance.post(`/${authApi}/login`, user);
    return response.data; 
  } catch (error: any) {
    handleConnectionError(error, "login");
  }
};

// --- Registro de Estudiante (REAL) ---
export const signUp = async (user: UserRegister) => {
  try {
    // Aseguramos que los nombres de las propiedades coincidan exactamente con lo que espera el DTO de .NET
    const payloadParaElBackend = {
      email: user.email,
      password: user.password,
      name: user.name,
      lastname: user.lastName,      
      dateofbirth: user.birthDate,  
      username: user.email         
    };
    
    console.log("Enviando Payload de Registro:", payloadParaElBackend);
    
    const response = await instance.post(`/api/students/register`, payloadParaElBackend);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "registro");
  }
};

// --- Login con Google (REAL) ---
export const googleLogin = async (idToken: string) => {
  try {
    const response = await instance.post(`/${authApi}/google-login`, { 
      idToken: idToken 
    });
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "Google Login");
  }
};

// ==========================================
// --- Funciones Legacy (Fetch tradicional) ---
// ==========================================

export const _register = async (credentials: any): Promise<any> => {
  try {
    const credentialsToSend = {
      ...credentials,
      FechaNacimiento: credentials.fechaNacimiento
        ? new Date(credentials.fechaNacimiento).toISOString().split("T")[0]
        : "",
    };
    
    const response = await fetch(`api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentialsToSend),
    });

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      ...data,
    };
  } catch (error) {
    console.error("Error en registro legacy:", error);
    return {
      ok: false,
      message: "⚠️ Error Crítico: No se pudo conectar con el servidor.",
    };
  }
};

export const _login = async (credentials: { Email: string; Password: string; }) => {
  try {
    const response = await fetch(`api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      ...data,
    };
  } catch (error) {
    console.error("Error en login legacy:", error);
    return {
      ok: false,
      message: "⚠️ Error Crítico: No se pudo conectar con el servidor.",
    };
  }
};