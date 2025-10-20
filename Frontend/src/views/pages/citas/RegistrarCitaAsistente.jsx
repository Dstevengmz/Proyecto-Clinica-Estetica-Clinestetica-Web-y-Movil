import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Form, Container, Button, Modal, Spinner } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import esES from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { usePerfilUsuario } from "../../../hooks/usePerfilUsuario";
import useListarDoctores from "../../../hooks/useListarDoctores";
import useHorariosDisponible from "../../../hooks/useHorariosDisponible";
import horariosDisponibles from "../../../assets/js/HorariosDisponibles";
import estaOcupado from "../../../assets/js/HorarioEstaOcupado";
import AlertaCitas from "../../../assets/js/alertas/citas/AlertaCitas";
import Cargando from "../../../components/Cargando";
import InformacionUsuario from "../../../views/pages/usuarios/InformacionUsuario";
import useOrdenesEvaluacionRealizada from "../../../hooks/useOrdenesEvaluacionRealizada";
import useListarUsuarios from "../../../hooks/useListarUsuarios";
import useCitasDoctor from "../../../hooks/useCitaDoctorIdParaAsistente";
import calendarFormats from "../../../assets/js/CalendarioEspanol";
import "../../../assets/css/AsistenteCita.css";

const API_URL = import.meta.env.VITE_API_URL;

