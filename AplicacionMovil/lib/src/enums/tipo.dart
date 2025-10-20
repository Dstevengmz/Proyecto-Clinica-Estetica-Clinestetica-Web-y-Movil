enum Tipo { evaluacion, procedimiento }

extension TipoExtension on Tipo {
  String get nombre {
    switch (this) {
      case Tipo.evaluacion:
        return 'Evaluación';
      case Tipo.procedimiento:
        return 'Procedimiento';
    }
  }
}
