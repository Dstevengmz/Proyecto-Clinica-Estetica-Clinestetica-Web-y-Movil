import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useConsentimientos(citaId) {
  const [consentimientos, setConsentimientos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Obtener consentimientos
  const obtener = useCallback(async () => {
    if (!token || !citaId) return;
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/apiconsentimiento/cita/${citaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsentimientos(res.data || []);
    } catch (err) {
      console.error("Error obteniendo consentimientos", err);
      setError(err);
    } finally {
      setCargando(false);
    }
  }, [citaId, token]);

  // Firmar consentimiento
  const firmar = async (texto) => {
    if (!token) return;
    try {
      setCargando(true);
      const res = await axios.post(
        `${API_URL}/apiconsentimiento`,
        { id_cita: citaId, texto_terminos: texto },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConsentimientos((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error("Error al firmar consentimiento", err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  // Descargar PDF
  const descargarPDF = async (idConsentimiento) => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${API_URL}/apiconsentimiento/${idConsentimiento}/pdf`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { url } = res.data || {};
      if (url) window.open(url, "_blank");
    } catch (err) {
      console.error("Error descargando PDF", err);
    }
  };

  useEffect(() => {
    obtener();
  }, [obtener]);

  return { consentimientos, cargando, error, firmar, descargarPDF };
}

export default useConsentimientos;
