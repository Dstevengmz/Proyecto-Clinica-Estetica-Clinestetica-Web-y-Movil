import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNotificationsUsuario } from '../../../contexts/NotificationUsuarioContext';
import { useNavigate } from 'react-router-dom';

const FiltroTabs = ({ filtro, setFiltro }) => (
  <div className="btn-group mb-3" role="group" aria-label="Filtro historial">
    <button className={`btn btn-${filtro==='todas'?'primary':'outline-primary'}`} onClick={() => setFiltro('todas')}>Todas</button>
    <button className={`btn btn-${filtro==='activa'?'primary':'outline-primary'}`} onClick={() => setFiltro('activa')}>Activas</button>
    <button className={`btn btn-${filtro==='archivada'?'primary':'outline-primary'}`} onClick={() => setFiltro('archivada')}>Archivadas</button>
  </div>
);

function HistorialNotificacionesUsuario() {
  const { loadNotificationHistory, markAllAsRead, clearNotifications } = useNotificationsUsuario();
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const navigate = useNavigate();

  const cargar = useCallback(async () => {
    setCargando(true);
    const data = await loadNotificationHistory();
    setHistorial(Array.isArray(data) ? data : []);
    setCargando(false);
  }, [loadNotificationHistory]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const listaFiltrada = useMemo(() => {
    if (filtro === 'todas') return historial;
    return historial.filter(n => n.estado === filtro);
  }, [historial, filtro]);

  const fechaLocal = (iso) => {
    try { return new Date(iso).toLocaleString('es-CO'); } catch { return String(iso || ''); }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">Historial de notificaciones</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={cargar} disabled={cargando}>
            {cargando ? 'Cargando…' : 'Recargar'}
          </button>
          <button className="btn btn-outline-primary" onClick={async()=>{ await markAllAsRead(); await cargar(); }}>
            Marcar todas como leídas
          </button>
          <button className="btn btn-outline-danger" onClick={async()=>{ await clearNotifications(); await cargar(); }}>
            Archivar leídas
          </button>
        </div>
      </div>

      <FiltroTabs filtro={filtro} setFiltro={setFiltro} />

      <div className="card">
        <div className="card-body p-0">
          {cargando ? (
            <div className="p-4">Cargando notificaciones…</div>
          ) : listaFiltrada.length === 0 ? (
            <div className="p-4 text-muted">No hay notificaciones para mostrar.</div>
          ) : (
            <ul className="list-group list-group-flush">
              {listaFiltrada.map((n, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold d-flex align-items-center gap-2">
                      <span>{n.tipo === 'confirmacion_cita' ? 'Confirmación de cita' : (n.tipo || 'Notificación')}</span>
                      <span className={`badge ${n.leida ? 'bg-secondary' : 'bg-success'}`}>{n.leida ? 'Leída' : 'Nueva'}</span>
                      <span className={`badge ${n.estado === 'archivada' ? 'bg-dark' : 'bg-info text-dark'}`}>{n.estado}</span>
                    </div>
                    <div className="text-break">{n.mensaje}</div>
                    <small className="text-muted">{fechaLocal(n.fecha)}</small>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {n.citaId && (
                      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/citas/${n.citaId}`)}>
                        Ver cita
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistorialNotificacionesUsuario;
