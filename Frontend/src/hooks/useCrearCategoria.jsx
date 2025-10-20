import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function useCrearCategoria() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const normalizeNombre = (nombre) =>
    (typeof nombre === "string"
      ? nombre
          .trim()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase()
      : "");

  const crearCategoria = useCallback(async ({ nombre, descripcion, estado }) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const nombreNorm = normalizeNombre(nombre);
      if (!nombreNorm) {
        const err = new Error("El nombre de la categoría es requerido");
        err.status = 400;
        throw err;
      }
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/apicategoriaprocedimientos/crearcategoria`,
        { nombre, descripcion, estado },
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
      if (e?.response?.status === 409) {
        e.userMessage = "Ya existe una categoría con ese nombre";
      } else if (e?.response?.status === 400 || e?.status === 400) {
        e.userMessage = "El nombre de la categoría es requerido";
      } else {
        e.userMessage = "No se pudo crear la categoría";
      }
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { crearCategoria, loading, error, data };
}
