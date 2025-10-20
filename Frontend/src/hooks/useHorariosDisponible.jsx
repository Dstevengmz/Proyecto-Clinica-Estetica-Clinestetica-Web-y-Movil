import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const useHorariosDisponible = (fecha, tipo, token, doctorId = null) => {
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const obtenerHorarios = async () => {
      if (!fecha || !tipo || !token) {
        setHorariosOcupados([]);
        setCargando(false);
        setError(null);
        return;
      }

      setCargando(true);
      setError(null);

      try {
        const query = doctorId ? `?doctorId=${doctorId}` : '';
        const respuesta = await axios.get(
          `${API_URL}/apicitas/horarios/${fecha}${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHorariosOcupados(respuesta.data || []);
        setError(null);
      } catch (err) {
        console.error("Error al obtener horarios ocupados", err);
        setHorariosOcupados([]);
        setError("Error al obtener los horarios disponibles.");
      } finally {
        setCargando(false);
      }
    };
    
    obtenerHorarios();
  }, [fecha, tipo, token, doctorId]);
  
  return { horariosOcupados, cargando, error };
};

export default useHorariosDisponible;