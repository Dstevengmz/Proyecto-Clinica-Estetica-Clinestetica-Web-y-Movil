import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useOrdenesEvaluacionRealizada(usuarioId, token) {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    const fuente = axios.CancelToken.source();

    async function cargar() {
      if (!usuarioId || !token) return;
      setCargando(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${API_URL}/apiordenes/elegibles/${usuarioId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cancelToken: fuente.token,
          }
        );
        if (!cancelado) setOrdenes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (axios.isCancel(e)) return;
        console.error("Error cargando órdenes elegibles:", e);
        if (!cancelado) setError(e?.response?.data?.error || "Error al cargar órdenes");
      } finally {
        if (!cancelado) setCargando(false);
      }
    }
    cargar();

    return () => {
      cancelado = true;
      fuente.cancel();
    };
  }, [usuarioId, token]);

  return { ordenes, cargando, error };
}
