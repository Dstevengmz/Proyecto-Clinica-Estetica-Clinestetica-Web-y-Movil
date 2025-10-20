import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSpinner, useColorModes } from "@coreui/react";
import "./scss/style.scss";
import "./scss/examples.scss";

// Verificar Token y permisos o autorizaciones para navegacion
import ProtectedRoute from "./components/ProtegerRutas";
import VerificarTokenExpirado from "./assets/js/ValidarTokenExpirado";
import TokenExpiradoAlerta from "./assets/js/MensajeTokenEXpirado";
import { useAuth } from "./contexts/AuthenticaContext";

// Layout
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const PublicLayout = React.lazy(() => import("./layout/PublicLayout"));

//Terminos y condiciones ruta
const TerminosyCondiciones = React.lazy(() =>
  import("./views/pages/politicas/terminosycondiciones")
);

// Pages
const Contacto = React.lazy(() => import("./components/Publico/Contacto"));
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));
const Inicio = React.lazy(() => import("./views/pages/inicio/Inicio"));
const Servicios = React.lazy(() => import("./views/pages/servicios/Servicios"));
const VistaServicios = React.lazy(() =>
  import("./views/pages/servicios/VistaServicios")
);
const Unauthorized = React.lazy(() =>
  import("./views/pages/page404/AutorizacionNavegacion")
);

const DashboardOtro = React.lazy(() =>
  import("./views/pages/dashboard/paneldoctor")
);
//Rutas de usuarios
const EditarUsuarioXAdmin = React.lazy(() =>
  import("./views/pages/usuarios/EditarUsuarioXAdmin")
);

const ConsultarListausuarios = React.lazy(() =>
  import("./views/pages/usuarios/ListaUsuarios")
);

// Rutas de contrasena
const CambiarContrasena = React.lazy(() =>
  import("./views/pages/contrasena/CambiarContrasena")
);

const OlvideContrasena = React.lazy(() =>
  import("./views/pages/contrasena/OlvideContrasena")
);

const ResetearContrasena = React.lazy(() =>
  import("./views/pages/contrasena/ResetearContrasena")
);

const CrearUsuario = React.lazy(() =>
  import("./views/pages/usuarios/CrearUsuario")
);
const EditarUsuario = React.lazy(() =>
  import("./views/pages/usuarios/EditarUsuario")
);
import DetallesListarUsuarios from "./views/pages/usuarios/DetallesListaUsuarios";
import { ListarUsuariosContext } from "./contexts/ListarUsuariosContext";

//historialClinico
import { HistorialClinicoContext } from "./contexts/HistorialClinicoContext";
const CrearHistorialClinico = React.lazy(() =>
  import("./views/pages/historialmedico/CrearHistorialMedico")
);
const MiHistorialMedico = React.lazy(() =>
  import("./views/pages/historialmedico/MiHistorialMedico")
);
const ConsultarHistorialMedico = React.lazy(() =>
  import("./views/pages/historialmedico/ConsultarHistorialMedico")
);
const DetallesHistorialMedico = React.lazy(() =>
  import("./views/pages/historialmedico/DetallesHistorialMedico")
);
const EditarHistorialMedico = React.lazy(() =>
  import("./views/pages/historialmedico/EditarHistorialMedico")
);
const HistorialNotificaciones = React.lazy(() =>
  import("./views/pages/notificaciones/HistorialNotificaciones")
);
const HistorialNotificacionesUsuario = React.lazy(() =>
  import("./views/pages/notificaciones/HistorialNotificacionesUsuario")
);
//citas
import { CitasContext } from "./contexts/CitasContext";
const CrearCita = React.lazy(() => import("./views/pages/citas/RegistrarCita"));
const RegistrarCitaAsistente = React.lazy(() =>
  import("./views/pages/citas/RegistrarCitaAsistente")
);

const HistorialCompleto = React.lazy(() =>
  import("./views/pages/historialcompletopaciente/historialtodocompletousuario")
);

const SeleccionarUsuarioHistorial = React.lazy(() =>
  import("./views/pages/historialcompletopaciente/SeleccionarUsuarioHistorial")
);

import ReagendarCita from "./views/pages/citas/ReagendarCita";

import CitasPaciente from "./views/pages/citas/CitasPorPaciente";

const ConsultarCitas = React.lazy(() =>
  import("./views/pages/citas/ConsultarCitas")
);
const CalendarioCitas = React.lazy(() =>
  import("./views/pages/citas/CalendarioCitas")
);
const DetallesCitas = React.lazy(() =>
  import("./views/pages/citas/DetallesCitas")
);
const Editarcita = React.lazy(() => import("./views/pages/citas/EditarCita"));

const MisCitas = React.lazy(() => import("./views/pages/citas/MisCitas"));

const VerTodo = React.lazy(() => import("./views/pages/citas/CitaVerTodo"));

