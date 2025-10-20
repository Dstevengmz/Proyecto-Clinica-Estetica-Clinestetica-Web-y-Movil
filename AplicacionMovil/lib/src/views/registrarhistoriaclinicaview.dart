import 'package:flutter/material.dart';
import '../controllers/historiaclinicacontroller.dart';
import '../models/historiaclinicamodel.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
import '../widgets/leerrol.dart';
import '../utils/alertasutil.dart';

class CrearHistorialView extends StatefulWidget {
  const CrearHistorialView({super.key, this.existing, this.soloCrear = false});

  final HistoriaClinica? existing;
  // Cuando es true, esta vista se comporta 100% como "Registrar" (no prellenar ni editar)
  final bool soloCrear;

  @override
  State<CrearHistorialView> createState() => _CrearHistorialViewState();
}

class _CrearHistorialViewState extends State<CrearHistorialView> {
  final _formKey = GlobalKey<FormState>();
  final _controller = HistoriaClinicaController();
  bool _authChecked = false;
  HistoriaClinica? _existing;

  // Campos
  final _enfermedadesCtrl = TextEditingController();
  final _alergiasCtrl = TextEditingController();
  final _cirugiasCtrl = TextEditingController();
  final _condicionesPielCtrl = TextEditingController();
  final _medicamentosCtrl = TextEditingController();
  final _detallesAnticonceptivosCtrl = TextEditingController();
  final _otrasCondicionesCtrl = TextEditingController();

  // Booleans
  final embarazoLactanciaVN = ValueNotifier<bool>(false);
  final tabacoVN = ValueNotifier<bool>(false);
  final alcoholVN = ValueNotifier<bool>(false);
  final usaAnticonceptivosVN = ValueNotifier<bool>(false);
  final diabetesVN = ValueNotifier<bool>(false);
  final hipertensionVN = ValueNotifier<bool>(false);
  final historialCancerVN = ValueNotifier<bool>(false);
  final problemasCoagulacionVN = ValueNotifier<bool>(false);
  final epilepsiaVN = ValueNotifier<bool>(false);

