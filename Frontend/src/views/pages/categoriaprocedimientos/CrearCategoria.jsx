import React, { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useCrearCategoria from "../../../hooks/useCrearCategoria";
import AlertasCategoria from "../../../assets/js/alertas/categoria/AlertaCategoria";

function CrearCategoria() {
  const navigate = useNavigate();
  const { crearCategoria, loading, error } = useCrearCategoria();
  const alertas = new AlertasCategoria();
  const [form, setForm] = useState({ nombre: "", descripcion: "", estado: true });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirm = await alertas.confirmarGuardarCategoria();
      if (!confirm.isConfirmed) return; 

      const creada = await crearCategoria(form);
      if (creada && creada.id) {
        await alertas.alertaCategoriaCreadaExito();
        navigate("/categoriaprocedimientos");
      } else {
        await alertas.alertaNoSePudoCrearCategoria();
      }
    } catch (e) {
      const status = e?.response?.status || e?.status;
      if (status === 409) {
        await alertas.alertaNombreDuplicado();
      } else if (status === 400) {
        await alertas.alertaNombreRequerido();
      } else {
        await alertas.alertaErrorCrearCategoria();
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Crear Categoría de Procedimientos</h2>
      {error && (
        <Alert variant="danger">{error.userMessage || "Error al crear la categoría."}</Alert>
      )}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            placeholder="Ej. Facial"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={form.descripcion}
            onChange={onChange}
            placeholder="Descripción breve de la categoría"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Activa"
            name="estado"
            checked={form.estado}
            onChange={onChange}
          />
        </Form.Group>

        <Button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Creando...
            </>
          ) : (
            "Crear categoría"
          )}
        </Button>

        <Button type="button" className="ms-2 btn btn-secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </Form>
    </Container>
  );
}

export default CrearCategoria;