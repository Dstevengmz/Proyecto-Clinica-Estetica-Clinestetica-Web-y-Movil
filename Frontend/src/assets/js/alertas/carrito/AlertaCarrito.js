import Swal from "sweetalert2";

class AlertaCarrito {
  async confirmarGuardarCarrito() {
    const result = await Swal.fire({
      title: "¿Estás seguro deseas agregar este servicio a tu carrito?",
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
  async ServicioYaEnCarrito() {
    await Swal.fire({
      icon: "error",
      title: "El servicio ya está en tu carrito",
      text: "Puedes revisar tu carrito para proceder con la reserva.",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar",
    });
  }

  async alertaServicioAgregadoExito() {
    await Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Servicio agregado a tu carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  async alertaErrorGenerico(mensaje = "Ocurrió un error. Inténtalo de nuevo.") {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: mensaje,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar",
    });
  }
  async direccionandoALogin() {
    let timerInterval;
    await Swal.fire({
      title: "Direccionándote al inicio de sesión",
      
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("Yo fui cerrado por el temporizador");
      }
    });
  }
}

export default AlertaCarrito;
