import { instance } from "../../../shared/api/axiosInstance";
import { User, UserRegister } from "../types/auth";

const authApi = `api/auth`;

// --- Helper para errores de conexión ---
const handleConnectionError = (error: any, context: string) => {
  console.error(`Error en ${context}:`, error);
  if (error.code === "ERR_NETWORK" || !error.response) {
    console.error(`🚨 NO SE ENCONTRÓ EL SERVIDOR (${context}) 🚨`);
    console.error("👉 Verifique que el Backend (.NET) esté corriendo en el puerto correcto.");
    console.error("👉 Verifique que la URL en el .env del Frontend sea la correcta.");
    throw new Error("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
  }
  throw error;
};

// --- Login Normal (REAL) ---
export const logIn = async (user: User) => {
  try {
    const response = await instance.post(`${authApi}/login`, user);
    return response.data; 
  } catch (error: any) {
    handleConnectionError(error, "login");
  }
};

// --- Registro Normal (REAL) ---
export const signUp = async (user: UserRegister) => {
  try {
    const payloadParaElBackend = {
      Email: user.email,
      Password: user.password,
      Name: user.name,
      Lastname: user.lastName,      
      Dateofbirth: user.birthDate,  
      Username: user.email         
    };
    const response = await instance.post(`api/students/register`, payloadParaElBackend);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "registro");
  }
};

// --- Login con Google (REAL) ---
export const googleLogin = async (idToken: string) => {
  try {
    console.log("Enviando token Google al backend para validación...");
    const response = await instance.post(`${authApi}/google-login`, { 
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
      message: "⚠️ Error Crítico: No se pudo conectar con el servidor. Verifique la conexión.",
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
      message: "⚠️ Error Crítico: No se pudo conectar con el servidor. Verifique la conexión.",
    };
  }
};