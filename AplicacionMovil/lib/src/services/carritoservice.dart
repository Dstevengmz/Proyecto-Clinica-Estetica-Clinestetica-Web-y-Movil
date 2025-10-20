import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/carritomodel.dart';

class CarritoAPI {
  static Future<List<Carrito>> listarMiCarrito() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception("API_BASE_URL no definida");

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");
    if (token == null || token.isEmpty) {
      throw Exception("Usuario no autenticado");
    }

    final url = Uri.parse("$baseUrl/apicarrito/listarmicarrito");
    final response = await http.get(
      url,
      headers: {"Authorization": "Bearer $token", "Accept": "application/json"},
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((e) => Carrito.fromJson(e)).toList();
    } else {
      throw Exception("Error al listar carrito: ${response.statusCode}");
    }
  }

  static Future<void> agregarAlCarrito(int idProcedimiento) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    final url = Uri.parse("$baseUrl/apicarrito/agregaramicarrito");
    final response = await http.post(
      url,
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode({"id_procedimiento": idProcedimiento}),
    );

    if (response.statusCode != 201) {
      final error = json.decode(response.body);
      throw Exception(error["error"] ?? "Error al agregar al carrito");
    }
  }

  static Future<void> eliminarDelCarrito(int id) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    final url = Uri.parse("$baseUrl/apicarrito/eliminardemicarrito/$id");
    final response = await http.delete(
      url,
      headers: {"Authorization": "Bearer $token"},
    );

    if (response.statusCode != 200) {
      throw Exception("Error al eliminar del carrito");
    }
  }

  static Future<void> limpiarMiCarrito() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    final url = Uri.parse("$baseUrl/apicarrito/limpiarmicarrito");
    final response = await http.delete(
      url,
      headers: {"Authorization": "Bearer $token"},
    );

    if (response.statusCode != 200) {
      throw Exception("Error al limpiar carrito");
    }
  }
}
