import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CButton, CCard, CCardBody, CCol, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CFormSelect } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser, cilBook, cilClipboard } from "@coreui/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import useCrearUsuarioAdmin from "../../../hooks/useCrearUsuarioAdmin";
import { useAuth } from "../../../contexts/AuthenticaContext";
import Swal from "sweetalert2";

const CrearUsuario = () => {
  const { userRole, isAuthenticated } = useAuth();
  const isDoctor = userRole === "doctor";

  useEffect(() => {
    if (isAuthenticated && !isDoctor) {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "No puedes ver esta interfaz. Solo los doctores tienen acceso.",
        confirmButtonText: "Entendido",
      });
    }
  }, [isAuthenticated, isDoctor]);

  const {
    phone, nombre, tipodocumento, numerodocumento, correo, contrasena, confirmar, rol, genero, terminos,
    setPhone,
    setNombre,
    setTipodocumento,
    setNumerodocumento,
    setCorreo,
    setContrasena,
    setConfirmar,
    setRol,
    setGenero,
    setTerminos,
    registrarUsuario,
  } = useCrearUsuarioAdmin();

  if (isAuthenticated && !isDoctor) {
    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="mb-0">Crear usuario</h1>
          <Link to="/listarusuarios">
            <CButton color="secondary" variant="outline">
              Volver a la lista
            </CButton>
          </Link>
        </div>

        <CCard>
          <CCardBody>
            <div className="alert alert-warning mb-0">
              No puedes ver esta interfaz. Solo los doctores tienen acceso.
            </div>
          </CCardBody>
        </CCard>
      </div>
    );
  }

  const registrarUsuarioAdmin = async (e) => {
    await registrarUsuario(e, {
      redirectTo: "/listarusuarios",
      successTitle: "Usuario creado",
      successText: "El usuario ha sido creado correctamente",
      successConfirmText: "Ir a la lista",
    });
  };

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Crear usuario</h1>
        <Link to="/listarusuarios">
          <CButton color="secondary" variant="outline">
            Volver a la lista
          </CButton>
        </Link>
      </div>

      <CCard>
        <CCardBody>
          <CForm onSubmit={registrarUsuarioAdmin}>
            <CRow className="g-3">
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Nombre"
                    autoComplete="Nombre completo"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilBook} />
                  </CInputGroupText>
                  <CFormSelect
                    value={tipodocumento}
                    required
                    aria-label="Seleccione su documento"
                    onChange={(e) => setTipodocumento(e.target.value)}
                    options={[
                      { label: "Seleccione su documento", value: "", disabled: true },
                      { label: "Cédula de Ciudadanía", value: "Cédula de Ciudadanía" },
                      { label: "Pasaporte", value: "Pasaporte" },
                      { label: "Documento de Identificación Extranjero", value: "Documento de Identificación Extranjero " },
                      { label: "Permiso Especial de Permanencia", value: "Permiso Especial de Permanencia" },
                    ]}
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilClipboard} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Numero de documento"
                    autoComplete="Numero de documento"
                    maxLength={10}
                    pattern="[0-9]*"
                    required
                    value={numerodocumento}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setNumerodocumento(value);
                      }
                    }}
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    type="email"
                    required
                    value={correo}
                    placeholder="Correo Electrónico"
                    autoComplete="email"
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect
                    value={rol}
                    required
                    aria-label="Seleccione el rol"
                    onChange={(e) => setRol(e.target.value)}
                    options={[
                      { label: "Seleccione el rol", value: "", disabled: true },
                      { label: "Usuario", value: "usuario" },
                      { label: "Asistente", value: "asistente" },
                      { label: "Doctor", value: "doctor" },
                    ]}
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <div style={{ flex: 1 }}>
                    <PhoneInput
                      required
                      country={"co"}
                      value={phone}
                      onChange={setPhone}
                      inputProps={{ name: "phone", required: true }}
                      inputStyle={{
                        width: "100%",
                        height: "38px",
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: "0",
                        backgroundColor: "#212631",
                        color: "white",
                      }}
                    />
                  </div>
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect
                    value={genero}
                    required
                    aria-label="Seleccione su género"
                    onChange={(e) => setGenero(e.target.value)}
                    options={[
                      { label: "Seleccione su género", value: "", disabled: true },
                      { label: "Masculino", value: "Masculino" },
                      { label: "Femenino", value: "Femenino" },
                      { label: "Otro", value: "Otro" },
                    ]}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Contraseña"
                    autoComplete="Contraseña"
                    required
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Confirmar Contraseña"
                    autoComplete="Confirmar Contraseña"
                    required
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                  />
                </CInputGroup>
              </CCol>

              <CCol xs={12}>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terminos"
                    checked={terminos}
                    onChange={(e) => setTerminos(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="terminos">
                    Acepto los <Link to="/terminoscondiciones" target="_blank">términos y condiciones</Link>
                  </label>
                </div>
              </CCol>

              <CCol xs={12}>
                <div className="d-flex gap-2">
                  <CButton type="submit" color="primary">Crear usuario</CButton>
                  <Link to="/listarusuarios">
                    <CButton color="secondary" variant="outline">Cancelar</CButton>
                  </Link>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CrearUsuario;
