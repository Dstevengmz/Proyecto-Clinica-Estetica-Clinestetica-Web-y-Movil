import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Sencillo caché en memoria por sesión (stale-while-revalidate)
const cache = new Map(); // id -> { data, timestamp }
const API_URL = import.meta.env.VITE_API_URL;
const MAX_AGE = 1000 * 60 * 2; 
 function useCitaPorId(id, { initialData } = {}) {
    
  const [cita, setCita] = useState(() => {
    if (initialData && initialData.id === Number(id)) {
      cache.set(String(id), { data: initialData, timestamp: Date.now() });
      return initialData;
    }
    const cached = cache.get(String(id));
    return cached?.data || null;
  });
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetch = async (opts = { force: false }) => {
    if (!id) return;
    const token = localStorage.getItem("token");
    try {
      setError(null);
      // Si hay datos en cache y no es force, solo revalidar en background
      if (!opts.force && cache.has(String(id))) {
        setActualizando(true);
      } else {
        setActualizando(true);
      }
      abortRef.current?.abort?.();
      const controller = new AbortController();
      abortRef.current = controller;

      const resp = await axios.get(`${API_URL}/apicitas/buscarcitas/${id}` , {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      const data = resp.data;
      cache.set(String(id), { data, timestamp: Date.now() });
      setCita(data);
    } catch (e) {
      if (!axios.isCancel(e)) {
        setError(e.response?.data?.error || e.message || "Error al cargar cita");
      }
    } finally {
      setActualizando(false);
    }
  };

  useEffect(() => {
    // Si no hay nada en cache, cargar; si hay, revalidar en background
    const cached = cache.get(String(id));
    if (cached && Date.now() - cached.timestamp < MAX_AGE) {
      setCita(cached.data);
      fetch({ force: false });
    } else {
      fetch({ force: true });
    }
    return () => abortRef.current?.abort?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { cita, setCita, actualizando, error, refrescar: () => fetch({ force: true }) };
}
export default useCitaPorId;