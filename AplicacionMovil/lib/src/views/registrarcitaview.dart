import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../controllers/registrarcitacontroller.dart';
import '../models/citamodel.dart';
import '../models/doctormodel.dart';
import '../widgets/leerrol.dart';
import '../utils/horariosdisponiblesutil.dart';
import '../utils/alertasutil.dart';
import '../services/carritoservice.dart';
import 'package:go_router/go_router.dart';

class CitaDataSource extends CalendarDataSource {
  CitaDataSource(List<Appointment> source) {
    appointments = source;
  }
}

class PerfilUsuarioView extends StatefulWidget {
  const PerfilUsuarioView({Key? key}) : super(key: key);

  @override
  State<PerfilUsuarioView> createState() => _PerfilUsuarioViewState();
}

class _PerfilUsuarioViewState extends State<PerfilUsuarioView> {
  final RegistrarCitaController _controller = RegistrarCitaController();

  late Future<CitaRegistrar> _futureUsuario;
  late Future<List<Doctor>> _futureDoctores;

  Doctor? _doctorSeleccionado;

  // Estado para citas del doctor (sin FutureBuilder)
  List<Appointment> _appointments = [];
  bool _cargandoCitas = false;
  String? _errorCitas;

  @override
  void initState() {
    super.initState();
    _futureUsuario = _controller.obtenerPerfilUsuario();
    _futureDoctores = _controller.obtenerDoctores();
  }

  Future<void> _cargarCitasDoctor(int doctorId) async {
    setState(() {
      _cargandoCitas = true;
      _errorCitas = null;
      _appointments = [];
    });

    try {
      final citas = await _controller.obtenerCitasDoctor(doctorId);

      final appts = citas
          .where((c) => c.fecha != null && c.fecha!.isNotEmpty)
          .map((cita) {
            final startLocal = DateTime.parse(cita.fecha!).toLocal();
            final endLocal = startLocal.add(const Duration(minutes: 30));

            return Appointment(
              startTime: startLocal,
              endTime: endLocal,
              subject: "🟥 Ocupado",
              color: Colors.red,
            );
          })
          .toList();

      if (!mounted) return;
      setState(() {
        _appointments = appts;
        _cargandoCitas = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorCitas = e.toString();
        _cargandoCitas = false;
      });
    }
  }

  void _seleccionarSlot(CalendarTapDetails details) async {
    final rootContext = context;
    if (_doctorSeleccionado == null) {
      AlertasApp.seleccioneDoctor(
        context,
        "Seleccione un doctor primero",
        () {},
      );
      return;
    }
    if (details.date == null) return;

    final DateTime startDate = details.date!;
    final DateTime endDate = startDate.add(const Duration(minutes: 30));
    final horaStr =
        '${startDate.hour.toString().padLeft(2, '0')}:${startDate.minute.toString().padLeft(2, '0')}';

    if (startDate.weekday == DateTime.sunday) {
      AlertasApp.noSePuedeCrearCitaLosDomingos(
        context,
        "No se pueden agendar citas los domingos",
        () {},
      );
      return;
    }

    //  Validar horario permitido
    if (!horariosDisponibles.contains(horaStr)) {
      AlertasApp.seleccioneHorarioValidos(context, "Horario no válido", () {});
      return;
    }

    //  Validar ocupación
    final ocupado = _appointments.any(
      (a) =>
          startDate.isAtSameMomentAs(a.startTime) ||
          (startDate.isAfter(a.startTime) && startDate.isBefore(a.endTime)),
    );
    if (ocupado) {
      AlertasApp.horarioOcupado(context, "Ese horario ya está ocupado", () {});
      return;
    }
    // Verificación: no permitir registrar cita si el carrito está vacío
    try {
      final items = await CarritoAPI.listarMiCarrito();
      if (items.isEmpty) {
        AlertasApp.citaCarritoVacio(
          rootContext,
          onIrServicios: () {
            // go_router: ir a servicios
            context.go('/pantallaprincipal');
          },
        );
        return;
      }
    } catch (e) {
      // Si falla la consulta del carrito, mostrar el error y abortar
      AlertasApp.mostrarError(
        rootContext,
        e.toString().replaceFirst('Exception: ', ''),
      );
      return;
    }

    AlertasApp.confirmarCita(
      rootContext,
      doctor: _doctorSeleccionado!.nombre,
      horario:
          "$horaStr - ${endDate.hour.toString().padLeft(2, '0')}:${endDate.minute.toString().padLeft(2, '0')}",
      tipo: "evaluacion",
      onConfirmar: () async {
        try {
          final prefs = await SharedPreferences.getInstance();
          final idStr = prefs.getString('id');
          final idUsuario = int.tryParse(idStr ?? '');
          if (idUsuario == null) {
            throw Exception('No se encontró el id del usuario');
          }

          await _controller.registrarCita(
            idUsuario: idUsuario,
            idDoctor: _doctorSeleccionado!.id,
            fecha: startDate,
          );

          if (!mounted) return;
          setState(() {
            _appointments.add(
              Appointment(
                startTime: startDate,
                endTime: endDate,
                subject: '🟩 Nueva cita',
                color: Colors.green,
              ),
            );
          });

          if (!mounted) return;
          ScaffoldMessenger.of(rootContext).showSnackBar(
            const SnackBar(content: Text(' Cita guardada exitosamente')),
          );

          _cargarCitasDoctor(_doctorSeleccionado!.id);
        } catch (e) {
          if (!mounted) return;
          final msg = e.toString().replaceFirst('Exception: ', '');
          AlertasApp.mostrarError(rootContext, msg);
        }
      },
    );
  }

