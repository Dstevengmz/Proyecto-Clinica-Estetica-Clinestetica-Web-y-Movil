import '../models/iniciarsesionmodel.dart';
import '../services/iniciarsesionservice.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginController {
  Future<String> loginUsuario(Login login) async {
    try {
      final data = await LoginAPI.login(login);

      if (data.containsKey("token")) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString("token", data["token"]);
        await prefs.setString("rol", data["usuario"]["rol"]);
        await prefs.setString("nombre", data["usuario"]["nombre"]);
        await prefs.setString("correo", data["usuario"]["correo"]);
        final usuario = data["usuario"];
        dynamic userId;
        if (usuario is Map<String, dynamic>) {
          userId =
              usuario["id"] ??
              usuario["id_usuario"] ??
              usuario["idUsuario"] ??
              usuario["usuarioId"];
        }
        if (userId != null) {
          await prefs.setString("id", userId.toString());
        }
        return "Login exitoso Bienvenido ${data["usuario"]["rol"]}";
      } else {
        return "Credenciales inválidas ";
      }
    } catch (e) {
      return "Error al iniciar Sesión Credenciales inválidas";
    }
  }
}
