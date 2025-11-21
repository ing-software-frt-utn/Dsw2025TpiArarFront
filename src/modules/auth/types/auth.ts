export type AuthAction = "Iniciar Sesión" | "Registrarse";

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
