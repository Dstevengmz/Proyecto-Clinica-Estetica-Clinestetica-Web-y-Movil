function puedeCancelarCita(fechaCita) {
  if (!fechaCita) return false;

  const ahora = Date.now();
  const diferencia = new Date(fechaCita).getTime() - ahora;

  return diferencia >= 24 * 60 * 60 * 1000;
}
export default puedeCancelarCita;
