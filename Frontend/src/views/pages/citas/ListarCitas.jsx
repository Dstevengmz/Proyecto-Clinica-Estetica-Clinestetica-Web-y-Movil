
import React from 'react';

const CitasList = ({ citas, loading, error }) => {
  if (loading) return <div>Cargando citas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Citas</h2>
      <ul>
        {citas.length > 0 ? (
          citas.map((cita) => (
            <li key={cita.id}>
              <p><strong>Paciente:</strong> {cita.usuario.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(cita.fecha).toLocaleString()}</p>
              <p><strong>Estado:</strong> {cita.estado}</p>
              <p><strong>Observaciones:</strong> {cita.observaciones}</p>
            </li>
          ))
        ) : (
          <p>No hay citas para este filtro.</p>
        )}
      </ul>
    </div>
  );
};

export default CitasList;