function RegistraCitaAsistente() {
  const locales = { es: esES };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { locale: esES }),
    getDay,
    locales,
  });

  function toISODate(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function combineDateTime(dateStr, hhmm) {
    const [hh, mm] = hhmm.split(":").map(Number);
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0, 0);
  }
  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  const { usuario, cargando } = usePerfilUsuario();
  const navigate = useNavigate();
  const {
    doctores,
    cargando: cargandoDoctores,
    error: errorDoctores,
  } = useListarDoctores();
  const {
    usuarios,
    cargando: cargandoUsuarios,
    error: errorUsuarios,
  } = useListarUsuarios();

  const token = localStorage.getItem("token");

  const [view, setView] = useState("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fechaVista, setFechaVista] = useState(toISODate(new Date()));
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);

  const [enviando, setEnviando] = useState(false);
  const alerta = new AlertaCitas();
  const [formData, setFormData] = useState({
    id_usuario: "",
    id_doctor: "",
    estado: "pendiente",
    tipo: "procedimiento",
    id_orden: "",
  });

  const {
    horariosOcupados,
    cargando: cargandoHorarios,
    error,
  } = useHorariosDisponible(
    fechaVista,
    formData.tipo,
    token,
    formData.id_doctor || null
  );
  const { citas: citasDoctor, cargando: cargandoCitasDoctor } = useCitasDoctor(
    formData.id_doctor
  );

  useEffect(() => {
    if (
      !cargando &&
      usuario?.id &&
      usuario?.rol === "usuario" &&
      !formData.id_usuario
    ) {
      setFormData((prev) => ({
        ...prev,
        id_usuario: usuario.id,
      }));
    }
  }, [usuario?.id, usuario?.rol, cargando, formData.id_usuario]);

  const [terminoBusquedaUsuarios, setTerminoBusquedaUsuarios] = useState("");
  const usuariosFiltrados = useMemo(() => {
    const term = terminoBusquedaUsuarios.trim().toLowerCase();
    if (!term) return usuarios || [];
    return (usuarios || []).filter((u) => {
      const nombre = (u.nombre || "").toLowerCase();
      const doc = (u.numerodocumento?.toString() || "").toLowerCase();
      const correo = (u.correo || "").toLowerCase();
      const rol = (u.rol || "").toLowerCase();
      return (
        nombre.includes(term) ||
        doc.includes(term) ||
        correo.includes(term) ||
        rol.includes(term)
      );
    });
  }, [usuarios, terminoBusquedaUsuarios]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const {
    ordenes: ordenesElegibles,
    cargando: cargandoOrdenes,
    error: errorOrdenes,
  } = useOrdenesEvaluacionRealizada(formData.id_usuario, token);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id_orden: "",
      fecha: "",
      tipo: "procedimiento",
    }));
    setSlotSeleccionado(null);
  }, [formData.id_usuario]);
  const minTime = useMemo(() => {
    const first = horariosDisponibles[0] || "08:00";
    return combineDateTime(fechaVista, first);
  }, [fechaVista]);
  const maxTime = useMemo(() => {
    const last = horariosDisponibles[horariosDisponibles.length - 1] || "18:00";
    return addMinutes(combineDateTime(fechaVista, last), 30);
  }, [fechaVista]);

  useEffect(() => {
    if (!formData.id_doctor) {
      setEventos([]);
      return;
    }

    if (!citasDoctor || citasDoctor.length === 0) {
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
  }, [citasDoctor, formData.id_doctor]);

  function validarSlot(start) {
    const ahora = new Date();
    const fechaStr = toISODate(start);
    const horaStr = `${String(start.getHours()).padStart(2, "0")}:${String(
      start.getMinutes()
    ).padStart(2, "0")}`;
    if (start < ahora) {
      alerta.alertaLaCitaNoPuedeSerPasada();
      return false;
    }
    if (!horariosDisponibles.includes(horaStr)) {
      alerta.alertaErrorCrearCita("Seleccione una hora válida.");
      return false;
    }
    const ocupado = estaOcupado(horaStr, horariosOcupados, false, {
      fecha: fechaStr,
      tipo: "procedimiento",
    });
    if (ocupado) {
      alerta.alertaErrorCrearCita("Ese horario ya está ocupado.");
      return false;
    }
    return true;
  }

  const dayPropGetter = (date) => {
    if (date.getDay() === 0) {
      return { className: "dia-domingo" };
    }
    return {};
  };

  const slotPropGetter = (date) => {
    if (date.getDay() === 0) {
      return { className: "slot-domingo" };
    }
    return {};
  };

  const onSelectSlot = ({ start }) => {
    if (start.getDay() === 0) {
      alerta.NoAgendarDomingos();
      return;
    }

    if (!formData.id_usuario) {
      alerta.alertaValidacionCampos("Primero seleccione un usuario.");
      return;
    }
    if (!formData.id_orden) {
      alerta.alertaErrorCrearCita(
        "Debe seleccionar una orden con evaluación realizada."
      );
      return;
    }
    const rounded = new Date(start);
    rounded.setMinutes(
      rounded.getMinutes() - (rounded.getMinutes() % 30),
      0,
      0
    );
    if (!validarSlot(rounded)) return;
    const end = addMinutes(rounded, 60);
    setSlotSeleccionado({ start: rounded, end });
    setShowModal(true);
  };

  const onNavigate = (date) => {
    setCurrentDate(date);
    setFechaVista(toISODate(date));
  };
  const onView = (next) => setView(next);

  const guardarCita = async () => {
    if (!slotSeleccionado?.start) {
      await alerta.alertaValidacionCampos("Seleccione doctor y horario.");
      return;
    }
    try {
      setEnviando(true);
      const fechaISO = toISODate(slotSeleccionado.start);
      const hh = String(slotSeleccionado.start.getHours()).padStart(2, "0");
      const mm = String(slotSeleccionado.start.getMinutes()).padStart(2, "0");
      const fechaFormateada = `${fechaISO}T${hh}:${mm}:00`;
      await axios.post(
        `${API_URL}/apicitas/crearcitas`,
        {
          id_usuario: formData.id_usuario,
          id_doctor: formData.id_doctor,
          fecha: fechaFormateada,
          tipo: "procedimiento",
          estado: "pendiente",
          id_orden: formData.id_orden,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await alerta.alertaCitaAgendada();
      setEventos((prev) => [
        ...prev,
        {
          title: "🟥 Ocupado",
          start: slotSeleccionado.start,
          end: slotSeleccionado.end,
          tipo: "ocupado",
          resource: {
            fecha: fechaFormateada,
            tipo: "procedimiento",
            id_doctor: formData.id_doctor,
          },
        },
      ]);
      setShowModal(false);
    } catch (e) {
      console.error("Error al registrar cita:", e);
      const backendMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e.message ||
        "Hubo un error al registrar la cita";
      if (String(backendMsg).toLowerCase().includes("pasada")) {
        await alerta.alertaLaCitaNoPuedeSerPasada();
      } else {
        await alerta.alertaErrorCrearCita(backendMsg);
      }
    } finally {
      setEnviando(false);
    }
  };

  const eventPropGetter = (event) => {
    if (event.tipo === "ocupado") {
      return {
        style: {
          backgroundColor: "rgba(220,53,69,0.25)",
          borderColor: "rgba(220,53,69,0.8)",
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

  if (
    cargando ||
    cargandoDoctores ||
    cargandoHorarios ||
    cargandoUsuarios ||
    cargandoCitasDoctor
  ) {
    return <Cargando texto="Cargando Informacion" />;
  }

  if (!usuario || !usuario.id) {
    return (
      <Cargando texto=" No se pudo cargar la información del usuario. Por favor, inicie sesión nuevamente." />
    );
  }

  return (
    <Container>
      <h1 className="mt-4">Registrar Cita</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {errorDoctores && (
        <div className="alert alert-warning">{errorDoctores}</div>
      )}
      {errorUsuarios && (
        <div className="alert alert-warning">{errorUsuarios}</div>
      )}
      <InformacionUsuario usuario={usuario} />
      <Form onSubmit={(e) => e.preventDefault()}>
        <input type="hidden" name="id_usuario" value={formData.id_usuario} />

        <div className="mb-3">
          <label className="form-label">Seleccione Usuario:</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Buscar por nombre, documento, correo"
            value={terminoBusquedaUsuarios}
            onChange={(e) => setTerminoBusquedaUsuarios(e.target.value)}
            disabled={cargandoUsuarios}
          />
          <select
            name="id_usuario"
            className="form-select"
            value={formData.id_usuario}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un Usuario</option>
            {usuariosFiltrados && usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))
            ) : (
              <option disabled>No hay usuarios disponibles</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Orden (requiere evaluación realizada):
          </label>
          <select
            name="id_orden"
            className="form-select"
            value={formData.id_orden}
            onChange={manejarCambio}
            disabled={!formData.id_usuario || cargandoOrdenes}
            required
          >
            <option value="">
              {!formData.id_usuario
                ? "Primero seleccione un usuario"
                : cargandoOrdenes
                ? "Cargando órdenes..."
                : ordenesElegibles && ordenesElegibles.length > 0
                ? "Seleccione una Orden"
                : "No hay órdenes con evaluación realizada"}
            </option>
            {ordenesElegibles &&
              ordenesElegibles.length > 0 &&
              ordenesElegibles.map((orden) => (
                <option key={orden.id} value={orden.id}>
                  #{orden.id} -{" "}
                  {orden?.procedimientos?.map((p) => p.nombre).join(", ")}
                </option>
              ))}
          </select>
          {errorOrdenes && (
            <div className="text-danger small mt-1">{errorOrdenes}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Doctor:</label>
          <select
            name="id_doctor"
            className="form-select"
            value={formData.id_doctor}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un Doctor</option>
            {doctores && doctores.length > 0 ? (
              doctores.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.nombre}
                </option>
              ))
            ) : (
              <option disabled>No hay doctores disponibles</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo:</label>
          <input className="form-control" value="procedimiento" readOnly />
        </div>

        {formData.id_orden ? (
          <div className="card mb-3">
            <div className="card-body">
              <Calendar
                localizer={localizer}
                events={eventos}
                selectable
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectSlot={onSelectSlot}
                onNavigate={onNavigate}
                onView={onView}
                view={view}
                date={currentDate}
                step={30}
                timeslots={2}
                min={minTime}
                max={maxTime}
                messages={messages}
                formats={calendarFormats}
                eventPropGetter={eventPropGetter}
                dayPropGetter={dayPropGetter}
                slotPropGetter={slotPropGetter}
              />
            </div>
          </div>
        ) : (
          <div className="alert alert-info">
            Seleccione primero una orden válida para mostrar el calendario.
          </div>
        )}
        <div className="d-flex gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Cancelar
          </button>
        </div>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cita (Procedimiento)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            <strong>Usuario:</strong>{" "}
            {usuarios && usuarios.length > 0
              ? usuarios.find(
                  (u) => String(u.id) === String(formData.id_usuario)
                )?.nombre || "Desconocido"
              : "Cargando..."}
          </p>
          <p className="mb-2">
            <strong>Orden:</strong> #{formData.id_orden}
          </p>
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
          <Form.Group className="mb-3">
            <Form.Label>Doctor</Form.Label>
            {formData.id_doctor ? (
              <div className="form-control bg-light">
                {doctores?.find((d) => d.id === parseInt(formData.id_doctor))
                  ?.nombre || "—"}
              </div>
            ) : (
              <Form.Select
                name="id_doctor"
                value={formData.id_doctor}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccione un doctor</option>
                {doctores?.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.nombre}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Control type="text" value="procedimiento" readOnly />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCita} disabled={enviando}>
            {enviando ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />{" "}
                Guardando…
              </>
            ) : (
              "Guardar Cita"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default RegistraCitaAsistente;
