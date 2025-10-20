import { useState, useEffect, useCallback } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function useListarDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const obtenerDoctores = useCallback(async () => {
    if (!token) {
      setDoctores([]);
      setCargando(false);
      setError("No autenticado");
      return;
    }
    try {
      setCargando(true);
      setError(null);
      const resp = await axios.get(`${API_URL}/apiusuarios/doctores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctores(resp.data || []);
    } catch (e) {
      console.error("Error listando doctores:", e);
      setError("No se pudieron cargar los doctores");
      setDoctores([]);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    obtenerDoctores();
  }, [obtenerDoctores]);

  return { doctores, cargando, error, refrescar: obtenerDoctores };
}

export default useListarDoctores;
