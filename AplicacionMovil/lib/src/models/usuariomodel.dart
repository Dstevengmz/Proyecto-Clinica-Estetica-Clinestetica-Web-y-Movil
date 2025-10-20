class Usuario {
  final String? nombre;
  final String? correo;
  final String? tipodocumento;
  final String? numerodocumento;
  final String? rol;
  final String? telefono;
  final String? genero;
  final String? direccion;
  final String? fechaNacimiento; // formato 'YYYY-MM-DD'
  final String? ocupacion;
  final String? estadoCivil;
  final bool? terminosCondiciones;
  final bool? estado; // solo lectura, usualmente gestionado por admin

  Usuario({
    required this.nombre,
    required this.correo,
    required this.tipodocumento,
    required this.numerodocumento,
    required this.rol,
    required this.telefono,
    required this.genero,
    this.direccion,
    this.fechaNacimiento,
    this.ocupacion,
    this.estadoCivil,
    this.terminosCondiciones,
    this.estado,
  });

  Map<String, dynamic> toJson() {
    return {
      'nombre': nombre,
      'correo': correo,
      'tipodocumento': tipodocumento,
      'numerodocumento': numerodocumento,
      'rol': rol,
      'telefono': telefono,
      'genero': genero,
      'direccion': direccion,
      'fecha_nacimiento': fechaNacimiento,
      'ocupacion': ocupacion,
      'estado_civil': estadoCivil,
      'terminos_condiciones': terminosCondiciones,
      // 'estado' normalmente no se actualiza por perfil de usuario
    };
  }

  factory Usuario.fromJson(Map<String, dynamic> json) {
    // helpers locales para conversiones seguras
    String? asString(dynamic v) => v?.toString();
    bool? asBool(dynamic v) {
      if (v == null) return null;
      if (v is bool) return v;
      final s = v.toString().toLowerCase().trim();
      if (s == 'true' || s == '1' || s == 'si' || s == 'sí') return true;
      if (s == 'false' || s == '0' || s == 'no') return false;
      return null;
    }

    return Usuario(
      nombre: asString(json['nombre']) ?? '',
      correo: asString(json['correo']) ?? '',
      tipodocumento: asString(json['tipodocumento']) ?? '',
      numerodocumento: asString(json['numerodocumento']) ?? '',
      rol: asString(json['rol']) ?? '',
      telefono: asString(json['telefono']),
      genero: asString(json['genero']) ?? '',
      direccion: asString(json['direccion']),
      fechaNacimiento:
          asString(json['fecha_nacimiento']) ??
          asString(json['fechaNacimiento']),
      ocupacion: asString(json['ocupacion']),
      estadoCivil:
          asString(json['estado_civil']) ?? asString(json['estadoCivil']),
      terminosCondiciones:
          asBool(json['terminos_condiciones']) ??
          asBool(json['terminosCondiciones']),
      estado: asBool(json['estado']),
    );
  }
}