const CitasTodosAsistente = React.lazy(() =>
  import("./views/pages/citas/CitaTodosUsuariosAsistente")
);

//Procedimientos
const CrearProcedimiento = React.lazy(() =>
  import("./views/pages/procedimientos/CrearProcedimiento")
);
const ConsultarProcedimientos = React.lazy(() =>
  import("./views/pages/procedimientos/ConsultarProcedimientos")
);
const DetallesProcedimientos = React.lazy(() =>
  import("./views/pages/procedimientos/DetallesProcedimientos")
);
import { ProcedimientoProvider } from "./contexts/ProcedimientoContext";
const EditarProcedimiento = React.lazy(() =>
  import("./views/pages/procedimientos/EditarProcedimiento")
);
// Categoria Procedimientos
import { CategoriaContext } from "./contexts/CategoriaContext";
const DetallesCategoria = React.lazy(() =>
  import("./views/pages/categoriaprocedimientos/DetallesCategoria")
);
const CrearCategoria = React.lazy(() =>
  import("./views/pages/categoriaprocedimientos/CrearCategoria")
);
const ListarCategorias = React.lazy(() =>
  import("./views/pages/categoriaprocedimientos/ListarCategorias")
);
const EditarCategoria = React.lazy(() =>
  import("./views/pages/categoriaprocedimientos/EditarCategoria")
);
//Carrito
const Carrito = React.lazy(() => import("./views/pages/carrito/carrito"));

import CerrarSesion from "./views/pages/logout/CerrarSesion";
import Control from "./components/control/control";

