import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useRecuperarContrasena() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const solicitarReset = useCallback(async (correo) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const res = await axios.post(
        `${API_URL}/apicambiarcontrasena/olvidocontrasena`,
        { correo }
      );
      setData(res.data);
      return res.data;
    } catch (e) {
      e.userMessage = e?.response?.data?.error || "No se pudo enviar el correo";
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetearContrasena = useCallback(async (token, nueva) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const res = await axios.post(
        `${API_URL}/apicambiarcontrasena/resetearcontrasena/${token}`,
        { nueva }
      );
      setData(res.data);
      return res.data;
    } catch (e) {
      e.userMessage =
        e?.response?.data?.error || "No se pudo restablecer la contraseña";
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { solicitarReset, resetearContrasena, loading, error, data };
}
