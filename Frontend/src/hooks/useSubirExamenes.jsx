import { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function useSubirExamenes() {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const token = localStorage.getItem('token');

  const subir = async ({ id_cita, archivos, nombre_examen, observaciones }) => {
    setSubiendo(true); setError(null); setResultado(null);
    try {
      const fd = new FormData();
      if (archivos && archivos.length) {
        [...archivos].forEach(f => fd.append('archivos', f));
      }
      if (nombre_examen) fd.append('nombre_examen', nombre_examen);
      if (observaciones) fd.append('observaciones', observaciones);
      const resp = await axios.post(`${API_URL}/apiexamenes/subir/${id_cita}`, fd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResultado(resp.data);
      return resp.data;
    } catch (e) {
      setError(e.response?.data?.error || 'Error al subir exámenes');
      throw e;
    } finally {
      setSubiendo(false);
    }
  };

  return { subir, subiendo, error, resultado };
}
