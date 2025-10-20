import { useState, useEffect, useCallback } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function useListarCitas() {
    const [citas, setCitas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const token = localStorage.getItem("token");
    const obtenerListaCitas = useCallback(async () => {
    if (!token) {
      setCitas([]); 
      setCargando(false);
      return;
    }
    try {
      setCargando(true);
      const response = await axios.get(`${API_URL}/apicitas/listarcitas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Respuesta de la API:", response);
      if (response.data && response.data) {
        setCitas(response.data);
      } else {
        setCitas([]); 
      }
    } catch (error) {
      console.error("Error al obtener la lista de los usuarios", error);
      setCitas([]); 
    } finally {
      setCargando(false);
    }
  }, [token]);
  useEffect(() => {
      obtenerListaCitas();
    }, [obtenerListaCitas]);
    return { citas, cargando, refrescarLista: obtenerListaCitas };
}
export default useListarCitas;