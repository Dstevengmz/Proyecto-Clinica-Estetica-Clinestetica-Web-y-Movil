// src/components/CitasPorDia.js
import React, { useState } from 'react';
import useCitasPorDia from '../../../hooks/useCitasPorDia';  // Importar el hook

const CitasPorDia = ({ doctorId, setCitas }) => {
  const [fecha, setFecha] = useState('2025-08-05');  // Fecha por defecto

  const { citas, loading, error } = useCitasPorDia(doctorId, fecha);

  const handleFechaChange = (e) => {
    setFecha(e.target.value);  // Actualizar la fecha
    setCitas(citas);  // Actualizar las citas filtradas
  };

  if (loading) return <div>Cargando citas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Citas del Doctor {doctorId} para el {fecha}</h2>
      <input
        type="date"
        value={fecha}
        onChange={handleFechaChange}
      />
    </div>
  );
};

export default CitasPorDia;
