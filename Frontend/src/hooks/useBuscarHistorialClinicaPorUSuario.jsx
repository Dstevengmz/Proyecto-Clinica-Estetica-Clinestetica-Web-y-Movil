import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

 function useVerificacionHistorial(usuario) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const verificarHistorialMedico = async () => {
      if (!usuario || !usuario.id || !token) {
        return false;
      }
      try {
        const response = await axios.get(
          `${API_URL}/apihistorialmedico/buscarhistorialclinicoporusuario/${usuario.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return !!response.data;
      } catch (error) {
        if (error?.response?.status === 404) {
          return false;
        }
        console.error("Error al verificar el historial médico:", error);
        return false;
      }
  };

  const irACita = async () => {
    const tieneHistorial = await verificarHistorialMedico();
    if (tieneHistorial) {
      navigate("/crearcita");
    } else {
      navigate("/crearhistorialclinico");
    }
  };

  return {
    verificarHistorialMedico,
    irACita,
  };
}
export default useVerificacionHistorial;