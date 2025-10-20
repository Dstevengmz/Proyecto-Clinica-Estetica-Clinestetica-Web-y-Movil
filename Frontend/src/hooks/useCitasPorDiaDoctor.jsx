// src/hooks/useCitasPorDiaDoctor.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useCitasPorDiaDoctor = (fecha) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (fecha && token) {
      const fetchCitas = async () => {
        try {
          setLoading(true);
          // Usar el endpoint que ya funciona con el doctor autenticado
          const response = await axios.get(`${API_URL}/apicitas/listarcitas`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Filtrar las citas por la fecha específica en el frontend
          const fechaSeleccionada = new Date(fecha + 'T00:00:00');
          const citasFiltradas = response.data.filter(cita => {
            const fechaCita = new Date(cita.fecha);
            return fechaCita.toDateString() === fechaSeleccionada.toDateString();
          });
          
          setCitas(citasFiltradas);
          setError(null);
        } catch (err) {
          console.error('Error al obtener citas por día:', err);
          setError(err.response?.data?.message || err.message);
          setCitas([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCitas();
    } else if (!fecha) {
      setLoading(false);
      setCitas([]);
    }
  }, [fecha, token]);

  return { citas, loading, error };
};

export default useCitasPorDiaDoctor;
