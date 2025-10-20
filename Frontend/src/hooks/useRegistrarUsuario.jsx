import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function useRegistrarUsuario() {
  const [phone, setPhone] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipodocumento, setTipodocumento] = useState("");
  const [numerodocumento, setNumerodocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [rol, setRol] = useState("usuario");
  const [genero, setGenero] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState([]);

  const navigate = useNavigate();

  const validarFormulario = () => {
    const erroresValidacion = [];

    // Validación del nombre
    if (!nombre.trim()) erroresValidacion.push("El nombre es obligatorio");
    else {
      if (nombre.trim().length < 5)
        erroresValidacion.push("El nombre debe tener al menos 5 caracteres");
      if (/\d/.test(nombre))
        erroresValidacion.push("El nombre no debe contener números");
    }
    // Validación del tipo de documento
    if (!tipodocumento)
      erroresValidacion.push("Debe seleccionar un tipo de documento");
    // Validación del número de documento
    if (!numerodocumento.trim())
      erroresValidacion.push("El número de documento es obligatorio");
    else if (numerodocumento.trim().length < 7)
      erroresValidacion.push(
        "El número de documento debe tener al menos 7 caracteres"
      );
    else if (numerodocumento.trim().length > 10)
      erroresValidacion.push(
        "El número de documento no puede tener más de 10 caracteres"
      );
    // Validación del correo
    if (!correo.trim())
      erroresValidacion.push("El correo electrónico es obligatorio");
    else if (!/\S+@\S+\.\S+/.test(correo))
      erroresValidacion.push("El correo electrónico no es válido");
    // Validación de la contraseña
    if (!contrasena.trim())
      erroresValidacion.push("La contraseña es obligatoria");
    else if (contrasena.length < 6)
      erroresValidacion.push("La contraseña debe tener al menos 6 caracteres");
    // Validación de confirmación de contraseña
    if (contrasena !== confirmar)
      erroresValidacion.push("Las contraseñas no coinciden");
    // Validación del rol
    if (!rol) erroresValidacion.push("Debe seleccionar un rol");
    // Validación del teléfono
    if (!phone.trim())
      erroresValidacion.push("El número de teléfono es obligatorio");
    else if (!/^\+?[0-9\s]+$/.test(phone))
      erroresValidacion.push("El número de teléfono no es válido");
    // Validación del género
    if (!genero) erroresValidacion.push("Debe seleccionar un género");
    // Validación de términos y condiciones
    if (!terminos)
      erroresValidacion.push("Debe aceptar los términos y condiciones");
    return erroresValidacion;
  };

  const mostrarErrores = (erroresLista) => {
    setErrores(erroresLista);
    Swal.fire({
      icon: "error",
      title: "Errores en el formulario",
      html: `<ul style="text-align: left;">${erroresLista
        .map((error) => `<li>${error}</li>`)
        .join("")}</ul>`,
      confirmButtonText: "Entendido",
    });
  };

  const registrarUsuario = async (e, options = {}) => {
    if (e) e.preventDefault();
    const {
      redirectTo = "/iniciarsesion",
      successTitle = "Registro exitoso",
      successText = "Tu cuenta ha sido creada correctamente",
      successConfirmText = "Iniciar sesión",
      onSuccess,
    } = options;

    const erroresValidacion = validarFormulario();
    if (erroresValidacion.length > 0) {
      mostrarErrores(erroresValidacion);
      return;
    }

    setCargando(true);
    setErrores([]);

    try {
      const respuesta = await axios.post(`${API_URL}/apiusuarios/crearusuarios`, {
        nombre,
        tipodocumento,
        numerodocumento,
        correo,
        contrasena,
        rol,
        telefono: phone,
        genero,
        terminos_condiciones: terminos,
      });
      Swal.fire({
        icon: "success",
        title: successTitle,
        text: successText,
        confirmButtonText: successConfirmText,
      }).then(() => {
        limpiarFormulario();
        if (typeof onSuccess === "function") {
          onSuccess(respuesta);
        } else {
          navigate(redirectTo);
        }
      });
    } catch (err) {
      console.error("Error al registrar usuario:", err);

      let mensajeError = "No se pudo registrar el usuario. Intenta más tarde.";

      if (err.response?.data?.message) {
        mensajeError = err.response.data.message;
      } else if (err.response?.status === 400) {
        mensajeError = "Datos inválidos. Verifica la información ingresada.";
      } else if (err.response?.status === 409) {
        mensajeError = "El correo o número de documento ya están registrados.";
      }

      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: mensajeError,
        confirmButtonText: "Entendido",
      });
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setPhone("");
    setNombre("");
    setTipodocumento("");
    setNumerodocumento("");
    setCorreo("");
    setContrasena("");
    setConfirmar("");
  setRol("usuario");
    setGenero("");
    setTerminos(false);
    setErrores([]);
  };
  return {
    phone,
    nombre,
    tipodocumento,
    numerodocumento,
    correo,
    contrasena,
    confirmar,
    rol,
    genero,
    terminos,
    cargando,
    errores,
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
    limpiarFormulario,
    validarFormulario,
  };
}

export default useRegistrarUsuario;
