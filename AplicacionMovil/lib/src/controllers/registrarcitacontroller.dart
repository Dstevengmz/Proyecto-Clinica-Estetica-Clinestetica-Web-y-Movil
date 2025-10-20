import '../models/citamodel.dart';
import '../services/registrarcitaservice.dart';
import '../models/doctormodel.dart';

class RegistrarCitaController {
  Future<CitaRegistrar> obtenerPerfilUsuario() async {
    try {
      return await ServicioRegistrarCitaAPI.obtenerUsuario();
    } catch (e) {
      throw Exception("Error obteniendo el usuario: $e");
    }
  }

  Future<List<Doctor>> obtenerDoctores() async {
    try {
      return await ServicioRegistrarCitaAPI.obtenerDoctores();
    } catch (e) {
      throw Exception("Error obteniendo los doctores: $e");
    }
  }

  Future<List<CitaRegistrar>> obtenerCitasDoctor(int doctorId) async {
    try {
      return await ServicioRegistrarCitaAPI.obtenerCitasDoctor(doctorId);
    } catch (e) {
      throw Exception("Error obteniendo citas del doctor: $e");
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
