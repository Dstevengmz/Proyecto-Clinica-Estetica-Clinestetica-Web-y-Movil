import { useContext } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { ListarUsuariosContext } from "../../../contexts/ListarUsuariosContext";

function UserDetail() {
  const { selectedListarusuarios } = useContext(ListarUsuariosContext);

  if (!selectedListarusuarios) {
    return (
      <p className="text-center mt-4">
        Selecciona un Usuarios para ver los detalles
      </p>
    );
  }
  return (
    <div>
      <h2 className="text-center mb-4">Detalles del Usuario</h2>
      <Card>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedListarusuarios.nombre || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formEstado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedListarusuarios.estado ? "Activo" : "Inactivo"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formTipoDocumento">
                  <Form.Label>Tipo De Documento</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedListarusuarios.tipodocumento || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formNumeroDocumento">
                  <Form.Label>Numero De Documento</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedListarusuarios.numerodocumento || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formCorreo">
                  <Form.Label>Correo Electronico</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedListarusuarios.correo || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formRol">
                  <Form.Label>Rol</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedListarusuarios.rol || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formGenero">
                  <Form.Label>Género</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedListarusuarios.genero || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formFechaNacimiento">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedListarusuarios.fecha_nacimiento || "Sin fecha de nacimiento"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
              <Form.Group controlId="formFechaNacimiento">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedListarusuarios.telefono || "Sin numero de telefono"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
              <Form.Group controlId="formFechaNacimiento">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedListarusuarios.direccion || "Sin Dirección"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
               <Form.Group controlId="formFechaNacimiento">
                  <Form.Label>Ocupación</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedListarusuarios.ocupacion || "Sin Definir"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
              <Form.Group controlId="formFechaNacimiento">
                  <Form.Label>Estado Civil</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedListarusuarios.estado_civil || "No Definido"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formFechaNacimiento">
                  <Form.Label>Fecha de Registro</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedListarusuarios.fecha_registro || "Sin fecha de registro"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserDetail;
