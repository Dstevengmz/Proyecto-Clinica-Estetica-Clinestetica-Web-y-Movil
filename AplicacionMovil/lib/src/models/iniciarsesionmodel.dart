class Login {
  final String correo;
  final String contrasena;

  Login({required this.correo, required this.contrasena});

  Map<String, dynamic> toJson() {
    return {'correo': correo, 'contrasena': contrasena};
  }
}
