import { useState, useEffect, useCallback } from "react";
import {
  crearConsentimiento,
  obtenerConsentimientosPorUsuario,
  descargarConsentimientoPDF,
} from "../services/consentimientoService";
import { useAuth } from "../contexts/AuthenticaContext";

 function useConsentimientos() {
  const { token, user } = useAuth();
  const [consentimientos, setConsentimientos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Listar consentimientos por usuario
  const fetchConsentimientos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await obtenerConsentimientosPorUsuario(token);
      setConsentimientos(res.data);
    } catch (error) {
      console.error("Error al listar consentimientos:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Crear consentimiento
  const firmarConsentimiento = async (id_cita, texto_terminos) => {
    try {
      const res = await crearConsentimiento(token, { id_cita, texto_terminos });
      // actualizar lista
      fetchConsentimientos();
      return res.data;
    } catch (error) {
      console.error("Error al firmar consentimiento:", error);
      throw error;
    }
  };

  // Descargar PDF
  const descargarPDF = async (id) => {
    try {
      const res = await descargarConsentimientoPDF(token, id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `consentimiento_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al descargar PDF:", error);
    }
  };

  useEffect(() => {
    if (user?.rol === "doctor" || user?.rol === "asistente" || user?.rol === "usuario") {
      fetchConsentimientos();
    }
  }, [fetchConsentimientos, user]);

  return {
    consentimientos,
    loading,
    firmarConsentimiento,
    descargarPDF,
    fetchConsentimientos,
  };
}
export default useConsentimientos;