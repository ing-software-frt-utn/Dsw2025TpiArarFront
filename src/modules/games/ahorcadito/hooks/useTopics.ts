import { useCallback, useEffect, useRef, useState } from "react";
import { instance } from "../../../../shared/api/axiosInstance";

export interface Topic {
  id: string;
  name: string;
  description: string;
}

function normalizeList<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.$values)) return data.$values;
  return [];
}

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // evita doble-fetch en StrictMode
  const didFetchRef = useRef(false);

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await instance.get("api/classroom/topics");
      const list = normalizeList<any>(response.data);
      setTopics(
        list.map((t) => ({
          id: String(t.id ?? t.Id),
          name: String(t.name ?? t.Name),
          description: String(t.description ?? t.Description ?? ""),
        }))
      );
    } catch (err: any) {
      setError(err?.response?.data?.title || err?.message || "Error al traer tópicos");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTopic = useCallback(async (name: string, description: string = "") => {
    try {
      const response = await instance.post("api/classroom/topic", { name, description });
      const t = response.data;
      const newTopic: Topic = {
        id: String(t.id ?? t.Id),
        name: String(t.name ?? t.Name),
        description: String(t.description ?? t.Description ?? ""),
      };
      setTopics((prev) => [...prev, newTopic]);
      return newTopic;
    } catch (err: any) {
      throw new Error(err?.response?.data?.title || err?.response?.data?.message || "No se pudo crear el tópico");
    }
  }, []);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchTopics();
  }, [fetchTopics]);

  return { topics, loading, error, fetchTopics, createTopic };
};