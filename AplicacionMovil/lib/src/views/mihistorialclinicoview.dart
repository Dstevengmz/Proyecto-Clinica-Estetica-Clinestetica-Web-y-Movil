import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../controllers/historiaclinicacontroller.dart';
import '../models/historiaclinicamodel.dart';
import '../widgets/leerrol.dart';

class MiHistorialClinicoView extends StatefulWidget {
  const MiHistorialClinicoView({super.key});

  @override
  State<MiHistorialClinicoView> createState() => _MiHistorialClinicoViewState();
}

class _MiHistorialClinicoViewState extends State<MiHistorialClinicoView> {
  final _controller = HistoriaClinicaController();
  late Future<HistoriaClinica?> _future;

  @override
  void initState() {
    super.initState();
    _future = _controller.obtenerMiHistoriaClinica();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Mi Historial Clínico',
      body: FutureBuilder<HistoriaClinica?>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _ErrorView(
              error: snapshot.error.toString(),
              onRetry: () => setState(
                () => _future = _controller.obtenerMiHistoriaClinica(),
              ),
            );
          }

          final historia = snapshot.data;
          if (historia == null) {
            return _EmptyHistory(
              onCreate: () => context.push('/registrarhistorialclinico'),
            );
          }

          return _HistoryDetails(
            historia: historia,
            onEdited: () => setState(
              () => _future = _controller.obtenerMiHistoriaClinica(),
            ),
          );
        },
      ),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _Section({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _KeyValue extends StatelessWidget {
  final String label;
  final String? value;
  const _KeyValue({required this.label, this.value});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: textTheme.bodyMedium?.copyWith(
                color: Colors.grey[700],
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            flex: 3,
            child: Text(
              (value == null || value!.isEmpty) ? '—' : value!,
              style: textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}

class _HistoryDetails extends StatelessWidget {
  final HistoriaClinica historia;
  final VoidCallback onEdited;
  const _HistoryDetails({required this.historia, required this.onEdited});

  String _boolToText(bool? v) => v == true
      ? 'Sí'
      : v == false
      ? 'No'
      : '—';

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(top: 8, bottom: 24),
      children: [
        _Section(
          title: 'Información General',
          children: [
            _KeyValue(
              label: 'Usuario',
              value: historia.usuario?.nombre ?? '#${historia.idUsuario}',
            ),
            _KeyValue(label: 'ID Historial', value: historia.id?.toString()),
          ],
        ),
        _Section(
          title: 'Antecedentes Médicos',
          children: [
            _KeyValue(label: 'Enfermedades', value: historia.enfermedades),
            _KeyValue(label: 'Alergias', value: historia.alergias),
            _KeyValue(
              label: 'Cirugías Previas',
              value: historia.cirugiasPrevias,
            ),
            _KeyValue(
              label: 'Otras Condiciones',
              value: historia.otrasCondiciones,
            ),
          ],
        ),
        _Section(
          title: 'Hábitos y Medicación',
          children: [
            _KeyValue(label: 'Medicación Actual', value: historia.medicamentos),
            _KeyValue(
              label: 'Tabaco',
              value: _boolToText(historia.consumeTabaco),
            ),
            _KeyValue(
              label: 'Alcohol',
              value: _boolToText(historia.consumeAlcohol),
            ),
          ],
        ),
        _Section(
          title: 'Condiciones Específicas',
          children: [
            _KeyValue(
              label: 'Condiciones de Piel',
              value: historia.condicionesPiel,
            ),
            _KeyValue(
              label: 'Embarazo/Lactancia',
              value: _boolToText(historia.embarazoLactancia),
            ),
            _KeyValue(label: 'Diabetes', value: _boolToText(historia.diabetes)),
            _KeyValue(
              label: 'Hipertensión',
              value: _boolToText(historia.hipertension),
            ),
            _KeyValue(
              label: 'Historial de Cáncer',
              value: _boolToText(historia.historialCancer),
            ),
            _KeyValue(
              label: 'Problemas de Coagulación',
              value: _boolToText(historia.problemasCoagulacion),
            ),
            _KeyValue(
              label: 'Epilepsia',
              value: _boolToText(historia.epilepsia),
            ),
          ],
        ),
        if (historia.usaAnticonceptivos == true ||
            (historia.detallesAnticonceptivos?.isNotEmpty ?? false))
          _Section(
            title: 'Anticonceptivos',
            children: [
              _KeyValue(
                label: 'Uso',
                value: _boolToText(historia.usaAnticonceptivos),
              ),
              _KeyValue(
                label: 'Detalles',
                value: historia.detallesAnticonceptivos,
              ),
            ],
          ),
        const SizedBox(height: 8),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: () async {
                final result = await context.push(
                  '/historial/editar',
                  extra: historia,
                );
                if (result == true) {
                  onEdited();
                }
              },
              icon: const Icon(Icons.edit_outlined),
              label: const Text('Editar historial'),
            ),
          ),
        ),
      ],
    );
  }
}

class _EmptyHistory extends StatelessWidget {
  final VoidCallback onCreate;
  const _EmptyHistory({required this.onCreate});

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
              'Aún no tienes un historial clínico',
              style: Theme.of(context).textTheme.titleMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Registra tu información médica para una mejor atención y seguimiento.',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: Colors.grey[700]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onCreate,
              icon: const Icon(Icons.add_circle_outline),
              label: const Text('Crear historial clínico'),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  final String error;
  final VoidCallback onRetry;
  const _ErrorView({required this.error, required this.onRetry});

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
