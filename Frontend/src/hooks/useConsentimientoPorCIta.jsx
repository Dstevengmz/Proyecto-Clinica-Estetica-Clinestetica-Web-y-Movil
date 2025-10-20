import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useConsentimientosPorCita(idCita, token) {
  const [consentimientos, setConsentimientos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const tk = token || localStorage.getItem("token");
  if (!idCita || !tk) return;

    const fetchConsentimientos = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_URL}/apiconsentimiento/cita/${idCita}`,
          {
            headers: { Authorization: `Bearer ${tk}` },
          }
        );
        setConsentimientos(res.data || []);
      } catch (err) {
        console.error("Error al obtener consentimientos:", err);
        setError(err);
      } finally {
        setCargando(false); // 👈 MUY IMPORTANTE
      }
    };

    fetchConsentimientos();
  }, [idCita, token]);

  return { consentimientos, cargando, error };
}

export default useConsentimientosPorCita;
