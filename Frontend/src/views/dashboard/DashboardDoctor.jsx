import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardAction from './common/CardAction';

export default function DashboardDoctor() {
  const nav = useNavigate();
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 30 }}>Panel Doctor</h1>
      <div style={{ display:'flex', flexWrap:'wrap', gap:20 }}>
        <CardAction icon='📅' title='Citas' description='Agenda completa' onClick={()=>nav('/consultarcitas')} />
        <CardAction icon='➕' title='Agregar Servicios' description='Registrar servicios' onClick={()=>nav('/consultarprocedimientos')} />
        <CardAction icon='🩺' title='Historias' description='Historial clínico' onClick={()=>nav('/consultarhistorialmedico')} />
        <CardAction icon='🧾' title='Procedimientos' description='Gestionar servicios' onClick={()=>nav('/consultarprocedimientos')} />
        <CardAction icon='👥' title='Usuarios' description='Listado de pacientes' onClick={()=>nav('/listarusuarios')} />
        <CardAction icon='🔔' title='Notificaciones' description='Novedades' onClick={()=>nav('/historial-notificaciones')} />
      </div>
    </div>
  );
}
