const duraciones = {
  evaluacion: 30,
  procedimiento: 60,
};

const estaOcupado = (hora, horariosOcupados, cargandoHorarios, formData) => {
  if (!horariosOcupados || horariosOcupados.length === 0 || cargandoHorarios) {
    return false;
  }

  const fechaHora = `${formData.fecha}T${hora}:00`;
  const inicio = new Date(fechaHora);
  const duracionMin = duraciones[formData.tipo] || 0;
  const fin = new Date(inicio.getTime() + duracionMin * 60000);

  return horariosOcupados.some((cita) => {
    const inicioOcupado = new Date(cita.fecha);
    const finOcupado = new Date(
      inicioOcupado.getTime() + duraciones[cita.tipo] * 60000
    );
    return (
      (inicio >= inicioOcupado && inicio < finOcupado) ||
      (fin > inicioOcupado && fin <= finOcupado) ||
      (inicio <= inicioOcupado && fin >= finOcupado)
    );
  });
};

export default estaOcupado;