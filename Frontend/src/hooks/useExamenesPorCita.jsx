import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function useExamenesPorCita(id_cita) {
  const [examenes, setExamenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    if (!id_cita) return;
    try {
      setCargando(true);
      const resp = await axios.get(`${API_URL}/apiexamenes/cita/${id_cita}` ,{
        headers: { Authorization: `Bearer ${token}` }
      });
      setExamenes(resp.data || []);
    } catch (e) {
      setError(e.response?.data?.error || 'Error al cargar exámenes');
    } finally {
      setCargando(false);
    }
  }, [id_cita, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { examenes, cargando, error, refrescar: fetchData };
}
