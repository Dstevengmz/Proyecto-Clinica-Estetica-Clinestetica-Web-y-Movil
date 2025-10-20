import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useMisCitas() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchMisCitas = useCallback(async () => {
    if (!token) {
      setCitas([]);
      setCargando(false);
      setError("No autenticado");
      return;
    }
    try {
      setCargando(true);
      setError(null);
      const resp = await axios.get(`${API_URL}/apicitas/miscitas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitas(resp.data || []);
    } catch (e) {
      console.error("Error al obtener mis citas", e);
      setError(e.response?.data?.error || "No hay Citas registradas");
      setCitas([]);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMisCitas();
  }, [fetchMisCitas]);

  return { citas, cargando, error, refrescar: fetchMisCitas };
}

export default useMisCitas;
