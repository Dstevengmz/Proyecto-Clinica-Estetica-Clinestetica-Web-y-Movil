import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Procedimientos / Servicios
const CrearProcedimiento = React.lazy(() => import('./views/pages/procedimientos/CrearProcedimiento'))
const ConsultarProcedimientos = React.lazy(() => import('./views/pages/procedimientos/ConsultarProcedimientos'))
const DetallesProcedimiento = React.lazy(() => import('./views/pages/procedimientos/DetallesProcedimientos'))
const EditarProcedimiento = React.lazy(() => import('./views/pages/procedimientos/EditarProcedimiento'))

// Categorías de Procedimientos
const CrearCategoria = React.lazy(() => import('./views/pages/categoriaprocedimientos/CrearCategoria'))
const ListarCategorias = React.lazy(() => import('./views/pages/categoriaprocedimientos/ListarCategorias'))
const EditarCategoria = React.lazy(() => import('./views/pages/categoriaprocedimientos/EditarCategoria'))
const DetallesCategoria = React.lazy(() => import('./views/pages/categoriaprocedimientos/DetallesCategoria'))
// Servicios (vista pública/listado general y detalle)
const Servicios = React.lazy(() => import('./views/pages/servicios/Servicios'))
const VistaServicio = React.lazy(() => import('./views/pages/servicios/VistaServicios'))

// Historial Médico
const CrearHistorialMedico = React.lazy(() => import('./views/pages/historialmedico/CrearHistorialMedico'))
const ConsultarHistorialMedico = React.lazy(() => import('./views/pages/historialmedico/ConsultarHistorialMedico'))
const MiHistorialMedico = React.lazy(() => import('./views/pages/historialmedico/MiHistorialMedico'))
const DetallesHistorialMedico = React.lazy(() => import('./views/pages/historialmedico/DetallesHistorialMedico'))

// Citas
const RegistrarCita = React.lazy(() => import('./views/pages/citas/RegistrarCita'))
const RegistrarCitaAsistente = React.lazy(() => import('./views/pages/citas/RegistrarCitaAsistente'))
const ConsultarCitas = React.lazy(() => import('./views/pages/citas/ConsultarCitas'))
const MisCitas = React.lazy(() => import('./views/pages/citas/MisCitas'))
const DetallesCitas = React.lazy(() => import('./views/pages/citas/DetallesCitas'))

// Notificaciones Usuario
const HistorialNotificacionesUsuario = React.lazy(() => import('./views/pages/notificaciones/HistorialNotificacionesUsuario'))

// Usuarios
const ListaUsuarios = React.lazy(() => import('./views/pages/usuarios/ListaUsuarios'))
const DetallesUsuario = React.lazy(() => import('./views/pages/usuarios/InformacionUsuario'))

// Página de inicio pública (opcional si se usa)
const Inicio = React.lazy(() => import('./views/pages/inicio/Inicio'))


const routes = [
  { path: '/', exact: true, name: 'Home', element: Inicio },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Servicios / Procedimientos (panel interno)
  { path: '/crearprocedimiento', name: 'Crear servicio', element: CrearProcedimiento },
  { path: '/consultarprocedimientos', name: 'Consultar servicios', element: ConsultarProcedimientos },
  { path: '/procedimientos/:id', name: 'Detalle servicio', element: DetallesProcedimiento },
  { path: '/procedimientos/:id/editar', name: 'Editar servicio', element: EditarProcedimiento },

  // Categorías
  { path: '/categoriaprocedimientos', name: 'Categorías', element: ListarCategorias },
  { path: '/categoriaprocedimientoscrear', name: 'Crear categoría', element: CrearCategoria },
  { path: '/detallescategorias/:id', name: 'Detalle categoría', element: DetallesCategoria },
  { path: '/categoriaprocedimientos/:id', name: 'Editar categoría', element: EditarCategoria },
  // Servicios públicos
  { path: '/servicios', name: 'Servicios', element: Servicios },
  { path: '/servicios/:id', name: 'Detalle servicio público', element: VistaServicio },

  // Historial Médico
  { path: '/crearhistorialclinico', name: 'Crear historial médico', element: CrearHistorialMedico },
  { path: '/consultarhistorialmedico', name: 'Consultar historial médico', element: ConsultarHistorialMedico },
  { path: '/mihistorialclinico/:id', name: 'Mi historial médico', element: MiHistorialMedico },
  { path: '/historialmedico/:id', name: 'Detalle historial médico', element: DetallesHistorialMedico },

  // Citas
  { path: '/crearcita', name: 'Crear cita', element: RegistrarCita },
  { path: '/crearcitaasistente', name: 'Crear cita asistente', element: RegistrarCitaAsistente },
  { path: '/consultarcitas', name: 'Consultar citas', element: ConsultarCitas },
  { path: '/miscitas', name: 'Mis citas', element: MisCitas },
  { path: '/citas/:id', name: 'Detalle cita', element: DetallesCitas },

  // Notificaciones Usuario
  { path: '/notificaciones/usuario/historial', name: 'Historial notificaciones', element: HistorialNotificacionesUsuario },

  // Usuarios
  { path: '/listarusuarios', name: 'Usuarios', element: ListaUsuarios },
  { path: '/usuarios/:id', name: 'Detalle usuario', element: DetallesUsuario },
]

export default routes
