import AlertaUsuario from "./AlertaUsuario";
const alertas = new AlertaUsuario();
class Validaciones {
  async validarFormularioUsuario(formulario) {
    if (!formulario.nombre || formulario.nombre.length < 5) {
      await alertas.noSePudoActualizarUsuario(
        "El nombre debe tener al menos 5 caracteres"
      );
      return false;
    }

    if (!/^\d{7,10}$/.test(formulario.numerodocumento)) {
      await alertas.noSePudoActualizarUsuario(
        "El número de documento debe tener entre 7 y 10 dígitos"
      );
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formulario.correo)) {
      await alertas.noSePudoActualizarUsuario("El correo no es válido");
      return false;
    }

    if (!/^\d{7,12}$/.test(formulario.telefono)) {
      await alertas.noSePudoActualizarUsuario(
        "El teléfono debe tener entre 7 y 12 dígitos"
      );
      return false;
    }

    return true;
  }
}
export default Validaciones;
