import { instance } from "../../../shared/api/axiosInstance";
import { User, UserRegister } from "../types/auth";
const authApi = `api/auth`;
/*export const logIn = async (user: User) => {
  return instance
    .post(`${authApi}/login`, user)
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      console.error("Error en inicio de sesión:", error);
      return Promise.reject(error);
    });
};*/

//simulo login sin back
export const logIn = async (user: User) => {
  // Simulo una respuesta exitosa del servidor
  // Devuelvo un objeto con un token inventado for me
  return Promise.resolve({
    token: "keren-la-mejor",
    user: {
      email: user.email,
      name: "KEREN THE BEST",
    },
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
