import './usuariomodel.dart';
import './doctormodel.dart';
import './historiaclinicamodel.dart';
import './ordenmodel.dart';

class CitasDoctor {
  final int? id;
  final int? idUsuario;
  final Usuario? usuario;
  final Doctor? doctor;
  final HistoriaClinica? historialMedico;
  final Orden? orden;
  final DateTime fecha;
  final String estado;
  final String tipo;
  final String? observaciones;

  CitasDoctor({
    this.id,
    this.idUsuario,
    this.usuario,
    this.doctor,
    this.historialMedico,
    this.orden,
    required this.fecha,
    required this.estado,
    required this.tipo,
    this.observaciones,
  });
  factory CitasDoctor.fromJson(Map<String, dynamic> json) {
    return CitasDoctor(
      id: json['id'] as int?,
      idUsuario: json['id_usuario'] as int?,
      orden: json['orden'] != null ? Orden.fromJson(json['orden']) : null,
      usuario: json['usuario'] != null
          ? Usuario.fromJson(json['usuario'])
          : null,
      doctor: json['doctor'] != null ? Doctor.fromJson(json['doctor']) : null,
      fecha: DateTime.parse(json['fecha']),
      estado: json['estado'] ?? '',
      tipo: json['tipo'] ?? '',
      observaciones: json['observaciones'],
      historialMedico:
          json['usuario'] != null && json['usuario']['historial_medico'] != null
          ? HistoriaClinica.fromJson(json['usuario']['historial_medico'])
          : null,
    );
  }
}
