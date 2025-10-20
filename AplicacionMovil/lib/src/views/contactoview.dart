import 'package:flutter/material.dart';
import '../controllers/contactocontroller.dart';
import '../widgets/leerrol.dart';

class ContactoView extends StatefulWidget {
  const ContactoView({super.key});

  @override
  State<ContactoView> createState() => _ContactoViewState();
}

class _ContactoViewState extends State<ContactoView> {
  final _formKey = GlobalKey<FormState>();
  final _controller = ContactoController();

  final _nombreCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _asuntoCtrl = TextEditingController();
  final _mensajeCtrl = TextEditingController();

  bool _cargando = false;

  Future<void> _enviar() async {
    if (!_formKey.currentState!.validate()) return;

    FocusScope.of(context).unfocus();
    setState(() => _cargando = true);

    try {
      await _controller.enviarMensaje(
        nombre: _nombreCtrl.text.trim(),
        email: _emailCtrl.text.trim(),
        asunto: _asuntoCtrl.text.trim(),
        mensaje: _mensajeCtrl.text.trim(),
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            " Mensaje enviado correctamente",
            style: TextStyle(fontWeight: FontWeight.w500),
          ),
          backgroundColor: Theme.of(context).colorScheme.primary,
          duration: const Duration(seconds: 3),
        ),
      );

      _formKey.currentState!.reset();
      _nombreCtrl.clear();
      _emailCtrl.clear();
      _asuntoCtrl.clear();
      _mensajeCtrl.clear();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString(),
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
          backgroundColor: Colors.redAccent,
          duration: const Duration(seconds: 4),
        ),
      );
    } finally {
      setState(() => _cargando = false);
    }
  }

  InputDecoration _inputDecoration(String label, {IconData? icon}) {
    final theme = Theme.of(context);
    return InputDecoration(
      labelText: label,
      prefixIcon: icon != null
          ? Icon(icon, color: theme.colorScheme.primary)
          : null,
      filled: true,
      fillColor: Colors.grey.shade50,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: theme.colorScheme.primary, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppScaffold(
      title: 'Contáctanos',
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Form(
                  key: _formKey,
                  child: ListView(
                    shrinkWrap: true,
                    children: [
                      Text(
                        "Envíanos tu mensaje",
                        textAlign: TextAlign.center,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _nombreCtrl,
                        decoration: _inputDecoration(
                          "Nombre",
                          icon: Icons.person,
                        ),
                        validator: (v) => v!.trim().isEmpty
                            ? 'El nombre es obligatorio'
                            : null,
                      ),
                      const SizedBox(height: 15),

                      TextFormField(
                        controller: _emailCtrl,
                        keyboardType: TextInputType.emailAddress,
                        decoration: _inputDecoration(
                          "Correo electrónico",
                          icon: Icons.email,
                        ),
                        validator: (v) {
                          if (v == null || v.isEmpty) {
                            return 'El email es obligatorio';
                          }
                          if (!RegExp(
                            r'^[^\s@]+@[^\s@]+\.[^\s@]+$',
                          ).hasMatch(v)) {
                            return 'Email inválido';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 15),

                      TextFormField(
                        controller: _asuntoCtrl,
                        decoration: _inputDecoration(
                          "Asunto (opcional)",
                          icon: Icons.subject,
                        ),
                      ),
                      const SizedBox(height: 15),

                      TextFormField(
                        controller: _mensajeCtrl,
                        maxLines: 6,
                        decoration: _inputDecoration(
                          "Mensaje",
                          icon: Icons.message,
                        ),
                        validator: (v) => v!.trim().isEmpty
                            ? 'El mensaje es obligatorio'
                            : null,
                      ),
                      const SizedBox(height: 25),

                      SizedBox(
                        height: 50,
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          icon: _cargando
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Icon(Icons.send),
                          label: Text(
                            _cargando ? "Enviando..." : "Enviar",
                            style: const TextStyle(fontSize: 16),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: theme.colorScheme.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          onPressed: _cargando ? null : _enviar,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
