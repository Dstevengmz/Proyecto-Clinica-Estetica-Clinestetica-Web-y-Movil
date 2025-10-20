import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import CIcon from "@coreui/icons-react";
import Swal from "sweetalert2";
import axios from "axios";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { useAuth } from "../../../contexts/AuthenticaContext";
import useRecuperarContrasena from "../../../hooks/useRecuperarContrasena";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { solicitarReset } = useRecuperarContrasena();

  const rawFromState = location.state?.from;
  const savedReturnTo = sessionStorage.getItem("returnTo");
  const sanitized = (v) => (typeof v === "string" && v.startsWith("/") ? v : null);
  const from = sanitized(savedReturnTo) || sanitized(rawFromState) || "/dashboard";

  const [formulario, setFormulario] = useState({ correo: "", contrasena: "" });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!formulario.correo || !formulario.contrasena) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Completa todos los campos para continuar",
      });
      return;
    }

    try {
      setLoading(true);
      const respuesta = await axios.post(`${API_URL}/apiusuarios/iniciarsesion`, formulario);
      const { token } = respuesta.data;

      if (token) {
        login(token);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Inicio de sesión exitoso",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          if (savedReturnTo) sessionStorage.removeItem("returnTo");
          navigate(from, { replace: true });
        }, 1600);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Token no recibido",
        });
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        Swal.fire({
          icon: "warning",
          title: "Demasiados intentos",
          text: error.response.data.mensaje || "Intenta más tarde",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: "Correo o contraseña incorrectos",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const manejarRecuperar = async () => {
    Swal.fire({
      title: "Recuperar contraseña",
      input: "email",
      inputPlaceholder: "Ingresa tu correo registrado",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      showLoaderOnConfirm: true,
      preConfirm: async (correo) => {
        if (!correo) {
          return Swal.showValidationMessage("Debes ingresar un correo válido");
        }
        try {
          await solicitarReset(correo);
          return correo;
        } catch (err) {
          return Swal.showValidationMessage(err.userMessage || "No se pudo enviar el correo");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Correo enviado",
          text: `Se enviaron instrucciones a: ${result.value}`,
        });
      }
    });
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={manejarEnvio}>
                    <h1>Inicio de Sesión</h1>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="correo"
                        type="email"
                        placeholder="Correo Electrónico"
                        autoComplete="username"
                        value={formulario.correo}
                        onChange={manejarCambio}
                        required
                        autoFocus
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name="contrasena"
                        type={mostrarContrasena ? "text" : "password"}
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={formulario.contrasena}
                        onChange={manejarCambio}
                        required
                      />
                      <CButton
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={() => setMostrarContrasena((prev) => !prev)}
                      >
                        {mostrarContrasena ? <EyeSlashFill /> : <EyeFill />}
                      </CButton>
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={loading}>
                          {loading ? "Cargando..." : "Login"}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right d-flex flex-column align-items-end">
                        <Link to="/registrar" state={{ from }}>
                          <CButton color="link" className="px-0">
                            ¿Crear una cuenta?
                          </CButton>
                        </Link>
                        <CButton color="link" className="px-0" onClick={manejarRecuperar}>
                          ¿Olvidaste tu contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
