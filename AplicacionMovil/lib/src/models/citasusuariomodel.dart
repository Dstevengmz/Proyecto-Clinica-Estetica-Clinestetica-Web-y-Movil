import './usuariomodel.dart';

class Citas {
  final int? id;
  final int? idUsuario;
  final Usuario? usuario;
  final DateTime fecha;
  final String estado;
  final String tipo;
  final String? observaciones;

  Citas({
    this.id,
    this.idUsuario,
    this.usuario,
    required this.fecha,
    required this.estado,
    required this.tipo,
    required this.observaciones,
  });
  factory Citas.fromJson(Map<String, dynamic> json) {
    return Citas(
      id: json['id'],
      idUsuario: json['id_usuario'],
      usuario: json['usuario'] != null
          ? Usuario.fromJson(json['usuario'])
          : null,
      fecha: DateTime.parse(json['fecha']),
      estado: json['estado'],
      tipo: json['tipo'],
      observaciones: json['observaciones'],
    );
  }
}
