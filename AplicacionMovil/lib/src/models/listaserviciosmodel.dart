class Servicio {
  final int id;
  final String nombre;
  final String descripcion;
  final String duracion;
  final int precio;
  final String imagen;

  Servicio({
    required this.id,
    required this.nombre,
    required this.descripcion,
    required this.duracion,
    required this.precio,
    required this.imagen,
  });

  factory Servicio.fromJson(Map<String, dynamic> json) {
    return Servicio(
      id: json['id'],
      nombre: json['nombre'],
      descripcion: json['descripcion'],
      duracion: json['duracion'],
      precio: json['precio'],
      imagen: json['imagen'],
    );
  }
}
