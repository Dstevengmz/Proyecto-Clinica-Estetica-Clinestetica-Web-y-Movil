import { Card, Col, Row } from "react-bootstrap";

const InformacionUsuario = ({ usuario }) => (
  <Card className="mb-4">
    <Card.Body>
      <h5>Información del Usuario</h5>
      <Row>
        <Col md={6}><p><strong>Nombre:</strong> {usuario?.nombre || "No disponible"}</p></Col>
        <Col md={6}><p><strong>Correo:</strong> {usuario?.correo || "No disponible"}</p></Col>
        <Col md={6}><p><strong>Teléfono:</strong> {usuario?.telefono || "No disponible"}</p></Col>
        <Col md={6}><p><strong>Dirección:</strong> {usuario?.direccion || "No registrada"}</p></Col>
        <Col md={6}><p><strong>Rol:</strong> {usuario?.rol || "No disponible"}</p></Col>
      </Row>
    </Card.Body>
  </Card> 
);

export default InformacionUsuario;