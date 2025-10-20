import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import useConsentimientosPorCita from "../../../hooks/useConsentimientoPorCIta";
import useFirmarConsentimiento from "../../../hooks/useFirmaConsentimiento";
import useDescargarConsentimiento from "../../../hooks/useDescargarConsentimiento";
import { useAuth } from "../../../contexts/AuthenticaContext";
import TokenExpiradoAlerta from "../../../assets/js/MensajeTokenEXpirado";

function ConsentimientoVista({
  cita,
  userRole: userRoleProp,
  forceShow = false,
}) {
  const navigate = useNavigate();
  const { token, userRole } = useAuth();
  const { consentimientos, cargando, error } = useConsentimientosPorCita(
    cita.id,
    token
  );
  const { firmar } = useFirmarConsentimiento(token);
  const { descargar } = useDescargarConsentimiento(token);

  const [show, setShow] = useState(forceShow);
  const [aceptado, setAceptado] = useState(false);
  const [justFirmado, setJustFirmado] = useState(false);

  useEffect(() => {
    if (forceShow) setShow(true);
  }, [forceShow]);

  if (cargando) return <p>Cargando consentimiento...</p>;
  if (error)
    return <p className="text-danger">Error al cargar consentimiento.</p>;

  const yaFirmado = consentimientos.length > 0 || justFirmado;
  const consentimiento = consentimientos[0] || null;
  const normalizedRole = (userRoleProp || userRole || "")
    .toString()
    .toLowerCase();

  if (normalizedRole === "usuario" || normalizedRole === "paciente") {
    if (yaFirmado) {
      return (
        <p className="text-success">
          ✅ Consentimiento firmado el{" "}
          {new Date(consentimiento?.fecha_firma || Date.now()).toLocaleString()}
        </p>
      );
    }

    const texto = `
CONSENTIMIENTO INFORMADO PARA PROCEDIMIENTO ESTÉTICO
Paciente: ${cita.usuario?.nombre || "—"}
Documento: ${cita.usuario?.tipodocumento || ""} ${
      cita.usuario?.numerodocumento || ""
    }
Doctor: ${cita.doctor?.nombre || "—"}
Fecha de la cita: ${
      cita.fecha ? new Date(cita.fecha).toLocaleDateString() : "—"
    }

Declaro que he leído y acepto el procedimiento estético según lo descrito por la clínica. 
He sido informado(a) de riesgos, beneficios y alternativas, y mis dudas han sido resueltas.
    `;

    return (
      <Modal
        show={show}
        onHide={() => {
          if (forceShow) {
            navigate("/miscitas");
          } else {
            setShow(false);
          }
        }}
        backdrop={forceShow ? "static" : true}
        keyboard={!forceShow}
        size="lg"
        centered
      >
        <Modal.Header closeButton={!forceShow}>
          <Modal.Title>Consentimiento Informado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{texto}</pre>
          <a
            href="https://docs.google.com/document/d/1qEhOlb_WRyiKnnHQsEDmlJXsaSBw52BLbSHbYE8uO54/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-link"
          >
            📄 Ver documento
          </a>

          <Form.Check
            className="mt-3"
            type="checkbox"
            id="acepta-consent"
            label="He leído y acepto los términos del consentimiento informado."
            checked={aceptado}
            onChange={(e) => setAceptado(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              if (forceShow) {
                navigate("/miscitas"); // 👈 redirige si no quiere firmar
              } else {
                setShow(false);
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            disabled={!aceptado}
            onClick={async () => {
              try {
                await firmar(cita.id, texto);
                setJustFirmado(true);
                setShow(false);
              } catch (e) {
                const status = e?.response?.status;
                if (status === 401) {
                  await TokenExpiradoAlerta(navigate);
                } else {
                  alert(
                    e?.response?.data?.mensaje ||
                      e?.response?.data?.error ||
                      e.message ||
                      "Error al firmar consentimiento"
                  );
                }
              }
            }}
          >
            Firmar y aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Doctor
  if (normalizedRole === "doctor") {
    if (yaFirmado) {
      return (
        <div>
          <p className="text-info">
            El paciente firmó el consentimiento el{" "}
            {new Date(consentimiento.fecha_firma).toLocaleString()}.
          </p>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => descargar(consentimiento.id)}
          >
            Descargar PDF
          </button>
        </div>
      );
    }
    return (
      <p className="text-danger">
        ❌ El paciente aún no ha firmado el consentimiento.
      </p>
    );
  }

  return null;
}

export default ConsentimientoVista;
