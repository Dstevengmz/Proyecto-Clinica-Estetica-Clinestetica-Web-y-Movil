import '../enums/tipodocumento.dart';
import '../enums/genero.dart';

class Registrar {
  final int id;
  final String nombre;
  final TipoDocumento tipodocumento;
  final String numerodocumento;
  final String correo;
  final String contrasena;
  final String telefono;
  final Genero genero;
  final bool terminoscondiciones;

  Registrar({
    required this.id,
    required this.nombre,
    required this.tipodocumento,
    required this.numerodocumento,
    required this.correo,
    required this.contrasena,
    required this.telefono,
    required this.genero,
    required this.terminoscondiciones,
  });

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "nombre": nombre,
      "tipodocumento": tipodocumento.nombre,
      "numerodocumento": numerodocumento,
      "correo": correo,
      "contrasena": contrasena,
      "telefono": telefono,
      "genero": genero.nombre,
      "terminos_condiciones": terminoscondiciones,
    };
  }
}
