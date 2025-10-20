import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card, Spinner, Container, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import useRecuperarContrasena from "../../../hooks/useRecuperarContrasena";

function ResetearContrasena() {
  const { token } = useParams();
  const navigate = useNavigate(); // 👈 para redirigir
  const { resetearContrasena, loading } = useRecuperarContrasena();

  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const validarContrasena = () => {
    if (nueva.length < 6) {
      Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "warning");
      return false;
    }
    if (nueva !== confirmar) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validarContrasena()) return;

    try {
      await resetearContrasena(token, nueva);
      await Swal.fire("Éxito", "Tu contraseña fue actualizada correctamente.", "success");

      // 👇 Redirección al login
      navigate("/login", { replace: true });

    } catch (err) {
      Swal.fire(
        "Error",
        err?.userMessage || "Hubo un problema al actualizar la contraseña",
        "error"
      );
    }
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center"
    >
      <Card className="p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="mb-3 text-center">Restablecer contraseña</h3>
        <Form onSubmit={onSubmit}>
          {/* Nueva contraseña */}
          <Form.Group className="mb-3">
            <Form.Label>Nueva contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={mostrarNueva ? "text" : "password"}
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                required
                placeholder="Ingresa tu nueva contraseña"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setMostrarNueva((prev) => !prev)}
              >
                {mostrarNueva ? <EyeSlashFill /> : <EyeFill />}
              </Button>
            </InputGroup>
          </Form.Group>

          {/* Confirmar contraseña */}
          <Form.Group>
            <Form.Label>Confirmar contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={mostrarConfirmar ? "text" : "password"}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
                placeholder="Confirma tu nueva contraseña"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setMostrarConfirmar((prev) => !prev)}
              >
                {mostrarConfirmar ? <EyeSlashFill /> : <EyeFill />}
              </Button>
            </InputGroup>
          </Form.Group>

          {/* Botón */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-3 w-100"
            variant="primary"
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Actualizando...
              </>
            ) : (
              "Actualizar contraseña"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ResetearContrasena;
