import React, { useState } from "react";
import CardOficial from "./ComponenteOficialLimpio";
import {
  Calendar,
  XCircle,
  Clock,
  CheckCircle,
  ClipboardCheck,
} from "lucide-react";
import useCitasDoctor from "../../../hooks/useDashboardFiltroDoctor";

function DashboardDoctorPage({ doctorId }) {
  const [filtro, setFiltro] = useState("dia");
  const { totales, loading } = useCitasDoctor(doctorId, filtro);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [displayTotales, setDisplayTotales] = useState(null);

  React.useEffect(() => {
    if (!loading) setHasLoadedOnce(true);
  }, [loading]);

  React.useEffect(() => {
    if (!loading && totales) {
      setDisplayTotales(totales);
    }
  }, [loading, totales]);

  if (!hasLoadedOnce && loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: 240 }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
  <div className="container pt-2 pb-4">
  <div className="row align-items-center justify-content-between mb-2 gy-1">
        <div className="col">
          <h1 className="h3 fw-bold mb-1 text-dark">Visualización de Citas</h1>
        </div>

        <div className="col-auto">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small me-1">Periodo:</span>
            <div className="btn-group" role="group" aria-label="Filtro por periodo">
              <button
                type="button"
                className={`btn btn-outline-success ${filtro === 'dia' ? 'active' : ''}`}
                onClick={() => setFiltro('dia')}
              >
                Hoy
              </button>
              <button
                type="button"
                className={`btn btn-outline-success ${filtro === 'semana' ? 'active' : ''}`}
                onClick={() => setFiltro('semana')}
              >
                Semana
              </button>
              <button
                type="button"
                className={`btn btn-outline-success ${filtro === 'mes' ? 'active' : ''}`}
                onClick={() => setFiltro('mes')}
              >
                Mes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="position-relative">
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-50" style={{ zIndex: 2 }}>
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        <div className="row row-cols-1 row-cols-sm-2 g-3 g-md-4" style={{ position: 'relative', zIndex: 1 }}>
        <div className="col">
          <CardOficial
            title="Total de Citas"
            total={displayTotales?.total ?? 0}
            icon={Calendar}
            color="green"
          />
        </div>
        <div className="col">
          <CardOficial
            title="Citas Canceladas"
            total={displayTotales?.canceladas ?? 0}
            icon={XCircle}
            color="red"
          />
        </div>
        <div className="col">
          <CardOficial
            title="Pendientes"
            total={displayTotales?.pendientes ?? 0}
            icon={Clock}
            color="yellow"
          />
        </div>
        <div className="col">
          <CardOficial
            title="Canceladas en Periodo"
            total={displayTotales?.canceladasPeriodo ?? 0}
            icon={XCircle}
            color="orange"
          />
        </div>
        <div className="col">
          <CardOficial
            title="Realizadas (Evaluación)"
            total={displayTotales?.realizadasEvaluacion ?? 0}
            icon={CheckCircle}
            color="green"
          />
        </div>
        <div className="col">
          <CardOficial
            title="Realizadas (Procedimiento)"
            total={displayTotales?.realizadasProcedimiento ?? 0}
            icon={ClipboardCheck}
            color="blue"
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardDoctorPage;