import { useContext } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { CategoriaContext } from "../../../contexts/CategoriaContext";
import usePerfilUsuario from "../../../hooks/usePerfilUsuario";

function DetallesCategoria() {
  const { selectedCategoria } = useContext(CategoriaContext);
  const { usuario: usuarioPerfil } = usePerfilUsuario();
  const usuario = selectedCategoria?.usuario || usuarioPerfil || {};

  if (!selectedCategoria) {
    return (
      <p className="text-center mt-4">
        Selecciona una categoría para ver los detalles.
      </p>
    );
  }
  return (
    <div>
      <Card className="mb-4">
        <Card.Body>
          <h4>Detalles del Usuario</h4>
          <Row>
            <Col md={6}>
              <p>
                <strong>Nombre:</strong> {usuario?.nombre || "N/A"}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Correo:</strong> {usuario?.correo || "N/A"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <strong>Teléfono:</strong> {usuario?.telefono || "N/A"}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Dirección:</strong>{" "}
                {usuario?.direccion || "No registrada"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <strong>Rol:</strong> {usuario?.rol || "N/A"}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h4>Detalles de Categoria </h4>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formEnfermedades">
                  <Form.Label>Nombre:</Form.Label>
                  <Form.Control type="text" value={selectedCategoria.nombre || ""} disabled />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formAlergias">
                  <Form.Label>Descripción:</Form.Label>
                  <Form.Control type="text" value={selectedCategoria.descripcion || ""} disabled />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formCirugias">
                  <Form.Label>Estado:</Form.Label>
                  <Form.Control type="text" value={selectedCategoria.estado ? "Activa" : "Inactiva"} disabled />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DetallesCategoria;