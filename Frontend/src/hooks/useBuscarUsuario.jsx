import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function useUsuarioPorId(id, token) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !token) return;

    const fetchUsuario = async () => {
      setCargando(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/apiusuarios/buscarusuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsuario(response.data);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        setError("No se pudo cargar el usuario.");
      } finally {
        setCargando(false);
      }
    };

    fetchUsuario();
  }, [id, token]);

  return { usuario, cargando, error };
}

export default useUsuarioPorId;