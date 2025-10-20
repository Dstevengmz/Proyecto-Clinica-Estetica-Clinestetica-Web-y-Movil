import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useReagendarCita() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [cita, setCita] = useState(null);

  const token = localStorage.getItem("token");

  const reagendarCita = async (id, fecha, hora) => {
    if (!token) throw new Error("Falta token de autenticación");

    try {
      setCargando(true);
      setError(null);

      const fechaHora = `${fecha}T${hora}:00`;

      const response = await axios.patch(
        `${API_URL}/apicitas/reagendarcita/${id}`,
        { fecha: fechaHora },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;
      setCita(data?.cita ?? data);
      return data;
    } catch (err) {
      console.error("Error al reagendar cita:", err);
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { cita, cargando, error, reagendarCita };
}

export default useReagendarCita;
