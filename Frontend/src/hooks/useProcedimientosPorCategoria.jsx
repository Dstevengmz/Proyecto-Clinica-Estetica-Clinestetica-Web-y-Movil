import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useProcedimientosPorCategoria(categoriaId) {
  const [procedimientos, setProcedimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoriaId) {
      setProcedimientos([]);
      return;
    }
    let cancel = false;
    async function cargar() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(
          `${API_URL}/apiprocedimientos/listarprocedimiento?categoriaId=${categoriaId}`
        );
        if (!cancel) setProcedimientos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancel) setError(e);
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    cargar();
    return () => {
      cancel = true;
    };
  }, [categoriaId]);

  return { procedimientos, loading, error };
}
