import axios from "axios";
import Swal from "sweetalert2";
import { useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function useEliminarUsuarios(onSuccess) {
  const eliminarUsuario = useCallback(
    async (id) => {
      try {
        const confirm = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#d33",
          cancelButtonColor: "#6c757d",
        });
        const token = localStorage.getItem("token");

        if (!confirm.isConfirmed) return;

        await axios.delete(
          `${API_URL}/apiusuarios/eliminarusuarios/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await Swal.fire({
          title: "Eliminada",
          text: "EL usuario ha sido eliminado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        if (onSuccess) onSuccess(id);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario.",
          icon: "error",
        });
      }
    },
    [onSuccess]
  );

  return eliminarUsuario;
}
export default useEliminarUsuarios;
