import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Container } from "react-bootstrap";
import { CitasContext, useCitasContext } from "../../../contexts/CitasContext";
import FiltrosCitas from "./FiltrosCitas";
import { cibCassandra, cilPenAlt, cilCalendarCheck } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import useListarCitas from "../../../hooks/useListarCitasTodosUsuarioAsistente";

import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from "@coreui/react";
import BuscadorCitas from "./BuscadorCitas";
import PaginacionComponents from "../../../components/PaginacionComponents";

function ConsultarCitasPorAsistente() {
  const { citas: todasLasCitas, cargando: cargandoCitas } = useListarCitas();
  const { selectedCitas, setSelectedCitas } = useCitasContext();
  const navigate = useNavigate();

  const [tipoFiltro, setTipoFiltro] = useState("todas");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [fechaTipo, setFechaTipo] = useState("");

  const normalizarInicioDia = (str) => new Date(`${str}T00:00:00`);
  const normalizarFinDia = (str) => new Date(`${str}T23:59:59`);

  const citasBase = useMemo(() => {
    if (!Array.isArray(todasLasCitas)) return [];
    switch (tipoFiltro) {
      case "dia": {
        if (!fechaSeleccionada) return todasLasCitas;
        const d = normalizarInicioDia(fechaSeleccionada);
        return todasLasCitas.filter((c) => {
          const fc = new Date(c.fecha);
          return fc.toDateString() === d.toDateString();
        });
      }
      case "rango": {
        if (!fechaDesde || !fechaHasta) return todasLasCitas;
        const d1 = normalizarInicioDia(fechaDesde);
        const d2 = normalizarFinDia(fechaHasta);
        return todasLasCitas.filter((c) => {
          const fc = new Date(c.fecha);
          return fc >= d1 && fc <= d2;
        });
      }
      case "tipo": {
        if (!tipoSeleccionado || !fechaTipo) return todasLasCitas;
        const d = normalizarInicioDia(fechaTipo);
        const tipoLower = String(tipoSeleccionado).toLowerCase();
        return todasLasCitas.filter((c) => {
          const fc = new Date(c.fecha);
          const mismoDia = fc.toDateString() === d.toDateString();
          const mismoTipo = String(c?.tipo || "").toLowerCase() === tipoLower;
          return mismoDia && mismoTipo;
        });
      }
      default:
        return todasLasCitas;
    }
  }, [
    todasLasCitas,
    tipoFiltro,
    fechaSeleccionada,
    fechaDesde,
    fechaHasta,
    tipoSeleccionado,
    fechaTipo,
  ]);

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [citasFiltradasBusqueda, setCitasFiltradasBusqueda] =
    useState(citasBase);

  const citasAMostrar = useMemo(() => {
    return citasFiltradasBusqueda;
  }, [citasFiltradasBusqueda]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; 

  const totalPages = Math.max(1, Math.ceil(citasFiltradasBusqueda.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [citasFiltradasBusqueda]);

  const paginatedCitas = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return citasFiltradasBusqueda.slice(start, start + pageSize);
  }, [citasFiltradasBusqueda, currentPage]);

  const goToPage = (page) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
  };
  const prevPage = () => goToPage(currentPage - 1);
  const nextPage = () => goToPage(currentPage + 1);

  useEffect(() => {
    if (!terminoBusqueda.trim()) {
      setCitasFiltradasBusqueda(citasBase);
    } else {
      const t = terminoBusqueda.toLowerCase().trim();
      setCitasFiltradasBusqueda(
        citasBase.filter(
          (c) =>
            (c.id && c.id.toString().includes(t)) ||
            (c.usuario?.nombre && c.usuario.nombre.toLowerCase().includes(t)) ||
            (c.doctor?.nombre && c.doctor.nombre.toLowerCase().includes(t)) ||
            (c.tipo && c.tipo.toLowerCase().includes(t)) ||
            (c.estado && c.estado.toLowerCase().includes(t)) ||
            (c.usuario?.correo && c.usuario.correo.toLowerCase().includes(t))
        )
      );
    }
  }, [citasBase, terminoBusqueda]);

  const estasCargando = cargandoCitas;

  const selectCitas = (citas) => {
    setSelectedCitas(citas);
    navigate("/detallesCitas/" + citas.id);
  };

  const handleFiltrarPorDia = () => {
    if (!fechaSeleccionada) {
      alert("Por favor selecciona una fecha");
      return;
    }
    setTipoFiltro("dia");
  };

  const handleFiltrarPorRango = () => {
    if (!fechaDesde || !fechaHasta) {
      alert("Por favor selecciona ambas fechas del rango");
      return;
    }
    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      alert('La fecha "desde" no puede ser mayor que la fecha "hasta"');
      return;
    }
    setTipoFiltro("rango");
  };

  const handleFiltrarPorTipo = () => {
    if (!tipoSeleccionado || !fechaTipo) {
      alert("Por favor selecciona el tipo de cita y la fecha");
      return;
    }
    setTipoFiltro("tipo");
  };

  const handleMostrarTodasLasCitas = () => {
    setTipoFiltro("todas");
    setFechaSeleccionada("");
    setFechaDesde("");
    setFechaHasta("");
    setTipoSeleccionado("");
    setFechaTipo("");
  };

  if (estasCargando) {
    return (
      <Container>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <div>Cargando información...</div>
        </div>
      </Container>
    );
  }
  return (
    <CitasContext.Provider value={{ selectedCitas, setSelectedCitas }}>
      <div className="card-body">
        <FiltrosCitas
          fechaSeleccionada={fechaSeleccionada}
          setFechaSeleccionada={setFechaSeleccionada}
          handleFiltrarPorDia={handleFiltrarPorDia}
          fechaDesde={fechaDesde}
          setFechaDesde={setFechaDesde}
          fechaHasta={fechaHasta}
          setFechaHasta={setFechaHasta}
          handleFiltrarPorRango={handleFiltrarPorRango}
          tipoSeleccionado={tipoSeleccionado}
          setTipoSeleccionado={setTipoSeleccionado}
          fechaTipo={fechaTipo}
          setFechaTipo={setFechaTipo}
          handleFiltrarPorTipo={handleFiltrarPorTipo}
          tipoFiltro={tipoFiltro}
          setTipoFiltro={setTipoFiltro}
          handleMostrarTodasLasCitas={handleMostrarTodasLasCitas}
        />
        <BuscadorCitas
          citas={citasBase}
          termino={terminoBusqueda}
          onTerminoChange={setTerminoBusqueda}
          onResultado={setCitasFiltradasBusqueda}
        />
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Usuario</CTableHeaderCell>
              <CTableHeaderCell>Doctor</CTableHeaderCell>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
              <CTableHeaderCell>Tipo</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Opciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {!citasAMostrar || citasAMostrar.length === 0 ? (
              <CTableRow>
                <CTableDataCell
                  colSpan={7}
                  className="text-center text-muted py-4"
                >
                  <div className="mb-2">
                    <i className="bi bi-x-circle me-2" />
                    No hay citas{" "}
                    {tipoFiltro !== "todas"
                      ? "para el filtro o búsqueda aplicada"
                      : "registradas"}
                    .
                  </div>
                  {(tipoFiltro !== "todas" || terminoBusqueda) && (
                    <CButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      onClick={handleMostrarTodasLasCitas}
                    >
                      <CIcon icon={cilCalendarCheck} className="me-1" /> Ver
                      todas
                    </CButton>
                  )}
                </CTableDataCell>
              </CTableRow>
            ) : (
              paginatedCitas.map((cita) => (
                <CTableRow key={cita.id}>
                  <CTableDataCell>{cita.id}</CTableDataCell>
                  <CTableDataCell>
                    {cita.usuario?.nombre || "N/A"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {cita.doctor?.nombre || "N/A"}
                  </CTableDataCell>
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
                      {cita.tipo || "N/A"}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <span
                      className={`badge ${
                        cita.estado === "confirmada"
                          ? "bg-success"
                          : cita.estado === "pendiente"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {cita.estado || "N/A"}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-sm btn-info"
                        title="Ver detalles"
                        onClick={() => selectCitas(cita)}
                      >
                        <CIcon icon={cibCassandra} size="sm" />
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        title={
                          ["cancelada", "realizada"].includes(cita.estado)
                            ? "No disponible para citas canceladas o realizadas"
                            : "Reagendar"
                        }
                        disabled={["cancelada", "realizada"].includes(
                          cita.estado
                        )}
                        onClick={() => navigate(`/reagendarcita/${cita.id}`)}
                      >
                        <CIcon icon={cilPenAlt} size="sm" />
                      </button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
        {/* Pagination controls */}
        <div className="d-flex justify-content-center">
          <PaginacionComponents
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </div>
      </div>
    </CitasContext.Provider>
  );
}
export default ConsultarCitasPorAsistente;
