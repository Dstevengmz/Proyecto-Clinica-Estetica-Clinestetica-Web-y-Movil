import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/historiaclinicamodel.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HistoriaClinicaAPI {
  static Future<List<HistoriaClinica>> obtenerHistorialClinico() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception('API_BASE_URL no definida en el .env');

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null || token.isEmpty) {
      throw Exception('Token no disponible. Usuario no autenticado.');
    }

    final url = Uri.parse('$baseUrl/apihistorialmedico/listarhistorialclinico');
    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $token', 'Accept': 'application/json'},
    );
    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((item) => HistoriaClinica.fromJson(item)).toList();
    } else {
      throw Exception(
        'Error al cargar historial clínico: ${response.statusCode}',
      );
    }
  }

  // Obtiene el historial clínico del usuario autenticado.
  // Retorna null si no existe (HTTP 404).
  static Future<HistoriaClinica?> obtenerMiHistorialClinico() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception('API_BASE_URL no definida en el .env');

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final idUsuario = prefs.getString('id') ?? prefs.getInt('id');

    if (token == null || token.isEmpty || idUsuario == null) {
      throw Exception('Token o usuario no disponible. Usuario no autenticado.');
    }

    final url = Uri.parse(
      '$baseUrl/apihistorialmedico/mihistorialclinico/$idUsuario',
    );
    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $token', 'Accept': 'application/json'},
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body);
      return HistoriaClinica.fromJson(jsonData);
    } else if (response.statusCode == 404) {
      return null;
    } else {
      throw Exception(
        'Error al obtener mi historial clínico: ${response.statusCode}',
      );
    }
  }

  static Future<HistoriaClinica> crearHistorialClinico(
    HistoriaClinica historial,
  ) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception('API_BASE_URL no definida en el .env');

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null || token.isEmpty) {
      throw Exception('Token no disponible. Usuario no autenticado.');
    }

    final url = Uri.parse('$baseUrl/apihistorialmedico/crearhistorialclinico');
    final response = await http.post(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: json.encode(historial.toJson()),
    );

    if (response.statusCode == 201) {
      return HistoriaClinica.fromJson(json.decode(response.body));
    } else {
      final Map<String, dynamic> errorData = json.decode(response.body);
      final mensaje =
          errorData['error'] ?? errorData['message'] ?? 'Error desconocido';
      throw Exception(mensaje);
    }
  }

  static Future<HistoriaClinica> actualizarHistorialClinico(
    HistoriaClinica historial,
  ) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception('API_BASE_URL no definida en el .env');

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null || token.isEmpty) {
      throw Exception('Token no disponible. Usuario no autenticado.');
    }

    // Función auxiliar para intentar una solicitud (PUT/PATCH) y evaluar éxito
    Future<http.Response> _try(String method, Uri url) {
      final body = json.encode(historial.toJson());
      final headers = {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      switch (method) {
        case 'PATCH':
          return http.patch(url, headers: headers, body: body);
        default:
          return http.put(url, headers: headers, body: body);
      }
    }

    http.Response? lastResponse;

    // 1) Intentos por ID (si tenemos ID)
    if (historial.id != null && historial.id != 0) {
      final urlsById = <Uri>[
        Uri.parse(
          '$baseUrl/apihistorialmedico/editarhistorialclinico/${historial.id}',
        ),
        Uri.parse(
          '$baseUrl/apihistorialmedico/actualizarhistorialclinico/${historial.id}',
        ),
      ];
      for (final url in urlsById) {
        for (final method in const ['PUT', 'PATCH']) {
          final res = await _try(method, url);
          lastResponse = res;
          if (res.statusCode == 200) {
            return HistoriaClinica.fromJson(json.decode(res.body));
          }
          if (res.statusCode == 204) {
            return historial;
          }
          if (res.statusCode == 404 || res.statusCode == 405) {
            // probar siguiente patrón
            continue;
          }
        }
      }
    }

    // 2) Intentos por usuario (si tenemos idUsuario)
    final idUsuarioPref = prefs.getString('id') ?? prefs.getInt('id');
    final idUsuario = historial.idUsuario != 0
        ? historial.idUsuario
        : idUsuarioPref;
    if (idUsuario != null) {
      final usuarioStr = idUsuario.toString();
      final urlsByUser = <Uri>[
        Uri.parse(
          '$baseUrl/apihistorialmedico/editarhistorialclinicoporusuario/$usuarioStr',
        ),
        Uri.parse(
          '$baseUrl/apihistorialmedico/actualizarhistorialclinicoporusuario/$usuarioStr',
        ),
        Uri.parse('$baseUrl/apihistorialmedico/mihistorialclinico/$usuarioStr'),
      ];
      for (final url in urlsByUser) {
        for (final method in const ['PUT', 'PATCH']) {
          final res = await _try(method, url);
          lastResponse = res;
          if (res.statusCode == 200) {
            return HistoriaClinica.fromJson(json.decode(res.body));
          }
          if (res.statusCode == 204) {
            return historial;
          }
          if (res.statusCode == 404 || res.statusCode == 405) {
            continue;
          }
        }
      }
    }

    // Si llegamos aquí, ningún endpoint funcionó
    final code = lastResponse?.statusCode;
    final bodyText = lastResponse?.body ?? '';
    String mensaje = 'Error desconocido';
    try {
      if (bodyText.isNotEmpty) {
        final Map<String, dynamic> err = json.decode(bodyText);
        mensaje = err['error'] ?? err['message'] ?? mensaje;
      }
    } catch (_) {
      if (bodyText.isNotEmpty) mensaje = bodyText;
    }
    throw Exception(
      'Error al actualizar historial clínico: ${code ?? 'sin código'}. Detalle: $mensaje',
    );
  }

  static Future<bool> tieneHistorial() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final idUsuario = prefs.getString('id') ?? prefs.getInt('id');

    if (token == null || idUsuario == null) {
      throw Exception("Usuario no autenticado");
    }

    final url = Uri.parse(
      "$baseUrl/apihistorialmedico/buscarhistorialclinicoporusuario/$idUsuario",
    );

    final response = await http.get(
      url,
      headers: {"Authorization": "Bearer $token", "Accept": "application/json"},
    );

    if (response.statusCode == 200) {
      return true;
    } else if (response.statusCode == 404) {
      return false;
    } else {
      throw Exception("Error al verificar historial");
    }
  }
}
