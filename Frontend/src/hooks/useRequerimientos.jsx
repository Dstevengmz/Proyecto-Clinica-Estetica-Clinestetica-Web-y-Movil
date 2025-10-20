import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
  function useRequerimientos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const crearRequerimiento = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const resp = await axios.post(
        `${import.meta.env.API_URL}/apicitas/requerimientos`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return resp.data;
    } catch (e) {
      console.error("Error en crearRequerimiento:", e);
      setError(e.response?.data?.error || "Error al crear requerimiento");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { crearRequerimiento, loading, error };
}
export default useRequerimientos;