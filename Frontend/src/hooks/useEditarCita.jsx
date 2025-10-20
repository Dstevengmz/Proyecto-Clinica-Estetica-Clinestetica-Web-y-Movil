import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertaCitas from "../assets/js/alertas/citas/AlertaCitas";

const API_URL = import.meta.env.VITE_API_URL;

const useActualizarCita = (id, formulario, hora, token, userRole,requerimientos) => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const actualizarCita = async (e) => {
    e.preventDefault();
    const alertas = new AlertaCitas();

    let url = "";
    let payload = {};

    if (userRole === "usuario") {
      if (!formulario.fecha) {
        await alertas.alertaValidacionFecha();
        return;
      }
      if (!hora) {
        await alertas.alertaValidacionHora();
        return;
      }

      url = `${API_URL}/apicitas/editarcitausuario/${id}`;
      payload = { fecha: `${formulario.fecha}T${hora}:00` };
    }

    if (userRole === "doctor" || userRole === "asistente") {
      if (!formulario.estado) {
        await alertas.alertaValidacionTipo();
        return;
      }

      url = `${API_URL}/apicitas/editarcita-doctor/${id}`;
      payload = {
        estado: formulario.estado,
        observaciones: formulario.observaciones,
        examenes_requeridos: formulario.examenes_requeridos,
        nota_evolucion: formulario.nota_evolucion,
        medicamentos_recetados: formulario.medicamentos_recetados,
        requiere_mas_procedimientos: formulario.requiere_mas_procedimientos,
        descripcion_de_procedimientos: formulario.descripcion_de_procedimientos,
        requerimientos,
      };
    }

    try {
      setCargando(true);
      await axios.patch(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await alertas.alertaCitaActualizada();
      navigate("/consultarcitas");
    } catch (err) {
      console.error("Error al actualizar cita:", err);
      const errorMessage =
        err.response?.data?.message || "No se pudo actualizar la cita";
      setError(errorMessage);
      await alertas.alertaErrorActualizarCita(errorMessage);
    } finally {
      setCargando(false);
    }
  };

  return { actualizarCita, cargando, error };
};

export default useActualizarCita;
