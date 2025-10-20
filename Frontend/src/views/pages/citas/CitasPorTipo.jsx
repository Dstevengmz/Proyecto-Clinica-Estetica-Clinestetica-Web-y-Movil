// src/components/CitasPorTipo.js
import React, { useState } from 'react';
import useCitasPorTipo from '../../../hooks/useCitasPorTipo';  // Importar el hook

const CitasPorTipo = ({ doctorId }) => {
  const [tipo, setTipo] = useState('procedimiento');  // Tipo por defecto
  const [fecha, setFecha] = useState('2025-08-05');  // Fecha por defecto

  const { citas, loading, error } = useCitasPorTipo(doctorId, tipo, fecha);

  const handleTipoChange = (e) => setTipo(e.target.value);
  const handleFechaChange = (e) => setFecha(e.target.value);

  if (loading) return <div>Cargando citas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Citas del Doctor {doctorId} - Tipo: {tipo} para la fecha {fecha}</h2>
      <label>Tipo de cita:</label>
      <select onChange={handleTipoChange} value={tipo}>
        <option value="procedimiento">Procedimiento</option>
        <option value="evaluacion">Evaluación</option>
      </select>
      <label>Fecha:</label>
      <input
        type="date"
        value={fecha}
        onChange={handleFechaChange}
      />
      <ul>
        {citas.map((cita) => (
          <li key={cita.id}>
            {cita.usuario?.nombre} - {new Date(cita.fecha).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CitasPorTipo;
