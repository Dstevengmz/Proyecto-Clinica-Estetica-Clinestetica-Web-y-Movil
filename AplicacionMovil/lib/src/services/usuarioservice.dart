import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/usuariomodel.dart';

class PerfilUsuarioAPI {
  static Future<Usuario?> obtenerMiPerfil() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en .env');
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final idStr = prefs.getString('id');
    final idUsuario = int.tryParse(idStr ?? '') ?? prefs.getInt('id');

    if (token == null || token.isEmpty) {
      throw Exception('Sesión no válida');
    }

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };

    final candidates = <Uri>[
      Uri.parse('$baseUrl/apiusuarios/perfil'),
      Uri.parse('$baseUrl/apiusuarios/perfil/$idUsuario'),
      Uri.parse('$baseUrl/apiusuarios/buscarusuarios/$idUsuario'),
    ];

    http.Response? last;
    for (final url in candidates) {
      final res = await http.get(url, headers: headers);
      last = res;
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic>) {
          if (data['usuario'] is Map<String, dynamic>) {
            return Usuario.fromJson(
              Map<String, dynamic>.from(data['usuario'] as Map),
            );
          }
          return Usuario.fromJson(data);
        }
        if (data is List && data.isNotEmpty) {
          return Usuario.fromJson(Map<String, dynamic>.from(data.first));
        }
        return null;
      }
    }

    if (last?.statusCode == 404) return null;
    throw Exception(
      'Error obteniendo perfil (${last?.statusCode}): ${last?.body}',
    );
  }

  static Future<Usuario> actualizarMiPerfil(Usuario usuario) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en .env');
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final idStr = prefs.getString('id');
    final idUsuario = int.tryParse(idStr ?? '') ?? prefs.getInt('id');
    if (token == null || token.isEmpty) {
      throw Exception('Sesión no válida');
    }

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };

    final body = jsonEncode(usuario.toJson());

    final patchCandidates = <Uri>[
      // Endpoint que sabemos que funciona - probarlo primero
      if (idUsuario != null)
        Uri.parse('$baseUrl/apiusuarios/editarusuarios/$idUsuario'),
      // Otros endpoints como respaldo
      Uri.parse('$baseUrl/apiusuarios/editarperfil'),
      Uri.parse('$baseUrl/apiusuarios/actualizarperfil'),
      if (idUsuario != null)
        Uri.parse('$baseUrl/apiusuarios/editarperfil/$idUsuario'),
      if (idUsuario != null)
        Uri.parse('$baseUrl/apiusuarios/actualizarperfil/$idUsuario'),
      if (idUsuario != null)
        Uri.parse('$baseUrl/apiusuarios/actualizarusuario/$idUsuario'),
    ];

    print('Actualizando perfil del usuario $idUsuario...');

    http.Response? last;

    // Intentar PATCH primero
    for (final url in patchCandidates) {
      final res = await http.patch(url, headers: headers, body: body);
      last = res;

      if (res.statusCode == 200) {
        print(' Perfil actualizado exitosamente');
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic>) {
          if (data['usuario'] is Map<String, dynamic>) {
            return Usuario.fromJson(
              Map<String, dynamic>.from(data['usuario'] as Map),
            );
          }
          return Usuario.fromJson(Map<String, dynamic>.from(data));
        }
        return usuario;
      }
      if (res.statusCode == 204) {
        print(' Perfil actualizado exitosamente (sin contenido)');
        return usuario;
      }

      // Solo log de error si no es el endpoint principal
      if (!url.toString().contains('editarusuarios')) {
        print(' Endpoint $url falló con código ${res.statusCode}');
      }
    }
    // Intentar PUT como respaldo si PATCH no funcionó
    for (final url in patchCandidates) {
      final res = await http.put(url, headers: headers, body: body);
      last = res;

      if (res.statusCode == 200) {
        print(' Perfil actualizado exitosamente (PUT)');
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic>) {
          if (data['usuario'] is Map<String, dynamic>) {
            return Usuario.fromJson(
              Map<String, dynamic>.from(data['usuario'] as Map),
            );
          }
          return Usuario.fromJson(Map<String, dynamic>.from(data));
        }
        return usuario;
      }
      if (res.statusCode == 204) {
        print(' Perfil actualizado exitosamente (PUT sin contenido)');
        return usuario;
      }
    }

    print(' No se pudo actualizar el perfil con ningún endpoint');
    throw Exception(
      'No se pudo actualizar el perfil. Código: ${last?.statusCode}',
    );
  }

  static Future<List<Usuario>> listarUsuarios() async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en el .env');
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null || token.isEmpty) {
      throw Exception('Token no disponible. Usuario no autenticado.');
    }

    final url = Uri.parse('$baseUrl/apiusuarios/listarusuarios');
    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $token', 'Accept': 'application/json'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((item) => Usuario.fromJson(item)).toList();
    } else {
      throw Exception(
        'Error al cargar lista de usuarios: ${response.statusCode}',
      );
    }
  }
}
