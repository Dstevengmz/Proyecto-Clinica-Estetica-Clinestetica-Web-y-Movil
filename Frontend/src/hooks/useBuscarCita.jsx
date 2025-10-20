import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function useCitaPorId(id, token) {
  const [cita, setCita] = useState(null);
  const [hora, setHora] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !token) return;

    const fetchCita = async () => {
      setCargando(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/apicitas/buscarcitas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const citaData = response.data;
        const [fecha, horaStr] = citaData.fecha.split(" ");
        setCita({ ...citaData, fecha });
        setHora(horaStr.slice(0, 5));
      } catch (err) {
        console.error("Error al cargar cita:", err);
        setError("No se pudo cargar la cita.");
      } finally {
        setCargando(false);
      }
    };

    fetchCita();
  }, [id, token]);

  return { cita, hora, cargando, error };
}

export default useCitaPorId;
