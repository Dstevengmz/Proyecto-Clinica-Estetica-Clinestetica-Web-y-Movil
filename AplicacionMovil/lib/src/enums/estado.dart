enum Estado { pendiente, confirmada, realizada, cancelada }

extension EstadoExtension on Estado {
  String get nombre {
    switch (this) {
      case Estado.pendiente:
        return 'Pendiente';
      case Estado.confirmada:
        return 'Confirmada';
      case Estado.realizada:
        return 'Realizada';
      case Estado.cancelada:
        return 'Cancelada';
    }
  }
}
