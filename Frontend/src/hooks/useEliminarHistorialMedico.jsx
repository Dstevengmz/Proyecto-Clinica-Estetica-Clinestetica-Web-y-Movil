import axios from "axios";
import Swal from "sweetalert2";
import { useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function useEliminarHistorialMedico(onSuccess) {
  const eliminarHistorialMedico = useCallback(
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
          `${API_URL}/apihistorialmedico/eliminarhistorialclinico/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await Swal.fire({
          title: "Eliminada",
          text: "La historia médica ha sido eliminada correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        if (onSuccess) onSuccess(id);
      } catch (error) {
        console.error("Error al eliminar historia médica:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la historia médica.",
          icon: "error",
        });
      }
    },
    [onSuccess]
  );

  return eliminarHistorialMedico;
}
export default useEliminarHistorialMedico;
