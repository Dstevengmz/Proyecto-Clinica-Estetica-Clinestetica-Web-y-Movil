import Swal from "sweetalert2";

const manejarCerrarSesion = (navigate, logout, location) => {
  Swal.fire({
    title: "¿Estás seguro de cerrar sesión?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, cerrar sesión",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Sesión cerrada correctamente",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Llamar al logout del contexto
        logout();
        // Determinar destino
        const x = location.pathname;
        const destino = x.includes('/dashboard') ? '/iniciarsesion' : '/inicio'
        navigate(destino);
      });
    }
  });
};

export default manejarCerrarSesion;
