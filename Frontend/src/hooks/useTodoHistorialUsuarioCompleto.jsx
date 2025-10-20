import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useHistorialCompletoPaciente() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);

  const obtenerHistorialCompleto = async (idUsuario, fechaSeleccionada) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación");
      return null;
    }

    setCargando(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${API_URL}/apicitas/historialcompleto/${idUsuario}/${fechaSeleccionada}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHistorial(data);
      return data;
    } catch (e) {
      console.error("Error al obtener historial completo:", e);
      const msg =
        e.response?.data?.error ||
        e.response?.data?.mensaje ||
        "Error al obtener el historial médico";
      setError(msg);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { historial, obtenerHistorialCompleto, cargando, error };
}

export default useHistorialCompletoPaciente;
