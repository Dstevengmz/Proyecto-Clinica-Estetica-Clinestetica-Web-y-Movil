import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import AlertaUsuario from "../../../assets/js/alertas/usuario/AlertaUsuario";
import Validaciones from "../../../assets/js/alertas/usuario/Validaciones";

const API_URL = import.meta.env.VITE_API_URL;
const alertas = new AlertaUsuario();
const validar = new Validaciones();

function EditarUsuarioXAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    nombre: "",
    estado: "",
    cirugias_previas: "",
    tipodocumento: "",
    numerodocumento: "",
    correo: "",
    rol: "",
    genero: "",
    fecha_nacimiento: "",
    telefono: "",
    direccion: "",
    ocupacion: "",
    estado_civil: "",
    usuario: {},
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alertas.alertaConfirmacionSinToken("No estás autenticado");
      return;
    }

    const obtenerUsuarios = async () => {
      console.log("Cargando Datos Usuario para el ID:", id);
      try {
        const response = await axios.get(
          `${API_URL}/apiusuarios/buscarusuarios/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;

        if (data.fecha_nacimiento) {
          data.fecha_nacimiento = new Date(data.fecha_nacimiento)
            .toISOString()
            .split("T")[0];
        }
        setFormulario(response.data);
      } catch (error) {
        console.error("Error al cargar el Usuario:", error);
        await alertas.noSePudoCargarInfoUsuario(
          "No se pudo cargar la información del Usuario"
        );
      }
    };

    obtenerUsuarios();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const actualizarUsuario = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alertas.alertaConfirmacionSinToken("No estás autenticado");
      return;
    }
    const esValido = await validar.validarFormularioUsuario(formulario);
    if (!esValido) return;

    const result = await alertas.alertaEditarUsuarioXDoctor();
    if (result.isConfirmed) {
      try {
        await axios.patch(
          `${API_URL}/apiusuarios/editarusuarios/${id}`,
          { ...formulario, rol: formulario.rol },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await alertas.alertEditarUsuarioXAdminConfirmar(
          "Usuario actualizado correctamente"
        );
        navigate("/listarusuarios");
      } catch (error) {
        console.error("Error al actualizar el Usuario:", error);
        const mensajeVerificacion =
          error?.response?.data?.error || error?.response?.data?.message ||
          error?.message || "No se pudo actualizar el Usuario";
        await alertas.noSePudoActualizarUsuario(mensajeVerificacion);
      }
    }
  };

  return (
    <Container>
      <h1 className="mt-4">Editar Usuario</h1>
      <Form onSubmit={actualizarUsuario}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>

              <Form.Control
                type="text"
                name="nombre"
                required
                minLength={5}
                placeholder="Nombre completo"
                value={formulario.nombre}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={formulario.estado}
                onChange={handleChange}
                disabled
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de documento : </Form.Label>
              <Form.Select
                name="tipodocumento"
                value={formulario.tipodocumento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione Tipo documento</option>
                <option value="Cédula de Ciudadanía">
                  Cédula de Ciudadanía
                </option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Documento de Identificación Extranjero">
                  Documento de Identificación Extranjero
                </option>
                <option value="Permiso Especial de Permanencia">
                  Permiso Especial de Permanencia
                </option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formCondicionesPiel">
              <Form.Label>Numero Documento</Form.Label>

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
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formMedicamentos">
              <Form.Label>Correo electronico</Form.Label>

              <Form.Control
                type="email"
                name="correo"
                required
                placeholder="Correo electrónico"
                value={formulario.correo}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Rol : </Form.Label>
              <Form.Select
                name="rol"
                value={formulario.rol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione su rol</option>
                <option value="doctor">Doctor</option>
                <option value="asistente">Asistente</option>
                <option value="usuario">Usuario</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Genero : </Form.Label>
              <Form.Select
                name="genero"
                value={formulario.genero}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione su género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formFechaNacimiento">
              <Form.Label>Fecha Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fecha_nacimiento"
                value={formulario.fecha_nacimiento}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formMedicamentos">
              <Form.Label>Telefono</Form.Label>

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
          </Col>
          <Col>
            <Form.Group controlId="formMedicamentos">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formulario.direccion}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formMedicamentos">
              <Form.Label>Ocupacion</Form.Label>
              <Form.Control
                type="text"
                name="ocupacion"
                value={formulario.ocupacion}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formMedicamentos">
              <Form.Label>Estado civil</Form.Label>
              <Form.Control
                type="text"
                name="estado_civil"
                value={formulario.estado_civil}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
}

export default EditarUsuarioXAdmin;
