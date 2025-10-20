import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";

import {
  cilFile,
  cilAccountLogout,
  cilUser,
  cilLifeRing,
  cilLockLocked,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import manejarCerrarSesion from "../../assets/js/alertas/logout/AlertaCerrarSesion";
import { useAuth } from "../../contexts/AuthenticaContext";
import ObtenerUsuarioIToken from "../../assets/js/ObtenerTokenDelUsuario";

import { useNavigate, useLocation } from "react-router-dom";
import avatar8 from "./../../assets/images/avatars/8.jpg";
const AppHeaderDropdown = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = ObtenerUsuarioIToken();

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
          Configuraciones
        </CDropdownHeader>
        <CDropdownItem
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (userId) {
              navigate(`/editarusuario/${userId}`);
            } else {
              navigate("/iniciarsesion");
            }
          }}
        >
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>

        <CDropdownItem onClick={() => navigate("/terminoscondiciones")}>
          <CIcon icon={cilFile} className="me-2" />
          Términos y Condiciones
        </CDropdownItem>
        <CDropdownItem onClick={() => navigate("/contacto")}>
          <CIcon icon={cilLifeRing} className="me-2" />
          Ayuda
        </CDropdownItem>
        <CDropdownItem onClick={() => navigate("/cambiarcontrasena")}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Cambiar Contraseña
        </CDropdownItem>

        <CDropdownDivider />
        <CDropdownItem
          href="#"
          className="nav-link"
          onClick={() => manejarCerrarSesion(navigate, logout, location)}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
