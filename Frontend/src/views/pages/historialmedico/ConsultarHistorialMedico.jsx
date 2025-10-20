import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import {
  CButton,
  CContainer,
  CForm,
  CFormInput,
  CNavbar,
  CNavbarBrand,
} from "@coreui/react";
import AlertaHistorialMedico from "../../../assets/js/alertas/historialmedico/HistorialMedico";
import { usePerfilUsuario } from "../../../hooks/usePerfilUsuario";
import { HistorialClinicoContext } from "../../../contexts/HistorialClinicoContext";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import useEliminarHistorialMedico from "../../../hooks/useEliminarHistorialMedico";
const alertas = new AlertaHistorialMedico();
function ConsultaHistorialMedico() {
  const [historialmedico, setHistorialmedico] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const { setSelectedHistorialclinico } = useContext(HistorialClinicoContext);
  const navigate = useNavigate();
  const { rol } = usePerfilUsuario();

  const reload = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alertas.alertaMensaje("No estás autenticado. Por favor, inicia sesión.");
      navigate("/iniciarsesion");
      return;
    }

    axios
      .get(`${API_URL}/apihistorialmedico/listarhistorialclinico`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setHistorialmedico(response.data);
        console.log("Historial cargado:", response.data);
      })
      .catch((error) => {
        console.error("Error al cargar historial médico:", error);
        alertas.alertaMensaje("Error al cargar los registros");
      });
  }, [navigate]);
  const eliminarHistorial = useEliminarHistorialMedico(() => reload());
  useEffect(() => {
    reload();
  }, [reload]);

  const historialFiltrado = useMemo(() => {
    if (!terminoBusqueda.trim()) return historialmedico;
    const t = terminoBusqueda.toLowerCase().trim();
    return historialmedico.filter((item) => {
      const u = item.usuario || {};
      return (
        (item.id && item.id.toString().includes(t)) ||
        (u.nombre && u.nombre.toLowerCase().includes(t)) ||
        (u.correo && u.correo.toLowerCase().includes(t)) ||
        (u.rol && u.rol.toLowerCase().includes(t)) ||
        (u.genero && u.genero.toLowerCase().includes(t))
      );
    });
  }, [historialmedico, terminoBusqueda]);

  const handleBusquedaChange = (e) => setTerminoBusqueda(e.target.value);
  const limpiarBusqueda = () => setTerminoBusqueda("");

  const selectUser = (historialmedico) => {
    setSelectedHistorialclinico && setSelectedHistorialclinico(historialmedico);
    navigate("/detalleshistorialmedico");
  };

  return (
    <div className="card-body">
      <h1 className="mb-0 text-center">Historial Médico</h1>
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-center justify-content-md-between mb-3 gap-2 mt-3">
        <div />
        <CForm
          className="d-flex justify-content-center justify-content-md-end"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <CFormInput
            type="search"
            className="me-2"
            placeholder="Buscar por ID, nombre, correo, rol o género..."
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
              Mostrando {historialFiltrado.length} de {historialmedico.length}{" "}
              registros
              {terminoBusqueda && ` para "${terminoBusqueda}"`}
            </span>
            {historialFiltrado.length === 0 && (
              <span className="text-muted">
                <i className="bi bi-search me-1"></i>
                No se encontraron resultados
              </span>
            )}
          </div>
        </div>
      )}
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
            <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
            <CTableHeaderCell scope="col">Rol</CTableHeaderCell>
            <CTableHeaderCell scope="col">Género</CTableHeaderCell>
            <CTableHeaderCell scope="col">Opciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {historialFiltrado.length === 0 ? (
            <CTableRow>
              <CTableDataCell
                colSpan={6}
                className="text-center text-muted py-4"
              >
                {terminoBusqueda ? (
                  <>
                    <i className="bi bi-search me-2"></i>
                    No se encontraron registros que coincidan con "
                    {terminoBusqueda}"
                  </>
                ) : (
                  <>
                    <i className="bi bi-x-circle me-2"></i>
                    No hay registros de historial médico
                  </>
                )}
              </CTableDataCell>
            </CTableRow>
          ) : (
            historialFiltrado.map((hm) => (
              <CTableRow key={hm.id}>
                <CTableDataCell>{hm.id}</CTableDataCell>
                <CTableDataCell>
                  {hm.usuario?.nombre || "Sin nombre"}
                </CTableDataCell>
                <CTableDataCell>
                  {hm.usuario?.correo || "Sin correo"}
                </CTableDataCell>
                <CTableDataCell>{hm.usuario?.rol || "Sin rol"}</CTableDataCell>
                <CTableDataCell>
                  {hm.usuario?.genero || "Sin género"}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <a
                      onClick={() => selectUser(hm)}
                      className="btn btn-sm btn-info"
                      title="Ver detalles"
                    >
                      <i className="bi bi-eye-fill"></i>
                    </a>
                    {rol === "doctor" && (
                      <a
                        onClick={() =>
                          navigate(`/editarhistorialmedico/${hm.id}`)
                        }
                        className="btn btn-sm btn-primary"
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </a>
                    )}
                    <a
                      className="btn btn-sm btn-danger"
                      title="Eliminar"
                      onClick={() => eliminarHistorial(hm.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </a>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  );
}
export default ConsultaHistorialMedico;
