import { useState } from "react";
import useConsentimientos from "../../../hooks/useConsentimientocita";

function ConsentimientoCita({ citaId, userRole }) {
  const [aceptado, setAceptado] = useState(false);
  const { consentimientos, cargando, firmar, descargarPDF } = useConsentimientos(citaId);

  if (cargando) return <p>Cargando consentimiento...</p>;

  const yaFirmado = consentimientos.length > 0;
  const consentimiento = consentimientos[0] || null;

  // 👤 Paciente
  if (userRole === "usuario") {
    if (yaFirmado) {
      return (
        <div>
          <p className="text-success">
            ✅ Consentimiento firmado el {new Date(consentimiento.fecha_firma).toLocaleString()}  
            desde IP {consentimiento.ip_firma}.
          </p>
          <p className="text-muted small">Ya no puede modificar este consentimiento.</p>
        </div>
      );
    }

    const texto = "Declaro que acepto el procedimiento estético según lo descrito por la clínica.";
    return (
      <div>
        <p>{texto}</p>
        <label>
          <input
            type="checkbox"
            checked={aceptado}
            onChange={(e) => setAceptado(e.target.checked)}
          />{" "}
          Acepto los términos
        </label>
        <br />
        <button
          className="btn btn-success btn-sm mt-2"
          disabled={!aceptado}
          onClick={() => firmar(texto)}
        >
          Firmar y aceptar
        </button>
      </div>
    );
  }

  // 🩺 Doctor
  if (userRole === "doctor") {
    if (yaFirmado) {
      return (
        <div>
          <p className="text-info">
            El paciente firmó el consentimiento el{" "}
            {new Date(consentimiento.fecha_firma).toLocaleString()}.
          </p>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => descargarPDF(consentimiento.id)}
          >
            Descargar PDF
          </button>
        </div>
      );
    }
    return <p className="text-danger">❌ El paciente aún no ha firmado el consentimiento.</p>;
  }

  return null;
}

export default ConsentimientoCita;
