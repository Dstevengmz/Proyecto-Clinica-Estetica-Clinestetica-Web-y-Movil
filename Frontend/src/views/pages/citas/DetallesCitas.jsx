import { useContext, useMemo, useState } from "react";
import { Row, Col, Card, Alert, Badge } from "react-bootstrap";
import useSubirExamenes from "../../../hooks/useSubirExamenes";
import useExamenesPorCita from "../../../hooks/useExamenesPorCita";
import { CitasContext } from "../../../contexts/CitasContext";
import { useAuth } from "../../../contexts/AuthenticaContext";
import { useLocation, useParams } from "react-router-dom";
import useCitaPorId from "../../../hooks/useCitaPorId";
import ConsentimientoVista from "./ConsentimientoVista";

function DetallesCitas() {
  const { selectedCitas } = useContext(CitasContext);
  const location = useLocation();
  const { id } = useParams();
  const { userRole } = useAuth();
  const initial = selectedCitas || location.state?.cita || null;
  const {
    cita,
    setCita,
    actualizando: cargandoCita,
  } = useCitaPorId(id, { initialData: initial });

  const historial = cita?.usuario?.historial_medico || {};
  const orden = cita?.orden || null;
  const estado = cita?.estado || "—";
  const esProcedimiento = cita?.tipo === "procedimiento";
  const esRequerimiento = cita?.origen === "requerimiento";

  const puedeSubir =
    esProcedimiento &&
    userRole === "usuario" &&
    !!cita?.examenes_requeridos &&
    !cita?.examenes_cargados;

  const {
    examenes,
    cargando: cargandoExamenes,
    refrescar: refrescarExamenes,
  } = useExamenesPorCita(cita?.id);
  const { subir, subiendo, error: errorSubir } = useSubirExamenes();
  const [archivos, setArchivos] = useState([]);
  const [nombreExamen, setNombreExamen] = useState("");
  const [observacionesExamen, setObservacionesExamen] = useState("");
  console.log("Detalles cita:", cita);
  const handleSubirExamen = async (e) => {
    e.preventDefault();
    if (!cita?.id || archivos.length === 0) return;
    await subir({
      id_cita: cita.id,
      archivos,
      nombre_examen: nombreExamen,
      observaciones: observacionesExamen,
    });
    setArchivos([]);
    setNombreExamen("");
    setObservacionesExamen("");
    refrescarExamenes();
  };

  const marcarExamenesSubidos = async () => {
    if (!cita?.id) return;
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/apicitas/marcar-examenes-subidos/${
          cita.id
        }`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!resp.ok) throw new Error("No se pudo marcar exámenes");
      await resp.json();
      setCita((prev) => ({ ...prev, examenes_cargados: true }));
    } catch (e) {
      console.error(e);
      alert(e.message || "Error al marcar exámenes");
    }
  };

  const fechaFormateada = useMemo(() => {
    if (!cita?.fecha) return "—";
    try {
      return new Date(cita.fecha).toLocaleString();
    } catch {
      return String(cita.fecha);
    }
  }, [cita?.fecha]);

  const renderBool = (val) =>
    val === true ? "Sí" : val === false ? "No" : "No registrado";

  if (!cita) {
    return (
      <Alert variant="info" className="mt-4 text-center">
        Selecciona una cita para ver los detalles.
      </Alert>
    );
  }
  return (
    <div className="position-relative">
      {cargandoCita && (
        <div
          className="position-absolute top-0 end-0 p-2"
          style={{ zIndex: 10 }}
        >
          <span className="badge bg-info">Actualizando…</span>
        </div>
      )}
      <h3 className="mb-4 text-center">Detalles de la Cita</h3>
      {userRole === "usuario" &&
        esProcedimiento &&
        cita.examenes_requeridos && (
          <div className="mb-3 text-end">
            {cita.examenes_cargados ? (
              <button className="btn btn-secondary" disabled>
                Exámenes subidos
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={marcarExamenesSubidos}
              >
                Marcar exámenes subidos
              </button>
            )}
          </div>
        )}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="text-primary mb-3">Paciente</h5>
          <Row>
            <Col md={6} className="mb-3">
              <strong>Nombre:</strong> {cita.usuario?.nombre || "—"}
            </Col>
            <Col md={6} className="mb-3">
              <strong>Teléfono:</strong> {cita.usuario?.telefono || "—"}
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <strong>Dirección:</strong>{" "}
              {cita.usuario?.direccion || "No registrada"}
            </Col>
            <Col md={6} className="mb-3">
              <strong>Rol:</strong> {cita.usuario?.rol || "—"}
            </Col>
          </Row>

          <hr />
          <h5 className="text-primary mb-3">Doctor</h5>
          <Row>
            <Col md={6} className="mb-3">
              <strong>Nombre:</strong> {cita.doctor?.nombre || "—"}
            </Col>
            <Col md={6} className="mb-3">
              <strong>Ocupación:</strong>{" "}
              {cita.doctor?.ocupacion || "No registrada"}
            </Col>
          </Row>

          <hr />
          <h5 className="text-primary mb-3">Información de la Cita</h5>
          <Row>
            <Col md={6} className="mb-3">
              <strong>Fecha:</strong> {fechaFormateada}
            </Col>
            <Col md={6} className="mb-3">
              <strong>Estado:</strong> <Badge bg="success">: {estado}</Badge>
            </Col>
            <Col md={6} className="mb-2">
              <strong>Tipo de cita:</strong>{" "}
              {cita.tipo ? (
                <Badge bg={cita.tipo === "evaluacion" ? "info" : "success"}>
                  {cita.tipo}
                </Badge>
              ) : (
                "—"
              )}
            </Col>
          </Row>
          {cita.tipo !== "procedimiento" && cita.observaciones && (
            <>
              <hr />
              <h5 className="text-primary mb-3">Motivo Consulta</h5>
              <Row>
                <Col md={12}>{cita.observaciones}</Col>
              </Row>
            </>
          )}

          {(userRole === "usuario" || userRole === "doctor") &&
            cita.tipo === "procedimiento" &&
            cita.nota_evolucion && (
              <>
                <hr />
                <h5 className="text-primary mb-3">Nota de Evolución</h5>
                <Row>
                  <Col md={12}>
                    {cita.nota_evolucion ||
                      "No hay nota de evolución registrada."}
                  </Col>
                </Row>
              </>
            )}
          {/* Desde aqui  Medicamentos*/}
          {(userRole === "usuario" || userRole === "doctor") &&
            cita.tipo === "procedimiento" &&
            cita.medicamentos_recetados && (
              <>
                <hr />
                <h5 className="text-primary mb-3 d-flex justify-content-between align-items-center">
                  Medicamentos recetados
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        const resp = await fetch(
                          `${
                            import.meta.env.VITE_API_URL
                          }/apicitas/orden-medicamentos/pdf/${cita.id}`,
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        if (!resp.ok) {
                          const data = await resp.json().catch(() => ({}));
                          return alert(data.error || "Error generando PDF");
                        }
                        const blob = await resp.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `receta_medicamentos_cita_${cita.id}.pdf`;
                        a.click();
                        URL.revokeObjectURL(url);
                      } catch {
                        alert("Error al descargar PDF de medicamentos");
                      }
                    }}
                  >
                    Descargar PDF
                  </button>
                </h5>
                <Row>
                  <Col md={12} style={{ whiteSpace: "pre-wrap" }}>
                    {cita.medicamentos_recetados}
                  </Col>
                </Row>
              </>
            )}

          {/* Hasta aqui Medicamentos*/}
          {cita.examenes_requeridos && (
            <>
              <hr />
              <h5 className="text-primary mb-3 d-flex justify-content-between align-items-center">
                Exámenes Requeridos
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      const resp = await fetch(
                        `${
                          import.meta.env.VITE_API_URL
                        }/apicitas/orden-examenes/pdf/${cita.id}`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      if (!resp.ok) {
                        const data = await resp.json().catch(() => ({}));
                        return alert(data.error || "Error generando PDF");
                      }
                      const blob = await resp.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `orden_examenes_cita_${cita.id}.pdf`;
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch {
                      alert("Error al descargar PDF");
                    }
                  }}
                >
                  Descargar PDF
                </button>
              </h5>
              <Row>
                <Col md={12} style={{ whiteSpace: "pre-wrap" }}>
                  {cita.examenes_requeridos}
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>

      {userRole === "doctor" && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="text-primary mb-3">Historial Médico del Paciente</h5>
            <Row>
              <Col md={6} className="mb-3">
                <strong>Enfermedades:</strong>{" "}
                {historial.enfermedades || "No registradas"}
              </Col>
              <Col md={6} className="mb-3">
                <strong>Alergias:</strong>{" "}
                {historial.alergias || "No registradas"}
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <strong>Cirugías previas:</strong>{" "}
                {historial.cirugias_previas || "No registradas"}
              </Col>
              <Col md={6} className="mb-3">
                <strong>Condiciones de piel:</strong>{" "}
                {historial.condiciones_piel || "No registradas"}
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <strong>Embarazo/Lactancia:</strong>{" "}
                {renderBool(historial.embarazo_lactancia)}
              </Col>
              <Col md={6} className="mb-3">
                <strong>Medicamentos:</strong>{" "}
                {historial.medicamentos || "No registrados"}
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <strong>Consume tabaco:</strong>{" "}
                {renderBool(historial.consume_tabaco)}
              </Col>
              <Col md={6} className="mb-3">
                <strong>Consume alcohol:</strong>{" "}
                {renderBool(historial.consume_alcohol)}
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <strong>Usa anticonceptivos:</strong>{" "}
                {renderBool(historial.usa_anticonceptivos)}
              </Col>
              <Col md={6} className="mb-3">
                <strong>Detalles anticonceptivos:</strong>{" "}
                {historial.detalles_anticonceptivos || "—"}
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <strong>Diabetes:</strong> {renderBool(historial.diabetes)}
              </Col>
              <Col md={6} className="mb-3">
                <strong>Hipertensión:</strong>{" "}
                {renderBool(historial.hipertension)}
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <strong>Historial de cáncer:</strong>{" "}
                {renderBool(historial.historial_cancer)}
              </Col>
              <Col md={6} className="mb-3">
                <strong>Problemas de coagulación:</strong>{" "}
                {renderBool(historial.problemas_coagulacion)}
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <strong>Epilepsia:</strong> {renderBool(historial.epilepsia)}
              </Col>
              <Col md={6} className="mb-3">
                <strong>Otras condiciones:</strong>{" "}
                {historial.otras_condiciones || "—"}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {(userRole === "usuario" || userRole === "doctor") &&
        !esRequerimiento && (
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="text-primary mb-3">
                Procedimientos Asociados a esta Cita
              </h5>
              {orden ? (
                <>
                  <p>
                    <strong>Orden #{orden.id}</strong>
                  </p>
                  <p>
                    <strong>Fecha de creación:</strong>{" "}
                    {new Date(orden.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Estado:</strong> {orden.estado || "No registrado"}
                  </p>

                  {Array.isArray(orden.procedimientos) &&
                  orden.procedimientos.length > 0 ? (
                    <ul>
                      {orden.procedimientos.map((procedimiento) => (
                        <li key={procedimiento.id}>
                          <strong>{procedimiento.nombre}</strong> - $
                          {procedimiento.precio?.toFixed(2)}
                          <br />
                          <em>
                            {procedimiento.descripcion || "Sin descripción"}
                          </em>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay procedimientos en esta orden.</p>
                  )}
                </>
              ) : (
                <p>Esta cita no tiene una orden asociada.</p>
              )}

              {/* Consentimiento Informado Inicio */}
              {(userRole === "usuario" || userRole === "doctor") &&
                cita.tipo === "procedimiento" &&
                !esRequerimiento && (
                  <Card className="mb-4 shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-primary mb-0">
                          Consentimiento Informado
                        </h5>
                        <Badge bg={esProcedimiento ? "success" : "secondary"}>
                          {esProcedimiento ? "Procedimiento" : "No aplica"}
                        </Badge>
                      </div>
                      <ConsentimientoVista
                        cita={cita}
                        orden={orden}
                        userRole={userRole}
                        esProcedimiento={esProcedimiento}
                        forceShow={true}
                      />
                    </Card.Body>
                  </Card>
                )}
              {/* Consentimiento Informado Fin */}
            </Card.Body>
          </Card>
        )}

      {/* Examenes Inicio */}
      {(userRole === "doctor" || (userRole === "usuario" && esProcedimiento)) &&
        !esRequerimiento && (
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="text-primary mb-0">Exámenes Adjuntos</h5>
                {esProcedimiento && <Badge bg="secondary">Procedimiento</Badge>}
              </div>
              {Array.isArray(examenes) && examenes.length > 0 ? (
                <>
                  {cargandoExamenes && (
                    <div className="text-end mb-2">
                      <span className="badge bg-info">
                        Actualizando exámenes…
                      </span>
                    </div>
                  )}
                  <div className="row g-3 mb-3">
                    {examenes.map((ex) => {
                      const isPdf = ex.archivo_examen
                        ?.toLowerCase()
                        .includes(".pdf");
                      return (
                        <div key={ex.id} className="col-md-4 col-sm-6">
                          <div className="border rounded p-2 h-100 d-flex flex-column">
                            <div
                              className="mb-2 fw-semibold text-truncate"
                              title={ex.nombre_examen}
                            >
                              {ex.nombre_examen}
                            </div>
                            {isPdf ? (
                              <div
                                className="flex-grow-1 d-flex align-items-center justify-content-center bg-light"
                                style={{ minHeight: "120px" }}
                              >
                                <span className="text-muted">PDF</span>
                              </div>
                            ) : (
                              <div
                                className="ratio ratio-4x3 mb-2"
                                style={{ overflow: "hidden", borderRadius: 4 }}
                              >
                                <img
                                  src={ex.archivo_examen}
                                  alt={ex.nombre_examen}
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary mt-auto"
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("token");
                                  const resp = await fetch(
                                    `${
                                      import.meta.env.VITE_API_URL
                                    }/apiexamenes/descargar/${ex.id}`,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  const data = await resp.json();
                                  if (data?.url) {
                                    window.open(data.url, "_blank");
                                  } else {
                                    alert(
                                      data.error || "No se pudo generar enlace"
                                    );
                                  }
                                } catch {
                                  alert("Error al solicitar URL segura");
                                }
                              }}
                            >
                              Ver / Descargar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : cargandoExamenes ? (
                <p>Cargando exámenes...</p>
              ) : (
                <p className="text-muted mb-3">No hay exámenes adjuntos.</p>
              )}
              {puedeSubir && (
                <div className="border-top pt-3">
                  <h6 className="fw-semibold">Subir nuevos exámenes</h6>
                  {!esProcedimiento && (
                    <p className="text-muted small mb-2">
                      Solo disponible para citas de procedimiento.
                    </p>
                  )}
                  {userRole === "usuario" &&
                    esProcedimiento &&
                    !cita?.examenes_requeridos && (
                      <p className="text-danger small mb-2">
                        El doctor aún no ha solicitado exámenes para esta cita.
                      </p>
                    )}
                  <form onSubmit={handleSubirExamen} className="small">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nombre del examen (opcional)"
                        value={nombreExamen}
                        onChange={(e) => setNombreExamen(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        className="form-control form-control-sm"
                        placeholder="Observaciones"
                        rows={2}
                        value={observacionesExamen}
                        onChange={(e) => setObservacionesExamen(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*,application/pdf"
                        multiple
                        onChange={(e) => setArchivos(e.target.files)}
                      />
                    </div>
                    {archivos && archivos.length > 0 && (
                      <div className="mb-2">
                        <ul
                          className="list-group list-group-flush small"
                          style={{ maxHeight: 150, overflowY: "auto" }}
                        >
                          {[...archivos].map((f, i) => (
                            <li
                              key={i}
                              className="list-group-item py-1 d-flex justify-content-between align-items-center"
                            >
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "70%" }}
                                title={f.name}
                              >
                                {f.name}
                              </span>
                              <span className="badge bg-secondary rounded-pill">
                                {(f.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="d-flex justify-content-end mt-2 gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => setArchivos([])}
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                    )}
                    {errorSubir && (
                      <div className="text-danger mb-2">{errorSubir}</div>
                    )}
                    <button
                      type="submit"
                      className="btn btn-sm btn-success"
                      disabled={subiendo || archivos.length === 0}
                    >
                      {subiendo ? "Subiendo..." : "Subir"}
                    </button>
                  </form>
                  <p className="text-muted mt-2 mb-0 small">
                    Formatos permitidos: imágenes o PDF. Máx. varios archivos
                    por lote.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        )}
      {/* Examenes Fin */}
    </div>
  );
}

export default DetallesCitas;
