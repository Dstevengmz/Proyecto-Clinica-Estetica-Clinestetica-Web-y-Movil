import React from "react";
import { useNavigate } from "react-router-dom";
import CardAction from "./common/CardAction";
import  useTourAsistente  from "../../hooks/useTourDriverjs";
import { useAuth } from "../../contexts/AuthenticaContext";
export default function DashboardAsistente() {
  const nav = useNavigate();
  const { userRole } = useAuth(); 
  useTourAsistente(userRole);

  return (
    <div id="dashboard-asistente" style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 30 }}>Panel Asistente</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        <CardAction
          id="card-citas"
          icon="🗂"
          title="Citas"
          description="Gestionar / Filtrar"
          onClick={() => nav("/listatodoslosusuariosasistente")}
        />
        <CardAction
          id="card-agendar"
          icon="➕"
          title="Agendar Cita"
          description="Para un paciente"
          onClick={() => nav("/crearcitaasistente")}
        />
        <CardAction
         id="card-procedimientos"
          icon="🧾"
          title="Procedimientos"
          description="Servicios disponibles"
          onClick={() => nav("/consultarprocedimientos")}
        />
      </div>
    </div>
  );
}
