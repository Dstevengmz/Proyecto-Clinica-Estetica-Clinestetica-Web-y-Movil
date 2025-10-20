import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/contactomodel.dart';

class ContactoService {
  static Future<Map<String, dynamic>> enviar(Contacto contacto) async {
    final baseUrl = dotenv.env['API_BASE_URL'];
    if (baseUrl == null) throw Exception("API_BASE_URL no definida");

    final url = Uri.parse("$baseUrl/apicontacto/contacto");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(contacto.toJson()),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final body = jsonDecode(response.body);
      throw Exception(body['error'] ?? 'Error al enviar el mensaje');
    }
  }
}
