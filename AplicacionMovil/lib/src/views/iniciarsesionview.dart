import 'package:flutter/material.dart';
import '../controllers/iniciarsesioncontroller.dart';
import '../models/iniciarsesionmodel.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/alertasutil.dart';
import '../widgets/leerrol.dart';

class LoginView extends StatefulWidget {
  const LoginView({Key? key}) : super(key: key);

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _formKey = GlobalKey<FormState>();
  final LoginController _controller = LoginController();

  final TextEditingController _correoCtrl = TextEditingController();
  final TextEditingController _passCtrl = TextEditingController();

  bool _cargando = false;

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      final login = Login(
        correo: _correoCtrl.text.trim(),
        contrasena: _passCtrl.text.trim(),
      );

      setState(() => _cargando = true);
      final respuesta = await _controller.loginUsuario(login);

      if (!mounted) return;
      setState(() => _cargando = false);

      if (respuesta.contains("exitoso")) {
        final prefs = await SharedPreferences.getInstance();
        final rol = prefs.getString("rol");

        AlertasApp.inicioSesionExitoso(context, respuesta, () {
          if (rol == "doctor") {
            context.go('/doctorpanel');
          } else if (rol == "usuario") {
            context.go('/usuariopanel');
          } else {
            context.go('/pantallaprincipal');
          }
        });
      } else {
        AlertasApp.mostrarError(context, respuesta);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: "Iniciar Sesión",
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Image.asset('assets/icon/icon.png', width: 90, height: 90),
              const SizedBox(height: 16),
              const Text(
                "Bienvenido a Clinestetica",
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30),

              // Campo Correo
              TextFormField(
                controller: _correoCtrl,
                decoration: InputDecoration(
                  labelText: "Correo",
                  prefixIcon: const Icon(
                    Icons.email_outlined,
                    color: Colors.green,
                  ),
                  labelStyle: const TextStyle(color: Colors.black),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.green, width: 2),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(
                      color: Colors.black54,
                      width: 1,
                    ),
                  ),
                ),
                validator: (v) => (v != null && v.contains("@"))
                    ? null
                    : "Ingrese un correo válido",
              ),
              const SizedBox(height: 16),

              // Campo Contraseña
              TextFormField(
                controller: _passCtrl,
                decoration: InputDecoration(
                  labelText: "Contraseña",
                  prefixIcon: const Icon(
                    Icons.lock_outline,
                    color: Colors.green,
                  ),
                  labelStyle: const TextStyle(color: Colors.black),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.green, width: 2),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(
                      color: Colors.black54,
                      width: 1,
                    ),
                  ),
                ),
                obscureText: true,
                validator: (v) =>
                    (v != null && v.length >= 6) ? null : "Mínimo 6 caracteres",
              ),
              const SizedBox(height: 24),

              // Botón principal
              _cargando
                  ? const CircularProgressIndicator(color: Colors.green)
                  : SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: _login,
                        child: const Text(
                          "Iniciar Sesión",
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
              const SizedBox(height: 20),

              // Botón de registro
              TextButton(
                onPressed: () {
                  context.push('/registrarusuario');
                },
                child: const Text(
                  "¿No tienes cuenta? Regístrate",
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.green,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              Row(
                children: const [
                  Expanded(child: Divider(thickness: 1)),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8),
                    child: Text("O continúa con"),
                  ),
                  Expanded(child: Divider(thickness: 1)),
                ],
              ),
              const SizedBox(height: 20),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildSocialButton(
                    icon: Icons.g_mobiledata,
                    label: "Google",
                    color: Colors.red,
                    onTap: () {},
                  ),
                  const SizedBox(width: 16),
                  _buildSocialButton(
                    icon: Icons.facebook,
                    label: "Facebook",
                    color: Theme.of(context).colorScheme.primary,
                    onTap: () {},
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        icon: Icon(icon, color: Colors.white),
        label: Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        onPressed: onTap,
      ),
    );
  }
}
