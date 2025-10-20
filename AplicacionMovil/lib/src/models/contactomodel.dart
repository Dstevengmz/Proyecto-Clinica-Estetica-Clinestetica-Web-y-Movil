class Contacto {
  final String nombre;
  final String email;
  final String asunto;
  final String mensaje;

  Contacto({
    required this.nombre,
    required this.email,
    required this.asunto,
    required this.mensaje,
  });

  Map<String, dynamic> toJson() => {
    "nombre": nombre,
    "email": email,
    "asunto": asunto,
    "mensaje": mensaje,
  };
}
