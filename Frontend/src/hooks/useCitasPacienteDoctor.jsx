import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useCitasPacienteDoctor(usuarioId) {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    if (!usuarioId || !token) return;
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/apicitas/citasusuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitas(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Error al listar citas del paciente:", err);
      setError("No se pudieron cargar las citas");
    } finally {
      setCargando(false);
    }
  }, [usuarioId, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { citas, cargando, error, reload: fetchData };
}

export default useCitasPacienteDoctor;
