import { useState, useEffect, useCallback } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

 function useListarUsuario() {
  const [usuario, setUsuario] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem("token");

  const obtenerListaUsuarios = useCallback(async () => {
    if (!token) {
      setUsuario([]); 
      setCargando(false);
      return;
    }
    try {
      setCargando(true);
      const response = await axios.get(`${API_URL}/apiusuarios/listarusuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Respuesta de la API:", response);
      if (response.data && response.data) {
        setUsuario(response.data);
      } else {
        setUsuario([]); 
      }
    } catch (error) {
      console.error("Error al obtener la lista de los usuarios", error);
      setUsuario([]); 
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    obtenerListaUsuarios();
  }, [obtenerListaUsuarios]);

  return { usuario, cargando, refrescarLista: obtenerListaUsuarios };
}
export default useListarUsuario;