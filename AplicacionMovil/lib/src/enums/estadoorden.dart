enum Estado { pendiente, confirmada, cancelada }

extension EstadoOrdenExtension on Estado {
  String get nombre {
    switch (this) {
      case Estado.pendiente:
        return 'Pendiente';
      case Estado.confirmada:
        return 'Confirmada';
      case Estado.cancelada:
        return 'Cancelada';
    }
  }

  static Estado fromString(String value) {
    switch (value.toLowerCase()) {
      case 'pendiente':
        return Estado.pendiente;
      case 'confirmada':
        return Estado.confirmada;
      case 'cancelada':
        return Estado.cancelada;
      default:
        throw Exception('Estado desconocido: $value');
    }
  }
}
