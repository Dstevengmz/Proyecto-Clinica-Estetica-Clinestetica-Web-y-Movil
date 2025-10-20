import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilCalendar,
  cilNotes,
  cilMedicalCross,
  cilSpeedometer,
  cilApps,
  // cilUser,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import ObtenerUserIdFromToken from "./assets/js/ObtenerTokenDelUsuario";

// Navegacion para usuarios
const getUserNavigation = () => {
  const userId = ObtenerUserIdFromToken();

  return [
    {
      component: CNavItem,
      name: "Panel de control",
      to: "/dashboard",
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: "Historial Médico",
      icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: "Crear",
          to: "/crearhistorialclinico",
        },
        {
          component: CNavItem,
          name: "Mi Historial Medico",
          to: `/mihistorialclinico/${userId}`,
        },
      ],
    },
    {
      component: CNavGroup,
      name: "Mis Citas",
      icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: "Agendar Cita",
          to: "/crearcita",
        },
        {
          component: CNavItem,
          name: "Mis Citas",
          to: "/miscitas",
        },
      ],
    },
    {
      component: CNavGroup,
      name: "Notificaciones",
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: "Mis notificaciones",
          to: "/notificaciones/usuario/historial",
        },
      ],
    },
  ];
};

// Navegación para Asistentes
const getAsistenteNavigation = () => [
  {
    component: CNavItem,
    name: "Panel de control",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "Citas",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Registrar Cita ",
        to: "/crearcitaasistente",
      },
      {
        component: CNavItem,
        name: "Reagendar Citas",
        to: "/listatodoslosusuariosasistente",
      },
      {
        component: CNavItem,
        name: "Completo Historial",
        to: "/seleccionarusuariohistorial",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Servicio",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Crear Servicio",
        to: "/crearprocedimiento",
      },
      {
        component: CNavItem,
        name: "Crear Categoria",
        to: "/categoriaprocedimientoscrear",
      },
      {
        component: CNavItem,
        name: "Consultar Servicios",
        to: "/consultarprocedimientos",
      },

      {
        component: CNavItem,
        name: "Consultar Categorias",
        to: "/categoriaprocedimientos",
      },
    ],
  },
];

const getDoctorNavigation = () => [
  {
    component: CNavItem,
    name: "Panel en vivo",
    to: "/paneldedatos",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Accesos rápidos",
    to: "/dashboard",
    icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: "Historial Médico",
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Crear",
        to: "/crearhistorialclinico",
      },
      {
        component: CNavItem,
        name: "Consultar",
        to: "/consultarhistorialmedico",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Citas",
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Crear Cita",
        to: "/crearcita",
      },
      {
        component: CNavItem,
        name: "Consultar Citas",
        to: "/consultarcitas",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Servicio",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Crear Servicio",
        to: "/crearprocedimiento",
      },
      {
        component: CNavItem,
        name: "Crear Categoria",
        to: "/categoriaprocedimientoscrear",
      },
      {
        component: CNavItem,
        name: "Consultar Servicios",
        to: "/consultarprocedimientos",
      },

      {
        component: CNavItem,
        name: "Consultar Categorias",
        to: "/categoriaprocedimientos",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Usuarios",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "lista de Usuarios",
        to: "/listarusuarios",
      },
    ],
  },
];

const getNavigationByRole = (userRole) => {
  switch (userRole) {
    case "doctor":
    case "Doctor":
    case "DOCTOR":
      return getDoctorNavigation();
    case "usuario":
    case "Usuario":
    case "USUARIO":
      return getUserNavigation();
    case "asistente":
    case "Asistente":
    case "ASISTENTE":
      return getAsistenteNavigation();
    default:
      return getUserNavigation();
  }
};

export default getNavigationByRole;
