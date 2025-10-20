// src/components/CitasPorRango.js
import React, { useState } from 'react';
import useCitasPorRango from '../../../hooks/useCitasPorRango';  // Importar el hook

const CitasPorRango = ({ doctorId }) => {
  const [desde, setDesde] = useState('2025-08-01');  // Fecha de inicio por defecto
  const [hasta, setHasta] = useState('2025-08-07');  // Fecha de fin por defecto

  const { citas, loading, error } = useCitasPorRango(doctorId, desde, hasta);

  const handleDesdeChange = (e) => setDesde(e.target.value);
  const handleHastaChange = (e) => setHasta(e.target.value);

  if (loading) return <div>Cargando citas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Citas del Doctor {doctorId} desde {desde} hasta {hasta}</h2>
      <label>Desde:</label>
      <input
        type="date"
        value={desde}
        onChange={handleDesdeChange}
      />
      <label>Hasta:</label>
      <input
        type="date"
        value={hasta}
        onChange={handleHastaChange}
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

export default CitasPorRango;
