import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/citasusuariomodel.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CitasUsuarioAPI {
  static Future<List<Citas>> obtenerCitas() async {
    final baseUrl = dotenv.env['API_BASE_URL'];

    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en el .env');
    }
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null || token.isEmpty) {
      throw Exception('Token no disponible. Usuario no autenticado.');
    }

    final url = Uri.parse('$baseUrl/apicitas/miscitas');
    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $token', 'Accept': 'application/json'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((item) => Citas.fromJson(item)).toList();
    } else {
      throw Exception('Error al cargar citas: ${response.statusCode}');
    }
  }
}
