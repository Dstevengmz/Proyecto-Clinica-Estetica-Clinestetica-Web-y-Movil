import { jwtDecode } from "jwt-decode";

 function obtenerRolDesdeToken() {
  const token = localStorage.getItem("token");
  let rol = null;
   if (token) {
    try {
      const usuario = jwtDecode(token);
      rol = usuario.rol;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      rol = null;
    }
  }
  return rol;
}
export default obtenerRolDesdeToken;
 