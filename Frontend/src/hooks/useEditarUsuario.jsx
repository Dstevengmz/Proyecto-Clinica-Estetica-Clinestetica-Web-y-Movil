import { useState, useEffect, useCallback } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function useEditarUsuario(id) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const obtenerUsuario = useCallback(async () => {
    if (!token || !id) {
      setError(new Error("Falta token o id de usuario"));
      setUsuario(null);
      setCargando(false);
      return;
    }
    try {
      setCargando(true);
      setError(null);
      const response = await axios.get(
        `${API_URL}/apiusuarios/buscarusuarios/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response?.data;
      const usuarioData = data?.usuario ?? data;
      setUsuario(usuarioData);
    } catch (err) {
      console.error("Error al obtener el usuario", err);
      setError(err);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, [id, token]);

  const editarUsuario = async (datosActualizados) => {
    if (!token || !id) {
      throw new Error("Falta token o id de usuario");
    }
    try {
      setCargando(true);
      setError(null);
      const response = await axios.patch(
        `${API_URL}/apiusuarios/editarusuarios/${id}`,
        datosActualizados,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      const usuarioActualizado = data?.usuario ?? data ?? datosActualizados;
      setUsuario(usuarioActualizado);
      return usuarioActualizado;
    } catch (err) {
      console.error("Error al editar el usuario", err);
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuario();
  }, [obtenerUsuario]);

  return { usuario, cargando, error, obtenerUsuario, editarUsuario };
}

export default useEditarUsuario;
