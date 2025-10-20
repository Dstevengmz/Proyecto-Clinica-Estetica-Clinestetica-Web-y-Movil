import { Form, Row, Col, Card, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cargando from "../../../components/Cargando";
import useUsuarioPorId from "../../../hooks/useBuscarUsuario";
import useActualizarUsuario from "../../../hooks/useEditarUsuario";
import AlertaUsuario from "../../../assets/js/alertas/usuario/AlertaUsuario";
import Validaciones from "../../../assets/js/alertas/usuario/Validaciones";
const alertas = new AlertaUsuario();
const validar = new Validaciones();
function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    rol: "",
    tipodocumento: "",
    numerodocumento: "",
    telefono: "",
    direccion: "",
    genero: "",
    fecha_nacimiento: "",
    ocupacion: "",
    estado_civil: "",
  });

  const {
    usuario,
    cargando: cargandoUsuario,
    error,
  } = useUsuarioPorId(id, token);
  const { editarUsuario, cargando: cargandoActualizacion } =
    useActualizarUsuario(id);

  useEffect(() => {
    if (usuario) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (isNaN(d)) return dateString;
        return d.toISOString().split("T")[0];
      };
      setFormulario({
        nombre: usuario.nombre || "",
        correo: usuario.correo || "",
        rol: usuario.rol || "",
        tipodocumento: usuario.tipodocumento || "",
        numerodocumento: usuario.numerodocumento || "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
        genero: usuario.genero || "",
        fecha_nacimiento: formatDateForInput(usuario.fecha_nacimiento),
        ocupacion: usuario.ocupacion || "",
        estado_civil: usuario.estado_civil || "",
      });
    }
  }, [usuario]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const esValido = await validar.validarFormularioUsuario(formulario);
    if (!esValido) return;

    try {
      const correoOriginal = (usuario?.correo || "").trim().toLowerCase();

      const usuarioActualizado = await editarUsuario(formulario);

      const correoNuevo = (
        (usuarioActualizado?.correo ?? formulario?.correo) ||
        ""
      )
        .trim()
        .toLowerCase();

      if (correoNuevo && correoNuevo !== correoOriginal) {
        localStorage.removeItem("token");
        try {
          localStorage.setItem("ultimoCorreoActualizado", correoNuevo);
        } catch {
          //
        }

        await alertas.alertaConfirmacionSinToken(
          "Usuario actualizado. Debes iniciar sesión nuevamente."
        );
        navigate("/iniciarsesion", { replace: true });
        return;
      }
      await alertas.alertEditarUsuarioXAdminConfirmar(
        "Usuario actualizado exitosamente."
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      const verificacionMensaje =
        error?.response?.data?.error || error?.response?.data?.message ||
        error?.message || "No se pudo actualizar el usuario. Intenta nuevamente.";
      await alertas.noSePudoActualizarUsuario(verificacionMensaje);
    }
  };

  if (cargandoUsuario) {
    return <Cargando texto="Cargando datos del usuario..." />;
  }

  if (error) {
    return (
      <Container>
        <div className="alert alert-danger mt-4">
          <h4>Error al cargar el usuario</h4>
          <p>{error.message || error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => navigate("/listarusuarios")}
          >
            Volver a la lista de usuarios
          </button>
        </div>
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container>
        <div className="alert alert-warning mt-4">
          <h4>Usuario no encontrado</h4>
          <p>
            El usuario que intentas editar no existe o no tienes permisos para
            verlo.
          </p>
          <button
            className="btn btn-outline-warning"
            onClick={() => navigate("/listarusuarios")}
          >
            Volver a la lista de usuarios
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mt-4">Editar Usuario</h2>
      <Card className="mb-4">
        <Card.Body>
          <h5>Información Actual del Usuario</h5>
          <Row>
            <Col md={4}>
              <p>
                <strong>Nombre:</strong> {formulario.nombre}
              </p>
            </Col>
            <Col md={4}>
              <p>
                <strong>correo:</strong> {formulario.correo}
              </p>
            </Col>
            <Col md={4}>
              <p>
                <strong>Rol:</strong> {formulario.rol}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Form onSubmit={manejarSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre : </Form.Label>

          <Form.Control
            type="text"
            name="nombre"
            required
            minLength={3}
            placeholder="Nombre completo"
            value={formulario.nombre}
            onChange={manejarCambio}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Correo : </Form.Label>
          <Form.Control
            type="email"
            name="correo"
            value={formulario.correo}
            onChange={manejarCambio}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo de documento : </Form.Label>
          <Form.Select
            name="tipodocumento"
            value={formulario.tipodocumento}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione Tipo documento</option>
            <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Documento de Identificación Extranjero">
              Documento de Identificación Extranjero
            </option>
            <option value="Permiso Especial de Permanencia">
              Permiso Especial de Permanencia
            </option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Numero documento : </Form.Label>

          <Form.Control
            type="text"
            name="numerodocumento"
            required
            maxLength={10}
            placeholder="Número de documento"
            value={formulario.numerodocumento}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setFormulario((prev) => ({
                  ...prev,
                  numerodocumento: value,
                }));
              }
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Numero Ceular : </Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            required
            maxLength={12}
            pattern="[0-9]{7,12}"
            title="Debe tener entre 7 y 12 dígitos numéricos"
            placeholder="Teléfono"
            value={formulario.telefono}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setFormulario((prev) => ({ ...prev, telefono: value }));
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Direccion : </Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={formulario.direccion}
            onChange={manejarCambio}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Genero : </Form.Label>
          <Form.Select
            name="genero"
            value={formulario.genero}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione su género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha De Nacimiento : </Form.Label>
          <Form.Control
            type="date"
            name="fecha_nacimiento"
            value={formulario.fecha_nacimiento}
            onChange={manejarCambio}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Ocupacion : </Form.Label>
          <Form.Control
            type="text"
            name="ocupacion"
            value={formulario.ocupacion}
            onChange={manejarCambio}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Estado Civil : </Form.Label>
          <Form.Control
            type="text"
            name="estado_civil"
            value={formulario.estado_civil}
            onChange={manejarCambio}
            required
          />
        </Form.Group>
        <button
          type="submit"
          className="btn btn-success me-2"
          disabled={cargandoActualizacion}
        >
          {cargandoActualizacion ? "Actualizando..." : "Actualizar"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
          disabled={cargandoActualizacion}
        >
          Cancelar
        </button>
      </Form>
    </Container>
  );
}

export default EditarUsuario;
