import Swal from "sweetalert2";

class AlertaProcedimiento {
  async confirmarGuardarProcedimiento() {
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

  async alertaProcedimientoCreadoExito() {
    return Swal.fire({
      icon: "success",
      title: "Creado",
      text: "El procedimiento se creó exitosamente.",
      confirmButtonText: "Entendido",
    });
  }

  async alertaProcedimientoCreado() {
    const result = await Swal.fire({
      title: "Estas seguro ?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Guardar!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Creada",
        text: "El Procedimiento se creó exitosamente.",
      });
    }

    return {
      isConfirmed: !!result.isConfirmed,
      isCancelled: result.dismiss === Swal.DismissReason.cancel,
    };
  }

  async alertaNoSePudoCrearProcedimiento() {
    return Swal.fire({
      icon: "error",
      title: "No se pudo crear",
      text: "Inténtalo de nuevo en unos segundos.",
      confirmButtonText: "Entendido",
    });
  }

  async alertaErrorCrearProcedimiento() {
    return Swal.fire({
      icon: "error",
      title: "Error al crear",
      text: "Ocurrió un problema creando el procedimiento.",
      confirmButtonText: "Entendido",
    });
  }


    async confirmarGuardarEditarProcedimiento() {
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

  async alertaProcedimientoEditarCreadoExito() {
    return Swal.fire({
      icon: "success",
      title: "Editado",
      text: "El procedimiento se editó exitosamente.",
      confirmButtonText: "Entendido",
    });
  }

  async alertaNoSeCargoInformacionDelProcedimiento() {
    return Swal.fire({
      icon: "error",
      title: "No se cargó la información",
      text: "Inténtalo de nuevo en unos segundos.",
      confirmButtonText: "Entendido",
    });
  }

  async alertaErrorEditarProcedimiento() {
    return Swal.fire({
      icon: "error",
      title: "Error al editar",
      text: "Ocurrió un problema editando el procedimiento.",
      confirmButtonText: "Entendido",
    });
  }
  async alertaImagenesExcedidas() {
    return Swal.fire({
      icon: "error",
      title: "Error al agregar imagenes",
      text: "Solo puedes subir un máximo de 10 imágenes.",
      confirmButtonText: "Entendido",
    });
  }
  async alertaMensajes(mensaje) {
    return Swal.fire({
      icon: "error",
      title: "No autorizado",
      text: mensaje,
      confirmButtonText: "Entendido",
    }); 
  }
}

export default AlertaProcedimiento;
