import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/listaserviciosmodel.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ServicioListaAPI {
  static Future<List<Servicio>> obtenerServicios() async {
    final baseUrl = dotenv.env['API_BASE_URL'];

    if (baseUrl == null) {
      throw Exception('API_BASE_URL no definida en el .env');
    }

    final url = Uri.parse('$baseUrl/apiprocedimientos/listarprocedimiento');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((item) => Servicio.fromJson(item)).toList();
    } else {
      throw Exception('Error al cargar servicios: ${response.statusCode}');
    }
  }
}
