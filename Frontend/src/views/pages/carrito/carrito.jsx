import { useCarrito } from "../../../contexts/CarritoContext";
import { usePerfilUsuario } from "../../../hooks/usePerfilUsuario";
import  useVerificacionHistorial  from "../../../hooks/useBuscarHistorialClinicaPorUSuario";

function Carrito() {
  const { usuario } = usePerfilUsuario();
  const { carrito, eliminarDelCarrito, limpiarCarrito } = useCarrito();
  const { irACita } = useVerificacionHistorial(usuario);

  const tieneCarrito = carrito.length > 0;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🛒 Mi Carrito</h2>

      {!tieneCarrito ? (
        <p className="text-muted">No tienes procedimientos en tu carrito.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {carrito.map(({ id, procedimiento }) => (
              <li
                key={id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-start gap-3">
                  {procedimiento?.imagen && (
                    <img
                      src={procedimiento.imagen}
                      alt={procedimiento.nombre}
                      className="img-thumbnail"
                      style={{ width: "200px", height: "auto" }}
                    />
                  )}
                  <div>
                    <p className="mb-1">
                      <strong>ID:</strong> {procedimiento?.id}
                    </p>
                    <p className="mb-1">
                      <strong>Nombre:</strong> {procedimiento?.nombre}
                    </p>
                    <p className="mb-1">
                      <strong>Precio:</strong> ${procedimiento?.precio}
                    </p>
                    <small className="text-muted">
                      {procedimiento?.descripcion}
                    </small>
                  </div>
                </div>
                <button
                  onClick={() => eliminarDelCarrito(id)}
                  className="btn btn-sm btn-danger"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-end gap-3">
            <button onClick={limpiarCarrito} className="btn btn-warning">
              Limpiar Carrito
            </button>
            <button onClick={irACita} className="btn btn-primary">
              Realizar Cita
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Carrito;
