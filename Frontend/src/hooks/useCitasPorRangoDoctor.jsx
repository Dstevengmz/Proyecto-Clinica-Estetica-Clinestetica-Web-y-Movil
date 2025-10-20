// src/hooks/useCitasPorRangoDoctor.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useCitasPorRangoDoctor = (desde, hasta) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (desde && hasta && token) {
      const fetchCitas = async () => {
        try {
          setLoading(true);
          // Usar el endpoint que ya funciona con el doctor autenticado
          const response = await axios.get(`${API_URL}/apicitas/listarcitas`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Filtrar las citas por el rango de fechas en el frontend
          const fechaDesde = new Date(desde + 'T00:00:00');
          const fechaHasta = new Date(hasta + 'T23:59:59');
          
          const citasFiltradas = response.data.filter(cita => {
            const fechaCita = new Date(cita.fecha);
            return fechaCita >= fechaDesde && fechaCita <= fechaHasta;
          });
          
          setCitas(citasFiltradas);
          setError(null);
        } catch (err) {
          console.error('Error al obtener citas por rango:', err);
          setError(err.response?.data?.message || err.message);
          setCitas([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCitas();
    } else if (!desde || !hasta) {
      setLoading(false);
      setCitas([]);
    }
  }, [desde, hasta, token]);

  return { citas, loading, error };
};

export default useCitasPorRangoDoctor;
