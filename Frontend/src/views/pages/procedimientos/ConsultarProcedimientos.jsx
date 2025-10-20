import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CForm,
  CFormInput,
  CButton,
} from "@coreui/react";
import { useProcedimientoContext } from "../../../contexts/ProcedimientoContext";
import usePaginacion from "../../../hooks/usePaginacion";
import PaginacionComponents from "../../../components/PaginacionComponents";
const API_URL = import.meta.env.VITE_API_URL;
import { useAuth } from "../../../contexts/AuthenticaContext";
import useEliminarProcedimiento from "../../../hooks/useEliminarProcedimiento";
import AlertaProcedimiento from "../../../assets/js/alertas/procedimientos/AlertaProcedimiento";
const alertas = new AlertaProcedimiento();
function ConsultarProcedimientos() {
  const { userRole } = useAuth();
  const [procedimientos, setProcedimientos] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const { setSelectedProcedimiento } = useProcedimientoContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoriaId = searchParams.get("categoriaId");

  const reload = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alertas.alertaMensajes("No estás autenticado");
      navigate("/iniciarsesion");
      return;
    }

    const url = categoriaId
      ? `${API_URL}/apiprocedimientos/listarprocedimiento?categoriaId=${categoriaId}`
      : `${API_URL}/apiprocedimientos/listarprocedimiento`;

    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setProcedimientos(response.data);
        console.log("Procedimientos cargados:", response.data);
      })
      .catch((error) => {
        console.error("Error al cargar procedimientos:", error);
        alertas.alertaMensajes("Error al cargar los procedimientos");
      });
  }, [categoriaId, navigate]);

  const eliminarProcedimiento = useEliminarProcedimiento(() => reload());

  useEffect(() => {
    reload();
  }, [reload, location.search]);

  const procedimientosFiltrados = useMemo(() => {
    if (!terminoBusqueda.trim()) return procedimientos;
    const termino = terminoBusqueda.toLowerCase().trim();
    return procedimientos.filter((p) => {
      const categoriaNombre = p?.categoria?.nombre
        ? p.categoria.nombre.toLowerCase()
        : "";
      return (
        (p.nombre && p.nombre.toLowerCase().includes(termino)) ||
        categoriaNombre.includes(termino) ||
        (p.id && p.id.toString().includes(termino)) ||
        (p.precio && p.precio.toString().includes(termino))
      );
    });
  }, [procedimientos, terminoBusqueda]);
  const { currentPage, totalPages, currentData, goToPage, prevPage, nextPage } =
    usePaginacion({
      data: procedimientosFiltrados,
      itemsPerPage: 8,
    });
  const handleBusquedaChange = (e) => setTerminoBusqueda(e.target.value);
  const limpiarBusqueda = () => setTerminoBusqueda("");

  const selectUser = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    navigate("/detallesprocedimientos");
  };

  return (
    <div className="card-body">
      <h1 className="mb-0 text-center">Lista de Procedimientos</h1>
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-center justify-content-md-between mb-3 gap-2 mt-3">
        <div className="d-flex justify-content-center justify-content-md-start">
          {(userRole === "doctor" || userRole === "asistente") && (
            <CButton
              color="primary"
              size="sm"
              onClick={() => navigate("/crearprocedimiento")}
            >
              <i className="bi bi-plus-circle me-1"></i> Crear Procedimiento
            </CButton>
          )}
        </div>
        <CForm
          className="d-flex justify-content-center justify-content-md-end"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <CFormInput
            type="search"
            className="me-2"
            placeholder="Buscar por nombre, categoría, precio o ID..."
            value={terminoBusqueda}
            onChange={handleBusquedaChange}
            style={{ minWidth: "300px" }}
          />
          {terminoBusqueda && (
            <CButton
              type="button"
              color="secondary"
              variant="outline"
              className="me-2"
              onClick={limpiarBusqueda}
              title="Limpiar búsqueda"
            >
              <i className="bi bi-x-lg"></i>
            </CButton>
          )}
          <CButton type="button" color="success" variant="outline">
            <i className="bi bi-search"></i>
          </CButton>
        </CForm>
      </div>

      {terminoBusqueda && (
        <div className="mb-3">
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-info-circle me-2"></i>
              Mostrando {procedimientosFiltrados.length} de{" "}
              {procedimientos.length} procedimientos
              {terminoBusqueda && ` para "${terminoBusqueda}"`}
            </span>
            {procedimientosFiltrados.length === 0 && (
              <span className="text-muted">
                <i className="bi bi-search me-1"></i>
                No se encontraron resultados
              </span>
            )}
          </div>
        </div>
      )}

      <CTable striped bordered hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Precio</CTableHeaderCell>
            <CTableHeaderCell>Categoria</CTableHeaderCell>
            {(userRole === "doctor" || userRole === "asistente") && (
              <CTableHeaderCell>Opciones</CTableHeaderCell>
            )}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {procedimientosFiltrados.length === 0 ? (
            <CTableRow>
              <CTableDataCell
                colSpan={5}
                className="text-center text-muted py-4"
              >
                {terminoBusqueda ? (
                  <>
                    <i className="bi bi-search me-2"></i>
                    No se encontraron procedimientos que coincidan con "
                    {terminoBusqueda}"
                  </>
                ) : (
                  <>
                    <i className="bi bi-x-circle me-2"></i>
                    No hay procedimientos registrados
                  </>
                )}
              </CTableDataCell>
            </CTableRow>
          ) : (
            currentData.map((procedimiento) => (
              <CTableRow key={procedimiento.id}>
                <CTableDataCell>{procedimiento.id}</CTableDataCell>
                <CTableDataCell>{procedimiento.nombre}</CTableDataCell>
                <CTableDataCell>
                  {Number(procedimiento.precio).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </CTableDataCell>
                <CTableDataCell>
                  {procedimiento?.categoria?.nombre || "—"}
                </CTableDataCell>

                {(userRole === "doctor" || userRole === "asistente") && (
                  <CTableDataCell className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => selectUser(procedimiento)}
                        title="Ver detalles"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </CButton>
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/editarprocedimientos/${procedimiento.id}`)
                        }
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </CButton>

                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar"
                        onClick={() => eliminarProcedimiento(procedimiento.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </CButton>
                    </div>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
      <PaginacionComponents
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </div>
  );
}
export default ConsultarProcedimientos;
