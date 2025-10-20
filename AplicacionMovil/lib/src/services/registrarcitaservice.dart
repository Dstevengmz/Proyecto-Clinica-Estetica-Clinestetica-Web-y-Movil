import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/citamodel.dart';
import '../models/doctormodel.dart';

class ServicioRegistrarCitaAPI {
  static Future<CitaRegistrar> obtenerUsuario() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en el .env');
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    if (token == null || token.isEmpty) {
      throw Exception("No se encontró token, inicie sesión primero.");
    }

    final url = Uri.parse('$baseUrl/apiusuarios/perfil');
    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      return CitaRegistrar.fromJson(jsonData);
    } else {
      throw Exception('Error al cargar el perfil: ${response.statusCode}');
    }
  }

  static Future<List<Doctor>> obtenerDoctores() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en el .env');
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    if (token == null || token.isEmpty) {
      throw Exception("No se encontró token, inicie sesión primero.");
    }

    final url = Uri.parse('$baseUrl/apiusuarios/doctores');
    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((item) => Doctor.fromJson(item)).toList();
    } else {
      throw Exception('Error al cargar los doctores: ${response.statusCode}');
    }
  }

  static Future<List<CitaRegistrar>> obtenerCitasDoctor(int doctorId) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en el .env');
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    if (token == null || token.isEmpty) {
      throw Exception("No se encontró token, inicie sesión primero.");
    }

    final url = Uri.parse('$baseUrl/apicitas/listarcitas?doctorId=$doctorId');
    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    print("URL => $url");
    print("Token => $token");

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((c) => CitaRegistrar.fromJson(c)).toList();
    } else {
      throw Exception('Error al cargar citas: ${response.statusCode}');
    }
  }

  static Future<Map<String, dynamic>> crearCita({
    required int idUsuario,
    required int idDoctor,
    required DateTime fecha,
    String tipo = "evaluacion",
    String estado = "pendiente",
  }) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) {
      throw Exception("API_BASE_URL no definida en .env");
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) {
      throw Exception("Usuario no autenticado");
    }

    final url = Uri.parse('$baseUrl/apicitas/crearcitas');

    String _toIso8601WithOffset(DateTime dt) {
      final local = dt.toLocal();
      final offset = local.timeZoneOffset;
      final sign = offset.isNegative ? '-' : '+';
      String two(int n) => n.abs().toString().padLeft(2, '0');
      final hh = two(offset.inHours);
      final mm = two(offset.inMinutes.remainder(60));
      final base = local.toIso8601String().split('Z').first;
      return '$base$sign$hh:$mm';
    }

    final response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: json.encode({
        "id_usuario": idUsuario,
        "id_doctor": idDoctor,
        "fecha": _toIso8601WithOffset(fecha),
        "tipo": tipo,
        "estado": estado,
      }),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      String message = '';
      try {
        final body = json.decode(response.body);
        if (body is Map<String, dynamic>) {
          message =
              body['message']?.toString() ??
              body['mensaje']?.toString() ??
              body['error']?.toString() ??
              body['detail']?.toString() ??
              body['detalle']?.toString() ??
              '';
          if (message.isEmpty && body['errors'] != null) {
            final errs = body['errors'];
            if (errs is List && errs.isNotEmpty) {
              message = errs.first.toString();
            } else if (errs is Map) {
              final parts = <String>[];
              errs.forEach((k, v) {
                if (v is List && v.isNotEmpty) parts.add(v.first.toString());
                if (v is String) parts.add(v);
              });
              if (parts.isNotEmpty) message = parts.join("\n");
            }
          }
        } else if (body is List && body.isNotEmpty) {
          message = body.first.toString();
        }
      } catch (_) {
        message = response.body;
      }

      message = message.trim();
      if (message.isEmpty) {
        message = 'Error al crear la cita (HTTP ${response.statusCode}).';
      }
      throw Exception(message);
    }
  }
}
