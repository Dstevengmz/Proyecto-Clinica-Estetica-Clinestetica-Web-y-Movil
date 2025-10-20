import { useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import useRecuperarContrasena from "../../../hooks/useRecuperarContrasena";

function OlvideContrasena() {
  const [correo, setCorreo] = useState("");
  const { solicitarReset, loading } = useRecuperarContrasena();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await solicitarReset(correo);
      Swal.fire("Éxito", "Revisa tu correo para continuar", "success");
    } catch (err) {
      Swal.fire("Error", err.userMessage, "error");
    }
  };

  return (
    <Card className="p-4">
      <h3>Recuperar contraseña</h3>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" disabled={loading} className="mt-3">
          {loading ? <Spinner size="sm" animation="border" /> : "Enviar"}
        </Button>
      </Form>
    </Card>
  );
}

export default OlvideContrasena;
