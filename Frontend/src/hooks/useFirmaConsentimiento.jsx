import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useFirmarConsentimiento(token) {
  const firmar = async (id_cita, texto_terminos) => {
    const tk = token || localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/apiconsentimiento`,
      { id_cita, texto_terminos },
      { headers: { Authorization: `Bearer ${tk}` } }
    );
    return res.data;
  };

  return { firmar };
}

export default useFirmarConsentimiento;
