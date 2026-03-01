import { useState, useEffect, useCallback } from "react";
import * as classService from "../services/classService";
import { Classroom, Student, PublishedGame, PublishGameRequest } from "../types/classroom.types";

/**
 * Hook para listar las clases del profesor
 */
export const useTeacherClassrooms = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassrooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getTeacherClassrooms();
      setClassrooms(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  return { classrooms, loading, error, refresh: fetchClassrooms };
};

/**
 * Hook para listar las clases donde el estudiante está inscrito
 */
export const useStudentClassrooms = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassrooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getStudentClassrooms();
      setClassrooms(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  return { classrooms, loading, error, refresh: fetchClassrooms };
};

/**
 * Hook para el Profesor: Carga Clase, Juegos y Alumnos.
 * Lanza error si alguna de las 3 peticiones falla (ej. si un alumno intenta usarlo).
 */
export const useClassroomDetail = (id?: string) => {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [games, setGames] = useState<PublishedGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [classData, gamesData, studentsData] = await Promise.all([
        classService.getClassroomById(id),
        classService.getPublishedGames(id),
        classService.getStudentsByClassroom(id),
      ]);

      setClassroom(classData);
      setGames(Array.isArray(gamesData) ? gamesData : gamesData ? [gamesData] : []);
      setStudents(studentsData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { classroom, students, games, loading, error, refresh: fetchDetail };
};

/**
 * NUEVO Hook para el Estudiante:
 * Solo carga lo que el alumno tiene permiso para ver: Datos del Aula y Juegos.
 * Evita el error Forbidden (403) al no solicitar la lista de alumnos.
 */
export const useClassroomDetailStudent = (id?: string) => {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [games, setGames] = useState<PublishedGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Solo realizamos las llamadas que un estudiante puede ejecutar
      const [classData, gamesData] = await Promise.all([
        classService.getClassroomById(id),
        classService.getPublishedGames(id),
      ]);

      setClassroom(classData);
      // Aplicamos la misma normalización que en el hook de profesor
      setGames(Array.isArray(gamesData) ? gamesData : gamesData ? [gamesData] : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { classroom, games, loading, error, refresh: fetchDetail };
};

/**
 * Hook para acciones sobre las clases (Unirse, crear, publicar, borrar)
 */
export const useClassActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (name: string, description: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await classService.createClassroom(name, description);
      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const join = async (code: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await classService.joinClassroom(code);
      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publish = async (classId: string, data: PublishGameRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await classService.publishGame(classId, data);
      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await classService.deleteClassroom(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, join, publish, remove, loading, error, clearError: () => setError(null) };
};

/**
 * Hook para obtener la lista global de estudiantes (Uso administrativo/profesor)
 */
export const useAllStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getAllStudents();
      setStudents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, loading, error, refresh: fetchStudents };
};