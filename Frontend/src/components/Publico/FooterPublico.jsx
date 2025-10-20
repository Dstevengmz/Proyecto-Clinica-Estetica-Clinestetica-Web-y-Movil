import React from "react";
import { CContainer } from "@coreui/react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const FooterPublico = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-light text-dark border-top mt-5">
      <CContainer className="py-5">
        <div className="row gy-4 align-items-start">
          {/* --- SOBRE LA CLÍNICA --- */}
          <div className="col-md-4 text-center text-md-start">
            <h5 className="fw-bold text-uppercase mb-3">Clinestetica</h5>
            <p className="text-muted">
              En <strong>Clinestetica</strong> cuidamos tu bienestar y realzamos tu belleza
              con tecnología de vanguardia y atención personalizada.
            </p>
          </div>

          {/* --- CONTACTO --- */}
          <div className="col-md-4 text-center text-md-start">
            <h6 className="fw-semibold text-uppercase mb-3">Contáctanos</h6>
            <p className="mb-1">
              <FaMapMarkerAlt className="me-2 text-primary" />
              Calle 5 #10-25, Popayán, Cauca – Colombia
            </p>
            <p className="mb-1">
              <FaPhoneAlt className="me-2 text-primary" />
              +57 310 456 7890
            </p>
            <p className="mb-0">
              <FaEnvelope className="me-2 text-primary" />
              contacto@clinestetica.com
            </p>
          </div>

          {/* ---REDES SOCIALES --- */}
          <div className="col-md-4 text-center text-md-start">
            <h6 className="fw-semibold text-uppercase mb-3">Síguenos</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href="https://facebook.com/clinestetica"
                className="text-decoration-none text-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF size={22} />
              </a>
              <a
                href="https://instagram.com/clinestetica"
                className="text-decoration-none text-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://wa.me/573104567890"
                className="text-decoration-none text-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* --- SEPARADOR --- */}
        <hr className="my-4" />

        {/* --- PARTE INFERIOR --- */}
        <div className="text-center small text-muted">
          <p className="mb-1">
            <a href="/terminos" className="text-muted text-decoration-none me-3">
              Términos
            </a>
            <a href="/privacidad" className="text-muted text-decoration-none me-3">
              Privacidad
            </a>
            <a href="/contacto" className="text-muted text-decoration-none">
              Contacto
            </a>
          </p>
          <p className="mb-0">
            © {year} <strong>Clinestetica</strong>. Todos los derechos reservados.
          </p>
        </div>
      </CContainer>
    </footer>
  );
};

export default FooterPublico;
