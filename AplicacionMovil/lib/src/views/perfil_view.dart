import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../controllers/usuariocontroller.dart';
import '../models/usuariomodel.dart';
import '../widgets/leerrol.dart';

class PerfilView extends StatefulWidget {
  const PerfilView({super.key});

  @override
  State<PerfilView> createState() => _PerfilViewState();
}

class _PerfilViewState extends State<PerfilView> {
  final _controller = UsuarioPerfilController();
  late Future<Usuario?> _future;

  @override
  void initState() {
    super.initState();
    _future = _controller.obtenerMiPerfil();
  }

  void _recargarPerfil() {
    print(' Recargando perfil...');
    setState(() {
      _future = _controller.obtenerMiPerfil();
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Mi Perfil',
      body: FutureBuilder<Usuario?>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final usuario = snapshot.data;
          if (usuario == null) {
            return const Center(
              child: Text('No se encontraron datos de perfil'),
            );
          }
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _item('Nombre', usuario.nombre),
              _item('Correo', usuario.correo),
              _item('Tipo documento', usuario.tipodocumento),
              _item('Documento', usuario.numerodocumento),
              _item('Teléfono', usuario.telefono),
              _item('Género', usuario.genero),
              _item('Dirección', usuario.direccion),
              _item('Fecha de nacimiento', usuario.fechaNacimiento),
              _item('Ocupación', usuario.ocupacion),
              _item('Estado civil', usuario.estadoCivil),
              ListTile(
                title: const Text('Términos y condiciones'),
                subtitle: Text(
                  (usuario.terminosCondiciones ?? false) ? 'Sí' : 'No',
                ),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: () async {
                  print('📝 Navegando a editar perfil...');
                  await context.push('/perfil/editar', extra: usuario);
                  print('🔙 Regresó de editar, recargando perfil...');
                  _recargarPerfil();
                },
                icon: const Icon(Icons.edit_outlined),
                label: const Text('Editar perfil'),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _item(String label, String? value) {
    return ListTile(
      title: Text(label),
      subtitle: Text(value == null || value.isEmpty ? '—' : value),
    );
  }
}
