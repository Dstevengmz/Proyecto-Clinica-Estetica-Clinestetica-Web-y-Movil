import 'package:flutter/material.dart';
import '../controllers/registrarcontroller.dart';
import '../models/registrarusuariomodel.dart';
import '../enums/tipodocumento.dart';
import '../enums/genero.dart';
import '../utils/alertasutil.dart';
import 'package:go_router/go_router.dart';
import '../utils/validacionesregistro.dart';
import 'package:flutter/services.dart';
import 'package:google_sign_in/google_sign_in.dart';

class RegistrarUsuarioView extends StatefulWidget {
  const RegistrarUsuarioView({Key? key}) : super(key: key);

  @override
  State<RegistrarUsuarioView> createState() => _RegistrarUsuarioViewState();
}

class _RegistrarUsuarioViewState extends State<RegistrarUsuarioView> {
  final _formKey = GlobalKey<FormState>();
  final UsuarioController _controller = UsuarioController();
  final TextEditingController _nombreCtrl = TextEditingController();
  final TextEditingController _docCtrl = TextEditingController();
  final TextEditingController _correoCtrl = TextEditingController();
  final TextEditingController _passCtrl = TextEditingController();
  final TextEditingController _telCtrl = TextEditingController();

  TipoDocumento? _tipoDocumento;
  Genero? _genero;
  bool _terminos = false;

  bool _cargando = false;
  String _mensaje = "";

  // Configuración básica de Google Sign-In
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: [
      'email',
      // Otros scopes si los necesitas (normalmente no para registro básico)
    ],
  );

  Future<void> _rellenarConGoogle() async {
    setState(() => _mensaje = "");
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) {
        // Usuario canceló
        setState(() => _mensaje = "Acción cancelada.");
        return;
      }

      final displayName = account.displayName ?? '';
      final email = account.email;

      setState(() {
        if (displayName.isNotEmpty && _nombreCtrl.text.isEmpty) {
          _nombreCtrl.text = displayName;
        }
        if (email.isNotEmpty && _correoCtrl.text.isEmpty) {
          _correoCtrl.text = email;
        }
        _mensaje =
            "Datos de Google cargados. Completa el resto del formulario.";
      });
    } catch (e) {
      setState(() => _mensaje = "No se pudo conectar con Google: $e");
    }
  }

  Future<void> _registrarUsuario() async {
    if (_formKey.currentState!.validate()) {
      if (!_terminos) {
        setState(() => _mensaje = "Debes aceptar los términos y condiciones.");
        return;
      }

      final usuario = Registrar(
        id: 0,
        nombre: _nombreCtrl.text.trim(),
        tipodocumento: _tipoDocumento!,
        numerodocumento: _docCtrl.text.trim(),
        correo: _correoCtrl.text.trim(),
        contrasena: _passCtrl.text.trim(),
        telefono: _telCtrl.text.trim(),
        genero: _genero!,
        terminoscondiciones: _terminos,
      );

      setState(() => _cargando = true);
      final exito = await _controller.registrarUsuario(usuario);

      setState(() => _cargando = false);
      if (exito) {
        AlertasApp.mensajeConfirmacionCuenta(
          context,
          "Cuenta creada",
          "Tu cuenta se registró con éxito.",
          onAceptar: () {
            context.go('/iniciarsesion');
          },
        );
      } else {
        setState(() => _mensaje = "No se pudo registrar el usuario");
      }
    }
  }

  InputDecoration _inputDecoration(String label, {IconData? icon}) {
    return InputDecoration(
      labelText: label,
      prefixIcon: icon != null ? Icon(icon, color: Colors.green) : null,
      labelStyle: const TextStyle(color: Colors.black87),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.green, width: 2),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.black54, width: 1),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Registrar Usuario",
          style: TextStyle(color: Colors.black),
        ),
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Colors.green),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const Icon(Icons.person_add_alt_1, size: 80, color: Colors.green),
              const SizedBox(height: 20),
              const Text(
                "Crea tu cuenta en Clinestetica",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 30),

              TextFormField(
                controller: _nombreCtrl,
                decoration: _inputDecoration("Nombre", icon: Icons.person),
                validator: ValidacionesRegistro.validarNombre,
              ),
              const SizedBox(height: 16),

              DropdownButtonFormField<TipoDocumento>(
                value: _tipoDocumento,
                isExpanded: true,
                items: TipoDocumento.values.map((tipo) {
                  return DropdownMenuItem(
                    value: tipo,
                    child: Text(tipo.nombre),
                  );
                }).toList(),
                onChanged: (v) => setState(() => _tipoDocumento = v),
                decoration: _inputDecoration("Tipo de Documento"),
                validator: (v) => v == null ? "Seleccione un tipo" : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _docCtrl,
                decoration: _inputDecoration(
                  "Número de Documento",
                  icon: Icons.badge,
                ),
                keyboardType: TextInputType.number,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(10),
                  FilteringTextInputFormatter.digitsOnly,
                ],

                validator: ValidacionesRegistro.validarDocumento,
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _correoCtrl,
                decoration: _inputDecoration("Correo", icon: Icons.email),
                validator: ValidacionesRegistro.validarCorreo,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _passCtrl,
                decoration: _inputDecoration(
                  "Contraseña",
                  icon: Icons.lock_outline,
                ),
                obscureText: true,
                validator: ValidacionesRegistro.validarContrasena,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _telCtrl,
                decoration: _inputDecoration("Teléfono", icon: Icons.phone),
                keyboardType: TextInputType.number,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(12),
                  FilteringTextInputFormatter.digitsOnly,
                ],

                validator: ValidacionesRegistro.validarTelefono,
              ),

              const SizedBox(height: 16),

              DropdownButtonFormField<Genero>(
                value: _genero,
                items: Genero.values.map((g) {
                  return DropdownMenuItem(value: g, child: Text(g.nombre));
                }).toList(),
                onChanged: (v) => setState(() => _genero = v),
                decoration: _inputDecoration("Género"),
                validator: (v) => v == null ? "Seleccione un género" : null,
              ),
              const SizedBox(height: 16),

              CheckboxListTile(
                value: _terminos,
                onChanged: (v) => setState(() => _terminos = v ?? false),
                title: const Text("Acepto los términos y condiciones"),
                controlAffinity: ListTileControlAffinity.leading,
                activeColor: Colors.green,
              ),
              const SizedBox(height: 20),
              _cargando
                  ? const CircularProgressIndicator(color: Colors.green)
                  : SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            if (!_terminos) {
                              setState(
                                () => _mensaje =
                                    "Debes aceptar los términos y condiciones.",
                              );
                              return;
                            }
                            AlertasApp.mostrarMensajeConfirmacionCrearCuenta(
                              context,
                              "¿Estás seguro de crear la cuenta?",
                              onConfirmar: () async {
                                await _registrarUsuario();
                              },
                            );
                          }
                        },

                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          "Registrar",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
              const SizedBox(height: 12),
              // Botón Google: solo rellena, no registra automáticamente
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: _rellenarConGoogle,
                  icon: const Icon(Icons.account_circle, color: Colors.red),
                  label: const Text(
                    "Rellenar con Google",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    side: const BorderSide(color: Colors.red),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              if (_mensaje.isNotEmpty)
                Text(
                  _mensaje,
                  style: TextStyle(
                    color: _mensaje.contains("éxito")
                        ? Colors.green
                        : Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
