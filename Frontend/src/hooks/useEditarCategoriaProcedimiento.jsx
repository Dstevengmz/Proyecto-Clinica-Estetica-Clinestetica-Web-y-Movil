import { useState, useEffect, useCallback } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function useEditarCategoriaProcedimiento(id) {
  const [categoria, setCategoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(false);
  const token = localStorage.getItem("token");

  const obtenerCategoria = useCallback(async () => {
    if (!token || !id) {
      setCategoria(null);
      setCargando(false);
      return;
    }
    try {
      setCargando(true);
      const [catRes, perfilRes] = await Promise.all([
        axios.get(`${API_URL}/apicategoriaprocedimientos/buscarcategoria/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/apiusuarios/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const usuario = perfilRes?.data?.usuario || null;
      setCategoria({ ...(catRes?.data || null), usuario });
    } catch (err) {
      console.error("Error al obtener la categoría", err);
      setError(err);
      setCategoria(null);
    } finally {
      setCargando(false);
    }
  }, [id, token]);

  const editarCategoria = async (datosActualizados) => {
    if (!token || !id) return;
    try {
      setActualizando(true);
      const response = await axios.patch(
        `${API_URL}/apicategoriaprocedimientos/editarcategoria/${id}`,
        datosActualizados,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategoria((prev) => ({
        ...(prev || {}),
        ...(response.data || {}),
        usuario: prev?.usuario ?? null,
      }));
      return response.data;
    } catch (err) {
      console.error("Error al editar la categoría", err);
      throw err;
    } finally {
      setActualizando(false);
    }
  };

  useEffect(() => {
    obtenerCategoria();
  }, [obtenerCategoria]);

  return { categoria, cargando, actualizando, error, obtenerCategoria, editarCategoria };
}

export default useEditarCategoriaProcedimiento;