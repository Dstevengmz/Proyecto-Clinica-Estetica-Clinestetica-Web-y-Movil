function FormularioRequerimientos({ requerimientos, setRequerimientos }) {
  const manejarCambio = (index, field, value) => {
    const nuevos = [...requerimientos];
    nuevos[index][field] = value;
    setRequerimientos(nuevos);
  };

  const agregarRequerimiento = () => {
    setRequerimientos([
      ...requerimientos,
      { descripcion: "", frecuencia: 1, repeticiones: 1, fecha_inicio: "" },
    ]);
  };

  const eliminarRequerimiento = (index) => {
    const nuevos = [...requerimientos];
    nuevos.splice(index, 1);
    setRequerimientos(nuevos);
  };

  return (
    <div className="p-3 border rounded mt-3">
      <h5>Requerimientos</h5>
      {requerimientos.map((req, index) => (
        <div key={index} className="mb-3 p-2 border rounded bg-light">
          <div className="mb-2">
            <label>Descripción</label>
            <textarea
              className="form-control"
              value={req.descripcion}
              onChange={(e) =>
                manejarCambio(index, "descripcion", e.target.value)
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Frecuencia (en días)</label>
            <input
              type="number"
              className="form-control"
              value={req.frecuencia}
              min="1"
              onChange={(e) =>
                manejarCambio(index, "frecuencia", e.target.value)
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Repeticiones</label>
            <input
              type="number"
              className="form-control"
              value={req.repeticiones}
              min="1"
              onChange={(e) =>
                manejarCambio(index, "repeticiones", e.target.value)
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Fecha de inicio</label>
            <input
              type="date"
              className="form-control"
              value={req.fecha_inicio ? req.fecha_inicio.split(" ")[0] : ""}
              onChange={(e) =>
                manejarCambio(index, "fecha_inicio", e.target.value)
              }
              required
              
            />
          </div>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => eliminarRequerimiento(index)}
            disabled={requerimientos.length === 1}
          >
            Eliminar
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        onClick={agregarRequerimiento}
      >
        + Agregar Requerimiento
      </button>
    </div>
  );
}
export default FormularioRequerimientos;
