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
  username: string;
  password: string;
  email: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
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
