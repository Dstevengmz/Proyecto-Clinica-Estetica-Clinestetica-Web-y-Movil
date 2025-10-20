import '../models/notificacionmode.dart';
import '../services/notificacionservice.dart';

class NotificacionesController {
  Future<List<Notificacion>> obtenerNotificaciones(int idUsuario) async {
    try {
      return await NotificacionesService.listarNotificacionesUsuario(idUsuario);
    } catch (e) {
      throw Exception("Error al cargar notificaciones: $e");
    }
  }

  Future<void> marcarNotificacionLeida(
    int idUsuario,
    int idNotificacion,
  ) async {
    try {
      await NotificacionesService.marcarComoLeida(idUsuario, idNotificacion);
    } catch (e) {
      throw Exception("Error al marcar notificación como leída: $e");
    }
  }

  Future<int> contarNotificacionesNoLeidas(int idUsuario) async {
    try {
      final notificaciones =
          await NotificacionesService.listarNotificacionesUsuario(idUsuario);
      return notificaciones.where((n) => !n.leida).length;
    } catch (e) {
      return 0;
    }
  }

  // MÉTODOS PARA DOCTORES

  Future<List<Notificacion>> obtenerNotificacionesDoctor(int idDoctor) async {
    try {
      return await NotificacionesService.listarNotificacionesDoctor(idDoctor);
    } catch (e) {
      throw Exception("Error al cargar notificaciones del doctor: $e");
    }
  }

  Future<void> marcarNotificacionLeidaDoctor(
    int idDoctor,
    int idNotificacion,
  ) async {
    try {
      await NotificacionesService.marcarComoLeidaDoctor(
        idDoctor,
        idNotificacion,
      );
    } catch (e) {
      throw Exception("Error al marcar notificación del doctor como leída: $e");
    }
  }

  Future<int> contarNotificacionesNoLeidasDoctor(int idDoctor) async {
    try {
      final notificaciones =
          await NotificacionesService.listarNotificacionesDoctor(idDoctor);
      return notificaciones.where((n) => !n.leida).length;
    } catch (e) {
      return 0;
    }
  }
}
