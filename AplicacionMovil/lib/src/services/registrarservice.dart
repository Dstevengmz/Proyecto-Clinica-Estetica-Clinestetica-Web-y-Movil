import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/registrarusuariomodel.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class UsuarioAPI {
  static Future<bool> registrarUsuario(Registrar usuario) async {
    final baseUrl = dotenv.env['API_BASE_URL'];

    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en el .env');
    }

    final url = Uri.parse('$baseUrl/apiusuarios/crearusuarios');
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(usuario.toJson()),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return true;
    } else {
      throw Exception('Error al registrar usuario: ${response.body}');
    }
  }
}
