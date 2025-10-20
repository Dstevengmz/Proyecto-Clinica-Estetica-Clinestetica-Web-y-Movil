import React, { createContext, useContext, useState, useEffect } from "react";
import socketfrontend from "../assets/js/socket";
import { useAuth } from "./AuthenticaContext";
import ObtenerUserIdFromToken from "../assets/js/ObtenerTokenDelUsuario";

const NotificationUsuarioContext = createContext();

export const useNotificationsUsuario = () => {
  const context = useContext(NotificationUsuarioContext);
  if (!context) {
    throw new Error(
      "useNotificationsUsuario debe usarse dentro de NotificationUsuarioProvider"
    );
  }
  return context;
};

export const NotificationUsuarioProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    //  Solo para pacientes/usuarios (no doctores)
    // Verificar diferentes posibles valores de rol para usuarios
    const isUser =
      isAuthenticated &&
      userRole &&
      userRole !== "doctor" &&
      userRole !== "Doctor" &&
      userRole !== "DOCTOR";

    console.log(
      "NotificationUsuarioContext - isAuthenticated:",
      isAuthenticated,
      "userRole:",
      userRole,
      "isUser:",
      isUser
    );

    if (isUser) {
      const userId = ObtenerUserIdFromToken();

      if (userId && socketfrontend) {
        //  Registrar al paciente en su sala específica
        socketfrontend.emit("registrarPaciente", userId);
        console.log(`Paciente ${userId} registrado en socket`);

        //  Escuchar nuevas notificaciones
        socketfrontend.on("nuevaNotificacion", (notificacion) => {
          console.log("Nueva notificación de usuario recibida:", notificacion);
          const nuevaNotificacion = { ...notificacion, leida: false };
          setNotifications((prev) => [nuevaNotificacion, ...prev]);
          setUnreadCount((prev) => prev + 1);

          //  Notificación del navegador
          if (Notification.permission === "granted") {
            new Notification("Nueva notificación", {
              body: notificacion.mensaje,
              icon: "/favicon.ico",
            });
          }
        });

        //  Cargar notificaciones almacenadas
        loadStoredNotifications(userId);

        return () => {
          socketfrontend.off("nuevaNotificacion");
        };
      }
    }
  }, [isAuthenticated, userRole]);

  const loadStoredNotifications = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      //  Endpoint específico para usuarios
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/apiusuarios/notificacionesusuario/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const storedNotifications = await response.json();
        console.log(
          "Notificaciones de usuario recibidas:",
          storedNotifications
        );
        setNotifications(storedNotifications);
        const unread = storedNotifications.filter((n) => !n.leida).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones de usuario:", error);
    }
  };

  const markAsRead = async (notificacionId) => {
    try {
      const userId = ObtenerUserIdFromToken();
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/apiusuarios/notificacionesusuario/${userId}/marcar-leida`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notificacionId }),
        }
      );

      if (response.ok) {
        setNotifications((prev) => {
          let restados = 0;
          const next = prev.map((notif) => {
            if (String(notif.id) === String(notificacionId)) {
              if (!notif.leida) restados = 1;
              return { ...notif, leida: true };
            }
            return notif;
          });
          if (restados) setUnreadCount((p) => Math.max(0, p - 1));
          return next;
        });
        console.log(
          `Notificación de usuario ${notificacionId} marcada como leída`
        );
      }
    } catch (error) {
      console.error(
        "Error al marcar notificación de usuario como leída:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = ObtenerUserIdFromToken();
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/apiusuarios/notificacionesusuario/${userId}/marcar-todas-leidas`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, leida: true }))
        );
        setUnreadCount(0);
        console.log("Todas las notificaciones de usuario marcadas como leídas");
      }
    } catch (error) {
      console.error(
        "Error al marcar todas las notificaciones de usuario como leídas:",
        error
      );
    }
  };

  const clearNotifications = async () => {
    try {
      const userId = ObtenerUserIdFromToken();
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/apiusuarios/notificacionesusuario/${userId}/archivar-leidas`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(
          `${result.archivadas} notificaciones de usuario archivadas`
        );
        await loadStoredNotifications(userId);
      }
    } catch (error) {
      console.error("Error al archivar notificaciones de usuario:", error);
    }
  };

  const loadNotificationHistory = async () => {
    try {
      const userId = ObtenerUserIdFromToken();
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/apiusuarios/notificacionesusuario/${userId}/historial`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const historial = await response.json();
        return historial;
      }
      return [];
    } catch (error) {
      console.error(
        "Error al cargar historial de notificaciones de usuario:",
        error
      );
      return [];
    }
  };

  useEffect(() => {
    if (isAuthenticated && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    loadNotificationHistory,
  };

  return (
    <NotificationUsuarioContext.Provider value={value}>
      {children}
    </NotificationUsuarioContext.Provider>
  );
};
