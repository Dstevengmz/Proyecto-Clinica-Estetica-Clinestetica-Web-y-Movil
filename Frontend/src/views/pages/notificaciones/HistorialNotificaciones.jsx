import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButton,
  CFormInput,
  CForm
} from '@coreui/react';
import { useNotifications } from '../../../contexts/NotificationContext';

const HistorialNotificaciones = () => {
  const location = useLocation();
  const { loadNotificationHistory } = useNotifications();
  const [historial, setHistorial] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setLoading(true);
        // Si viene del state (navegación desde NotificationBell)
        if (location.state?.historial) {
          setHistorial(location.state.historial);
        } else {
          // Cargar directamente
          const data = await loadNotificationHistory();
          setHistorial(data);
        }
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [location.state, loadNotificationHistory]);

  const historialFiltrado = historial.filter(notif => 
    !filtroTexto || 
    notif.mensaje?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    notif.paciente?.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (notificacion) => {
    if (notificacion.estado === 'archivada') {
      return <CBadge color="secondary">Archivada</CBadge>;
    }
    if (notificacion.leida) {
      return <CBadge color="success">Leída</CBadge>;
    }
    return <CBadge color="primary">Nueva</CBadge>;
  };

  if (loading) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <i className="bi bi-bell me-2"></i>
              Historial de Notificaciones
            </h4>
            <CBadge color="info">
              {historial.length} total
            </CBadge>
          </CCardHeader>
          <CCardBody>
            {/* Buscador */}
            <CForm className="mb-3">
              <CFormInput
                type="search"
                placeholder="Buscar en notificaciones..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </CForm>

            {/* Estadísticas */}
            <div className="mb-3 d-flex gap-3">
              <CBadge color="primary">
                Nuevas: {historial.filter(n => !n.leida && n.estado !== 'archivada').length}
              </CBadge>
              <CBadge color="success">
                Leídas: {historial.filter(n => n.leida && n.estado !== 'archivada').length}
              </CBadge>
              <CBadge color="secondary">
                Archivadas: {historial.filter(n => n.estado === 'archivada').length}
              </CBadge>
            </div>

            {/* Tabla */}
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Mensaje</CTableHeaderCell>
                  <CTableHeaderCell>Paciente</CTableHeaderCell>
                  <CTableHeaderCell>Tipo</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {historialFiltrado.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center text-muted py-4">
                      {filtroTexto ? (
                        <>
                          <i className="bi bi-search me-2"></i>
                          No se encontraron notificaciones que coincidan con "{filtroTexto}"
                        </>
                      ) : (
                        <>
                          <i className="bi bi-bell-slash me-2"></i>
                          No hay notificaciones en el historial
                        </>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  historialFiltrado.map((notificacion, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <small>{formatDate(notificacion.fecha)}</small>
                        {notificacion.fechaArchivado && (
                          <div>
                            <small className="text-muted">
                              Archivada: {formatDate(notificacion.fechaArchivado)}
                            </small>
                          </div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-semibold">
                          {notificacion.mensaje}
                        </div>
                        {notificacion.fechaCita && (
                          <small className="text-muted">
                            Cita: {formatDate(notificacion.fechaCita)}
                          </small>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {notificacion.paciente || '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">
                          {notificacion.tipo || 'Notificación'}
                        </CBadge>
                        {notificacion.tipoCita && (
                          <div>
                            <CBadge color="dark" className="mt-1">
                              {notificacion.tipoCita}
                            </CBadge>
                          </div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getEstadoBadge(notificacion)}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default HistorialNotificaciones;
