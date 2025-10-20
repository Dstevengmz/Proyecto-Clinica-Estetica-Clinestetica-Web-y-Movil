import { useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import useCambiarContrasena from "../../../hooks/userCambiarContrasena";
import { useNavigate } from "react-router-dom";
function CambiarContrasena() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const { cambiarContrasena, loading } = useCambiarContrasena();
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await cambiarContrasena({ actual, nueva });
      await Swal.fire("Éxito", "Contraseña actualizada correctamente", "success");
      navigate("/dashboard", { replace: true });

      setActual("");
      setNueva("");
    } catch (err) {
      Swal.fire("Error", err.userMessage, "error");
    }
  };

  return (
    <Card className="p-4">
      <h3>Cambiar Contraseña</h3>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Contraseña actual</Form.Label>
          <Form.Control
            type="password"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nueva contraseña</Form.Label>
          <Form.Control
            type="password"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" disabled={loading} className="mt-3">
          {loading ? <Spinner size="sm" animation="border" /> : "Actualizar"}
        </Button>
      </Form>
    </Card>
  );
}

export default CambiarContrasena;
