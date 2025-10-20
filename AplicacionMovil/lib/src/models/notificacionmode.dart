class Notificacion {
  final int id;
  final String tipo;
  final String titulo;
  final String mensaje;
  final DateTime fecha;
  final bool leida;
  final bool archivada;

  Notificacion({
    required this.id,
    required this.tipo,
    required this.titulo,
    required this.mensaje,
    required this.fecha,
    required this.leida,
    required this.archivada,
  });

  factory Notificacion.fromJson(Map<String, dynamic> json) {
    bool toBool(dynamic v) {
      if (v is bool) return v;
      if (v is num) return v != 0;
      if (v is String) return v.toLowerCase() == 'true' || v == '1';
      return false;
    }

    DateTime parseDate(dynamic v) {
      if (v == null) return DateTime.now();
      if (v is int) {
        final isMs = v > 100000000000; // heurística para ms vs s
        final dt = DateTime.fromMillisecondsSinceEpoch(
          isMs ? v : v * 1000,
          isUtc: true,
        );
        return dt.toLocal();
      }
      if (v is String) {
        final numVal = int.tryParse(v);
        if (numVal != null) {
          final isMs = v.length >= 13;
          final dt = DateTime.fromMillisecondsSinceEpoch(
            isMs ? numVal : numVal * 1000,
            isUtc: true,
          );
          return dt.toLocal();
        }
        final dt = DateTime.tryParse(v);
        if (dt != null) {
          return dt.isUtc ? dt.toLocal() : dt;
        }
      }
      return DateTime.now();
    }

    return Notificacion(
      id: json['id'] is int
          ? json['id']
          : int.tryParse(json['id'].toString()) ?? 0,
      tipo: json['tipo'] ?? 'general',
      titulo: json['titulo'] ?? '',
      mensaje: json['mensaje'] ?? '',
      fecha: parseDate(json['fecha']),
      leida: toBool(json['leida']),
      archivada: toBool(json['archivada']),
    );
  }

  Map<String, dynamic> toJson() => {
    "id": id,
    "tipo": tipo,
    "titulo": titulo,
    "mensaje": mensaje,
    "fecha": fecha.toIso8601String(),
    "leida": leida,
    "archivada": archivada,
  };
}
