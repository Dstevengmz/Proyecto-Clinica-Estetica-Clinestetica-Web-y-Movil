import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useHistorialCompletoPaciente from "../../../hooks/useTodoHistorialUsuarioCompleto";

function HistorialPaciente({ idUsuario }) {
  const { historial, obtenerHistorialCompleto, cargando, error } =
    useHistorialCompletoPaciente();
  const params = useParams();
  const [fecha, setFecha] = useState("");
  const [usuarioIdInput, setUsuarioIdInput] = useState(idUsuario || params.id || params.idUsuario || "");

  useEffect(() => {
    const paramId = params.id || params.idUsuario || idUsuario;
    if (paramId) {
      setUsuarioIdInput(paramId);
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      const fechaHoy = `${yyyy}-${mm}-${dd}`;
      if (!fecha) setFecha(fechaHoy);
      obtenerHistorialCompleto(paramId, fechaHoy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, params.idUsuario, idUsuario]);

  const handleBuscar = () => {
    const targetId = usuarioIdInput || idUsuario;
    if (!targetId) return alert("Ingresa o selecciona el ID del usuario");
    if (!fecha) return alert("Selecciona una fecha");
    obtenerHistorialCompleto(targetId, fecha);
  };

  return (
    <div className="container">
      <h2>Historial médico del paciente</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">ID del usuario</label>
          <input
            type="text"
            className="form-control"
            value={usuarioIdInput}
            onChange={(e) => setUsuarioIdInput(e.target.value)}
            placeholder="Pega o escribe el ID del usuario"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha límite</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="col-md-2 align-self-end">
          <button className="btn btn-primary" onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </div>

      {cargando && <p>Cargando historial...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!cargando && historial.length === 0 && (
        <div className="alert alert-info">No se encontraron registros hasta la fecha indicada.</div>
      )}

      {!cargando && historial.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Doctor</th>
                <th>Procedimientos</th>
                <th>Notas / Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((cita) => (
                <tr key={cita.id || `${cita.fecha}-${Math.random()}`}>
                  <td>{cita.fecha ? new Date(cita.fecha).toLocaleString("es-CO") : "—"}</td>
                  <td>{cita.tipo || "—"}</td>
                  <td>{cita.doctor?.nombre || "—"}</td>
                  <td>
                    {cita.orden?.procedimientos && cita.orden.procedimientos.length > 0
                      ? cita.orden.procedimientos.map((p) => p.nombre).join(", ")
                      : "—"}
                  </td>
                  <td>{cita.observaciones || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistorialPaciente;
