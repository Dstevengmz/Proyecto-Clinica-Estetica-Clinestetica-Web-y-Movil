import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import manejarCerrarSesion from "../../assets/js/alertas/logout/AlertaCerrarSesion";
import { useAuth } from "../../contexts/AuthenticaContext";
import { useCarrito } from "../../contexts/CarritoContext";

import {
  CCollapse,
  CContainer,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import "../../assets/css/NavbarPublico.css";

const NavbarPublico = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const { carrito } = useCarrito();
  const cantidadCarrito = Array.isArray(carrito) ? carrito.length : 0;

  return (
    <CNavbar
      expand="lg"
      className="bg-body-tertiary sticky-top shadow-sm"
      style={{ zIndex: 1030 }}
    >
      <CContainer fluid>
        <CNavbarBrand as={Link} to="/inicio">
          Mi Clínica
        </CNavbarBrand>

        <CNavbarToggler onClick={() => setVisible(!visible)} />

        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="me-auto">
            <CNavItem>
              <CNavLink as={Link} to="/inicio" active>
                Inicio
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink as={Link} to="/servicios">
                Servicios
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink as={Link} to="/contacto">
                Contacto
              </CNavLink>
            </CNavItem>
          </CNavbarNav>

          <CNavbarNav className="ms-auto">
            {/* Carrito */}
            <CNavItem>
              <CNavLink
                as={Link}
                to="/carrito"
                className="position-relative me-4 cart-link btn btn-secondary d-inline-flex align-items-center"
              >
                🛒
                {isAuthenticated && cantidadCarrito > 0 && (
                  <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger cart-badge">
                    {cantidadCarrito}
                  </span>
                )}
              </CNavLink>
            </CNavItem>
            {/* Login / Usuario */}
            {!isAuthenticated ? (
              <CNavItem>
                <CNavLink as={Link} to="/iniciarsesion">
                  Iniciar Sesión
                </CNavLink>
              </CNavItem>
            ) : (
              <CDropdown alignment="end">
                <CDropdownToggle color="secondary">
                  👤 Mi cuenta
                </CDropdownToggle>

                <CDropdownMenu>
                  <CDropdownItem as={Link} to="/perfil">
                    Perfil
                  </CDropdownItem>
                  <CDropdownItem as={Link} to="/dashboard">
                    Dashboard
                  </CDropdownItem>

                  <CDropdownDivider />

                  <CDropdownItem
                    onClick={() =>
                      manejarCerrarSesion(navigate, logout, location)
                    }
                  >
                    Cerrar Sesión
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            )}
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
};

export default NavbarPublico;
