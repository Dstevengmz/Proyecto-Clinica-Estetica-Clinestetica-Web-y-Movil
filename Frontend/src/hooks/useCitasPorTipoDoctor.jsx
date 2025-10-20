// src/hooks/useCitasPorTipoDoctor.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useCitasPorTipoDoctor = (tipo, fecha) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (tipo && fecha && token) {
      const fetchCitas = async () => {
        try {
          setLoading(true);
          // Usar el endpoint que ya funciona con el doctor autenticado
          const response = await axios.get(`${API_URL}/apicitas/listarcitas`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Filtrar las citas por tipo y fecha específica en el frontend
          const fechaSeleccionada = new Date(fecha + 'T00:00:00');
          const citasFiltradas = response.data.filter(cita => {
            const fechaCita = new Date(cita.fecha);
            const mismoDia = fechaCita.toDateString() === fechaSeleccionada.toDateString();
            const mismoTipo = cita.tipo && cita.tipo.toLowerCase() === tipo.toLowerCase();
            return mismoDia && mismoTipo;
          });
          
          setCitas(citasFiltradas);
          setError(null);
        } catch (err) {
          console.error('Error al obtener citas por tipo:', err);
          setError(err.response?.data?.message || err.message);
          setCitas([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCitas();
    } else if (!tipo || !fecha) {
      setLoading(false);
      setCitas([]);
    }
  }, [tipo, fecha, token]);

  return { citas, loading, error };
};

export default useCitasPorTipoDoctor;
