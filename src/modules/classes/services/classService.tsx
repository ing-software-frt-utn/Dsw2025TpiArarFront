import { instance } from "../../../shared/api/axiosInstance";

const classroomApi = `api/classroom`;

// --- Helper para errores de conexión (Siguiendo tu patrón de auth) ---
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
    console.error("No se recibió respuesta del servidor. Revisa CORS o si el puerto del Backend está abierto.");
    throw new Error("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
  }
  
  throw error;
};

// --- Obtener clases del profesor (REAL) ---
export const getTeacherClassrooms = async () => {
  try {
    const response = await instance.get(`/${classroomApi}/classes`);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "getTeacherClassrooms");
  }
};

// --- Crear aula (Teacher) ---
export const createClassroom = async (name: string, description: string) => {
  try {
    const response = await instance.post(`/${classroomApi}/class`, { name, description });
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "createClassroom");
  }
};

// --- Unirse a aula (Student) ---
export const joinClassroom = async (accessCode: number) => {
  try {
    const response = await instance.post(`/${classroomApi}/join/${accessCode}`);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "joinClassroom");
  }
};

// --- Detalle de aula ---
export const getClassroomById = async (id: string) => {
  try {
    const response = await instance.get(`/${classroomApi}/class/${id}`);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "getClassroomById");
  }
};

// --- Actualizar aula ---
export const updateClassroom = async (id: string, name: string, description: string) => {
  try {
    const response = await instance.put(`/${classroomApi}/class/${id}`, { name, description });
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "updateClassroom");
  }
};

// --- Eliminar aula ---
export const deleteClassroom = async (id: string) => {
  try {
    const response = await instance.delete(`/${classroomApi}/class/${id}`);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "deleteClassroom");
  }
};

// --- Publicar juego en aula ---
export const publishGame = async (classroomId: string, gameData: any) => {
  try {
    const response = await instance.post(`/${classroomApi}/${classroomId}/publish-game`, gameData);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "publishGame");
  }
};

// --- Obtener juegos publicados de un aula ---
export const getPublishedGames = async (classroomId: string) => {
  try {
    const response = await instance.get(`/${classroomApi}/${classroomId}/publish-game`);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "getPublishedGames");
  }
};

// --- Tópicos (Rutas absolutas como definiste en el Controller) ---
export const getTopics = async () => {
  try {
    const response = await instance.get(`/topics`);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "getTopics");
  }
};

export const createTopic = async (topicData: { name: string, description: string }) => {
  try {
    const response = await instance.post(`/topic`, topicData);
    return response.data;
  } catch (error: any) {
    handleConnectionError(error, "createTopic");
  }
};