import axios from "axios";
import Swal from "sweetalert2";
import { useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function useEliminarProcedimiento(onSuccess) {
  const eliminarProcedimiento = useCallback(
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
          `${API_URL}/apiprocedimientos/eliminarprocedimiento/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await Swal.fire({
          title: "Eliminada",
          text: "EL procedimiento ha sido eliminado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        if (onSuccess) onSuccess(id);
      } catch (error) {
        console.error("Error al eliminar procedimiento:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el procedimiento.",
          icon: "error",
        });
      }
    },
    [onSuccess]
  );

  return eliminarProcedimiento;
}
export default useEliminarProcedimiento;
