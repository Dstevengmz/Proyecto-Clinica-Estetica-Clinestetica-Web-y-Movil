import { useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import useEnviarContacto from "../../hooks/useContacto";
import ContactoAlerta from "../../assets/js/alertas/contacto/Contacto";

const Contacto = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const { enviarContacto, loading } = useEnviarContacto();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await enviarContacto(form);

      ContactoAlerta.mostrarAlertaContacto(
        "¡Mensaje enviado!",
        "Tu mensaje ha sido enviado correctamente. Te responderemos pronto.",
        "success"
      );

      // Limpiar el formulario después de enviar
      setForm({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });
    } catch (err) {
      console.error("Error al enviar el mensaje de contacto:", err);

      ContactoAlerta.mostrarAlertaContacto(
        "Error",
        err?.userMessage || "No se pudo enviar el mensaje. Intenta nuevamente.",
        "error"
      );
    }
  };

  return (
    <Container style={{ paddingBottom: "2rem" }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mt-5">
            <Card.Body>
              <h2 className="mb-4">Contacto</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tuemail@ejemplo.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Asunto</Form.Label>
                  <Form.Control
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    placeholder="Motivo del mensaje"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí"
                    required
                  />
                </Form.Group>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Enviando…
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacto;
