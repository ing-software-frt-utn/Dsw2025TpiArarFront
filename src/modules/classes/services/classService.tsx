import { instance } from "../../../shared/api/axiosInstance";
import { Classroom, PublishGameRequest, Topic, Student } from "../types/classroom.types";

const classroomApi = `api/classroom`;
const studentApi = `api/students`;

function handleConnectionError(error: any, context: string): never {
  if (error.response) {
    const serverData = error.response.data;
    const detailedMessage = 
      serverData?.detail || 
      serverData?.message || 
      serverData?.title ||
      (serverData?.errors ? JSON.stringify(serverData.errors) : null);
    if (detailedMessage) throw new Error(detailedMessage);
  } else if (error.request) {
    throw new Error("No se pudo conectar con el servidor.");
  }
  throw error;
}

function normalizeList<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.$values && Array.isArray(data.$values)) return data.$values;
  return [];
}

export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await instance.get(`/${studentApi}`);
    return normalizeList<Student>(response.data);
  } catch (error: any) {
    return handleConnectionError(error, "getAllStudents");
  }
};

export const getStudentClassrooms = async (): Promise<Classroom[]> => {
  try {
    const response = await instance.get(`/${studentApi}/classes`);
    return normalizeList<Classroom>(response.data);
  } catch (error: any) {
    return handleConnectionError(error, "getStudentClassrooms");
  }
};

export const getTeacherClassrooms = async (): Promise<Classroom[]> => {
  try {
    const response = await instance.get(`/${classroomApi}/classes`);
    return normalizeList<Classroom>(response.data);
  } catch (error: any) {
    return handleConnectionError(error, "getTeacherClassrooms");
  }
};

export const createClassroom = async (name: string, description: string): Promise<Classroom> => {
  try {
    const response = await instance.post(`/${classroomApi}/class`, { name, description });
    return response.data;
  } catch (error: any) {
    return handleConnectionError(error, "createClassroom");
  }
};

export const joinClassroom = async (accessCode: number): Promise<any> => {
  try {
    const response = await instance.post(`/${classroomApi}/join/${accessCode}`);
    return response.data;
  } catch (error: any) {
    return handleConnectionError(error, "joinClassroom");
  }
};

export const getClassroomById = async (id: string): Promise<Classroom> => {
  try {
    const response = await instance.get(`/${classroomApi}/class/${id}`);
    return response.data;
  } catch (error: any) {
    return handleConnectionError(error, "getClassroomById");
  }
};

export const getStudentsByClassroom = async (id: string): Promise<Student[]> => {
  try {
    const response = await instance.get(`/${classroomApi}/${id}/students`);
    return normalizeList<Student>(response.data);
  } catch (error: any) {
    if (error.response?.status === 404) return [];
    return handleConnectionError(error, "getStudentsByClassroom");
  }
};

export const updateClassroom = async (id: string, name: string, description: string): Promise<any> => {
  try {
    const response = await instance.put(`/${classroomApi}/class/${id}`, { name, description });
    return response.data;
  } catch (error: any) {
    return handleConnectionError(error, "updateClassroom");
  }
};

export const deleteClassroom = async (id: string): Promise<any> => {
  try {
    const response = await instance.delete(`/${classroomApi}/class/${id}`);
    return response.data;
  } catch (error: any) {
    return handleConnectionError(error, "deleteClassroom");
  }
};

export const publishGame = async (classroomId: string, gameData: PublishGameRequest): Promise<any> => {
  try {
    const response = await instance.post(`/${classroomApi}/${classroomId}/publish-game`, gameData);
    return response.data;
  } catch (error: any) {
    return handleConnectionError(error, "publishGame");
  }
};

export const getPublishedGames = async (classroomId: string): Promise<any[]> => {
  try {
    const response = await instance.get(`/${classroomApi}/${classroomId}/publish-game`);
    return normalizeList<any>(response.data);
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.status === 204) return [];
    return handleConnectionError(error, "getPublishedGames");
  }
};

export const getTopics = async (): Promise<Topic[]> => {
  try {
    const response = await instance.get(`/topics`);
    return normalizeList<Topic>(response.data);
  } catch (error: any) {
    return handleConnectionError(error, "getTopics");
  }
};

export const createTopic = async (topicData: { name: string, description: string }): Promise<Topic> => {
  try {
    const response = await instance.post(`/topic`, topicData);
    return response.data;
  } catch (error: any) {
    return handleConnectionError(error, "createTopic");
  }
};