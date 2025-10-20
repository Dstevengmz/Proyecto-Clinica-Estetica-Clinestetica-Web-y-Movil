import 'package:flutter/material.dart';

import '../controllers/usuariocontroller.dart';
import '../models/usuariomodel.dart';
import '../utils/alertasutil.dart';
import '../utils/validacionesregistro.dart';
import '../widgets/leerrol.dart';

class EditarPerfilView extends StatefulWidget {
  final Usuario? existing;
  const EditarPerfilView({super.key, this.existing});

  @override
  State<EditarPerfilView> createState() => _EditarPerfilViewState();
}

class _EditarPerfilViewState extends State<EditarPerfilView> {
  final _formKey = GlobalKey<FormState>();
  final _controller = UsuarioPerfilController();

  final _nombreCtrl = TextEditingController();
  final _correoCtrl = TextEditingController();
  final _docCtrl = TextEditingController();
  final _telCtrl = TextEditingController();
  final _direccionCtrl = TextEditingController();
  final _fechaNacCtrl = TextEditingController();
  final _ocupacionCtrl = TextEditingController();
  final _estadoCivilCtrl = TextEditingController();

  String? _tipoDocSel;
  String? _generoSel;
  bool _terminos = false;

  final List<String> _tiposDocumento = const [
    'Cédula de Ciudadanía',
    'Pasaporte',
    'Documento de Identificación Extranjero',
    'Permiso Especial de Permanencia',
  ];

  final List<String> _generos = const ['Masculino', 'Femenino', 'Otro'];

  @override
  void initState() {
    super.initState();
    final u = widget.existing;
    if (u != null) {
      _nombreCtrl.text = u.nombre ?? '';
      _correoCtrl.text = u.correo ?? '';
      _tipoDocSel = u.tipodocumento?.isNotEmpty == true
          ? u.tipodocumento
          : null;
      _docCtrl.text = u.numerodocumento ?? '';
      _telCtrl.text = u.telefono ?? '';
      _generoSel = u.genero?.isNotEmpty == true ? u.genero : null;
      _direccionCtrl.text = u.direccion ?? '';
      _fechaNacCtrl.text = u.fechaNacimiento ?? '';
      _ocupacionCtrl.text = u.ocupacion ?? '';
      _estadoCivilCtrl.text = u.estadoCivil ?? '';
      _terminos = u.terminosCondiciones ?? _terminos;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Editar Perfil',
      enableDrawer: false,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nombreCtrl,
                decoration: const InputDecoration(labelText: 'Nombre'),
                validator: ValidacionesRegistro.validarNombre,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _correoCtrl,
                decoration: const InputDecoration(labelText: 'Correo'),
                validator: (v) =>
                    v != null && v.contains('@') ? null : 'Correo inválido',
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _tipoDocSel,
                isExpanded: true,
                items: _tiposDocumento
                    .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                    .toList(),
                onChanged: (v) => setState(() => _tipoDocSel = v),
                decoration: const InputDecoration(
                  labelText: 'Tipo de documento',
                ),
                validator: (v) => v == null || v.isEmpty
                    ? 'Seleccione un tipo de documento'
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _docCtrl,
                decoration: const InputDecoration(labelText: 'Documento'),
                keyboardType: TextInputType.number,
                maxLength: 10,
                validator: ValidacionesRegistro.validarDocumento,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _telCtrl,
                decoration: const InputDecoration(labelText: 'Teléfono'),
                keyboardType: TextInputType.number,
                maxLength: 12,
                validator: ValidacionesRegistro.validarTelefono,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _generoSel,
                isExpanded: true,
                items: _generos
                    .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                    .toList(),
                onChanged: (v) => setState(() => _generoSel = v),
                decoration: const InputDecoration(labelText: 'Género'),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _direccionCtrl,
                decoration: const InputDecoration(labelText: 'Dirección'),
              ),
              const SizedBox(height: 16),
              GestureDetector(
                onTap: () async {
                  final now = DateTime.now();
                  final initial = _fechaNacCtrl.text.isNotEmpty
                      ? DateTime.tryParse(_fechaNacCtrl.text) ??
                            DateTime(now.year - 18, now.month, now.day)
                      : DateTime(now.year - 18, now.month, now.day);
                  final picked = await showDatePicker(
                    context: context,
                    firstDate: DateTime(1900),
                    lastDate: now,
                    initialDate: initial,
                  );
                  if (picked != null) {
                    setState(() {
                      _fechaNacCtrl.text = picked
                          .toIso8601String()
                          .split('T')
                          .first;
                    });
                  }
                },
                child: AbsorbPointer(
                  child: TextFormField(
                    controller: _fechaNacCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fecha de nacimiento',
                      hintText: 'YYYY-MM-DD',
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _ocupacionCtrl,
                decoration: const InputDecoration(labelText: 'Ocupación'),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _estadoCivilCtrl,
                decoration: const InputDecoration(labelText: 'Estado civil'),
              ),
              const SizedBox(height: 8),
              if (!_terminos)
                CheckboxListTile(
                  value: _terminos,
                  onChanged: (v) => setState(() => _terminos = v ?? false),
                  title: const Text('Acepto términos y condiciones'),
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: _guardar,
                  icon: const Icon(Icons.save_outlined),
                  label: const Text('Guardar cambios'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _guardar() async {
    if (!_formKey.currentState!.validate()) return;
    final payload = Usuario(
      nombre: _nombreCtrl.text.trim(),
      correo: _correoCtrl.text.trim(),
      tipodocumento: _tipoDocSel?.trim(),
      numerodocumento: _docCtrl.text.trim(),
      rol: widget.existing?.rol,
      telefono: _telCtrl.text.trim(),
      genero: _generoSel?.trim(),
      direccion: _direccionCtrl.text.trim().isEmpty
          ? null
          : _direccionCtrl.text.trim(),
      fechaNacimiento: _fechaNacCtrl.text.trim().isEmpty
          ? null
          : _fechaNacCtrl.text.trim(),
      ocupacion: _ocupacionCtrl.text.trim().isEmpty
          ? null
          : _ocupacionCtrl.text.trim(),
      estadoCivil: _estadoCivilCtrl.text.trim().isEmpty
          ? null
          : _estadoCivilCtrl.text.trim(),
      terminosCondiciones: _terminos,
    );
    try {
      await _controller.actualizarMiPerfil(payload);
      if (!mounted) return;
      AlertasApp.exitoCrearHistorial(
        context,
        'Perfil actualizado correctamente ',
        () => Navigator.of(context).pop(true),
      );
    } catch (e) {
      if (!mounted) return;
      AlertasApp.mostrarError(context, 'Error al actualizar perfil: $e');
    }
  }
}
