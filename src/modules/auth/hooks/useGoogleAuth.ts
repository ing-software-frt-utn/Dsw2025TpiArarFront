import { useState } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { googleLogin } from '../services/authService'; // Importamos el servicio

interface UseGoogleAuthReturn {
  handleGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
  error: string | null;
  successMessage: string | null;
  loading: boolean;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const idToken = credentialResponse.credential;

    if (!idToken) {
      setError("Error: Google no retornó firma.");
      setLoading(false);
      return;
    }

    try {
      // Delegamos la lógica sucia al servicio (authService)
      const data = await googleLogin(idToken);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setSuccessMessage("Login con Google exitoso");
      } else {
        throw new Error("No se recibió token de sesión.");
      }

    } catch (err: any) {
      console.error(err);
      // Si el servicio falla (reject), capturamos el error aquí
      const mensaje = err.message || "Error al iniciar sesión con Google.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return { handleGoogleSuccess, error, successMessage, loading };
};