import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCarrito } from "../../../contexts/CarritoContext";
import { useProcedimiento } from "../../../hooks/useVistaServicios";
import Cargando from "../../../components/Cargando";
import ErrorCargando from "../../../components/ErrorCargar";
import AlertaCarrito from "../../../assets/js/alertas/carrito/AlertaCarrito";
import { CButton } from "@coreui/react";

function VistaServicios() {
  const alertas = new AlertaCarrito();
  const { id } = useParams();
  const {
    procedimiento,
    imagenActiva,
    setImagenActiva,
    tabActiva,
    setTabActiva,
    error,
  } = useProcedimiento(id);

  const { agregarAlCarrito, carrito, estaEnCarrito } = useCarrito();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const manejoReserva = async () => {
    if (isAdding) return;
    const token = localStorage.getItem("token");
    if (!token) {
      const returnTo = `/reservar/${id}`;
      if (/^\/reservar\/\d+$/.test(returnTo)) {
        sessionStorage.setItem("returnTo", returnTo);
      }
      await alertas.direccionandoALogin();
      navigate("/iniciarsesion", { state: { from: returnTo } });
      return;
    }

    const yaEnCarrito =
      typeof estaEnCarrito === "function"
        ? estaEnCarrito(procedimiento.id)
        : carrito?.some((item) => item?.procedimiento?.id === procedimiento.id);
    if (yaEnCarrito) {
      await alertas.ServicioYaEnCarrito();
      return;
    }
    try {
      const confirm = await alertas.confirmarGuardarCarrito();
      if (!confirm.isConfirmed) return;
      setIsAdding(true);
      const result = await agregarAlCarrito(procedimiento.id);

      if (result?.reason === "already-in-cart") {
        await alertas.ServicioYaEnCarrito();
        return;
      }
      if (result && result.added === false && result.reason === "error") {
        await alertas.alertaErrorGenerico();
        return;
      }
      await alertas.alertaServicioAgregadoExito();
      navigate("/servicios");
    } catch {
      await alertas.alertaErrorGenerico();
    } finally {
      setIsAdding(false);
    }
  };

  if (error) {
    return <ErrorCargando texto="Error cargando el procedimiento." />;
  }

  if (!procedimiento) {
    return <Cargando texto="Cargando procedimiento..." />;
  }
  return (
    <main className="container-fluid mt-2">
      <article className="card shadow-sm">
        <section className="card-body">
          <div className="row">
            <aside className="col-12 col-sm-6 order-2 order-sm-1">
              <figure className="mb-3">
                <img
                  id="procedimiento-imagen-principal"
                  src={imagenActiva}
                  alt={`Imagen del procedimiento: ${procedimiento.nombre}`}
                  className="product-image img-fluid rounded border"
                  loading="lazy"
                  style={{
                    height: "400px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </figure>
              <div
                className="d-flex flex-wrap gap-2"
                role="group"
                aria-label="Miniaturas del procedimiento"
              >
                {(procedimiento.imagenes?.length
                  ? procedimiento.imagenes.map((i) => i.url)
                  : [procedimiento.imagen]
                )
                  .filter(Boolean)
                  .map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      className={`product-image-thumb border rounded p-1 ${
                        imagenActiva === img ? "border-primary" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setImagenActiva(img)}
                      aria-label={`Seleccionar imagen ${
                        idx + 1
                      } del procedimiento`}
                      aria-pressed={imagenActiva === img}
                      aria-controls="procedimiento-imagen-principal"
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${idx + 1} del procedimiento: ${
                          procedimiento.nombre
                        }`}
                        className="img-fluid"
                        style={{
                          height: "60px",
                          width: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        loading="lazy"
                      />
                    </button>
                  ))}
              </div>
            </aside>
            <section className="col-12 col-sm-6 order-1 order-sm-2">
              <h1 className="my-3">{procedimiento.nombre}</h1>
              <h5>Categoría</h5>
              <p>{procedimiento.categoria?.nombre || "Sin categoría"}</p>

              <div className="bg-dark py-3 px-4 mt-4 rounded text-white">
                <h4 className="mb-1 text-success fw-bold">
                  {Number(procedimiento.precio).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </h4>
                <small>Duración: {procedimiento.duracion} minutos</small>
              </div>

              <button
                className="btn btn-primary btn-lg w-100 mt-4 d-inline-flex align-items-center justify-content-center"
                onClick={manejoReserva}
                aria-label={`Reservar cita para ${procedimiento.nombre}`}
                aria-busy={isAdding}
                disabled={isAdding}
              >
                <i className="fas fa-cart-plus me-2" />
                {isAdding ? "Agregando..." : "Reservar Cita"}
              </button>
            </section>
          </div>

          <nav className="mt-4" aria-label="Detalles del procedimiento">
            <div className="nav nav-tabs" role="tablist">
              <button
                className={`nav-link ${
                  tabActiva === "description" ? "active" : ""
                }`}
                id="description-tab"
                type="button"
                role="tab"
                aria-selected={tabActiva === "description"}
                onClick={() => setTabActiva("description")}
              >
                Descripción
              </button>
            </div>
          </nav>

          <section
            className="tab-content p-3 border rounded"
            id="nav-tabContent"
            role="tabpanel"
            aria-labelledby="description-tab"
          >
            {tabActiva === "description" && (
              <article className="tab-pane fade show active">
                <h5>Descripción del Procedimiento</h5>
                <p>{procedimiento.descripcion}</p>
              </article>
            )}
          </section>
        </section>
      </article>
    </main>
  );
}

export default VistaServicios;
