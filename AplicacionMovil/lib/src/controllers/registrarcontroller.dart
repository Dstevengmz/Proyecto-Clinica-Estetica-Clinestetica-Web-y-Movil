import '../models/registrarusuariomodel.dart';
import '../services/registrarservice.dart';

class UsuarioController {
  Future<bool> registrarUsuario(Registrar usuario) async {
    try {
      return await UsuarioAPI.registrarUsuario(usuario);
    } catch (e) {
      return false;
    }
  }
}
