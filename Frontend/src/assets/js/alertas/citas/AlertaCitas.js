
import Swal from 'sweetalert2';

class AlertaCitas {

    async NoAgendarDomingos() {
         return Swal.fire({
      icon: "warning",
      title: "Fecha no permitida",
      text: "No se pueden agendar citas los domingos.",
      confirmButtonColor: "#3085d6",
    });
    }

    async alertaCitaAgendada() {
        return await Swal.fire({
            icon: 'success',
            title: 'Cita agendada',
            text: 'Tu cita ha sido agendada exitosamente.',
            confirmButtonText: 'Aceptar'
        });
    }

     async confirmarCancelarCita() {
    return Swal.fire({
      title: "¿Cancelar cita?",
      text: "Esta acción liberará el espacio y no podrás revertirla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#1e5f88ff",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });
  }

  async alertaCitaCancelada() {
    return Swal.fire(
      "Cancelada",
      "La cita fue cancelada correctamente.",
      "success"
    );
  }

  async alertaErrorCancelarCita(msg) {
    return Swal.fire("Error", msg, "error");
  }



    async alertaCarritoVacioIrServicios() {
        return await Swal.fire({
            title: 'No es posible registrar la cita',
            text: 'No tienes un servicio seleccionado en tu carrito. Agrega un procedimiento antes de continuar.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ir a servicios',
            cancelButtonText: 'Ok'
        });
    }

    async alertaValidacionCampos(mensaje = 'Debe seleccionar la fecha, hora y tipo de cita.') {
        return await Swal.fire({
            icon: 'info',
            title: 'Falta información',
            text: mensaje,
            confirmButtonText: 'Entendido'
        });
    }

    async alertaErrorCrearCita(mensaje = 'Hubo un error al registrar la orden o la cita') {
        return await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonText: 'Aceptar'
        });
    }
    async alertaLaCitaNoPuedeSerPasada() {
        return await Swal.fire({
            icon: 'warning',
            title: 'La cita no puede ser en una fecha pasada',
            text: 'Por favor, selecciona una fecha válida.',
            confirmButtonText: 'Aceptar'
        });
    }

    async alertaValidacionDoctor() {
        return await Swal.fire({
            icon: 'info',
            title: 'Falta el doctor',
            text: 'Por favor seleccione un doctor.',
            confirmButtonText: 'Entendido'
        });
    }

    async alertaValidacionTipo() {
        return await Swal.fire({
            icon: 'info',
            title: 'Falta el tipo',
            text: 'Seleccione el tipo de la cita.',
            confirmButtonText: 'Entendido'
        });
    }

    async alertaValidacionFecha() {
        return await Swal.fire({
            icon: 'info',
            title: 'Falta la fecha',
            text: 'Seleccione una fecha válida.',
            confirmButtonText: 'Entendido'
        });
    }

    async alertaValidacionHora() {
        return await Swal.fire({
            icon: 'info',
            title: 'Falta la hora',
            text: 'Seleccione una hora disponible.',
            confirmButtonText: 'Entendido'
        });
    }

    async alertaCitaActualizada() {
        return await Swal.fire({
            icon: 'success',
            title: 'Cita actualizada',
            text: 'La cita se actualizó correctamente.',
            confirmButtonText: 'Aceptar'
        });
    }

    async alertaErrorActualizarCita(mensaje = 'No se pudo actualizar la cita') {
        return await Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: mensaje,
            confirmButtonText: 'Aceptar'
        });
    }

    async confirmarMarcarRealizada() {
        return await Swal.fire({
            icon: 'question',
            title: 'Marcar como realizada',
            text: '¿Confirmas que la cita fue realizada?',
            showCancelButton: true,
            confirmButtonText: 'Sí, marcar',
            cancelButtonText: 'Cancelar'
        });
    }

    async alertaEstadoActualizado() {
        return await Swal.fire({
            icon: 'success',
            title: 'Estado actualizado',
            text: 'La cita fue marcada como realizada.',
            confirmButtonText: 'Aceptar'
        });
    }

    async alertaErrorEstado(mensaje = 'No se pudo cambiar el estado') {
        return await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonText: 'Aceptar'
        });
    }
}
export default AlertaCitas;