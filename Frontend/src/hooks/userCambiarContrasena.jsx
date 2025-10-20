import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useCambiarContrasena() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const cambiarContrasena = useCallback(async ({ actual, nueva }) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/apicambiarcontrasena/cambiarcontrasena`,
        { actual, nueva },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData(res.data);
      return res.data;
    } catch (e) {
      e.userMessage = e?.response?.data?.error || "No se pudo cambiar la contraseña";
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cambiarContrasena, loading, error, data };
}
