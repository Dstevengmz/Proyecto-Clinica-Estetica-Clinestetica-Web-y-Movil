import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import useCategorias from "../../../hooks/useListarCategorias";
import AlertaProcedimiento from "../../../assets/js/alertas/procedimientos/AlertaProcedimiento";
const API_URL = import.meta.env.VITE_API_URL;

function EditarProcedimientos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const alerta = useMemo(() => new AlertaProcedimiento(), []);
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    requiere_evaluacion: "",
    duracion: "",
    examenes_requeridos: "",
    imagen: null,
    imagenes: [],
    categoriaId: "",
    recomendaciones_previas: false,
    usuario: {},
  });
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const extraInputRef = useRef(null);
  const [extraSelection, setExtraSelection] = useState([]);
  const [extraPreviews, setExtraPreviews] = useState([]);
  const { categorias } = useCategorias();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No estás autenticado");
      return;
    }

    const obtenerProcedimiento = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/apiprocedimientos/buscarprocedimiento/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const proc = response.data || {};
        setFormulario({
          ...proc,
          categoriaId: proc?.categoriaId ?? proc?.categoria?.id ?? "",
          requiere_evaluacion: Boolean(proc?.requiere_evaluacion),
          examenes_requeridos: Boolean(proc?.examenes_requeridos),
          imagenes: [],
        });
        const existentes = Array.isArray(proc.imagenes)
          ? proc.imagenes
              .map((i) => ({ id: i.id ?? null, url: i.url }))
              .filter((i) => Boolean(i.url))
          : proc.imagen
          ? [{ id: null, url: proc.imagen }]
          : [];
        setImagenesExistentes(existentes);
      } catch (error) {
        console.error("Error al cargar el procedimiento:", error);
        await alerta.alertaNoSeCargoInformacionDelProcedimiento();
        navigate("/consultarprocedimientos");
      }
    };

    obtenerProcedimiento();
  }, [id, alerta, navigate]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (name === "imagenes" && type === "file") {
      setExtraSelection(Array.from(files || []));
      return;
    }
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]:
        type === "checkbox"
          ? Boolean(checked)
          : type === "file"
          ? files?.[0]
          : value,
    }));
  };

  useEffect(() => {
    const urls = (formulario.imagenes || [])
      .filter((f) => f instanceof File)
      .map((f) => URL.createObjectURL(f));
    setExtraPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [formulario.imagenes]);

  const agregarImagenesAdicionales = async () => {
    if (!extraSelection || extraSelection.length === 0) return;
    const max = 10;
    const actuales =
      (formulario.imagenes || []).length +
      imagenesExistentes.length -
      imagenesAEliminar.length;
    const disponibles = max - actuales;
    if (disponibles <= 0) {
       await alerta.alertaImagenesExcedidas();
      return;
    }
    const aAgregar = extraSelection.slice(0, disponibles);
    setFormulario((prev) => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), ...aAgregar],
    }));
    setExtraSelection([]);
    if (extraInputRef.current) extraInputRef.current.value = "";
  };

  const keyImagen = (img) => (img?.id ?? img?.url);
  const marcarEliminarExistente = (img) => {
    const clave = keyImagen(img);
    setImagenesAEliminar((prev) =>
      prev.includes(clave) ? prev.filter((u) => u !== clave) : [...prev, clave]
    );
  };

  const eliminarNuevaSeleccionada = (index) => {
    setFormulario((prev) => {
      const copia = [...(prev.imagenes || [])];
      copia.splice(index, 1);
      return { ...prev, imagenes: copia };
    });
  };

  const actualizarProcedmiento = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado");
        return;
      }

      // Confirm before proceeding with the update
      const { isConfirmed } = await alerta.confirmarGuardarEditarProcedimiento();
      if (!isConfirmed) return;

      const formData = new FormData();
      for (const key in formulario) {
        if (key === "imagen") {
          if (formulario.imagen instanceof File) {
            formData.append("imagen", formulario.imagen);
          }
        } else if (key === "imagenes") {
          (formulario.imagenes || []).forEach((file) => {
            if (file instanceof File) {
              formData.append("imagenes", file);
            }
          });
        } else {
          formData.append(key, formulario[key]);
        }
      }

      imagenesExistentes
        .filter((img) => imagenesAEliminar.includes(keyImagen(img)))
        .forEach((img) => formData.append("imagenes_eliminar[]", img.id ?? img.url));

      await axios.patch(
        `${API_URL}/apiprocedimientos/editarprocedimiento/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await alerta.alertaProcedimientoEditarCreadoExito();
      navigate("/consultarprocedimientos");
    } catch (error) {
      console.error("Error al actualizar el procedimiento:", error);
      await alerta.alertaErrorEditarProcedimiento();
    }
  };

  return (
    <Container>
      <h1 className="mt-4">Editar Procedimiento</h1>
      <Card className="mb-4">
        <Card.Body>
          <h4>Detalles del Usuario</h4>
          <Row>
            <Col md={6}>
              <p>
                <strong>Nombre:</strong> {formulario.usuario?.nombre}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Correo:</strong> {formulario.usuario?.correo}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <strong>Teléfono:</strong> {formulario.usuario?.telefono}
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
                <strong>Rol:</strong> {formulario.usuario?.rol}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Form onSubmit={actualizarProcedmiento}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formDuracion">
              <Form.Label>Duracion</Form.Label>
              <Form.Control
                type="text"
                name="duracion"
                value={formulario.duracion}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Requiere Evaluacion?"
              name="requiere_evaluacion"
              checked={formulario.requiere_evaluacion}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Check
              type="checkbox"
              label="¿Requiere examenes?"
              name="examenes_requeridos"
              checked={formulario.examenes_requeridos}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formPrecio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                name="precio"
                value={formulario.precio}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formImagen">
              <Form.Label>Imagen principal</Form.Label>
              <Form.Control
                type="text"
                value={
                  formulario.imagen instanceof File
                    ? formulario.imagen.name
                    : formulario.imagen || ""
                }
                readOnly
                disabled
              />
              <Form.Control
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formImagenesMultiples">
              <Form.Label>Imágenes adicionales (máx. 10)</Form.Label>
                {imagenesExistentes.length > 0 && (
                  <div className="mb-2 d-flex flex-wrap gap-2">
                    {imagenesExistentes.map((img) => (
                      <div key={keyImagen(img)} className="position-relative border rounded p-1" style={{ width: 120 }}>
                        <img src={img.url} alt="existente" style={{ width: 100, height: 100, objectFit: "cover" }} />
                        <Form.Check
                          type="checkbox"
                          label="Eliminar"
                          className="mt-1"
                          checked={imagenesAEliminar.includes(keyImagen(img))}
                          onChange={() => marcarEliminarExistente(img)}
                        />
                      </div>
                    ))}
                  </div>
                )}

              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="file"
                  name="imagenes"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  ref={extraInputRef}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={agregarImagenesAdicionales}
                  disabled={extraSelection.length === 0}
                >
                  Agregar
                </Button>
              </div>

              {(formulario.imagenes || []).length > 0 && (
                <div className="mt-3">
                  <div className="d-flex flex-wrap gap-2">
                    {(formulario.imagenes || []).map((file, idx) => (
                      <div
                        key={idx}
                        className="position-relative border rounded p-1"
                        style={{ width: 120 }}
                      >
                        <img
                          src={extraPreviews[idx]}
                          alt={`nueva-${idx}`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          className="position-absolute top-0 end-0 translate-middle"
                          onClick={() => eliminarNuevaSeleccionada(idx)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                  <small className="text-muted d-block mt-1">
                    Total al guardar:{" "}
                    {imagenesExistentes.length -
                      imagenesAEliminar.length +
                      (formulario.imagenes || []).length}{" "}
                    / 10
                  </small>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                name="categoriaId"
                value={formulario.categoriaId}
                onChange={handleChange}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formRecomendacionesPrevias">
              <Form.Label>Recomendaciones Previas</Form.Label>
              <Form.Control
                type="text"
                name="recomendaciones_previas"
                value={formulario.recomendaciones_previas}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Guardar Cambios
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </Form>
    </Container>
  );
}

export default EditarProcedimientos;