  Widget _campoTexto(String label, String? valor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Text(valor?.isNotEmpty == true ? valor! : '—'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Perfil del Usuario',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Perfil usuario
            FutureBuilder<CitaRegistrar>(
              future: _futureUsuario,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                }
                final usuario = snapshot.data?.usuario;
                if (usuario == null) {
                  return const Text('No se encontró información del usuario');
                }
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Información del Usuario',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _campoTexto('Nombre', usuario.nombre),
                    _campoTexto('Correo', usuario.correo),
                    _campoTexto('Teléfono', usuario.telefono),
                    const SizedBox(height: 20),
                  ],
                );
              },
            ),

            // Doctores + Calendario
            const Text(
              'Seleccionar Doctor',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            FutureBuilder<List<Doctor>>(
              future: _futureDoctores,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                }
                final doctores = snapshot.data ?? [];
                if (doctores.isEmpty) {
                  return const Text('No hay doctores disponibles');
                }

                return Column(
                  children: [
                    DropdownButtonFormField<Doctor>(
                      initialValue: _doctorSeleccionado,
                      decoration: const InputDecoration(
                        labelText: 'Seleccione un doctor',
                        border: OutlineInputBorder(),
                      ),
                      items: doctores
                          .map(
                            (doc) => DropdownMenuItem<Doctor>(
                              value: doc,
                              child: Text(doc.nombre),
                            ),
                          )
                          .toList(),
                      onChanged: (doc) {
                        setState(() {
                          _doctorSeleccionado = doc;
                          _appointments = [];
                          _errorCitas = null;
                        });
                        if (doc != null) {
                          _cargarCitasDoctor(doc.id);
                        }
                      },
                    ),
                    const SizedBox(height: 20),

                    const Text(
                      'Seleccionar horario',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),

                    if (_cargandoCitas)
                      const Center(child: CircularProgressIndicator())
                    else if (_errorCitas != null)
                      Column(
                        children: [
                          Text(
                            'Error cargando citas: $_errorCitas',
                            style: const TextStyle(color: Colors.red),
                          ),
                          const SizedBox(height: 8),
                          ElevatedButton.icon(
                            onPressed: () {
                              final d = _doctorSeleccionado;
                              if (d != null) _cargarCitasDoctor(d.id);
                            },
                            icon: const Icon(Icons.refresh),
                            label: const Text('Reintentar'),
                          ),
                        ],
                      )
                    else
                      SizedBox(
                        height: 500,
                        child: SfCalendar(
                          view: CalendarView.week,
                          allowedViews: const [
                            CalendarView.day,
                            CalendarView.week,
                            CalendarView.month,
                          ],
                          initialDisplayDate: DateTime.now(),
                          dataSource: CitaDataSource(_appointments),

                          onTap: _seleccionarSlot,

                          timeSlotViewSettings: const TimeSlotViewSettings(
                            startHour: 8,
                            endHour: 18,
                            timeInterval: Duration(minutes: 30),
                          ),
                        ),
                      ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