//seguridad
function RutaProtegida({ children }) {
  const autenticacionValida = localStorage.getItem("token");
  return autenticacionValida ? children : <Navigate to="/iniciarsesion" />;
}
// Rutas internas (router de dashboards por rol)
const DashboardRouter = React.lazy(() =>
  import("./views/dashboard/DashboardRouter")
);
const App = () => {
  const [selectedHistorialclinico, setSelectedHistorialclinico] =
    useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedCitas, setSelectedCitas] = useState(null);
  const [selectedListarusuarios, setSelectedListarusuarios] = useState(null);
  const { setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme"
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Fijar el tema en 'light' y desactivar cambios por URL o estado
    setColorMode("light");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { logout } = useAuth();
  useEffect(() => {
    const token = VerificarTokenExpirado.obtenerToken();
    if (token && !VerificarTokenExpirado.tokenEsValido(token)) {
      logout();
      TokenExpiradoAlerta(navigate);
    }
  }, [navigate, logout]);

  return (
    <HistorialClinicoContext.Provider
      value={{ selectedHistorialclinico, setSelectedHistorialclinico }}
    >
      <CitasContext.Provider value={{ selectedCitas, setSelectedCitas }}>
        <ProcedimientoProvider>
          <ListarUsuariosContext.Provider
            value={{ selectedListarusuarios, setSelectedListarusuarios }}
          >
            <CategoriaContext.Provider
              value={{ selectedCategoria, setSelectedCategoria }}
            >
              <Control />
              <Suspense
                fallback={
                  <div className="pt-3 text-center">
                    <CSpinner color="primary" variant="grow" />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/inicio" replace />} />
                  {/* Rutas públicas */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route element={<PublicLayout />}>
                    <Route path="/iniciarsesion" element={<Login />} />
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route
                      path="/olvidecontrasena"
                      element={<OlvideContrasena />}
                    />
                    <Route
                      path="/resetearcontrasena/:token"
                      element={<ResetearContrasena />}
                    />
                    {/* Alias de detalle de servicio público para compatibilidad */}
                    <Route path="/servicios/:id" element={<VistaServicios />} />
                    <Route path="/registrar" element={<Register />} />
                    {/* terminos y condiciones */}
                    <Route
                      path="/terminoscondiciones"
                      element={<TerminosyCondiciones />}
                    />
                    <Route
                      path="/carrito"
                      element={
                        <RutaProtegida>
                          <Carrito />
                        </RutaProtegida>
                      }
                    />
                    <Route path="/reservar/:id" element={<VistaServicios />} />
                  </Route>

                  {/* Rutas protegidas con layout */}

                  <Route
                    element={
                      <RutaProtegida>
                        <DefaultLayout />
                      </RutaProtegida>
                    }
                  >
                    <Route path="/dashboard" element={<DashboardRouter />} />
                    <Route path="/404" element={<Page404 />} />
                    <Route path="/500" element={<Page500 />} />

                    <Route
                      path="/crearhistorialclinico"
                      element={<CrearHistorialClinico />}
                    />

                    {/* USUARIOS */}
                    <Route
                      path="/listarusuarios"
                      element={
                        <ProtectedRoute allowedRoles={["doctor"]}>
                          <ConsultarListausuarios />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cambiarcontrasena"
                      element={<CambiarContrasena />}
                    />
                    <Route
                      path="/editarusuarioadmin/:id"
                      element={<EditarUsuarioXAdmin />}
                    />
                    <Route path="/crear-usuario" element={<CrearUsuario />} />
                    <Route
                      path="/editarusuario/:id"
                      element={<EditarUsuario />}
                    />
                    <Route
                      path="/listatodoslosusuariosasistente"
                      element={
                        <ProtectedRoute allowedRoles={["asistente"]}>
                          <CitasTodosAsistente />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/DetallesListarUsuarios"
                      element={<DetallesListarUsuarios />}
                    />

                    <Route
                      path="/consultarhistorialmedico"
                      element={<ConsultarHistorialMedico />}
                    />
                    <Route
                      path="/detalleshistorialmedico"
                      element={<DetallesHistorialMedico />}
                    />
                    <Route
                      path="/editarhistorialmedico/:id"
                      element={<EditarHistorialMedico />}
                    />
                    <Route
                      path="/mihistorialclinico/:id"
                      element={<MiHistorialMedico />}
                    />
                    <Route
                      path="/calendariocitas"
                      element={
                        <ProtectedRoute allowedRoles={["doctor"]}>
                          <CalendarioCitas />
                        </ProtectedRoute>
                      }
                    />
                    {/* Citas */}
                    <Route
                      path="/paneldedatos"
                      element={
                        <ProtectedRoute allowedRoles={["doctor"]}>
                          <DashboardOtro />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/vertodocita" element={<VerTodo />} />
                    <Route path="/crearcita" element={<CrearCita />} />
                    <Route
                      path="/reagendarcita/:id"
                      element={<ReagendarCita />}
                    />
                    <Route
                      path="/crearcitaasistente"
                      element={
                        <ProtectedRoute allowedRoles={["asistente", "doctor"]}>
                          <RegistrarCitaAsistente />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/consultarcitas"
                      element={
                        <ProtectedRoute allowedRoles={["doctor"]}>
                          <ConsultarCitas />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/citaspaciente/:usuarioId"
                      element={
                        <ProtectedRoute allowedRoles={["doctor"]}>
                          <CitasPaciente />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/detallescitas/:id"
                      element={<DetallesCitas />}
                    />
                    <Route path="/citas/:id" element={<DetallesCitas />} />
                    <Route path="/editarcita/:id" element={<Editarcita />} />
                    <Route path="/miscitas" element={<MisCitas />} />
                    <Route path="/miscitas" element={<MisCitas />} />
                    <Route
                      path="/historialcompleto/:idUsuario"
                      element={
                        <ProtectedRoute allowedRoles={["asistente"]}>
                          <HistorialCompleto />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/seleccionarusuariohistorial"
                      element={
                        <ProtectedRoute allowedRoles={["asistente"]}>
                          <SeleccionarUsuarioHistorial />
                        </ProtectedRoute>
                      }
                    />
                    {/* Procedimientos */}
                    <Route
                      path="/crearprocedimiento"
                      element={
                        <ProtectedRoute allowedRoles={["asistente", "doctor"]}>
                          <CrearProcedimiento />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/consultarprocedimientos"
                      element={
                        <ProtectedRoute allowedRoles={["asistente", "doctor"]}>
                          <ConsultarProcedimientos />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/detallesprocedimientos"
                      element={<DetallesProcedimientos />}
                    />
                    <Route
                      path="/editarprocedimientos/:id"
                      element={
                        <ProtectedRoute allowedRoles={["asistente", "doctor"]}>
                          <EditarProcedimiento />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/categoriaprocedimientos"
                      element={
                        <ProtectedRoute allowedRoles={["asistente", "doctor"]}>
                          <ListarCategorias />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/detallescategorias/:id"
                      element={<DetallesCategoria />}
                    />
                    <Route
                      path="/categoriaprocedimientoscrear"
                      element={
                        <ProtectedRoute allowedRoles={["doctor", "asistente"]}>
                          <CrearCategoria />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/editarcategoriaprocedimientos/:id"
                      element={<EditarCategoria />}
                    />
                    <Route
                      path="/historial-notificaciones"
                      element={
                        <RutaProtegida>
                          <HistorialNotificaciones />
                        </RutaProtegida>
                      }
                    />
                    <Route
                      path="/notificaciones/usuario/historial"
                      element={
                        <RutaProtegida>
                          <HistorialNotificacionesUsuario />
                        </RutaProtegida>
                      }
                    />
                  </Route>

                  {/* Cierre de sesión */}
                  <Route path="/cerrarsesion" element={<CerrarSesion />} />

                  {/* Ruta no encontrada */}
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
              </Suspense>
            </CategoriaContext.Provider>
          </ListarUsuariosContext.Provider>
        </ProcedimientoProvider>
      </CitasContext.Provider>
    </HistorialClinicoContext.Provider>
  );
};

export default App;
