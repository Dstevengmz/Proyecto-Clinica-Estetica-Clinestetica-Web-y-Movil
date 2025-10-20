import useListaProcedimientos from "../../../hooks/useProcedimientoCategoria";
import Cargando from "../../../components/Cargando";
import ErrorCargando from "../../../components/ErrorCargar";

function ServicioInicio() {
  const { procedimientos, loading, error } = useListaProcedimientos("");

  if (loading) return <Cargando texto="Cargando servicios..." />;
  if (error) return <ErrorCargando texto="Error al cargar los servicios." />;

  return (
    <div className="container-fluid px-5 my-5">
      <h2 className="text-center mb-4">Nuestros Servicios</h2>
      <p className="text-center mb-5">
        Conoce los procedimientos y tratamientos que ofrecemos para tu bienestar.
      </p>

      <div className="row text-center flex-nowrap overflow-auto" style={{ gap: "1rem" }}>
        {procedimientos.map((proc) => (
          <div key={proc.id} className="col-md-4 mb-4" style={{ minWidth: "280px" }}>
            <div className="card h-100 shadow-sm">
              <img
                src={proc.imagen}
                className="card-img-top"
                alt={proc.nombre}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">{proc.nombre}</h5>
                <p className="text-muted mb-2">
                  💲{" "}
                  {Number(proc.precio).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicioInicio;
