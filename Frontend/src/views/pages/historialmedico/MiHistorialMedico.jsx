import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { usePerfilUsuario } from "../../../hooks/usePerfilUsuario";

const API_URL = import.meta.env.VITE_API_URL;

function MiHistorialMedico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario: usuarioPerfil, rol, cargando: cargandoUsuario } = usePerfilUsuario();
  const [mihistorialmedico, setMihistorialmedico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarHistorial = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado");
      setMihistorialmedico(null);
      setCargando(false);
      return;
    }
    try {
      setCargando(true);
      setError(null);
      const { data } = await axios.get(
        `${API_URL}/apihistorialmedico/mihistorialclinico/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMihistorialmedico(data);
    } catch (e) {
      console.error("Error al cargar mi historial médico:", e);
      setError(
        e.response?.data?.error || "No se pudo cargar el historial médico"
      );
      setMihistorialmedico(null);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  // Si se carga un historial que no pertenece al usuario y no es doctor, bloquear
  useEffect(() => {
    if (cargando || cargandoUsuario) return;
    if (!mihistorialmedico) return;
    const isDoctor = (rol || "").toLowerCase() === "doctor";
    const ownerId = mihistorialmedico?.usuario?.id || mihistorialmedico?.usuarioId;
    const isOwnerViaData = usuarioPerfil?.id && ownerId && Number(usuarioPerfil.id) === Number(ownerId);
    const isOwnerViaRoute = usuarioPerfil?.id && id && Number(usuarioPerfil.id) === Number(id);
    if (!isDoctor && !(isOwnerViaData || isOwnerViaRoute)) {
      setError("No autorizado para ver este historial.");
    }
  }, [cargando, cargandoUsuario, mihistorialmedico, rol, usuarioPerfil?.id, id]);

  const renderBool = (val) =>
    val === true ? "Sí" : val === false ? "No" : "No registrado";

  const Header = (
    <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
      <h3 className="mb-0">Mi Historial Médico</h3>
      <div className="d-flex gap-2">
        {(() => {
          if (cargandoUsuario) return null; 
          const isDoctor = (rol || "").toLowerCase() === "doctor";
          const ownerId = mihistorialmedico?.usuario?.id || mihistorialmedico?.usuarioId;
          const isOwnerViaData = usuarioPerfil?.id && ownerId && Number(usuarioPerfil.id) === Number(ownerId);
          const isOwnerViaRoute = usuarioPerfil?.id && id && Number(usuarioPerfil.id) === Number(id);
          const canEdit = Boolean(mihistorialmedico?.id) && (isDoctor || isOwnerViaData || isOwnerViaRoute);
          return canEdit ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/editarhistorialmedico/${mihistorialmedico.id}`)}
            >
              Editar
            </Button>
          ) : null;
        })()}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={cargarHistorial}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />{" "}
              Actualizando...
            </>
          ) : (
            "Actualizar"
          )}
        </Button>
      </div>
    </div>
  );

  if (cargando) {
    return (
      <Container>
        {Header}
        <Card>
          <Card.Body className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Cargando historial...</span>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        {Header}
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!mihistorialmedico) {
    return (
      <Container>
        {Header}
        <Alert variant="info">No hay datos disponibles.</Alert>
      </Container>
    );
  }

  return (
    <Container>
      {Header}

      <Card className="mb-3">
        <Card.Header>Condiciones generales</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-2">
              <strong>Enfermedades:</strong>{" "}
              {mihistorialmedico.enfermedades || "—"}
            </Col>
            <Col md={6} className="mb-2">
              <strong>Alergias:</strong> {mihistorialmedico.alergias || "—"}
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-2">
              <strong>Cirugías previas:</strong>{" "}
              {mihistorialmedico.cirugias_previas || "—"}
            </Col>
            <Col md={6} className="mb-2">
              <strong>Condiciones de la piel:</strong>{" "}
              {mihistorialmedico.condiciones_piel || "—"}
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mb-2">
              <strong>Medicamentos actuales:</strong>{" "}
              {mihistorialmedico.medicamentos || "—"}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>Hábitos</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-2">
              <strong>Consume tabaco:</strong>{" "}
              {renderBool(mihistorialmedico.consume_tabaco)}
            </Col>
            <Col md={6} className="mb-2">
              <strong>Consume alcohol:</strong>{" "}
              {renderBool(mihistorialmedico.consume_alcohol)}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>Salud reproductiva</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-2">
              <strong>Embarazo/Lactancia:</strong>{" "}
              {renderBool(mihistorialmedico.embarazo_lactancia)}
            </Col>
            <Col md={6} className="mb-2">
              <strong>Usa anticonceptivos:</strong>{" "}
              {renderBool(mihistorialmedico.usa_anticonceptivos)}
            </Col>
          </Row>
          {mihistorialmedico.usa_anticonceptivos && (
            <Row>
              <Col md={12} className="mb-2">
                <strong>Detalles anticonceptivos:</strong>{" "}
                {mihistorialmedico.detalles_anticonceptivos || "—"}
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>Antecedentes</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-2">
              <strong>Diabetes:</strong>{" "}
              {renderBool(mihistorialmedico.diabetes)}
            </Col>
            <Col md={6} className="mb-2">
              <strong>Hipertensión:</strong>{" "}
              {renderBool(mihistorialmedico.hipertension)}
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-2">
              <strong>Historial de cáncer:</strong>{" "}
              {renderBool(mihistorialmedico.historial_cancer)}
            </Col>
            <Col md={6} className="mb-2">
              <strong>Problemas de coagulación:</strong>{" "}
              {renderBool(mihistorialmedico.problemas_coagulacion)}
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-2">
              <strong>Epilepsia:</strong>{" "}
              {renderBool(mihistorialmedico.epilepsia)}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Otras condiciones</Card.Header>
        <Card.Body>
          <Row>
            <Col md={12} className="mb-2">
              {mihistorialmedico.otras_condiciones || "—"}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MiHistorialMedico;
