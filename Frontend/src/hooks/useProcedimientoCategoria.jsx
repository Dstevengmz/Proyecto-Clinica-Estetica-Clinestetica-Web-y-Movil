import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useListaProcedimientos(categoriaId = "") {
  const [procedimientos, setProcedimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProcedimientos = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = categoriaId
          ? `${API_URL}/apiprocedimientos/listarprocedimiento?categoriaId=${categoriaId}`
          : `${API_URL}/apiprocedimientos/listarprocedimiento`;

        const { data } = await axios.get(url);
        setProcedimientos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    cargarProcedimientos();
  }, [categoriaId]);

  return { procedimientos, loading, error };
}
