import { instance } from "../../shared/api/axiosInstance";
import { User, UserRegister, Data, Error } from "../types/auth";
const authApi = `api/auth`;
export const logIn = async (user: User) => {
  return instance
    .post(`${authApi}/login`, user)
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      console.error("Error en inicio de sesión:", error);
      return Promise.reject(error);
    });
};
export const signUp = async (user: UserRegister) => {
  return await instance
    .post(`${authApi}/register`, user)
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      console.error("Error en registro:", error);
      return Promise.reject(error);
    });
};
export const _register = async (credentials: {
  readonly username: string;
  readonly password: string;
  readonly mail: string;
  readonly nombre: string;
  readonly apellido: string;
  readonly fechaNacimiento: string;
}): Promise<any> => {
  try {
    console.log(credentials);
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

    // Retornar el cuerpo aunque haya error
    return {
      ok: response.ok,
      status: response.status,
      ...data,
    };
  } catch (error) {
    console.error("Error en registro:", error);
    return {
      ok: false,
      message: "No se pudo conectar con el servidor",
    };
  }
};

export const _login = async (credentials: {
  Email: string;
  Password: string;
}) => {
  try {
    const response = await fetch(`api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Convertimos la respuesta en JSON
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      ...data,
    };
  } catch (error) {
    console.error("Error en login:", error);
    return {
      ok: false,
      message: "No se pudo conectar con el servidor",
    };
  }
};
