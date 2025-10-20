import '../models/citasdoctormodel.dart';
import '../services/citasdoctorservice.dart';

class CitasDoctorController {
  Future<List<CitasDoctor>> listarCitas() async {
    try {
      final citas = await CitasDoctorAPI.obtenerCitas();
      return citas;
    } catch (e) {
      throw Exception("Error obteniendo citas: $e");
    }
  }

  Future<int> contarCitasDeHoy() async {
    try {
      final citas = await CitasDoctorAPI.obtenerCitas();
      final hoy = DateTime.now();
      final fechaHoy = DateTime(hoy.year, hoy.month, hoy.day);

      int contador = 0;
      for (var cita in citas) {
        try {
          final fechaCitaSolo = DateTime(
            cita.fecha.year,
            cita.fecha.month,
            cita.fecha.day,
          );

          if (fechaCitaSolo.isAtSameMomentAs(fechaHoy)) {
            contador++;
          }
        } catch (e) {
          continue;
        }
      }

      return contador;
    } catch (e) {
      return 0;
    }
  }
}
