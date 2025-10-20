import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import useEditarCategoriaProcedimiento from "../../../hooks/useEditarCategoriaProcedimiento";
import alerta from "../../../assets/js/alertas/categoria/AlertaCategoria";
function EditarCategoriaProcedimiento() {
  const alertas = new alerta();
  const { id } = useParams();
  const navigate = useNavigate();

  const { categoria, cargando, actualizando, error, editarCategoria } =
    useEditarCategoriaProcedimiento(id);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    estado: "true",
    usuario: {},
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (categoria) {
      setFormulario({
        nombre: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
        estado: String(Boolean(categoria.estado)),
        usuario: categoria.usuario || {},
      });
    }
  }, [categoria]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    if (!formulario.nombre?.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    }
    if (!String(formulario.estado).trim()) {
      nuevosErrores.estado = "El estado es requerido";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      await alertas.alertaCamposRequerido?.();
      return;
    }

    try {
      const confirm = await alertas.EditarCategoriaExito();
      if (!confirm.isConfirmed) return;
      await editarCategoria({
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        estado: formulario.estado === "true",
      });
      await alertas.alertaEditarCategoriaCreadaExito();

      navigate("/categoriaprocedimientos");
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);

      const msg = error?.response?.data?.message || error?.message;
      if (msg && msg.toLowerCase().includes("nombre")) {
        setErrores((prev) => ({ ...prev, nombre: msg }));
        await alertas.alertaNombreRequerido?.();
      } else {
        await alertas.alertaNoSePudoEditarCrearCategoria();
      }
    }
  };

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar la categoría</p>;

  return (
    <Container>
      <h1 className="mt-4">Editar Categoría de Procedimiento</h1>
      <Card className="mb-4">
        <Card.Body>
          <h4>Detalles del Usuario</h4>
          <Row>
            <Col md={6}>
              <p>
                <strong>Nombre:</strong> {formulario.usuario?.nombre || "N/A"}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Correo:</strong> {formulario.usuario?.correo || "N/A"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <strong>Teléfono:</strong>{" "}
                {formulario.usuario?.telefono || "N/A"}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Dirección:</strong>{" "}
                {formulario.usuario?.direccion || "No registrada"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <strong>Rol:</strong> {formulario.usuario?.rol || "N/A"}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            disabled={actualizando}
            isInvalid={!!errores.nombre}
          />
          <Form.Control.Feedback type="invalid">
            {errores.nombre}
          </Form.Control.Feedback>
        </Form.Group>

        <Col>
          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              placeholder="Descripción breve de la categoría"
              disabled={actualizando}
              isInvalid={!!errores.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {errores.descripcion}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Form.Group controlId="formEstado">
          <Form.Label>Estado</Form.Label>
          <Form.Select
            name="estado"
            value={formulario.estado}
            onChange={handleChange}
            disabled={actualizando}
            isInvalid={!!errores.estado}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errores.estado}
          </Form.Control.Feedback>
        </Form.Group>
        <br />
        <Button variant="primary" type="submit" disabled={actualizando}>
          {actualizando ? "Guardando..." : "Guardar Cambios"}
        </Button>
        <Button
          type="button"
          className="ms-2 btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </Button>
      </Form>
    </Container>
  );
}

export default EditarCategoriaProcedimiento;
