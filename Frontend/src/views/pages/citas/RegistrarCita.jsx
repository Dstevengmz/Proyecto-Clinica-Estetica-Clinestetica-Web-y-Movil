import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import esES from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useCitasDoctor from "../../../hooks/useCitaDoctorIdParaAsistente";
import { useNavigate } from "react-router-dom";
import { usePerfilUsuario } from "../../../hooks/usePerfilUsuario";
import useListarDoctores from "../../../hooks/useListarDoctores";
import horariosDisponibles from "../../../assets/js/HorariosDisponibles";
import AlertaCitas from "../../../assets/js/alertas/citas/AlertaCitas";
import { useCarrito } from "../../../contexts/CarritoContext";
import Cargando from "../../../components/Cargando";
import InformacionUsuario from "../../../views/pages/usuarios/InformacionUsuario";
import calendarFormats from "../../../assets/js/CalendarioEspanol";
import "../../../assets/css/RegistrarCita.css";

const locales = { es: esES };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: esES }),
  getDay,
  locales,
});

const API_URL = import.meta.env.VITE_API_URL;

function toISODate(date) {
  // YYYY-MM-DD en zona local
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function combineDateTime(dateStr, hhmm) {
  // "YYYY-MM-DD" + "HH:mm" -> Date local
  const [hh, mm] = hhmm.split(":").map(Number);
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export default function RegistrarCitasCalendario() {
  const navigate = useNavigate();
  const alerta = new AlertaCitas();

  const { usuario, cargando: cargandoUsuario } = usePerfilUsuario();
  const {
    doctores,
    cargando: cargandoDoctores,
    error: errorDoctores,
  } = useListarDoctores();
  const { carrito, limpiarCarrito } = useCarrito();

  const token = localStorage.getItem("token");

  // Vista del calendario: por simplicidad, "day" para que coincida con tu hook de horarios por fecha
  const [view, setView] = useState("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const onNavigate = (date) => {
    setCurrentDate(date);
  };
  // Selección de doctor (debe ir antes de obtener horarios para poder filtrar)
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");

  // Hook de horarios ocupados (tipo fijo "evaluacion").
  // Solo se consultan horarios cuando ya hay un doctor seleccionado para no traer datos globales.

  // Eventos que pinta el calendario (derivados de horariosOcupados)
  const [eventos, setEventos] = useState([]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { citas: citasDoctor, cargando: cargandoCitasDoctor } =
    useCitasDoctor(doctorSeleccionado);
  // Ajusta la ventana visible del calendario a tu horario laboral usando horariosDisponibles
  const minTime = useMemo(() => {
    const first = horariosDisponibles[0] || "08:00";
    return combineDateTime(toISODate(currentDate), first);
  }, [currentDate]);

  const maxTime = useMemo(() => {
    const last = horariosDisponibles[horariosDisponibles.length - 1] || "18:00";
    return addMinutes(combineDateTime(toISODate(currentDate), last), 30);
  }, [currentDate]);

  useEffect(() => {
    if (!doctorSeleccionado || !citasDoctor || citasDoctor.length === 0) {
      setEventos([]);
      return;
    }

    const mapped = citasDoctor.map((cita) => {
      const start = new Date(cita.fecha);
      const duracion = cita.tipo === "evaluacion" ? 30 : 60;
      const end = new Date(start.getTime() + duracion * 60000);

      return {
        title: "🟥 Ocupado",
        start,
        end,
        tipo: "ocupado",
        resource: cita,
      };
    });

    setEventos(mapped);
  }, [citasDoctor, doctorSeleccionado]);

  const onView = (nextView) => setView(nextView);

  function validarSlot(start) {
    const ahora = new Date();

      if (start.getDay() === 0) {
    return false;
  }

      if (start < ahora) {
      alerta.alertaLaCitaNoPuedeSerPasada();
      return false;
    }

    const horaStr = `${String(start.getHours()).padStart(2, "0")}:${String(
      start.getMinutes()
    ).padStart(2, "0")}`;

    if (!horariosDisponibles.includes(horaStr)) {
      alerta.alertaErrorCrearCita(
        "Seleccione una hora válida según el horario disponible Horario [08:00am - 12:00pm 01:00pm - 06:00pm]"
      );
      return false;
    }

    const ocupado = eventos.some((ev) => start >= ev.start && start < ev.end);

    if (ocupado) {
      alerta.alertaErrorCrearCita("Ese horario ya está ocupado. Elige otro.");
      return false;
    }

    return true;
  }

const slotPropGetter = (date) => {
  if (date.getDay() === 0) {
    return {
      className: "slot-domingo"
    };
  }
  return {};
};


  const onSelectSlot = ({ start }) => {


    if (start.getDay() === 0) {
     alerta.NoAgendarDomingos();
    return;
  }

    const startRounded = new Date(start);
    startRounded.setMinutes(
      startRounded.getMinutes() - (startRounded.getMinutes() % 30),
      0,
      0
    );
    const endRounded = addMinutes(startRounded, 30);

    if (!doctorSeleccionado) {
      alerta.alertaErrorCrearCita(
        "Primero seleccione un doctor para agendar la cita."
      );
      return;
    }

    if (!validarSlot(startRounded)) return;

    setSlotSeleccionado({ start: startRounded, end: endRounded });
    setShowModal(true);
  };

  const guardarCita = async () => {
    if (!usuario?.id) {
      await alerta.alertaErrorCrearCita(
        "No se pudo cargar la información del usuario. Inicie sesión."
      );
      return;
    }
    if (!doctorSeleccionado) {
      await alerta.alertaValidacionCampos();
      return;
    }
    if (!slotSeleccionado?.start) return;

    if (!carrito || carrito.length === 0) {
      const { isConfirmed } = await alerta.alertaCarritoVacioIrServicios();
      if (isConfirmed) navigate("/servicios");
      return;
    }

    const fechaISO = toISODate(slotSeleccionado.start);
    const hh = String(slotSeleccionado.start.getHours()).padStart(2, "0");
    const mm = String(slotSeleccionado.start.getMinutes()).padStart(2, "0");
    const fechaFormateada = `${fechaISO}T${hh}:${mm}:00`;

    try {
      setEnviando(true);
      const resp = await axios.post(
        `${API_URL}/apicitas/crearcitas`,
        {
          id_usuario: usuario.id,
          id_doctor: doctorSeleccionado,
          fecha: fechaFormateada,
          tipo: "evaluacion",
          estado: "pendiente",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await alerta.alertaCitaAgendada();
      limpiarCarrito();
      setShowModal(false);

      const citaCreada = resp?.data?.cita ||
        resp?.data || {
          id_usuario: usuario.id,
          id_doctor: doctorSeleccionado,
          fecha: fechaFormateada,
          tipo: "evaluacion",
          estado: "pendiente",
        };

      setEventos((prev) => [
        ...prev,
        {
          title: "🟥 Ocupado",
          start: slotSeleccionado.start,
          end: slotSeleccionado.end,
          tipo: "ocupado",
          resource: citaCreada,
        },
      ]);
    } catch (error) {
      console.error("Error al registrar cita:", error);
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.msg ||
        error?.message ||
        "Hubo un error al registrar la cita";
      if (
        String(backendMsg)
          .toLowerCase()
          .includes("la fecha de la cita no puede ser pasada")
      ) {
        await alerta.alertaLaCitaNoPuedeSerPasada();
      } else {
        await alerta.alertaErrorCrearCita(backendMsg);
      }
    } finally {
      setEnviando(false);
    }
  };
  const dayPropGetter = (date) => {
  if (date.getDay() === 0) {
    return { className: "dia-domingo" };
  }
  return {};
};

  const eventPropGetter = (event) => {
    if (event.tipo === "ocupado") {
      return {
        style: {
          backgroundColor: "rgba(220, 53, 69, 0.25)",
          borderColor: "rgba(220, 53, 69, 0.8)",
          color: "#000",
        },
      };
    }
    return {};
  };

  const messages = {
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    allDay: "Todo el día",
    week: "Semana",
    work_week: "Semana laboral",
    day: "Día",
    month: "Mes",
    previous: "Anterior",
    next: "Siguiente",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    today: "Hoy",
    agenda: "Agenda",
    noEventsInRange: "No hay eventos en este rango.",
    showMore: (total) => `+ Ver más (${total})`,
  };

  if (cargandoUsuario || cargandoDoctores || cargandoCitasDoctor) {
    return <Cargando texto="Cargando información del calendario…" />;
  }

  if (!usuario?.id) {
    return (
      <Cargando texto="No se pudo cargar el usuario. Inicie sesión nuevamente." />
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Registrar Cita</h1>

      {errorDoctores && (
        <div className="alert alert-warning">{errorDoctores}</div>
      )}

      <InformacionUsuario usuario={usuario} />

      <div className="card mt-3">
        <div className="card-body">
          <Form.Group className="mb-3">
            <Form.Label>Doctores</Form.Label>
            <Form.Select
              value={doctorSeleccionado}
              onChange={(e) => {
                setDoctorSeleccionado(e.target.value);
                setSlotSeleccionado(null);
              }}
              disabled={cargandoDoctores}
              required
            >
              <option value="">Seleccione un doctor</option>
              {doctores?.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {!doctorSeleccionado ? (
            <div className="alert alert-info mb-0">
              Primero seleccione un doctor para cargar la disponibilidad.
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 650 }}
              selectable
              onSelectSlot={onSelectSlot}
              dayPropGetter={dayPropGetter}
              slotPropGetter={slotPropGetter} 
              onNavigate={onNavigate}
              onView={onView}
              view={view}
              date={currentDate}
              step={30}
              timeslots={2}
              min={minTime}
              max={maxTime}
              toolbar
              popup
              messages={messages}
              formats={calendarFormats}
              eventPropGetter={eventPropGetter}
              views={["day", "week", "month"]}
            />
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            <strong>Fecha y hora:</strong>{" "}
            {slotSeleccionado?.start?.toLocaleString("es-CO", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="mb-2">
            <strong>Doctores:</strong>{" "}
            {doctores?.find((d) => String(d.id) === String(doctorSeleccionado))
              ?.nombre || ""}
          </p>

          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Control type="text" value="evaluacion" readOnly />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCita} disabled={enviando}>
            {enviando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Guardando…
              </>
            ) : (
              "Guardar Cita"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
