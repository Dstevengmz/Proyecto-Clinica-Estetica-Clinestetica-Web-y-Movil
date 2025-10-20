import '../models/contactomodel.dart';
import '../services/contactoservice.dart';

class ContactoController {
  Future<Map<String, dynamic>> enviarMensaje({
    required String nombre,
    required String email,
    String? asunto,
    required String mensaje,
  }) async {
    // Validaciones locales (mismas del backend)
    if (nombre.trim().isEmpty)
      throw Exception("El campo nombre es obligatorio");
    if (email.trim().isEmpty) throw Exception("El campo email es obligatorio");
    if (mensaje.trim().isEmpty) throw Exception("El mensaje es obligatorio");

    final emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    if (!emailRegex.hasMatch(email)) throw Exception("El email no es válido");
    if (nombre.length > 100)
      throw Exception("El nombre es demasiado largo (máx 100)");
    if ((asunto ?? "").length > 150)
      throw Exception("El asunto es demasiado largo (máx 150)");
    if (mensaje.length > 5000)
      throw Exception("El mensaje es demasiado largo (máx 5000)");

    // Construir el modelo y llamar al servicio
    final contacto = Contacto(
      nombre: nombre,
      email: email,
      asunto: asunto ?? "",
      mensaje: mensaje,
    );

    return await ContactoService.enviar(contacto);
  }
}
