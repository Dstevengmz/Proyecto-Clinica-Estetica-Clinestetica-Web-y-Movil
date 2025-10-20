import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function useDescargarConsentimiento(token) {
  const descargar = async (idConsentimiento) => {
    const tk = token || localStorage.getItem("token");
    const res = await axios.get(
      `${API_URL}/apiconsentimiento/${idConsentimiento}/pdf`,
      {
        headers: { Authorization: `Bearer ${tk}` },
      }
    );
    const { url } = res.data || {};
    if (url) {
      window.open(url, "_blank");
    }
  };

  return { descargar };
}

export default useDescargarConsentimiento;
