import Swal from "sweetalert2"; 

class Contacto {
  static async mostrarAlertaContacto(titulo, mensaje, tipo) {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: tipo,
      confirmButtonText: "Aceptar",
    });
  }
}

export default Contacto;
