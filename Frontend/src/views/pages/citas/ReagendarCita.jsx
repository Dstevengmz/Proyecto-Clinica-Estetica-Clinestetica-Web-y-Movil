import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Card, Row, Col } from "react-bootstrap";
import horariosDisponibles from "../../../assets/js/HorariosDisponibles";
import estaOcupado from "../../../assets/js/HorarioEstaOcupado";
import useHorariosDisponible from "../../../hooks/useHorariosDisponible";
import useCitaPorId from "../../../hooks/useBuscarCita";
import useReagendarCita from "../../../hooks/useReagendarCita";
import Cargando from "../../../components/Cargando";
import InformacionUsuario from "../../../views/pages/usuarios/InformacionUsuario";
import AlertaCitas from "../../../assets/js/alertas/citas/AlertaCitas";
import { useAuth } from "../../../contexts/AuthenticaContext";

const alertas = new AlertaCitas();
function ReagendarCita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const token = localStorage.getItem("token");

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const {
    cita,
    hora: horaCita,
    cargando: cargandoCita,
    error: errorCita,
  } = useCitaPorId(id, token);

  const { horariosOcupados, cargando: cargandoHorarios } =
    useHorariosDisponible(fecha, cita?.tipo, token, cita?.id_doctor ?? null);

  const { reagendarCita, cargando: cargandoReagendar } = useReagendarCita();

  useEffect(() => {
    if (cita) {
      setFecha(cita.fecha);
      if (horaCita) setHora(horaCita);
    }
  }, [cita, horaCita]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reagendarCita(id, fecha, hora);
      await alertas.alertaEstadoActualizado("Cita reagendada correctamente");

      if (userRole?.toLowerCase().trim() === "asistente") {
        navigate("/listatodoslosusuariosasistente");
      } else {
        navigate("/miscitas");
      }
    } catch (err) {
      console.error(err);
      await alertas.alertaErrorActualizarCita("Error al reagendar la cita");
    }
  };

  if (cargandoCita) return <Cargando texto="Cargando cita..." />;
  if (errorCita)
    return (
      <Container>
        <div className="alert alert-danger">Error: {errorCita}</div>
      </Container>
    );

  return (
    <Container>
      <h2 className="mt-4">Reagendar Cita</h2>
      {cita?.usuario && <InformacionUsuario usuario={cita.usuario} />}
      <Card className="mb-4">
        <Card.Body>
          <h5>Información de la Cita Actual</h5>
          <Row>
            <Col md={6}>
              <p>
                <strong>Doctor:</strong> {cita?.doctor?.nombre}
              </p>
              <p>
                <strong>Tipo:</strong> {cita?.tipo}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Fecha actual:</strong>{" "}
                {cita?.fecha &&
                  new Date(
                    `${cita.fecha}T${horaCita || "00:00"}:00`
                  ).toLocaleString("es-CO")}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nueva Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                }}
                min={new Date().toISOString().split("T")[0]}
                required
                disabled
                readOnly
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nueva Hora</Form.Label>
              <Form.Select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
                disabled={!fecha || cargandoHorarios}
              >
                <option value="" disabled={cargandoHorarios}>
                  {cargandoHorarios
                    ? "Cargando horarios..."
                    : "Seleccione una hora"}
                </option>
                {horariosDisponibles.map((h) => {
                  const horariosOcupadosFiltrados = horariosOcupados.filter(
                    (c) => Number(c.id) !== Number(id)
                  );
                  const tipoNormalizado = (cita?.tipo || "")
                    .toString()
                    .trim()
                    .toLowerCase();
                  const duracionActualMin =
                    tipoNormalizado === "procedimiento" ? 60 : 30;
                  const ocupado = estaOcupado(
                    h,
                    horariosOcupadosFiltrados,
                    cargandoHorarios,
                    { fecha, tipo: tipoNormalizado }
                  );
                  const esHoraActual = (() => {
                    if (!horaCita || !fecha) return false;
                    const inicioActual = new Date(`${fecha}T${horaCita}:00`);
                    if (isNaN(inicioActual.getTime())) return false;
                    const finActual = new Date(
                      inicioActual.getTime() + duracionActualMin * 60000
                    );
                    const inicioSlot = new Date(`${fecha}T${h}:00`);
                    if (isNaN(inicioSlot.getTime())) return false;
                    return inicioSlot >= inicioActual && inicioSlot < finActual;
                  })();

                  const etiqueta = esHoraActual
                    ? "🟥 Actual"
                    : ocupado
                    ? "🟥 Ocupado"
                    : "🟩 Disponible";
                  return (
                    <option
                      key={h}
                      value={h}
                      disabled={ocupado}
                      style={
                        esHoraActual
                          ? { color: "#dc3545", fontWeight: 600 }
                          : undefined
                      }
                    >
                      {h} {etiqueta}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <button
          type="submit"
          className="btn btn-success me-2"
          disabled={cargandoReagendar}
        >
          {cargandoReagendar ? "Reagendando..." : "Reagendar Cita"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            if (userRole?.toLowerCase().trim() === "asistente") {
              navigate("/listatodoslosusuariosasistente");
            } else {
              navigate("/miscitas");
            }
          }}
        >
          Cancelar
        </button>
      </Form>
    </Container>
  );
}

export default ReagendarCita;
