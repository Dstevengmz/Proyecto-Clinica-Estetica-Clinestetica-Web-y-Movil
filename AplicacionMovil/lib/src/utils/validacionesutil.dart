class Validaciones {
  static String? validarNombre(String? valor) {
    if (valor == null || valor.trim().isEmpty) {
      return "El nombre es obligatorio";
    }
    if (valor.length < 3) {
      return "El nombre debe tener al menos 3 caracteres";
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
    if (valor.length < 6 || valor.length > 10) {
      return "El documento debe tener entre 6 y 10 dígitos";
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
      return "La contraseña debe tener mínimo 6 caracteres";
    }
    return null;
  }

  static String? validarTelefono(String? valor) {
    if (valor == null || valor.isEmpty) {
      return "El teléfono es obligatorio";
    }
    if (!RegExp(r'^[0-9]+$').hasMatch(valor)) {
      return "El teléfono solo puede contener números";
    }
    if (valor.length != 10) {
      return "El teléfono debe tener 10 dígitos";
    }
    return null;
  }

  static String? validarAceptacionTerminos(bool aceptado) {
    if (!aceptado) {
      return "Debe aceptar los términos y condiciones";
    }
    return null;
  }
}
