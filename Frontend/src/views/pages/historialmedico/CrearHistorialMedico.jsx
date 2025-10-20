import { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { usePerfilUsuario } from "../../../hooks/usePerfilUsuario";
import { useNavigate } from "react-router-dom";
import BuscarHistorialClinicaPorUSuario from "../../../hooks/useBuscarHistorialClinicaPorUSuario";
import AlertHistorialMedico from "../../../assets/js/alertas/historialmedico/HistorialMedico";
const API_URL = import.meta.env.VITE_API_URL;

function HistorialMedico() {
  const navigate = useNavigate();
  const alertas = new AlertHistorialMedico();
  const { usuario } = usePerfilUsuario();
  const { verificarHistorialMedico } =
    BuscarHistorialClinicaPorUSuario(usuario);
  const [formulario, setFormulario] = useState({
    enfermedades: "",
    alergias: "",
    cirugias_previas: "",
    condiciones_piel: "",
    embarazo_lactancia: false,
    medicamentos: "",
    consume_tabaco: false,
    consume_alcohol: false,
    usa_anticonceptivos: false,
    detalles_anticonceptivos: "",
    diabetes: false,
    hipertension: false,
    historial_cancer: false,
    problemas_coagulacion: false,
    epilepsia: false,
    otras_condiciones: "",
  });

  const [enfermedadesHabilitado, setEnfermedadesHabilitado] = useState(false);
  const [enfermedadActual, setEnfermedadActual] = useState("");
  const [enfermedadesLista, setEnfermedadesLista] = useState([]);
  // UI mejorada para Alergias
  const [alergiasHabilitado, setAlergiasHabilitado] = useState(false);
  const [alergiaActual, setAlergiaActual] = useState("");
  const [alergiasLista, setAlergiasLista] = useState([]);
  //Ui mejorada para Medicamentos
  const [medicamentosHabilitado, setMedicamentosHabilitado] = useState(false);
  const [medicamentoActual, setMedicamentoActual] = useState("");
  const [medicamentosLista, setMedicamentosLista] = useState([]);
  // UI mejorada para Cirugías previas y Condiciones de la piel
  const [cirugiaActual, setCirugiaActual] = useState("");
  const [cirugiasLista, setCirugiasLista] = useState([]);
  const [cirugiasHabilitado, setCirugiasHabilitado] = useState(false);
  const [condicionActual, setCondicionActual] = useState("");
  const [condicionesLista, setCondicionesLista] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const yaTieneHistorial = await verificarHistorialMedico();
    if (yaTieneHistorial) {
      await alertas.alertaYaTieneHistorialMedico();
      return;
    }

    // Confirmación antes de crear
    const confirm = await alertas.confirmarGuardarHistorialMedico?.();
    if (confirm && !confirm.isConfirmed) return;

    try {
      setEnviando(true);
      const payload = {
        ...formulario,
        enfermedades: enfermedadesLista.join(", "),
        alergias: alergiasLista.join(", "),
        medicamentos: medicamentosLista.join(", "),
        cirugias_previas: cirugiasLista.join(", "),
        condiciones_piel: condicionesLista.join(", "),
        id_usuario: usuario.id,
      };
      await axios.post(
        `${API_URL}/apihistorialmedico/crearhistorialclinico`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await alertas.alertaHistorialMedicoCreadoExito?.();
      navigate("/crearcita");
      setFormulario({
        enfermedades: "",
        alergias: "",
        cirugias_previas: "",
        condiciones_piel: "",
        embarazo_lactancia: false,
        medicamentos: "",
        consume_tabaco: false,
        consume_alcohol: false,
        usa_anticonceptivos: false,
        detalles_anticonceptivos: "",
        diabetes: false,
        hipertension: false,
        historial_cancer: false,
        problemas_coagulacion: false,
        epilepsia: false,
        otras_condiciones: "",
      });
      setEnfermedadesHabilitado(false);
      setEnfermedadActual("");
      setEnfermedadesLista([]);
      setAlergiasHabilitado(false);
      setAlergiaActual("");
      setAlergiasLista([]);
      setMedicamentosHabilitado(false);
      setMedicamentoActual("");
      setMedicamentosLista([]);
      setCirugiaActual("");
      setCirugiasLista([]);
      setCirugiasHabilitado(false);
      setCondicionActual("");
      setCondicionesLista([]);
    } catch (postError) {
      console.error("Error al guardar historial médico", postError);
      await alertas.alertaNoSePudoCrearHistorialMedico?.();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Container>
      <h1 className="mt-4">Historial Médico</h1>
      <Card className="mb-4">
        <Card.Body>
          <h4>Detalles del Usuario</h4>
          <Row>
            <Col md={6}>
              <p>
                <strong>Nombre:</strong> {usuario.nombre}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Correo:</strong> {usuario.correo}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <strong>Teléfono:</strong> {usuario.telefono}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Dirección:</strong> {usuario.direccion}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <strong>Rol:</strong> {usuario.rol}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formEnfermedades">
              <Form.Label>Enfermedades</Form.Label>
              <div className="d-flex gap-3 mb-2">
                <Form.Check
                  inline
                  type="radio"
                  label="No"
                  name="tieneEnfermedades"
                  id="enf-no"
                  checked={!enfermedadesHabilitado}
                  onChange={() => {
                    setEnfermedadesHabilitado(false);
                    setEnfermedadesLista([]);
                  }}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Sí"
                  name="tieneEnfermedades"
                  id="enf-si"
                  checked={enfermedadesHabilitado}
                  onChange={() => setEnfermedadesHabilitado(true)}
                />
              </div>
              {enfermedadesHabilitado && (
                <>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Agregar enfermedad"
                      value={enfermedadActual}
                      onChange={(e) => setEnfermedadActual(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = enfermedadActual.trim();
                          if (val && !enfermedadesLista.includes(val)) {
                            setEnfermedadesLista([...enfermedadesLista, val]);
                            setEnfermedadActual("");
                          }
                        }
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const val = enfermedadActual.trim();
                        if (val && !enfermedadesLista.includes(val)) {
                          setEnfermedadesLista([...enfermedadesLista, val]);
                          setEnfermedadActual("");
                        }
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                  {enfermedadesLista.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {enfermedadesLista.map((enf, idx) => (
                        <span
                          key={`${enf}-${idx}`}
                          className="badge bg-secondary d-inline-flex align-items-center"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {enf}
                          <Button
                            variant="link"
                            size="sm"
                            className="text-white ms-2 p-0"
                            onClick={() =>
                              setEnfermedadesLista(
                                enfermedadesLista.filter((e) => e !== enf)
                              )
                            }
                            aria-label={`Quitar ${enf}`}
                          >
                            ×
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formAlergias">
              <Form.Label>Alergias</Form.Label>
              <div className="d-flex gap-3 mb-2">
                <Form.Check
                  inline
                  type="radio"
                  label="No"
                  name="tieneAlergias"
                  id="alg-no"
                  checked={!alergiasHabilitado}
                  onChange={() => {
                    setAlergiasHabilitado(false);
                    setAlergiasLista([]);
                  }}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Sí"
                  name="tieneAlergias"
                  id="alg-si"
                  checked={alergiasHabilitado}
                  onChange={() => setAlergiasHabilitado(true)}
                />
              </div>
              {alergiasHabilitado && (
                <>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Agregar alergia"
                      value={alergiaActual}
                      onChange={(e) => setAlergiaActual(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = alergiaActual.trim();
                          if (val && !alergiasLista.includes(val)) {
                            setAlergiasLista([...alergiasLista, val]);
                            setAlergiaActual("");
                          }
                        }
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const val = alergiaActual.trim();
                        if (val && !alergiasLista.includes(val)) {
                          setAlergiasLista([...alergiasLista, val]);
                          setAlergiaActual("");
                        }
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                  {alergiasLista.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {alergiasLista.map((alg, idx) => (
                        <span
                          key={`${alg}-${idx}`}
                          className="badge bg-secondary d-inline-flex align-items-center"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {alg}
                          <Button
                            variant="link"
                            size="sm"
                            className="text-white ms-2 p-0"
                            onClick={() =>
                              setAlergiasLista(
                                alergiasLista.filter((e) => e !== alg)
                              )
                            }
                            aria-label={`Quitar ${alg}`}
                          >
                            ×
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formCirugias">
              <Form.Label>Cirugías Previas</Form.Label>
              <div className="d-flex gap-3 mb-2">
                <Form.Check
                  inline
                  type="radio"
                  label="No"
                  name="tieneCirugias"
                  id="cir-no"
                  checked={!cirugiasHabilitado}
                  onChange={() => {
                    setCirugiasHabilitado(false);
                    setCirugiasLista([]);
                  }}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Sí"
                  name="tieneCirugias"
                  id="cir-si"
                  checked={cirugiasHabilitado}
                  onChange={() => setCirugiasHabilitado(true)}
                />
              </div>
              {cirugiasHabilitado && (
                <>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Agregar cirugía"
                      value={cirugiaActual}
                      onChange={(e) => setCirugiaActual(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = cirugiaActual.trim();
                          if (val && !cirugiasLista.includes(val)) {
                            setCirugiasLista([...cirugiasLista, val]);
                            setCirugiaActual("");
                          }
                        }
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const val = cirugiaActual.trim();
                        if (val && !cirugiasLista.includes(val)) {
                          setCirugiasLista([...cirugiasLista, val]);
                          setCirugiaActual("");
                        }
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                  {cirugiasLista.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {cirugiasLista.map((c, idx) => (
                        <span
                          key={`${c}-${idx}`}
                          className="badge bg-secondary d-inline-flex align-items-center"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {c}
                          <Button
                            variant="link"
                            size="sm"
                            className="text-white ms-2 p-0"
                            onClick={() =>
                              setCirugiasLista(
                                cirugiasLista.filter((e) => e !== c)
                              )
                            }
                            aria-label={`Quitar ${c}`}
                          >
                            ×
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formCondicionesPiel">
              <Form.Label>Condiciones de la Piel</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="text"
                  placeholder="Agregar condición de la piel"
                  value={condicionActual}
                  onChange={(e) => setCondicionActual(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = condicionActual.trim();
                      if (val && !condicionesLista.includes(val)) {
                        setCondicionesLista([...condicionesLista, val]);
                        setCondicionActual("");
                      }
                    }
                  }}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const val = condicionActual.trim();
                    if (val && !condicionesLista.includes(val)) {
                      setCondicionesLista([...condicionesLista, val]);
                      setCondicionActual("");
                    }
                  }}
                >
                  Agregar
                </Button>
              </div>
              {condicionesLista.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {condicionesLista.map((c, idx) => (
                    <span
                      key={`${c}-${idx}`}
                      className="badge bg-secondary d-inline-flex align-items-center"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {c}
                      <Button
                        variant="link"
                        size="sm"
                        className="text-white ms-2 p-0"
                        onClick={() =>
                          setCondicionesLista(
                            condicionesLista.filter((e) => e !== c)
                          )
                        }
                        aria-label={`Quitar ${c}`}
                      >
                        ×
                      </Button>
                    </span>
                  ))}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Medicamentos */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formMedicamentos">
              <Form.Label>Medicamentos actuales</Form.Label>
              <div className="d-flex gap-3 mb-2">
                <Form.Check
                  inline
                  type="radio"
                  label="No"
                  name="tomaMedicamentos"
                  id="med-no"
                  checked={!medicamentosHabilitado}
                  onChange={() => {
                    setMedicamentosHabilitado(false);
                    setMedicamentosLista([]);
                  }}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Sí"
                  name="tomaMedicamentos"
                  id="med-si"
                  checked={medicamentosHabilitado}
                  onChange={() => setMedicamentosHabilitado(true)}
                />
              </div>
              {medicamentosHabilitado && (
                <>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Agregar medicamento"
                      value={medicamentoActual}
                      onChange={(e) => setMedicamentoActual(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = medicamentoActual.trim();
                          if (val && !medicamentosLista.includes(val)) {
                            setMedicamentosLista([...medicamentosLista, val]);
                            setMedicamentoActual("");
                          }
                        }
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const val = medicamentoActual.trim();
                        if (val && !medicamentosLista.includes(val)) {
                          setMedicamentosLista([...medicamentosLista, val]);
                          setMedicamentoActual("");
                        }
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                  {medicamentosLista.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {medicamentosLista.map((med, idx) => (
                        <span
                          key={`${med}-${idx}`}
                          className="badge bg-secondary d-inline-flex align-items-center"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {med}
                          <Button
                            variant="link"
                            size="sm"
                            className="text-white ms-2 p-0"
                            onClick={() =>
                              setMedicamentosLista(
                                medicamentosLista.filter((e) => e !== med)
                              )
                            }
                            aria-label={`Quitar ${med}`}
                          >
                            ×
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Usa anticonceptivos?"
              name="usa_anticonceptivos"
              checked={formulario.usa_anticonceptivos}
              onChange={handleChange}
            />
            {formulario.usa_anticonceptivos && (
              <Form.Group
                controlId="formDetallesAnticonceptivos"
                className="mt-2"
              >
                <Form.Label>Detalles de anticonceptivos</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="detalles_anticonceptivos"
                  placeholder="Método (píldora, DIU, inyección, etc.), dosis y frecuencia"
                  value={formulario.detalles_anticonceptivos}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Diabetes?"
              name="diabetes"
              checked={formulario.diabetes}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Hipertensión?"
              name="hipertension"
              checked={formulario.hipertension}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Historial de cáncer?"
              name="historial_cancer"
              checked={formulario.historial_cancer}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Problemas de coagulación?"
              name="problemas_coagulacion"
              checked={formulario.problemas_coagulacion}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Epilepsia?"
              name="epilepsia"
              checked={formulario.epilepsia}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Está embarazada o lactando?"
              name="embarazo_lactancia"
              checked={formulario.embarazo_lactancia}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Consume tabaco?"
              name="consume_tabaco"
              checked={formulario.consume_tabaco}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Consume alcohol?"
              name="consume_alcohol"
              checked={formulario.consume_alcohol}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formOtrasCondiciones">
              <Form.Label>
                {" "}
                ¿Presenta algún otro síntoma, condición o información relevante
                que desee mencionar?
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="otras_condiciones"
                value={formulario.otras_condiciones}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar Historial Médico"}
        </Button>
      </Form>
    </Container>
  );
}

export default HistorialMedico;
