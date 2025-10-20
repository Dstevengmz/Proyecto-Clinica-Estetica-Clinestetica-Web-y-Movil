import React from "react";
import "../../../assets/css/valoresclinicos.css";

function ValoresClinica() {
  return (
    <div className="container-fluid px-5 my-5">
      <h2 className="text-center mb-5">Misión, Visión y Valores</h2>
      {/* Misión */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow p-4">
            <h4 className="mb-3 text-dark text-center">Misión</h4>
            <p>
              Brindar atención médica y estética de alta calidad, centrada en el
              bienestar integral de nuestros pacientes, utilizando tecnología de
              vanguardia y un equipo humano altamente calificado.
            </p>
          </div>
        </div>
      </div>
      {/* Visión */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow p-4">
            <h4 className="mb-3 text-dark text-center">Visión</h4>
            <p>
              Ser una clínica referente en salud y estética a nivel regional,
              reconocida por su excelencia, innovación y compromiso humano.
            </p>
          </div>
        </div>
      </div>
      {/* Valores */}
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow p-4">
            <h4 className="mb-4 text-dark text-center">Nuestros Valores</h4>
            <div className="row text-center">
              <div className="col-md-4 mb-3">
                <h5 className="text-uppercase fw-bold">Empatía</h5>
                <p>Escuchamos y entendemos a nuestros pacientes con respeto y humanidad.</p>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="text-uppercase fw-bold">Calidad</h5>
                <p>Nos esforzamos por brindar servicios seguros y eficaces con altos estándares.</p>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="text-uppercase fw-bold">Ética</h5>
                <p>Actuamos con responsabilidad, integridad y transparencia en todo momento.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValoresClinica;