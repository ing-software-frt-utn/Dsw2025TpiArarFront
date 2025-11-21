export interface RegisterCretendial {
  Username: string;
  Password: string;
  Email: string;
  Nombre: string;
  Apellido: string;
  FechaNacimiento: string;
}
export const register = async (credentials: RegisterCretendial) => {
  try {
    console.log(credentials);
    const credentialsToSend = {
      ...credentials,
      FechaNacimiento: credentials.FechaNacimiento
        ? new Date(credentials.FechaNacimiento).toISOString().split("T")[0]
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

export const login = async (credentials: {
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
