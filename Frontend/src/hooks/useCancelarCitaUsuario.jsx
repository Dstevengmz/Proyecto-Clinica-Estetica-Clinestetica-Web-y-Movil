// hooks/useCancelarCita.js
import { useState } from "react";
import axios from "axios";
import AlertaCitas from "../assets/js/alertas/citas/AlertaCitas";

const API_URL = import.meta.env.VITE_API_URL;

const useCancelarCita = (token) => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cancelarCita = async (id) => {
    const alertas = new AlertaCitas();
    const confirm = await alertas.confirmarCancelarCita();
    if (!confirm.isConfirmed) return;

    try {
      setCargando(true);
      await axios.patch(
        `${API_URL}/apicitas/cancelarcita/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await alertas.alertaCitaCancelada();
      return true;
    } catch (err) {
      console.error("Error al cancelar cita:", err);
      const errorMessage =
        err.response?.data?.error || "No se pudo cancelar la cita";
      setError(errorMessage);
      await alertas.alertaErrorCancelarCita(errorMessage);
      return false;
    } finally {
      setCargando(false);
    }
  };

  return { cancelarCita, cargando, error };
};

export default useCancelarCita;
