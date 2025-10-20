import '../models/usuariomodel.dart';
import '../services/usuarioservice.dart';

class UsuarioPerfilController {
  Future<Usuario?> obtenerMiPerfil() async {
    try {
      print(' Controller: Obteniendo perfil de usuario...');
      final usuario = await PerfilUsuarioAPI.obtenerMiPerfil();
      print(' Controller: Perfil obtenido exitosamente');
      return usuario;
    } catch (e) {
      print(' Controller: Error obteniendo perfil: $e');
      throw Exception('Error obteniendo perfil: $e');
    }
  }

  Future<Usuario> actualizarMiPerfil(Usuario u) async {
    try {
      return await PerfilUsuarioAPI.actualizarMiPerfil(u);
    } catch (e) {
      print('Error en controller: $e');
      if (e.toString().contains('404')) {
        throw Exception(
          'El servicio no está disponible en este momento. Por favor, intenta más tarde.',
        );
      }
      if (e.toString().contains('Sesión no válida')) {
        throw Exception(
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        );
      }
      throw Exception(
        'No se pudo actualizar tu perfil. Verifica tu conexión e intenta nuevamente.',
      );
    }
  }

  /// Obtiene la lista de todos los usuarios (para doctores)
  Future<List<Usuario>> obtenerListaUsuarios() async {
    try {
      print(' Controller: Obteniendo lista de usuarios...');
      final usuarios = await PerfilUsuarioAPI.listarUsuarios();
      print(
        ' Controller: Lista de usuarios obtenida exitosamente (${usuarios.length} usuarios)',
      );
      return usuarios;
    } catch (e) {
      print(' Controller: Error obteniendo lista de usuarios: $e');
      if (e.toString().contains('404')) {
        throw Exception(
          'El servicio de usuarios no está disponible en este momento.',
        );
      }
      if (e.toString().contains('401') || e.toString().contains('Token')) {
        throw Exception('No tienes permisos para acceder a esta información.');
      }
      throw Exception(
        'Error al cargar la lista de usuarios. Verifica tu conexión.',
      );
    }
  }
}
