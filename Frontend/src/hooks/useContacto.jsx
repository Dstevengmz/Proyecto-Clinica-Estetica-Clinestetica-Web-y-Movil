import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useEnviarContacto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const enviarContacto = useCallback(async ({ nombre, email, asunto, mensaje }) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      if (!nombre || !email || !mensaje) {
        const err = new Error("Nombre, correo y mensaje son obligatorios");
        err.status = 400;
        throw err;
      }

      const res = await axios.post(
        `${API_URL}/apicontacto/contacto`,
        { nombre, email, asunto, mensaje },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setData(res.data);
      return res.data;
    } catch (e) {
      e.userMessage = e?.response?.data?.error || "No se pudo enviar el mensaje";
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { enviarContacto, loading, error, data };
}