  bool enviando = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(() async {
      _existing = widget.soloCrear ? null : widget.existing;
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      int? idUsuario;
      final idStr = prefs.getString('id');
      if (idStr != null) {
        idUsuario = int.tryParse(idStr);
      } else {
        idUsuario = prefs.getInt('id');
      }

      final loggedIn = token != null && token.isNotEmpty && idUsuario != null;
      if (!mounted) return;
      if (!loggedIn) {
        context.go('/iniciarsesion');
        return;
      }

      // Crear-only: no prellenar ni cargar historial
      if (!widget.soloCrear && _existing != null) {
        final h = _existing!;
        _enfermedadesCtrl.text = h.enfermedades ?? '';
        _alergiasCtrl.text = h.alergias ?? '';
        _cirugiasCtrl.text = h.cirugiasPrevias ?? '';
        _condicionesPielCtrl.text = h.condicionesPiel ?? '';
        _medicamentosCtrl.text = h.medicamentos ?? '';
        _detallesAnticonceptivosCtrl.text = h.detallesAnticonceptivos ?? '';
        _otrasCondicionesCtrl.text = h.otrasCondiciones ?? '';
        embarazoLactanciaVN.value = h.embarazoLactancia ?? false;
        tabacoVN.value = h.consumeTabaco ?? false;
        alcoholVN.value = h.consumeAlcohol ?? false;
        usaAnticonceptivosVN.value = h.usaAnticonceptivos ?? false;
        diabetesVN.value = h.diabetes ?? false;
        hipertensionVN.value = h.hipertension ?? false;
        historialCancerVN.value = h.historialCancer ?? false;
        problemasCoagulacionVN.value = h.problemasCoagulacion ?? false;
        epilepsiaVN.value = h.epilepsia ?? false;
      }

      setState(() => _authChecked = true);
    });
  }

  Future<void> _guardarHistorial() async {
    if (!_formKey.currentState!.validate()) return;

    _mostrarLoading(context);

    try {
      // Si estamos en modo "solo crear", validamos que no exista ya
      if (widget.soloCrear) {
        final yaExiste = await _controller.verificarHistorialUsuario();
        if (yaExiste) {
          if (!mounted) return;
          Navigator.of(context, rootNavigator: true).pop();
          if (!mounted) return;
          AlertasApp.mostrarError(
            context,
            'Ya tienes un historial médico registrado',
          );
          return;
        }
      }

      final prefs = await SharedPreferences.getInstance();
      final idStr = prefs.getString('id');
      final idUsuario = int.tryParse(idStr ?? '') ?? prefs.getInt('id');

      if (idUsuario == null) {
        if (!mounted) return;
        Navigator.of(context, rootNavigator: true).pop();
        if (!mounted) return;
        AlertasApp.mostrarError(
          context,
          'No se encontró el usuario autenticado',
        );
        return;
      }

      final payload = HistoriaClinica(
        id: _existing?.id ?? 0,
        idUsuario: _existing?.idUsuario ?? idUsuario,
        enfermedades: _enfermedadesCtrl.text,
        alergias: _alergiasCtrl.text,
        cirugiasPrevias: _cirugiasCtrl.text,
        condicionesPiel: _condicionesPielCtrl.text,
        embarazoLactancia: embarazoLactanciaVN.value,
        medicamentos: _medicamentosCtrl.text,
        consumeTabaco: tabacoVN.value,
        consumeAlcohol: alcoholVN.value,
        usaAnticonceptivos: usaAnticonceptivosVN.value,
        detallesAnticonceptivos: _detallesAnticonceptivosCtrl.text,
        diabetes: diabetesVN.value,
        hipertension: hipertensionVN.value,
        historialCancer: historialCancerVN.value,
        problemasCoagulacion: problemasCoagulacionVN.value,
        epilepsia: epilepsiaVN.value,
        otrasCondiciones: _otrasCondicionesCtrl.text,
      );

      final editando =
          !widget.soloCrear && _existing != null && (_existing!.id ?? 0) > 0;
      if (editando) {
        await _controller.actualizarHistoria(payload);
      } else {
        await _controller.crearHistoria(payload);
      }

      if (!mounted) return;
      Navigator.of(context, rootNavigator: true).pop();
      if (!mounted) return;
      final mensajeExito = editando
          ? 'Historial médico actualizado correctamente '
          : 'Historial médico guardado correctamente ';
      AlertasApp.exitoCrearHistorial(context, mensajeExito, () {
        if (editando) {
          // Volver a la pantalla anterior informando que hubo cambios
          if (mounted) Navigator.of(context).pop(true);
        } else {
          // En creación, redirigir a Mi Historial
          if (mounted) context.go('/mihistorialclinico');
        }
      });
    } catch (e) {
      if (!mounted) return;
      Navigator.of(context, rootNavigator: true).pop();

      final mensaje = e.toString();
      if (mensaje.contains(
        "El usuario ya tiene un historial médico registrado",
      )) {
        if (!mounted) return;
        AlertasApp.mostrarError(
          context,
          "Ya tienes un historial médico registrado ",
        );
      } else {
        if (!mounted) return;
        AlertasApp.mostrarError(
          context,
          "Error al guardar historial: $mensaje",
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_authChecked) {
      return const Center(child: CircularProgressIndicator());
    }

    final modoEdicion = !widget.soloCrear && widget.existing != null;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Enfermedades"),
            TextFormField(
              controller: _enfermedadesCtrl,
              decoration: const InputDecoration(
                hintText: "Ingrese enfermedades",
              ),
            ),
            const SizedBox(height: 12),

            const Text("Alergias"),
            TextFormField(
              controller: _alergiasCtrl,
              decoration: const InputDecoration(hintText: "Ingrese alergias"),
            ),
            const SizedBox(height: 12),

            const Text("Cirugías previas"),
            TextFormField(
              controller: _cirugiasCtrl,
              decoration: const InputDecoration(
                hintText: "Ej: Apendicectomía, cesárea...",
              ),
            ),
            const SizedBox(height: 12),

            const Text("Condiciones de la piel"),
            TextFormField(
              controller: _condicionesPielCtrl,
              decoration: const InputDecoration(
                hintText: "Ej: Acné, psoriasis...",
              ),
            ),
            const SizedBox(height: 12),

            const Text("Medicamentos actuales"),
            TextFormField(
              controller: _medicamentosCtrl,
              decoration: const InputDecoration(
                hintText: "Ingrese medicamentos",
              ),
            ),
            const SizedBox(height: 12),
            ValueListenableBuilder<bool>(
              valueListenable: embarazoLactanciaVN,
              builder: (context, value, _) => SwitchListTile(
                title: const Text("Embarazo o lactancia"),
                value: value,
                onChanged: (val) => embarazoLactanciaVN.value = val,
              ),
            ),
            ValueListenableBuilder<bool>(
              valueListenable: tabacoVN,
              builder: (context, value, _) => SwitchListTile(
                title: const Text("Consume tabaco"),
                value: value,
                onChanged: (val) => tabacoVN.value = val,
              ),
            ),
            ValueListenableBuilder<bool>(
              valueListenable: alcoholVN,
              builder: (context, value, _) => SwitchListTile(
                title: const Text("Consume alcohol"),
                value: value,
                onChanged: (val) => alcoholVN.value = val,
              ),
            ),
            ValueListenableBuilder<bool>(
              valueListenable: usaAnticonceptivosVN,
              builder: (context, usaAnticonceptivos, _) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SwitchListTile(
                    title: const Text("Usa anticonceptivos"),
                    value: usaAnticonceptivos,
                    onChanged: (val) => usaAnticonceptivosVN.value = val,
                  ),
                  if (usaAnticonceptivos)
                    TextFormField(
                      controller: _detallesAnticonceptivosCtrl,
                      decoration: const InputDecoration(
                        labelText: "Detalles de anticonceptivos",
                      ),
                    ),
                ],
              ),
            ),
            ValueListenableBuilder<bool>(
              valueListenable: diabetesVN,
              builder: (context, value, _) => SwitchListTile(
                title: const Text("Diabetes"),
                value: value,
                onChanged: (val) => diabetesVN.value = val,
              ),
            ),
            ValueListenableBuilder<bool>(
              valueListenable: hipertensionVN,
              builder: (context, value, _) => SwitchListTile(
                title: const Text("Hipertensión"),
                value: value,
                onChanged: (val) => hipertensionVN.value = val,
              ),
            ),
            ValueListenableBuilder<bool>(
              valueListenable: historialCancerVN,
              builder: (context, value, _) => SwitchListTile(
                title: const Text("Historial de cáncer"),
                value: value,
                onChanged: (val) => historialCancerVN.value = val,
              ),
            ),
            ValueListenableBuilder<bool>(
              valueListenable: problemasCoagulacionVN,
              builder: (context, value, _) => SwitchListTile(
                title: const Text("Problemas de coagulación"),
                value: value,
                onChanged: (val) => problemasCoagulacionVN.value = val,
              ),
            ),
            ValueListenableBuilder<bool>(
              valueListenable: epilepsiaVN,
              builder: (context, value, _) => SwitchListTile(
                title: const Text("Epilepsia"),
                value: value,
                onChanged: (val) => epilepsiaVN.value = val,
              ),
            ),
            const SizedBox(height: 12),

            const Text("Otras condiciones"),
            TextFormField(
              controller: _otrasCondicionesCtrl,
              decoration: const InputDecoration(hintText: "Especifique"),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: _guardarHistorial,
                icon: const Icon(Icons.save_outlined),
                label: Text(
                  modoEdicion ? 'Guardar cambios' : 'Guardar historial',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    // Dispose ValueNotifiers
    embarazoLactanciaVN.dispose();
    tabacoVN.dispose();
    alcoholVN.dispose();
    usaAnticonceptivosVN.dispose();
    diabetesVN.dispose();
    hipertensionVN.dispose();
    historialCancerVN.dispose();
    problemasCoagulacionVN.dispose();
    epilepsiaVN.dispose();

    // Dispose controllers
    _enfermedadesCtrl.dispose();
    _alergiasCtrl.dispose();
    _cirugiasCtrl.dispose();
    _condicionesPielCtrl.dispose();
    _medicamentosCtrl.dispose();
    _detallesAnticonceptivosCtrl.dispose();
    _otrasCondicionesCtrl.dispose();
    super.dispose();
  }
}

void _mostrarLoading(BuildContext context) {
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (context) {
      return const Center(child: CircularProgressIndicator());
    },
  );
}

/// Pantalla de Registrar Historial (solo crea) con AppScaffold.
class RegistrarHistorialScreen extends StatelessWidget {
  const RegistrarHistorialScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppScaffold(
      title: 'Registrar Historial',
      body: CrearHistorialView(soloCrear: true),
    );
  }
}

/// Pantalla de Editar Historial con AppScaffold.
class EditarHistorialScreen extends StatelessWidget {
  final HistoriaClinica historia;
  const EditarHistorialScreen({super.key, required this.historia});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Editar Historial Médico',
      body: CrearHistorialView(existing: historia),
    );
  }
}
