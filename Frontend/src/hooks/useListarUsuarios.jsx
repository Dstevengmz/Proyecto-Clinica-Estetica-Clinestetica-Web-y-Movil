import { useState, useEffect, useCallback } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function useListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const obtenerUsuarios = useCallback(async () => {
    if (!token) {
      setUsuarios([]);
      setCargando(false);
      setError("No autenticado");
      return;
    }
    try {
      setCargando(true);
      setError(null);
      const resp = await axios.get(`${API_URL}/apiusuarios/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(resp.data || []);
    } catch (e) {
      console.error("Error listando usuarios:", e);
      setError("No se pudieron cargar los usuarios");
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    obtenerUsuarios();
  }, [obtenerUsuarios]);

  return { usuarios, cargando, error, refrescar: obtenerUsuarios };
}

export default useListarUsuarios;
