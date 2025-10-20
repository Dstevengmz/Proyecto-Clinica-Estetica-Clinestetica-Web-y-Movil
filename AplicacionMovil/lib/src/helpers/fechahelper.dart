import 'package:intl/intl.dart';

class FechaHelper {
  static String formatFecha(DateTime fecha) {
    return DateFormat("d 'de' MMMM y", "es_ES").format(fecha);
  }

  static String formatHora(DateTime fecha) {
    return DateFormat("h:mm a", "es_ES").format(fecha);
  }
}
