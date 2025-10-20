import DashboardDoctorPage from "../dashboard/Dashboarddoctor";
import { useAuth } from '../../../contexts/AuthenticaContext';
import { jwtDecode } from 'jwt-decode';
import { useMemo } from 'react';
function PanelDoctorOtro() {
  const { token } = useAuth();

  const { doctorId, rol } = useMemo(() => {
    try {
      const tk = token || localStorage.getItem('token');
      if (!tk) return { doctorId: null, rol: null };
      const payload = jwtDecode(tk);

      const rawId =
        payload.doctorId ||
        payload.idDoctor ||
        payload.id ||
        payload.userId ||
        payload.id_usuario ||
        payload.sub;

      const numId = Number(rawId);

      return {
        doctorId: Number.isNaN(numId) ? null : numId,
        rol: payload.rol || null, 
      };
    } catch (e) {
      console.error('No se pudo decodificar el token:', e);
      return { doctorId: null, rol: null };
    }
  }, [token]);

  if (!doctorId || rol !== 'doctor') {
    return <h2 style={{ color: 'black' }}>No autorizado</h2>;
  }
    return(
        <div>

                <DashboardDoctorPage doctorId={doctorId} />
        </div>
    )

}
export default PanelDoctorOtro;



