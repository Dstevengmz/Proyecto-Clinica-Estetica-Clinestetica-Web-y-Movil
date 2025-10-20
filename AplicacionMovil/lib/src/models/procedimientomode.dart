class Procedimiento {
  final int id;
  final String nombre;
  final String descripcion;
  final double precio;
  final String? imagen;

  Procedimiento({
    required this.id,
    required this.nombre,
    required this.descripcion,
    required this.precio,
    this.imagen,
  });

  factory Procedimiento.fromJson(Map<String, dynamic> json) {
    return Procedimiento(
      id: json['id'] ?? 0,
      nombre: json['nombre'] ?? '',
      descripcion: json['descripcion'] ?? '',
      precio: (json['precio'] as num?)?.toDouble() ?? 0.0,
      imagen:
          (json['imagen'] ??
                  json['imagen_url'] ??
                  json['imagenUrl'] ??
                  json['image'])
              as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nombre': nombre,
      'descripcion': descripcion,
      'precio': precio,
      if (imagen != null) 'imagen': imagen,
    };
  }
}
