import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import usePacientesPorDoctor from "../../../hooks/usePacientesPorDoctor";
import CIcon from "@coreui/icons-react";
import { cilCalendarCheck } from "@coreui/icons";

function ListaPacientesDoctor() {
  const navigate = useNavigate();
  const { pacientes, cargando, error } = usePacientesPorDoctor();

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);

  const pacientesUnicos = useMemo(() => {
    return Array.from(
      new Map(pacientes.map((p) => [p.usuario?.correo, p.usuario])).values()
    );
  }, [pacientes]);

  useEffect(() => {
    if (!terminoBusqueda.trim()) {
      setPacientesFiltrados(pacientesUnicos);
    } else {
      const t = terminoBusqueda.toLowerCase().trim();
      setPacientesFiltrados(
        pacientesUnicos.filter(
          (u) =>
            u?.nombre?.toLowerCase().includes(t) ||
            u?.correo?.toLowerCase().includes(t) ||
            u?.numerodocumento?.toLowerCase().includes(t)
        )
      );
    }
  }, [terminoBusqueda, pacientesUnicos]);

  if (cargando) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="outline-success"
          onClick={() => navigate("/calendariocitas")}
        >
          <CIcon icon={cilCalendarCheck} className="me-2" />
          Ir al Calendario
        </Button>

        <Button
          variant="outline-success"
          onClick={() => navigate("/vertodocita")}
        >
          <CIcon icon={cilCalendarCheck} className="me-2" />
          Ver Todo
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre, correo o documento..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
      </Form.Group>

      <Table hover bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Correo</th>
            <th>Documento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientesFiltrados.map((u) => (
            <tr key={u?.correo}>
              <td>{u?.id}</td>
              <td>{u?.nombre}</td>
              <td>{u?.correo}</td>
              <td>{u?.numerodocumento}</td>
              <td>
                <Button
                  size="sm"
                  onClick={() => navigate(`/citaspaciente/${u?.id}`)}
                >
                  Ver citas
                </Button>
              </td>
            </tr>
          ))}
          {pacientesFiltrados.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No se encontraron pacientes
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ListaPacientesDoctor;
