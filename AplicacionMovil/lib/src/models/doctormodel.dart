class Doctor {
  final int id;
  final String nombre;
  final String especialidad;
  Doctor({required this.id, required this.nombre, required this.especialidad});

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id'] ?? 0,
      nombre: json['nombre'] ?? '',
      especialidad: json['ocupacion'] ?? '',
    );
  }
}
