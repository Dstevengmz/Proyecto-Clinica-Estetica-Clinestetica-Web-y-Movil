import Swal from "sweetalert2";

const TokenExpiradoAlerta = async (navigate) => {
  return Swal.fire({
    icon: "warning",
    title: "Sesión expirada",
    text: "Tu sesión ha caducado. Por favor, inicia sesión de nuevo.",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "Entendido",
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/iniciarsesion", { replace: true });
    }
  });
};

export default TokenExpiradoAlerta;
