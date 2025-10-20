import React, { useState } from "react";
import useListarUsuarios from "../../../hooks/useListarUsuarios";
import useHistorialCompletoPaciente from "../../../hooks/useTodoHistorialUsuarioCompleto";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from "@coreui/react";
import useEnviarHistorialPDF from "../../../hooks/useEnviarHistorialPdfCompleto";

function SeleccionarUsuarioHistorial() {
  const { usuarios, cargando, error } = useListarUsuarios();
  const {
    historial,
    obtenerHistorialCompleto,
    cargando: cargandoHist,
    error: errorHist,
  } = useHistorialCompletoPaciente();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [fecha, setFecha] = useState("");
  const {
    enviarHistorialPDF,
    cargando: cargandoPDF,
    error: errorPDF,
    mensaje,
  } = useEnviarHistorialPDF();

  const seleccionar = (u) => {
    setUsuarioSeleccionado(u);
    // por defecto, dejar la fecha vacía para que el asistente elija o usar hoy
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    setFecha(fechaHoy);
    // cargar historial hasta hoy automáticamente
    obtenerHistorialCompleto(u.id || u.usuarioId || u._id, fechaHoy);
  };

  const handleBuscar = () => {
    if (!usuarioSeleccionado) return alert("Selecciona un usuario primero");
    if (!fecha) return alert("Selecciona una fecha");
    obtenerHistorialCompleto(
      usuarioSeleccionado.id ||
        usuarioSeleccionado.usuarioId ||
        usuarioSeleccionado._id,
      fecha
    );
  };

  return (
    <div className="container">
      <h3>Seleccionar usuario para ver historial completo</h3>

      <div className="row mb-3">
        <div className="col-md-8">
          <div style={{ maxHeight: 400, overflow: "auto" }}>
            {cargando ? (
              <div>Cargando usuarios...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : (
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Correo</CTableHeaderCell>
                    <CTableHeaderCell>Opciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {usuarios.map((u) => (
                    <CTableRow key={u.id || u.usuarioId || u._id}>
                      <CTableDataCell>
                        {u.id || u.usuarioId || u._id}
                      </CTableDataCell>
                      <CTableDataCell>{u.nombre}</CTableDataCell>
                      <CTableDataCell>{u.correo}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => seleccionar(u)}
                        >
                          Seleccionar
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Usuario seleccionado</h5>
            {usuarioSeleccionado ? (
              <>
                <p>
                  <strong>{usuarioSeleccionado.nombre}</strong>
                </p>
                <p>{usuarioSeleccionado.correo}</p>
                <label>Fecha límite</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
                <CButton color="success" onClick={handleBuscar}>
                  Traer historial
                </CButton>
                <CButton
                  color="secondary"
                  className="mt-2"
                  onClick={() =>
                    enviarHistorialPDF(
                      usuarioSeleccionado.id ||
                        usuarioSeleccionado.usuarioId ||
                        usuarioSeleccionado._id,
                      fecha
                    )
                  }
                  disabled={cargandoPDF}
                >
                  {cargandoPDF
                    ? "Generando y enviando PDF..."
                    : "Enviar PDF al correo"}
                </CButton>

                {mensaje && <p className="text-success mt-2">{mensaje}</p>}
                {errorPDF && <p className="text-danger mt-2">{errorPDF}</p>}
              </>
            ) : (
              <p className="text-muted">Ningún usuario seleccionado</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        {cargandoHist && <div>Cargando historial...</div>}
        {errorHist && <div className="text-danger">{errorHist}</div>}
        {!cargandoHist && historial && historial.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Doctor</th>
                  <th>Procedimientos</th>
                  <th>Exámenes Requeridos</th>
                  <th>Nota de Evolución</th>
                  <th>Medicamentos Recetados</th>
                  <th>Origen</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((c) => (
                  <tr key={c.id || `${c.fecha}-${Math.random()}`}>
                    <td>
                      {c.fecha
                        ? new Date(c.fecha).toLocaleString("es-CO")
                        : "—"}
                    </td>
                    <td>{c.tipo || "—"}</td>
                    <td>{c.doctor?.nombre || "—"}</td>
                    <td>
                      {c.orden?.procedimientos
                        ?.map((p) => p.nombre)
                        .join(", ") || "—"}
                    </td>
                    <td>{c.examenes_requeridos || "—"}</td>
                    <td>{c.nota_evolucion || "—"}</td>
                    <td>{c.medicamentos_recetados || "—"}</td>
                    <td>{c.origen || "—"}</td>
                    <td>{c.observaciones || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeleccionarUsuarioHistorial;
