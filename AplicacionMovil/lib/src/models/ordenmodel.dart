import '../enums/estadoorden.dart';
import './procedimientomode.dart';

class Orden {
  final int id;
  final Estado estado;
  final List<Procedimiento> procedimientos;
  Orden({required this.id, required this.estado, required this.procedimientos});

  factory Orden.fromJson(Map<String, dynamic> json) {
    return Orden(
      id: json['id'],
      estado: EstadoOrdenExtension.fromString(json['estado']),
      procedimientos:
          (json['procedimientos'] as List<dynamic>?)
              ?.map((p) => Procedimiento.fromJson(p))
              .toList() ??
          [],
    );
  }
}
