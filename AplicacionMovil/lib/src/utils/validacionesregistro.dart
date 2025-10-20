class ValidacionesRegistro {
  static String? validarNombre(String? valor) {
    if (valor == null || valor.trim().isEmpty) {
      return "El nombre es obligatorio";
    }
    if (valor.length < 3) {
      return "Debe tener al menos 3 caracteres";
    }
    return null;
  }

  static String? validarDocumento(String? valor) {
    if (valor == null || valor.isEmpty) {
      return "El documento es obligatorio";
    }
    if (!RegExp(r'^[0-9]+$').hasMatch(valor)) {
      return "Solo se permiten números";
    }
    if (valor.length < 7 || valor.length > 10) {
      return "Debe tener entre 7 y 10 dígitos";
    }
    return null;
  }

  static String? validarCorreo(String? valor) {
    if (valor == null || valor.isEmpty) {
      return "El correo es obligatorio";
    }
    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(valor)) {
      return "Ingrese un correo válido";
    }
    return null;
  }

  static String? validarContrasena(String? valor) {
    if (valor == null || valor.isEmpty) {
      return "La contraseña es obligatoria";
    }
    if (valor.length < 6) {
      return "Debe tener al menos 6 caracteres";
    }
    return null;
  }

  static String? validarTelefono(String? valor) {
    if (valor == null || valor.isEmpty) {
      return "El teléfono es obligatorio";
    }
    if (!RegExp(r'^[0-9]+$').hasMatch(valor)) {
      return "Solo se permiten números";
    }
    if (valor.length < 9 || valor.length > 12) {
      return "Debe tener entre 9 y 12 dígitos";
    }
    return null;
  }
}
