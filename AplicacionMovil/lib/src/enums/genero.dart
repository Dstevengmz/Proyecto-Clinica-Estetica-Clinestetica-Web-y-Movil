enum Genero { masculino, femenino, otro }

extension GeneroExtension on Genero {
  String get nombre {
    switch (this) {
      case Genero.masculino:
        return 'Masculino';
      case Genero.femenino:
        return 'Femenino';
      case Genero.otro:
        return 'Otro';
    }
  }
}
