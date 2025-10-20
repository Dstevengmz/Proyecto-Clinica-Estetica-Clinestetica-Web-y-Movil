import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cibCassandra, cilPenAlt, cilXCircle } from "@coreui/icons";
import useEliminarCitaPaciente from "../../../hooks/useEliminarCita";
import { CitasContext, useCitasContext } from "../../../contexts/CitasContext";
import useCitasPacienteDoctor from "../../../hooks/useCitasPacienteDoctor";

function CitasPaciente() {
  const { usuarioId } = useParams();
  const navigate = useNavigate();
  const { selectedCitas, setSelectedCitas } = useCitasContext();

  const { citas, cargando, error, reload } = useCitasPacienteDoctor(usuarioId);
  const eliminarCita = useEliminarCitaPaciente(() => reload());

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [citasFiltradas, setCitasFiltradas] = useState(citas);

  useEffect(() => {
    if (!terminoBusqueda.trim()) {
      setCitasFiltradas(citas);
    } else {
      const t = terminoBusqueda.toLowerCase();
      setCitasFiltradas(
        citas.filter(
          (c) =>
            c.id.toString().includes(t) ||
            c.tipo?.toLowerCase().includes(t) ||
            c.estado?.toLowerCase().includes(t) ||
            c.usuario?.nombre?.toLowerCase().includes(t)
        )
      );
    }
  }, [terminoBusqueda, citas]);

  const citasAMostrar = useMemo(() => citasFiltradas, [citasFiltradas]);

  const selectCitas = (cita) => {
    setSelectedCitas(cita);
    navigate("/detallescitas/" + cita.id);
  };

  if (cargando) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <CitasContext.Provider value={{ selectedCitas, setSelectedCitas }}>
      <div className="card-body">
        <h4 className="mb-3">
          Citas del paciente: {citas[0]?.usuario?.nombre || "Desconocido"}
        </h4>

        {/* Buscador */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar cita por id, tipo, estado o nombre..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />

        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
              <CTableHeaderCell>Tipo</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Opciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {!citasAMostrar || citasAMostrar.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={5} className="text-center text-muted">
                  No hay citas registradas para este paciente.
                </CTableDataCell>
              </CTableRow>
            ) : (
              citasAMostrar.map((cita) => (
                <CTableRow key={cita.id}>
                  <CTableDataCell>{cita.id}</CTableDataCell>
                  <CTableDataCell>
                    {new Date(cita.fecha).toLocaleString("es-CO", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CTableDataCell>
                  <CTableDataCell>
                    <span
                      className={`badge ${
                        cita.tipo === "evaluacion" ? "bg-info" : "bg-success"
                      }`}
                    >
                      {cita.tipo}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <span
                      className={`badge ${
                        cita.estado === "confirmada"
                          ? "bg-success"
                          : cita.estado === "pendiente"
                          ? "bg-warning"
                          : cita.estado === "realizada"
                          ? "bg-primary"
                          : "bg-danger"
                      }`}
                    >
                      {cita.estado}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2 justify-content-center">
                      {/* Ver detalles */}
                      <button
                        className="btn btn-sm btn-info"
                        title="Ver detalles"
                        onClick={() => selectCitas(cita)}
                      >
                        <CIcon icon={cibCassandra} size="sm" />
                      </button>

                      <button
                        className="btn btn-sm btn-primary"
                        title="Editar"
                        onClick={() => navigate(`/editarcita/${cita.id}`)}
                        disabled={cita.estado === "cancelada"}
                      >
                        <CIcon icon={cilPenAlt} size="sm" />
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        title="Eliminar"
                        onClick={() => eliminarCita(cita.id)}
                      >
                        <CIcon icon={cilXCircle} size="sm" />
                      </button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    </CitasContext.Provider>
  );
}

export default CitasPaciente;
