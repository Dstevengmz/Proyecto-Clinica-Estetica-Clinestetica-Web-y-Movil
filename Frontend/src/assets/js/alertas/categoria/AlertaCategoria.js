import Swal from "sweetalert2";

class AlertasCategoria {
  async confirmarGuardarCategoria() {
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

  async alertaCategoriaCreadaExito() {
    return Swal.fire({
      icon: "success",
      title: "Creada",
      text: "La categoría se creó exitosamente.",
      confirmButtonText: "Entendido",
    });
  }

  async alertaCategoriaCreada() {
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
        text: "La categoría se creó exitosamente.",
      });
    }

    return {
      isConfirmed: !!result.isConfirmed,
      isCancelled: result.dismiss === Swal.DismissReason.cancel,
    };
  }

  async alertaNoSePudoCrearCategoria() {
    return Swal.fire({
      icon: "error",
      title: "No se pudo crear",
      text: "Inténtalo de nuevo en unos segundos.",
      confirmButtonText: "Entendido",
    });
  }

  async alertaErrorCrearCategoria() {
    return Swal.fire({
      icon: "error",
      title: "Error al crear",
      text: "Ocurrió un problema creando la categoría.",
      confirmButtonText: "Entendido",
    });
  }

  async alertaNombreDuplicado() {
    return Swal.fire({
      icon: "warning",
      title: "Nombre duplicado",
      text: "Ya existe una categoría con ese nombre.",
      confirmButtonText: "Cambiar nombre",
    });
  }

  async alertaCamposRequerido() {
    return Swal.fire({
      icon: "info",
      title: "Hay campos vacíos",
      text: "Los campos marcados con * son obligatorios.",
      confirmButtonText: "Entendido",
    });
  }

  async EditarCategoriaExito() {
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
  async alertaEditarCategoriaCreadaExito() {
    return Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Editada con éxito",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  async alertaNoSePudoEditarCrearCategoria() {
    return Swal.fire({
      icon: "error",
      title: "No se pudo editar",
      text: "Inténtalo de nuevo en unos segundos.",
      confirmButtonText: "Entendido",
    });
  }
}

export default AlertasCategoria;
