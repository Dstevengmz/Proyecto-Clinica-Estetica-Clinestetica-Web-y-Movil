import { useEffect, useState } from "react";
import socketfrontend from "../assets/js/socket";

const API_URL = import.meta.env.VITE_API_URL;

function construirURL(doctorId, filtro) {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fechaHoy = `${yyyy}-${mm}-${dd}`;

  if (filtro === "dia") {
    return `${API_URL}/apicitas/citas/dia/${doctorId}?fecha=${fechaHoy}`;
  }
  if (filtro === "semana") {
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - hoy.getDay());
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    return `${API_URL}/apicitas/citas/rango/${doctorId}?desde=${
      inicio.toISOString().split("T")[0]
    }&hasta=${fin.toISOString().split("T")[0]}`;
  }
  if (filtro === "mes") {
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    return `${API_URL}/apicitas/citas/rango/${doctorId}?desde=${
      inicio.toISOString().split("T")[0]
    }&hasta=${fin.toISOString().split("T")[0]}`;
  }
}

function useCitasDoctor(doctorId, filtro = "dia") {
  const [totales, setTotales] = useState({
    total: 0,
    canceladas: 0,
    pendientes: 0,
    canceladasPeriodo: 0,
    realizadasEvaluacion: 0,
    realizadasProcedimiento: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) return;

    setLoading(true);
    const url = construirURL(doctorId, filtro);

    fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setTotales({
          total: list.length,
          canceladas: list.filter((c) => c.estado === "cancelada").length,
          pendientes: list.filter((c) => c.estado === "pendiente").length,
          canceladasPeriodo: list.filter((c) => c.estado === "cancelada")
            .length,
          realizadasEvaluacion: list.filter(
            (c) => c.estado === "realizada" && c.tipo === "evaluacion"
          ).length,
          realizadasProcedimiento: list.filter(
            (c) => c.estado === "realizada" && c.tipo === "procedimiento"
          ).length,
        });
      })
      .catch(() => {
        setTotales({
          total: 0,
          canceladas: 0,
          pendientes: 0,
          canceladasPeriodo: 0,
          realizadasEvaluacion: 0,
          realizadasProcedimiento: 0,
        });
      })
      .finally(() => setLoading(false));
  }, [doctorId, filtro]);

  useEffect(() => {
    if (!doctorId) return;

    if (filtro === "dia") {
      socketfrontend.on("totalesDia", setTotales);
    } else if (filtro === "semana") {
      socketfrontend.on("totalesSemana", setTotales);
    } else if (filtro === "mes") {
      socketfrontend.on("totalesMes", setTotales);
    }

    return () => {
      socketfrontend.off("totalesDia");
      socketfrontend.off("totalesSemana");
      socketfrontend.off("totalesMes");
    };
  }, [doctorId, filtro]);

  return { totales, loading };
}

export default useCitasDoctor;
