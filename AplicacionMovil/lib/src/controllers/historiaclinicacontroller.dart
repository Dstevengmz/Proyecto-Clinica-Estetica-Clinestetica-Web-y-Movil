import '../models/historiaclinicamodel.dart';
import '../services/historiaclinicaservice.dart';

class HistoriaClinicaController {
  Future<List<HistoriaClinica>> listarHistorias() async {
    try {
      final historias = await HistoriaClinicaAPI.obtenerHistorialClinico();
      return historias;
    } catch (e) {
      throw Exception("Error obteniendo historial clínico: $e");
    }
  }

  Future<HistoriaClinica> crearHistoria(HistoriaClinica historia) async {
    try {
      return await HistoriaClinicaAPI.crearHistorialClinico(historia);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<HistoriaClinica> actualizarHistoria(HistoriaClinica historia) async {
    try {
      return await HistoriaClinicaAPI.actualizarHistorialClinico(historia);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<bool> verificarHistorialUsuario() async {
    try {
      return await HistoriaClinicaAPI.tieneHistorial();
    } catch (e) {
      throw Exception("Error verificando historial: $e");
    }
  }

  Future<HistoriaClinica?> obtenerMiHistoriaClinica() async {
    try {
      return await HistoriaClinicaAPI.obtenerMiHistorialClinico();
    } catch (e) {
      throw Exception("Error obteniendo mi historial clínico: $e");
    }
  }
}
