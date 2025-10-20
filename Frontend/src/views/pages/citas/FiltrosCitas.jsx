import { useNavigate } from "react-router-dom";

import {
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCalendar, cilX } from "@coreui/icons";
import { useAuth } from "../../../contexts/AuthenticaContext";

const FiltrosCitas = ({
  fechaSeleccionada,
  setFechaSeleccionada,
  handleFiltrarPorDia,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  handleFiltrarPorRango,
  tipoSeleccionado,
  setTipoSeleccionado,
  fechaTipo,
  setFechaTipo,
  handleFiltrarPorTipo,
  tipoFiltro,
  setTipoFiltro,
  handleMostrarTodasLasCitas,
}) => {
  const navigate = useNavigate();
    const { userRole } = useAuth();
  const irACalendario = () => {
    navigate("/calendariocitas");
  };

  return (
    <>
      {/* Filtros */}
      <CRow className="mb-4">
        <CCol
          md={12}
          className="d-flex justify-content-between align-items-center mb-3"
        >
          <h5 className="mb-0">Filtros de Consulta</h5>
          {(userRole === "doctor") && (
            <CButton color="primary" onClick={irACalendario}>
              Ir al Calendario
            </CButton>
          )}
        </CCol>

        {/* Filtro por día */}
        <CCol md={4}>
          <div className="border rounded p-3 h-100">
            <h6 className="text-success mb-3">
              <CIcon icon={cilCalendar} className="me-1" />
              Consultar por Día
            </h6>
            <CFormLabel htmlFor="fechaFiltro">Seleccionar fecha:</CFormLabel>
            <CFormInput
              type="date"
              id="fechaFiltro"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="mb-2"
            />
            <div className="d-flex gap-2">
              <CButton
                color="success"
                onClick={handleFiltrarPorDia}
                disabled={!fechaSeleccionada}
              >
                <CIcon icon={cilCalendar} className="me-1" />
                Consultar
              </CButton>
              {fechaSeleccionada && (
                <CButton
                  color="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setFechaSeleccionada("");
                    if (tipoFiltro === "dia") setTipoFiltro("todas");
                  }}
                  title="Limpiar fecha"
                >
                  <CIcon icon={cilX} />
                </CButton>
              )}
            </div>
          </div>
        </CCol>

        {/* Filtro por rango */}
        <CCol md={4}>
          <div className="border rounded p-3 h-100">
            <h6 className="text-success mb-3">
              <CIcon icon={cilCalendar} className="me-1" />
              Consultar por Rango
            </h6>
            <CFormLabel htmlFor="fechaDesde">Desde:</CFormLabel>
            <CFormInput
              type="date"
              id="fechaDesde"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="mb-2"
            />
            <CFormLabel htmlFor="fechaHasta">Hasta:</CFormLabel>
            <CFormInput
              type="date"
              id="fechaHasta"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              min={fechaDesde}
              className="mb-2"
            />
            <div className="d-flex gap-2">
              <CButton
                color="success"
                onClick={handleFiltrarPorRango}
                disabled={!fechaDesde || !fechaHasta}
              >
                <CIcon icon={cilCalendar} className="me-1" />
                Consultar
              </CButton>
              {(fechaDesde || fechaHasta) && (
                <CButton
                  color="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setFechaDesde("");
                    setFechaHasta("");
                    if (tipoFiltro === "rango") setTipoFiltro("todas");
                  }}
                  title="Limpiar rango"
                >
                  <CIcon icon={cilX} />
                </CButton>
              )}
            </div>
          </div>
        </CCol>

        {/* Filtro por tipo */}
        <CCol md={4}>
          <div className="border rounded p-3 h-100">
            <h6 className="text-success mb-3">
              <CIcon icon={cilCalendar} className="me-1" />
              Consultar por Tipo
            </h6>
            <CFormLabel htmlFor="tipoSelect">Tipo de cita:</CFormLabel>
            <CFormSelect
              id="tipoSelect"
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              className="mb-2"
            >
              <option value="">Seleccionar tipo...</option>
              <option value="evaluacion">Evaluación</option>
              <option value="procedimiento">Procedimiento</option>
            </CFormSelect>
            <CFormLabel htmlFor="fechaTipo">Fecha:</CFormLabel>
            <CFormInput
              type="date"
              id="fechaTipo"
              value={fechaTipo}
              onChange={(e) => setFechaTipo(e.target.value)}
              className="mb-2"
            />
            <div className="d-flex gap-2">
              <CButton
                color="success"
                onClick={handleFiltrarPorTipo}
                disabled={!tipoSeleccionado || !fechaTipo}
              >
                <CIcon icon={cilCalendar} className="me-1" />
                Consultar
              </CButton>
              {(tipoSeleccionado || fechaTipo) && (
                <CButton
                  color="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setTipoSeleccionado("");
                    setFechaTipo("");
                    if (tipoFiltro === "tipo") setTipoFiltro("todas");
                  }}
                  title="Limpiar tipo"
                >
                  <CIcon icon={cilX} />
                </CButton>
              )}
            </div>
          </div>
        </CCol>

        {/* Botón para mostrar todas */}
        <CCol md={12} className="mt-3 text-center">
          <CButton
            color="secondary"
            onClick={handleMostrarTodasLasCitas}
            disabled={tipoFiltro === "todas"}
          >
            Mostrar todas las citas
          </CButton>
        </CCol>
      </CRow>
    </>
  );
};

export default FiltrosCitas;
