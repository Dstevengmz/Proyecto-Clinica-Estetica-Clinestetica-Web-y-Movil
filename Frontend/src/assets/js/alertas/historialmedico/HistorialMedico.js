import Swal from "sweetalert2";

class AlertaHistorialMedico{

  async confirmarGuardarHistorialMedico() {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Guardar!",
      cancelButtonText: "Cancelar",
    });

    return {
      isConfirmed: !!result.isConfirmed,
      isCancelled: result.dismiss === Swal.DismissReason.cancel,
    };
  }

  async alertaHistorialMedicoCreadoExito() {
    return Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Historial médico creado con éxito",
          showConfirmButton: false,
          timer: 1500,
        });
  }

  async alertaNoSePudoCrearHistorialMedico() {
    return Swal.fire({
      icon: "error",
      title: "No se pudo crear",
      text: "Inténtalo de nuevo en unos segundos.",
      confirmButtonText: "Entendido",
    });
  }

  async alertaErrorCrearHistorialMedico() {
    return Swal.fire({
      icon: "error",
      title: "Error al crear",
      text: "Ocurrió un problema creando el historial médico.",
      confirmButtonText: "Entendido",
    });
  }
  async alertaYaTieneHistorialMedico() {
    return Swal.fire({
      icon: "info",
      title: "Ya tienes un historial médico",
      text: "No puedes crear más de un historial médico.",
      confirmButtonText: "Entendido",
    });
  }
 async alertaActualizadoEditarHistorialMedico(mensaje) {
    return Swal.fire({
      icon: "error",
      title: "No se pudo editar",
      text: mensaje,
      confirmButtonText: "Entendido",
    });
  }


  async alertaNoSePudoEditarHistorialMedico(mensaje) {
    return Swal.fire({
      icon: "error",
      title: "No se pudo editar",
      text: mensaje,
      confirmButtonText: "Entendido",
    });
  }

  async alertaErrorEditarHistorialMedico(mensaje) {
    return Swal.fire({
      icon: "error",
      title: "Error al editar",
      text: mensaje,
      confirmButtonText: "Entendido",
    });
  }
  async alertaMensaje(mensaje) {
    return Swal.fire({
      icon: "info",
      title: "Información",
      text: mensaje,
      confirmButtonText: "Entendido",
    });
  }
}

export default AlertaHistorialMedico;
