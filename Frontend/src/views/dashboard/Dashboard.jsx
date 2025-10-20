import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigate, useNavigate} from 'react-router-dom'
const Dashboard = () => {
  const navigate = useNavigate ();
  return (
    <div>
       <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Panel de Administración</h1>

      <div style={{
       display: 'flex',
       gap: '20px',
       flexWrap: 'wrap',
       justifyContent: 'center'
      }}>

        {/* Cuadro 1 */}
        <div 
          onClick={()=>navigate('/RegistrarHistorialMedico')}
          style={{
          border: '2px solid #031422FF',
          borderRadius: '8px',
          padding: '20px',
          width: '250px',
          textAlign: 'center',
          backgroundColor: '#031422FF',
          cursor: 'pointer'
          
        }}>
          <div style={{ fontSize: '40px' }}>👤</div>
          <h3>Usuarios</h3>
          <p>Administrar usuarios</p>
          
        </div>

        {/* Cuadro 2 */}
        <div 
          onClick={()=>navigate('/Consultarcitas')}
          style={{
          border: '2px solid #031422FF',
          borderRadius: '8px',
          padding: '20px',
          width: '250px',
          textAlign: 'center',
          backgroundColor: '#031422FF',
          cursor: 'pointer'
        }}>
          <div style={{ fontSize: '40px' }}>📅</div>
          <h3>Citas</h3>
          <p>Gestionar agenda</p>
        </div>

        {/* Cuadro 3 */}
        <div 
          onClick={()=>navigate('/ConsultarHistorialMedico')}
          style={{
          border: '2px solid #031422FF',
          borderRadius: '8px',
          padding: '20px',
          width: '250px',
          textAlign: 'center',
          backgroundColor: '#031422FF',
          cursor: 'pointer'
        }}>
          <div style={{ fontSize: '40px' }}>📄</div>
          <h3>Historia Clínica</h3>
          <p>Revisar expedientes</p>
        </div>
      </div>
    </div>
      <Outlet />
    </div>
  )
}

export default Dashboard
