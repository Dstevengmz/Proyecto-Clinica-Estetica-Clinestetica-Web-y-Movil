import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/iniciarsesionmodel.dart';

class LoginAPI {
  static Future<Map<String, dynamic>> login(Login login) async {
    final baseUrl = dotenv.env['API_BASE_URL'];

    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en el .env');
    }

    final url = Uri.parse('$baseUrl/apiusuarios/iniciarsesion');
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(login.toJson()),
    );
    print('Respuesta cruda del backend: ${response.body}');
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al iniciar sesión: ${response.body}');
    }
  }
}
