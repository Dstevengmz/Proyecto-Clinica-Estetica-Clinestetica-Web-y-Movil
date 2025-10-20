import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function useCambiarEstadoUsuario() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const cambiarEstado = async (id,estado) => {
    if (!token) {
      setError("No hay token de autenticación");
      return null;
    }

    setCargando(true);
    setError(null);

    try {
      const response = await axios.patch(
        `${API_URL}/apiusuarios/editarestadousuario/${id}`,
        { estado }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Estado del usuario cambiado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al cambiar el estado del usuario", error);
      setError(error.response?.data?.message || "Error al cambiar el estado");
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { cambiarEstado, cargando, error };
}
export default useCambiarEstadoUsuario;
