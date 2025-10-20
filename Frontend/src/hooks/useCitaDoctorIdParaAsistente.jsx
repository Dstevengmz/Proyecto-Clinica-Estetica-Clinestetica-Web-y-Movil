import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useCitasDoctor(doctorId) {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

useEffect(() => {
  if (!doctorId || !token) {
    setCitas([]);
    return;
  }

  const fetchCitas = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await axios.get(
        `${API_URL}/apicitas/listarcitas?doctorId=${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const activas = (res.data || []).filter(
        (cita) => cita.estado !== "cancelada"
      );

      setCitas(activas);
    } catch (err) {
      console.error("Error al cargar citas del doctor:", err);
      setError("Error al cargar citas");
      setCitas([]);
    } finally {
      setCargando(false);
    }
  };

  fetchCitas();
}, [doctorId, token]);


  return { citas, cargando, error };
}

export default useCitasDoctor;
