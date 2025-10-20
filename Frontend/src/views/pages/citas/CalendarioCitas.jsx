import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import calendarFormats from "../../../assets/js/CalendarioEspanol";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import { CitasContext, useCitasContext } from "../../../contexts/CitasContext";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import useListarCitas from "../../../hooks/useListarCitas";
import "react-big-calendar/lib/css/react-big-calendar.css";
import horariosDisponibles from "../../../assets/js/HorariosDisponibles";
import { Button} from "react-bootstrap";

function combineTime(hhmm) {
  const [hh, mm] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: es }),
  getDay,
  locales,
});

function CalendarioCitas() {
  const { selectedCitas, setSelectedCitas } = useCitasContext();
  const navigate = useNavigate();
  const { citas: todasLasCitas, cargando: cargandoCitas } = useListarCitas();

  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);


  const selectCitas = (citas) => {
    setSelectedCitas(citas);
    navigate("/detallesCitas/" + citas.id);
  };
  if (cargandoCitas) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div>Cargando calendario</div>
      </div>
    );
  }

  const firstSlot = horariosDisponibles?.[0] || "08:00";
  const lastSlot = horariosDisponibles?.[horariosDisponibles.length - 1] || "18:00";
  const minTime = combineTime(firstSlot);
  const maxTime = addMinutes(combineTime(lastSlot), 30);

//   const citasActivas = todasLasCitas.filter(
//   (cita) => cita.estado !== "cancelada"
// );



  const eventosCalendario = todasLasCitas
    .filter((cita) => mostrarCanceladas || cita.estado !== "cancelada")
    .map((cita) => ({
      title: `${
        cita.tipo === "evaluacion" ? "🩺 Evaluación" : "⚕️ Procedimiento"
      } - ${cita.usuario?.nombre || "Paciente"}`,
      start: new Date(cita.fecha),
      end: new Date(new Date(cita.fecha).getTime() + 30 * 60000),
      resource: cita,
    }));

  
const customEventStyleGetter = (event) => {
  // Si está cancelada, estilo gris y tachado
  if (event.resource.estado === "cancelada") {
    return {
      style: {
        backgroundColor: "gray",
        borderRadius: "5px",
        color: "white",
        border: "none",
        display: "block",
        opacity: 0.6, // un poco transparente
        textDecoration: "line-through", // tachado
      },
    };
  }

  // Si no está cancelada, usa colores normales según el tipo
  let backgroundColor = "#007bff";
  if (event.resource.tipo === "evaluacion") {
    backgroundColor = "#17a2b8";
  } else if (event.resource.tipo === "procedimiento") {
    backgroundColor = "#28a745";
  }

  return {
    style: {
      backgroundColor,
      borderRadius: "5px",
      color: "white",
      border: "none",
      display: "block",
    },
  };
};

  
  return (
    
    <CitasContext.Provider value={{ selectedCitas, setSelectedCitas }}>
        <div className="card-body">
          <Button
  variant={mostrarCanceladas ? "warning" : "secondary"}
  className="mb-3"
  onClick={() => setMostrarCanceladas(!mostrarCanceladas)}
>
  {mostrarCanceladas ? "Ocultar canceladas" : "Mostrar canceladas"}
</Button>
        <h5>Vista de Calendario</h5>
        <div style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={eventosCalendario}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            defaultView="week"
            views={["day", "week", "month"]}
            step={30}
            timeslots={2}
            min={minTime}
            max={maxTime}
            scrollToTime={minTime}
            eventPropGetter={customEventStyleGetter}
            onSelectEvent={(event) => {
              selectCitas(event.resource);
            }}
            messages={{
              next: "Siguiente",
              previous: "Anterior",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Cita",
              noEventsInRange: "No hay citas en este rango.",
            }}
            formats={calendarFormats}
          />
        </div>
      </div>
    </CitasContext.Provider>
  );
}
export default CalendarioCitas;