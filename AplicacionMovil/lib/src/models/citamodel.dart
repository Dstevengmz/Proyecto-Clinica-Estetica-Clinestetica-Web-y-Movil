import 'package:clinica_app/src/models/doctormodel.dart';

import 'usuariomodel.dart';

class CitaRegistrar {
  final String? fecha;
  final Usuario? usuario;
  final Doctor? doctor;

  CitaRegistrar({this.fecha, this.usuario, this.doctor});

  factory CitaRegistrar.fromJson(Map<String, dynamic> json) {
    return CitaRegistrar(
      fecha: json['fecha'],
      usuario: json['usuario'] != null
          ? Usuario.fromJson(json['usuario'])
          : null,
      doctor: json['doctor'] != null ? Doctor.fromJson(json['doctor']) : null,
    );
  }
}
