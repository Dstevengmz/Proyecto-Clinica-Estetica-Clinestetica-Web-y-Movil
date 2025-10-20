import './usuariomodel.dart';

class HistoriaClinica {
  final int? id;
  final int idUsuario;
  final Usuario? usuario;
  final String? enfermedades;
  final String? alergias;
  final String? cirugiasPrevias;
  final String? condicionesPiel;
  final bool? embarazoLactancia;
  final String? medicamentos;
  final bool? consumeTabaco;
  final bool? consumeAlcohol;
  final bool? usaAnticonceptivos;
  final String? detallesAnticonceptivos;
  final bool? diabetes;
  final bool? hipertension;
  final bool? historialCancer;
  final bool? problemasCoagulacion;
  final bool? epilepsia;
  final String? otrasCondiciones;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  HistoriaClinica({
    required this.id,
    required this.idUsuario,
    this.usuario,
    this.enfermedades,
    this.alergias,
    this.cirugiasPrevias,
    this.condicionesPiel,
    this.embarazoLactancia,
    this.medicamentos,
    this.consumeTabaco,
    this.consumeAlcohol,
    this.usaAnticonceptivos,
    this.detallesAnticonceptivos,
    this.diabetes,
    this.hipertension,
    this.historialCancer,
    this.problemasCoagulacion,
    this.epilepsia,
    this.otrasCondiciones,
    this.createdAt,
    this.updatedAt,
  });

  factory HistoriaClinica.fromJson(Map<String, dynamic> json) {
    int asInt(dynamic v) {
      if (v == null) return 0;
      if (v is int) return v;
      if (v is String) return int.tryParse(v) ?? 0;
      return 0;
    }

    bool? asBool(dynamic v) {
      if (v == null) return null;
      if (v is bool) return v;
      if (v is int) return v != 0;
      if (v is String) {
        final s = v.toLowerCase();
        if (s == 'true' || s == '1') return true;
        if (s == 'false' || s == '0') return false;
      }
      return null;
    }

    final usuarioJson = json['usuario'];
    final idUsuarioJson =
        json['id_usuario'] ?? json['idUsuario'] ?? (usuarioJson?['id']);

    DateTime? parseDate(dynamic v) {
      if (v == null) return null;
      if (v is String) {
        try {
          return DateTime.parse(v);
        } catch (_) {
          return null;
        }
      }
      return null;
    }

    return HistoriaClinica(
      id: json['id'] is String ? int.tryParse(json['id']) : json['id'],
      idUsuario: asInt(idUsuarioJson),
      usuario: usuarioJson != null ? Usuario.fromJson(usuarioJson) : null,
      enfermedades: json['enfermedades']?.toString(),
      alergias: json['alergias']?.toString(),
      cirugiasPrevias: json['cirugias_previas']?.toString(),
      condicionesPiel: json['condiciones_piel']?.toString(),
      embarazoLactancia: asBool(json['embarazo_lactancia']),
      medicamentos: json['medicamentos']?.toString(),
      consumeTabaco: asBool(json['consume_tabaco']),
      consumeAlcohol: asBool(json['consume_alcohol']),
      usaAnticonceptivos: asBool(json['usa_anticonceptivos']),
      detallesAnticonceptivos: json['detalles_anticonceptivos']?.toString(),
      diabetes: asBool(json['diabetes']),
      hipertension: asBool(json['hipertension']),
      historialCancer: asBool(json['historial_cancer']),
      problemasCoagulacion: asBool(json['problemas_coagulacion']),
      epilepsia: asBool(json['epilepsia']),
      otrasCondiciones: json['otras_condiciones']?.toString(),
      createdAt: parseDate(json['createdAt']),
      updatedAt: parseDate(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id_usuario": idUsuario,
      "enfermedades": enfermedades,
      "alergias": alergias,
      "cirugias_previas": cirugiasPrevias,
      "condiciones_piel": condicionesPiel,
      "embarazo_lactancia": embarazoLactancia,
      "medicamentos": medicamentos,
      "consume_tabaco": consumeTabaco,
      "consume_alcohol": consumeAlcohol,
      "usa_anticonceptivos": usaAnticonceptivos,
      "detalles_anticonceptivos": detallesAnticonceptivos,
      "diabetes": diabetes,
      "hipertension": hipertension,
      "historial_cancer": historialCancer,
      "problemas_coagulacion": problemasCoagulacion,
      "epilepsia": epilepsia,
      "otras_condiciones": otrasCondiciones,
    };
  }
}
