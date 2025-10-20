import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notificacionmode.dart';

class NotificacionesService {
  static Future<List<Notificacion>> listarNotificacionesUsuario(
    int idUsuario,
  ) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception("API_BASE_URL no definida");

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");
    if (token == null || token.isEmpty) {
      throw Exception("Usuario no autenticado");
    }

    final url = Uri.parse(
      "$baseUrl/apiusuarios/notificacionesusuario/$idUsuario",
    );
    final response = await http.get(
      url,
      headers: {"Authorization": "Bearer $token", "Accept": "application/json"},
    );

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      final List<dynamic> list = decoded is List
          ? decoded
          : (decoded is Map && decoded['data'] is List)
          ? List<dynamic>.from(decoded['data'])
          : <dynamic>[];
      return list
          .map((n) => Notificacion.fromJson(Map<String, dynamic>.from(n)))
          .toList();
    } else {
      throw Exception(
        "Error al obtener notificaciones (${response.statusCode})",
      );
    }
  }

  static Future<void> marcarComoLeida(int idUsuario, int idNotificacion) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception("API_BASE_URL no definida");
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");
    if (token == null || token.isEmpty) {
      throw Exception("Usuario no autenticado");
    }

    final url = Uri.parse(
      "$baseUrl/apiusuarios/notificacionesusuario/$idUsuario/marcar-leida",
    );
    final response = await http.patch(
      url,
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: jsonEncode({"notificacionId": idNotificacion}),
    );

    if (response.statusCode != 200) {
      final error = jsonDecode(response.body);
      throw Exception(error["error"] ?? "No se pudo marcar la notificación");
    }
  }

  static Future<List<Notificacion>> listarNotificacionesDoctor(
    int idDoctor,
  ) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception("API_BASE_URL no definida");

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");
    if (token == null || token.isEmpty) {
      throw Exception("Doctor no autenticado");
    }

    final url = Uri.parse("$baseUrl/apiusuarios/notificaciones/$idDoctor");
    final response = await http.get(
      url,
      headers: {"Authorization": "Bearer $token", "Accept": "application/json"},
    );

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      final List<dynamic> list = decoded is List
          ? decoded
          : (decoded is Map && decoded['data'] is List)
          ? List<dynamic>.from(decoded['data'])
          : <dynamic>[];
      return list
          .map((n) => Notificacion.fromJson(Map<String, dynamic>.from(n)))
          .toList();
    } else {
      throw Exception(
        "Error al obtener notificaciones del doctor (${response.statusCode})",
      );
    }
  }

  static Future<void> marcarComoLeidaDoctor(
    int idDoctor,
    int idNotificacion,
  ) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception("API_BASE_URL no definida");
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");
    if (token == null || token.isEmpty) {
      throw Exception("Doctor no autenticado");
    }

    final url = Uri.parse(
      "$baseUrl/apiusuarios/notificaciones/$idDoctor/marcar-leida",
    );
    final response = await http.patch(
      url,
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: jsonEncode({"notificacionId": idNotificacion}),
    );

    if (response.statusCode != 200) {
      final error = jsonDecode(response.body);
      throw Exception(
        error["error"] ?? "No se pudo marcar la notificación como leída",
      );
    }
  }
}
