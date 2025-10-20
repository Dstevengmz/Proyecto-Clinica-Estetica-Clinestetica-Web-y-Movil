import { useMemo } from "react";
import { Button, Table, Spinner, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useMisCitas from "../../../hooks/useMisCitas";
import { useCitasContext } from "../../../contexts/CitasContext";
import useCancelarCita from "../../../hooks/useCancelarCitaUsuario";
import puedeCancelarCita from "../../../assets/js/CancelarCitaUsuario";

function MisCitas() {
  const navigate = useNavigate();
  const { citas, cargando, error, refrescar } = useMisCitas();
  const { setSelectedCitas } = useCitasContext();
  const token = localStorage.getItem("token");
  const { cancelarCita, cargando: cargandoCancelacion } =
    useCancelarCita(token);

  const filas = useMemo(
    () =>
      (citas || []).map((c) => ({
        id: c.id,
        fecha: new Date(c.fecha),
        tipo: c.tipo,
        estado: c.estado,
        doctor: c.doctor?.nombre || "N/A",
        usuario: c.usuario?.nombre || "Yo",
      })),
    [citas]
  );

  const verDetalles = (cita) => {
    setSelectedCitas?.(cita);
    navigate("/detallescitas/" + cita.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Mis Citas</h3>
          <Button variant="primary" onClick={refrescar}>
            Refrescar
          </Button>
        </div>
        <Alert variant="dark" className="mb-3">
          Solo puedes cancelar tus citas con mínimo 24 horas de anticipación.
        </Alert>

        {cargando && (
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Cargando...</span>
          </div>
        )}

        {!!error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}

        {!cargando && !error && filas.length === 0 && (
          <Alert variant="info">No tienes citas registradas.</Alert>
        )}

        {!cargando && !error && filas.length > 0 && (
          <div className="table-responsive">
            <Table hover bordered size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Doctor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f, idx) => (
                  <tr key={f.id}>
                    <td>{idx + 1}</td>
                    <td>{f.fecha.toLocaleString()}</td>
                    <td>{f.tipo}</td>
                    <td>{f.doctor}</td>
                    <td>{f.estado}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => verDetalles(citas[idx])}
                        className="me-2"
                      >
                        Ver detalles
                      </Button>

                      {f.estado !== "cancelada" && f.estado !== "realizada" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline-warning"
                            className="me-2"
                            onClick={() => navigate("/reagendarcita/" + f.id)}
                          >
                            Reagendar
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={
                              cargandoCancelacion || !puedeCancelarCita(f.fecha)
                            }
                            onClick={async () => {
                              const ok = await cancelarCita(f.id);
                              if (ok) refrescar();
                            }}
                          >
                            {cargandoCancelacion
                              ? "Cancelando..."
                              : !puedeCancelarCita(f.fecha)
                              ? "Cancelar"
                              : "Cancelar"}
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default MisCitas;
