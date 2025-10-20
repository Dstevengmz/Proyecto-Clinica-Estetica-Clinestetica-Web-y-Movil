import axios from "axios";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function useEnviarHistorialPDF() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const enviarHistorialPDF = async (idUsuario, fechaSeleccionada) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${API_URL}/apicitas/historialcompletopdf/${idUsuario}/${fechaSeleccionada}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje(data.mensaje || "Historial enviado correctamente");
    } catch (e) {
      console.error("Error al enviar PDF:", e);
      setError("Error al enviar el historial al correo");
    } finally {
      setCargando(false);
    }
  };

  return { enviarHistorialPDF, cargando, error, mensaje };
}

export default useEnviarHistorialPDF;
