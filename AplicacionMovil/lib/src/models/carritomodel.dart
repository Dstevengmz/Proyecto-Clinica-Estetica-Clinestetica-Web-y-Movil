import 'procedimientomode.dart';

class Carrito {
  final int id;
  final int idUsuario;
  final Procedimiento? procedimiento;

  Carrito({required this.id, required this.idUsuario, this.procedimiento});

  factory Carrito.fromJson(Map<String, dynamic> json) {
    return Carrito(
      id: json['id'] ?? 0,
      idUsuario: json['id_usuario'] ?? 0,
      procedimiento: json['procedimiento'] != null
          ? Procedimiento.fromJson(json['procedimiento'])
          : null,
    );
  }
}
