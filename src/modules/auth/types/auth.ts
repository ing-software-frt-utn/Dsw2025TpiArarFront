export type AuthAction = "Iniciar Sesión" | "Registrarse";
export interface Data<Ok, Err> {
  data?: Ok;
  error?: Err;
}
export interface Error {
  message: string;
  code: string;
}
export interface User {
  email: string;
  password: string;
}
export interface UserRegister {
  password: string;
  email: string;
  name: string;
  lastName: string;
  birthDate: string;
}
//tipos para los datos de usuarios
export interface UserCredentials {
  Email: string;
  Password: string;
  Nombre: string;
  Apellido: string;
  FechaNacimiento: string;
  Username: string;
}

//tipo para el estado de errores de la contraseña
export interface PasswordError {
  message: string;
  isValid: boolean;
}
