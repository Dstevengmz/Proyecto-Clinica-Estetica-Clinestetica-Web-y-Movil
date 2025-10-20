import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import useCategorias from "../../../hooks/useListarCategorias";
import AlertaProcedimiento from "../../../assets/js/alertas/procedimientos/AlertaProcedimiento";

import { CButton } from "@coreui/react";
const API_URL = import.meta.env.VITE_API_URL;

function RegistrarProcedimiento() {
  const [usuario, setUsuario] = useState({});
  const navigate = useNavigate();
  const alertas = new AlertaProcedimiento();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [otro, setOtro] = useState(false);

  useEffect(() => {
    async function obtenerDatosUsuario() {
      try {
        const response = await axios.get(`${API_URL}/apiusuarios/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(response.data.usuario);
      } catch (error) {
        console.error("Error al obtener datos del usuario", error);
      }
    }

    obtenerDatosUsuario();
  }, [token]);

  const params = new URLSearchParams(location.search);
  const categoriaIdInicial = params.get("categoriaId") || "";

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    requiere_evaluacion: false,
    duracion: "",
    examenes_requeridos: false,
  imagen: null,
  imagenes: [],
    categoriaId: categoriaIdInicial,
    recomendaciones_previas: "",
  });

  const { categorias } = useCategorias();
  const extraInputRef = useRef(null);
  const [extraSelection, setExtraSelection] = useState([]);
  const [extraPreviews, setExtraPreviews] = useState([]);

  const manejarCambio = (e) => {
    const { name, value, type, checked, files } = e.target;
    // Para imágenes adicionales usamos un flujo con botón "Agregar"
    if (name === "imagenes" && type === "file") {
      setExtraSelection(Array.from(files || []));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] : value,
    }));
  };

  useEffect(() => {
    const urls = formData.imagenes.map((file) => URL.createObjectURL(file));
    setExtraPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [formData.imagenes]);

  const agregarImagenesAdicionales = () => {
    if (!extraSelection || extraSelection.length === 0) return;
    const max = 10;
    const disponibles = max - formData.imagenes.length;
    if (disponibles <= 0) {
      alert("Puedes subir máximo 10 imágenes adicionales.");
      return;
    }

    const aAgregar = extraSelection.slice(0, disponibles);
    setFormData((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, ...aAgregar],
    }));
    setExtraSelection([]);
    if (extraInputRef.current) extraInputRef.current.value = "";
  };

  const eliminarImagenAdicional = (index) => {
    setFormData((prev) => {
      const copia = [...prev.imagenes];
      copia.splice(index, 1);
      return { ...prev, imagenes: copia };
    });
  };
  const manejarDuracion = (e) => {
    const value = e.target.value;
    if (value === "otro") {
      setOtro(true);
      setFormData((prev) => ({ ...prev, duracion: "" }));
    } else {
      setOtro(false);
      setFormData((prev) => ({ ...prev, duracion: value }));
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const datos = new FormData();
    Object.entries(formData).forEach(([clave, valor]) => {
      if (clave === "imagenes") {
        (valor || []).forEach((file) => datos.append("imagenes", file));
      } else {
        datos.append(clave, valor);
      }
    });
    datos.append("id_usuario", usuario.id);

    try {
      const confirmar = await alertas.confirmarGuardarProcedimiento();
      if (!confirmar.isConfirmed) return;

      await axios.post(
        `${API_URL}/apiprocedimientos/crearprocedimiento`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await alertas.alertaProcedimientoCreadoExito();
      navigate("/consultarprocedimientos");
    } catch (error) {
      console.error("Error al registrar procedimiento:", error);
      await alertas.alertaErrorCrearProcedimiento();
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-center justify-content-md-between mb-3 gap-2 mt-3">
        <h1 className="mb-0">Crear Servicio</h1>
        <div>
          <CButton
            color="primary"
            size="sm"
            onClick={() => navigate("/categoriaprocedimientoscrear")}
          >
            <i className="bi bi-plus-circle me-1"></i> Crear Categoría
          </CButton>
        </div>
      </div>

      <Form onSubmit={manejarEnvio}>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={formData.nombre}
            onChange={manejarCambio}
            required
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            name="descripcion"
            value={formData.descripcion}
            onChange={manejarCambio}
            required
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="precio"
            value={formData.precio}
            onChange={manejarCambio}
            required
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="¿Requiere evaluación previa?"
            name="requiere_evaluacion"
            checked={formData.requiere_evaluacion}
            onChange={manejarCambio}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Duración (minutos)</Form.Label>
          <Form.Select
            value={otro ? "otro" : formData.duracion}
            onChange={manejarDuracion}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="30">30</option>
            <option value="60">60</option>
            <option value="90">90</option>
            <option value="120">120</option>
            <option value="otro">Otro</option>
          </Form.Select>

          {otro && (
            <Form.Control
              type="number"
              name="duracion"
              value={formData.duracion}
              onChange={manejarCambio}
              placeholder="Ingrese duración en minutos"
              className="mt-2"
              required
            />
          )}
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Imagen principal</Form.Label>
          <Form.Control
            type="file"
            name="imagen"
            accept="image/*"
            onChange={manejarCambio}
            required
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Imágenes adicionales (máx. 10)</Form.Label>
          <div className="d-flex gap-2 align-items-center">
            <Form.Control
              type="file"
              name="imagenes"
              accept="image/*"
              multiple
              onChange={manejarCambio}
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
          {formData.imagenes.length > 0 && (
            <div className="mt-3">
              <div className="d-flex flex-wrap gap-2">
                {formData.imagenes.map((file, idx) => (
                  <div key={idx} className="position-relative border rounded p-1" style={{ width: 96 }}>
                    <img
                      src={extraPreviews[idx]}
                      alt={`imagen-${idx + 1}`}
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      className="position-absolute top-0 end-0 translate-middle"
                      onClick={() => eliminarImagenAdicional(idx)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <small className="text-muted d-block mt-1">
                Seleccionadas: {formData.imagenes.length} / 10
              </small>
            </div>
          )}
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Categoría</Form.Label>
          <Form.Select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Recomendaciones Previas</Form.Label>
          <Form.Control
            as="textarea"
            name="recomendaciones_previas"
            value={formData.recomendaciones_previas}
            onChange={manejarCambio}
          />
        </Form.Group>
        <br />
        <Button type="submit" className="mt-3 btn btn-primary">
          Registrar Procedimiento
        </Button>
        <Button
          type="button"
          className="mt-3 ms-2 btn btn-secondary"
          onClick={() => navigate("/consultarprocedimientos")}
        >
          Cancelar
        </Button>
      </Form>
    </Container>
  );
}

export default RegistrarProcedimiento;
