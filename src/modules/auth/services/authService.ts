import { instance } from "../../../shared/api/axiosInstance";
import { User, UserRegister } from "../types/auth";

const authApi = `api/auth`;

const handleConnectionError = (error: any, context: string) => {
  console.error(`--- DEBUG ERROR EN ${context.toUpperCase()} ---`);
  
  if (error.response) {
    const serverData = error.response.data;
    console.error("Status:", error.response.status);
    console.error("Data del servidor:", serverData);
    const detailedMessage = 
      serverData?.detail || 
      serverData?.message || 
      serverData?.title ||
      (serverData?.errors ? JSON.stringify(serverData.errors) : null);

    if (detailedMessage) {
      throw new Error(detailedMessage);
    }
  } else if (error.request) {
    console.error("No se recibió respuesta del servidor. Revisa CORS o si el puerto 5073 está abierto.");
    throw new Error("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
  } else {
    console.error("Error de configuración:", error.message);
  }

  throw error;
};

export const logIn = async (user: User) => {
  try {
    const response = await instance.post(`/${authApi}/login`, user);
    return response.data; 
  } catch (error: any) {
    handleConnectionError(error, "login");
  }
};

export const signUp = async (user: UserRegister) => {
  try {
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
