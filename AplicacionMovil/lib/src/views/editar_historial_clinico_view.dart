import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../controllers/historiaclinicacontroller.dart';
import '../models/historiaclinicamodel.dart';
import '../widgets/leerrol.dart';
import 'registrarhistoriaclinicaview.dart';

/// Vista dedicada para editar el historial clínico.
///
/// Reutiliza el formulario existente (`CrearHistorialView`) pasando
/// la entidad a editar. Si no se proporciona por ruta, intenta cargar
/// el historial del usuario autenticado.
class EditarHistorialClinicoView extends StatefulWidget {
  const EditarHistorialClinicoView({super.key, this.existing});

  final HistoriaClinica? existing;

  @override
  State<EditarHistorialClinicoView> createState() =>
      _EditarHistorialClinicoViewState();
}

class _EditarHistorialClinicoViewState
    extends State<EditarHistorialClinicoView> {
  final _controller = HistoriaClinicaController();
  late Future<HistoriaClinica?> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.existing != null
        ? Future<HistoriaClinica?>.value(widget.existing)
        : _controller.obtenerMiHistoriaClinica();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Editar Historial Médico',
      enableDrawer: false,
      body: FutureBuilder<HistoriaClinica?>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _Error(
              error: snapshot.error.toString(),
              onRetry: () {
                setState(() {
                  _future = _controller.obtenerMiHistoriaClinica();
                });
              },
            );
          }

          final historia = snapshot.data;
          if (historia == null) {
            // No hay historial para editar. Sugerir crearlo.
            return _Empty(
              onCreate: () => context.push('/registrarhistorialclinico'),
            );
          }

          // Reutilizamos el formulario existente en modo edición.
          return CrearHistorialView(existing: historia);
        },
      ),
    );
  }
}

class _Empty extends StatelessWidget {
  final VoidCallback onCreate;
  const _Empty({required this.onCreate});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.description_outlined,
              size: 64,
              color: Colors.grey,
            ),
            const SizedBox(height: 12),
            Text(
              'No tienes un historial para editar',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Crea tu historial clínico para poder editarlo después.',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: Colors.grey[700]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onCreate,
              icon: const Icon(Icons.add_circle_outline),
              label: const Text('Crear historial'),
            ),
          ],
        ),
      ),
    );
  }
}

class _Error extends StatelessWidget {
  final String error;
  final VoidCallback onRetry;
  const _Error({required this.error, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.redAccent),
            const SizedBox(height: 12),
            Text(
              'Ocurrió un error',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              error,
              style: Theme.of(
                context,
              ).textTheme.bodySmall?.copyWith(color: Colors.grey[700]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }
}
