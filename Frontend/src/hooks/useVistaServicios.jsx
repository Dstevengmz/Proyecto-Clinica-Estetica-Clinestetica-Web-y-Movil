import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function useProcedimiento(id) {
  const [procedimiento, setProcedimiento] = useState(null);
  const [imagenActiva, setImagenActiva] = useState("");
  const [tabActiva, setTabActiva] = useState("description");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_URL}/apiprocedimientos/buscarprocedimiento/${id}`)
      .then((res) => {
        const data = res.data;
        setProcedimiento(data);
        const imgs = Array.isArray(data.imagenes) && data.imagenes.length
          ? data.imagenes.map((i) => i.url)
          : [data.imagen].filter(Boolean);
        setImagenActiva(imgs[0] || "");
      })
      .catch((err) => {
        console.error("Error al obtener el procedimiento:", err);
        setError(err);
      });
  }, [id]);

  return {
    procedimiento,
    imagenActiva,
    setImagenActiva,
    tabActiva,
    setTabActiva,
    error,
  };
}
