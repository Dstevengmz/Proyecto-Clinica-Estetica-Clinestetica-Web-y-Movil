import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../assets/css/driverTheme.css"; 

const useTourPorRol = (rol) => {
  useEffect(() => {
    const normalizedRol = (rol || "").toString().trim().toLowerCase();
    const tourKey = `tour_visto_${normalizedRol}`;
    if (!normalizedRol || localStorage.getItem(tourKey)) return;

    let steps = [];
    switch (normalizedRol) {
      case "asistente":
        steps = [
          {
            element: "#dashboard-asistente",
            popover: {
              title: "Panel del Asistente",
              description: "Este es tu panel principal donde gestionas todo.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#card-citas",
            popover: {
              title: "Citas",
              description:
                "Aquí puedes ver, filtrar y gestionar todas las citas de los pacientes.",
              side: "top",
              align: "center",
            },
          },
          {
            element: "#card-agendar",
            popover: {
              title: "Agendar Cita",
              description:
                "Desde aquí puedes crear una nueva cita para cualquier usuario.",
              side: "top",
              align: "center",
            },
          },
          {
            element: "#card-procedimientos",
            popover: {
              title: "Procedimientos",
              description:
                "Aquí puedes revisar los procedimientos y servicios disponibles.",
              side: "top",
              align: "center",
            },
          },
          {
            popover: {
              title: "¡Listo!",
              description:
                "Ya conoces el panel del asistente. Puedes volver a ver este recorrido cuando quieras.",
            },
          },
        ];
        break;

      default:
        return;
    }

    // Verificar que al menos uno de los elementos objetivo existe en el DOM
    const hasAnyTarget = steps.some((s) => s.element && document.querySelector(s.element));
    if (!hasAnyTarget) return; // No iniciar ni marcar como visto si no hay elementos aún

    const driverObj = driver({
      animate: true,
      showProgress: true,
      allowClose: true,
      popoverClass: "driverjs-theme", // ✅ Tema CSS personalizado
      steps,
    });

    // Esperar al próximo tick para asegurar que el DOM esté pintado
    const tid = setTimeout(() => {
      try {
        driverObj.drive(); // ✅ Inicia el tour
        localStorage.setItem(tourKey, "true");
      } catch (e) {
        // Si hubiera un error no bloquear futuros intentos
        console.error("Error iniciando el tour:", e);
      }
    }, 0);

    return () => clearTimeout(tid);
  }, [rol]);
};

export default useTourPorRol;
