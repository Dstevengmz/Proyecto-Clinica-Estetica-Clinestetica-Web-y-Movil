import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useColorModes } from "@coreui/react";
import "./NotificationBell.css";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownHeader,
  CDropdownItem,
  CDropdownDivider,
  CBadge,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell } from "@coreui/icons";
import { useNotifications } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthenticaContext";
import { CitasContext } from "../contexts/CitasContext";

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    loadNotificationHistory,
  } = useNotifications();
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const citasContext = useContext(CitasContext);

  // Obtener tema actual
  const { colorMode } = useColorModes("coreui-free-react-admin-template-theme");
  const currentTheme = useSelector((state) => state.theme);
  const isDarkMode = colorMode === "dark" || currentTheme === "dark";

  // Estilos dinámicos basados en el tema
  const getThemeStyles = () => {
    if (isDarkMode) {
      return {
        dropdown: {
          backgroundColor: "#2d3748",
          border: "1px solid #4a5568",
          color: "#e2e8f0",
        },
        item: {
          backgroundColor: "#2d3748",
          color: "#e2e8f0",
          borderColor: "#4a5568",
        },
        itemHover: {
          backgroundColor: "#4a5568",
        },
        unreadItem: {
          backgroundColor: "#1a365d",
          borderColor: "#3182ce",
        },
        iconBackground: "#4a5568",
        textMuted: "#a0aec0",
      };
    } else {
      return {
        dropdown: {
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          color: "#2d3748",
        },
        item: {
          backgroundColor: "#ffffff",
          color: "#2d3748",
          borderColor: "#e2e8f0",
        },
        itemHover: {
          backgroundColor: "#f7fafc",
        },
        unreadItem: {
          backgroundColor: "#e3f2fd",
          borderColor: "#1976d2",
        },
        iconBackground: "#f8f9fa",
        textMuted: "#6c757d",
      };
    }
  };

  const themeStyles = getThemeStyles();

  if (userRole !== "doctor" && userRole !== "Doctor" && userRole !== "DOCTOR") {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewAllNotifications = async () => {
    try {
      const historial = await loadNotificationHistory();
      console.log("Historial completo:", historial);
      navigate("/historial-notificaciones", { state: { historial } });
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  const handleNotificationClick = async (index, notification) => {
    console.log(`Marcando notificación ${notification?.id} como leída`);
    if (notification?.id != null) {
      await markAsRead(notification.id);
    }
    if (notification.ruta) {
      if (notification.citaId) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/apicitas/buscarcitas/${
              notification.citaId
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const citaData = await response.json();
            if (citasContext && citasContext.setSelectedCitas) {
              citasContext.setSelectedCitas(citaData);
            }
          }
        } catch (e) {
          console.error("Error precargando cita desde notificación:", e);
        }
      }
      navigate(notification.ruta);
      return;
    }

    if (
      (notification.tipo === "cita" || notification.tipo === "examenes") &&
      notification.citaId
    ) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/apicitas/buscarcitas/${
            notification.citaId
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const citaData = await response.json();

          // Si hay contexto de citas disponible, seleccionar la cita
          if (citasContext && citasContext.setSelectedCitas) {
            citasContext.setSelectedCitas(citaData);
          }

          // Navegar a detalles de citas
          navigate("/detallescitas/" + citaData.id);
        } else {
          // Si no se puede obtener la cita específica, navegar a la lista
          navigate("/consultarcitas");
        }
      } catch (error) {
        console.error("Error al obtener detalles de la cita:", error);
        // Fallback: navegar a la lista de citas
        navigate("/consultarcitas");
      }
    } else {
      // Para otros tipos de notificaciones, ir al dashboard
      navigate("/dashboard");
    }
  };

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle
        caret={false}
        className="position-relative"
        style={{ border: "none", background: "transparent" }}
      >
        <CIcon icon={cilBell} size="lg" />
        {unreadCount > 0 && (
          <CBadge
            color="danger"
            position="top-end"
            shape="rounded-pill"
            className="position-absolute translate-middle notification-bell-badge"
            style={{
              fontSize: "0.7rem",
              minWidth: "1.2rem",
              height: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </CBadge>
        )}
      </CDropdownToggle>

      <CDropdownMenu
        className="notification-dropdown"
        style={{
          width: "380px",
          maxHeight: "500px",
          overflowY: "auto",
          ...themeStyles.dropdown,
          boxShadow: isDarkMode
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <CDropdownHeader
          className="d-flex justify-content-between align-items-center"
          style={{ color: themeStyles.dropdown.color }}
        >
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <CBadge color="primary">{unreadCount} nuevas</CBadge>
          )}
        </CDropdownHeader>

        {notifications.length > 0 && (
          <>
            <CDropdownItem className="d-flex justify-content-between p-2">
              <CButton
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="me-1"
              >
                Marcar como leídas
              </CButton>
              <CButton
                size="sm"
                variant="outline"
                color="warning"
                onClick={clearNotifications}
                disabled={notifications.filter((n) => n.leida).length === 0}
                className="me-1"
              >
                Archivar leídas
              </CButton>
              <CButton
                size="sm"
                variant="outline"
                color="info"
                onClick={handleViewAllNotifications}
              >
                Ver todas
              </CButton>
            </CDropdownItem>
            <CDropdownDivider />
          </>
        )}

        {notifications.length === 0 ? (
          <CDropdownItem disabled style={{ ...themeStyles.item }}>
            <div className="text-center py-3">
              <CIcon
                icon={cilBell}
                size="xl"
                className="mb-2"
                style={{ color: themeStyles.textMuted }}
              />
              <p className="mb-0" style={{ color: themeStyles.textMuted }}>
                No tienes notificaciones
              </p>
            </div>
          </CDropdownItem>
        ) : (
          notifications.slice(0, 10).map((notification, index) => (
            <CDropdownItem
              key={index}
              onClick={() => handleNotificationClick(index, notification)}
              className="notification-item"
              style={{
                cursor: "pointer",
                padding: "16px",
                borderRadius: "8px",
                margin: "4px",
                ...(notification.leida
                  ? themeStyles.item
                  : themeStyles.unreadItem),
                border: !notification.leida
                  ? `1px solid ${themeStyles.unreadItem.borderColor}`
                  : `1px solid ${themeStyles.item.borderColor}`,
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor =
                  themeStyles.itemHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = notification.leida
                  ? themeStyles.item.backgroundColor
                  : themeStyles.unreadItem.backgroundColor;
              }}
            >
              <div className="d-flex align-items-start">
                <div
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: themeStyles.iconBackground,
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>
                    {notification.tipo === "cita" ? "📅" : "🔔"}
                  </span>
                </div>
                <div className="flex-grow-1 notification-content">
                  {notification.paciente && notification.fechaCita ? (
                    <>
                      <div
                        className="fw-bold mb-1"
                        style={{
                          fontSize: "0.9rem",
                          color: themeStyles.item.color,
                        }}
                      >
                        Nueva cita registrada
                      </div>
                      <div className="mb-2">
                        <span
                          style={{
                            color: themeStyles.item.color,
                            fontWeight: "600",
                          }}
                        >
                          Paciente: {notification.paciente}
                        </span>
                      </div>
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        <CBadge
                          color="info"
                          className="notification-type-badge"
                        >
                          📅 {formatDate(notification.fechaCita)}
                        </CBadge>
                        {notification.tipoCita && (
                          <CBadge
                            color="success"
                            className="notification-type-badge"
                          >
                            {notification.tipoCita}
                          </CBadge>
                        )}
                      </div>
                    </>
                  ) : (
                    //Caja Notificaciones doctor
                    <div
                      className="fw-semibold mb-1"
                      style={{
                        fontSize: "0.875rem",
                        color: themeStyles.item.color,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "100%",
                      }}
                    >
                      {notification.mensaje}
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <small style={{ color: themeStyles.textMuted }}>
                      {formatDate(notification.fecha)}
                    </small>
                    {!notification.leida && (
                      <CBadge color="primary" size="sm">
                        • Nuevo
                      </CBadge>
                    )}
                  </div>
                </div>
              </div>
            </CDropdownItem>
          ))
        )}

        {notifications.length > 10 && (
          <>
            <CDropdownDivider />
            <CDropdownItem
              className="text-center"
              style={{ color: themeStyles.textMuted }}
            >
              Y {notifications.length - 10} notificaciones más...
            </CDropdownItem>
          </>
        )}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default NotificationBell;
