import '../models/citasusuariomodel.dart';
import '../services/citasusuarioservice.dart';
import '../services/registrarcitaservice.dart';

class CitasUsuarioController {
  Future<List<Citas>> listarCitas() async {
    try {
      final citas = await CitasUsuarioAPI.obtenerCitas();
      return citas;
    } catch (e) {
      throw Exception("Error obteniendo citas: $e");
    }
  }

  Future<void> registrarCita({
    required int idUsuario,
    required int idDoctor,
    required DateTime fecha,
  }) async {
    await ServicioRegistrarCitaAPI.crearCita(
      idUsuario: idUsuario,
      idDoctor: idDoctor,
      fecha: fecha,
    );
  }
}
