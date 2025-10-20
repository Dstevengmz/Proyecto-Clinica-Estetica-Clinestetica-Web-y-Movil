import React from "react";
import { useNavigate } from "react-router-dom";
import CardAction from "./common/CardAction";
import ObtenerUserIdFromToken from "../../assets/js/ObtenerTokenDelUsuario";

export default function DashboardUsuario() {
  const nav = useNavigate();
  const userId = ObtenerUserIdFromToken();
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 30 }}>Mi Panel</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        <CardAction
          icon="➕"
          title="Agendar Cita"
          description="Nueva cita"
          onClick={() => nav("/crearcita")}
        />
        <CardAction
          icon="📅"
          title="Mis Citas"
          description="Historial y próximas"
          onClick={() => nav("/miscitas")}
        />
        <CardAction
          icon="🩺"
          title="Mi Historia"
          description="Ver / Crear"
          onClick={() => nav(`/mihistorialclinico/${userId}`)}
        />
        <CardAction
          icon="🔔"
          title="Notificaciones"
          description="Alertas recientes"
          onClick={() => nav("/notificaciones/usuario/historial")}
        />
        <CardAction
          icon="🛒"
          title="Carrito"
          description="Procedimientos seleccionados"
          onClick={() => nav("/carrito")}
        />
        <CardAction
          icon="🛍️"
          title="Servicios"
          description="Consultar servicios disponibles"
          onClick={() => nav("/servicios")}
        />
      </div>
    </div>
  );
}
