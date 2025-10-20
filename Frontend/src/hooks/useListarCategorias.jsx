import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useCategorias({ auto = true } = {}) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cancelRef = useRef(false);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${API_URL}/apicategoriaprocedimientos/listarcategorias`);
      if (!cancelRef.current) setCategorias(Array.isArray(data) ? data : []);
    } catch (e) {
      if (!cancelRef.current) setError(e);
    } finally {
      if (!cancelRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelRef.current = false;
    if (auto) reload();
    return () => {
      cancelRef.current = true;
    };
  }, [auto, reload]);

  return { categorias, loading, error, reload };
}
