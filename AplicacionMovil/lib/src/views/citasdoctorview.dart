import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../services/citasdoctorservice.dart';
import '../models/citasdoctormodel.dart';
import '../widgets/leerrol.dart';
import 'package:go_router/go_router.dart';
import '../helpers/fechahelper.dart';

class ListarCitasDoctor extends StatefulWidget {
  const ListarCitasDoctor({Key? key}) : super(key: key);

  @override
  State<ListarCitasDoctor> createState() => _ListarCitasDoctorState();
}

class _ListarCitasDoctorState extends State<ListarCitasDoctor> {
  late Future<List<CitasDoctor>> _future;
  late Map<DateTime, List<CitasDoctor>> _citasPorFecha;
  late DateTime _selectedDay;
  late DateTime _focusedDay;

  DateTime _soloFecha(DateTime dt) => DateTime(dt.year, dt.month, dt.day);

  @override
  void initState() {
    super.initState();
    _future = CitasDoctorAPI.obtenerCitas();
    _selectedDay = DateTime.now();
    _focusedDay = DateTime.now();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: "Citas de Doctor",
      body: FutureBuilder<List<CitasDoctor>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error, color: Colors.red, size: 48),
                    const SizedBox(height: 12),
                    Text('Error: ${snapshot.error}'),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () => setState(() {
                        _future = CitasDoctorAPI.obtenerCitas();
                      }),
                      icon: const Icon(Icons.refresh),
                      label: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            );
          }

          final lista = snapshot.data ?? [];
          if (lista.isEmpty) {
            return const Center(child: Text('No tienes citas programadas'));
          }

          _citasPorFecha = {};
          for (var cita in lista) {
            final fechaKey = _soloFecha(cita.fecha);
            _citasPorFecha.putIfAbsent(fechaKey, () => []);
            _citasPorFecha[fechaKey]!.add(cita);
          }

          final diaKey = _soloFecha(_selectedDay);
          final citasDelDia = _citasPorFecha[diaKey] ?? [];

          return Column(
            children: [
              TableCalendar(
                locale: 'es_CO',
                firstDay: DateTime.utc(2020, 1, 1),
                lastDay: DateTime.utc(2030, 12, 31),
                focusedDay: _focusedDay,
                selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                onDaySelected: (selectedDay, focusedDay) {
                  setState(() {
                    _selectedDay = selectedDay;
                    _focusedDay = focusedDay;
                  });
                },
                onPageChanged: (focusedDay) {
                  _focusedDay = focusedDay;
                },
                eventLoader: (day) {
                  return _citasPorFecha[_soloFecha(day)] ?? [];
                },

                calendarBuilders: CalendarBuilders(
                  markerBuilder: (context, day, events) {
                    if (events.isNotEmpty) {
                      return Positioned(
                        right: 1,
                        bottom: 1,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.blueAccent,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${events.length}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      );
                    }
                    return null;
                  },
                ),
              ),

              Expanded(
                child: ListView.builder(
                  itemCount: citasDelDia.length,
                  itemBuilder: (context, index) {
                    final cita = citasDelDia[index];
                    final fechaFormateada = FechaHelper.formatFecha(cita.fecha);
                    final horaFormateada = FechaHelper.formatHora(cita.fecha);

                    return Card(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: () =>
                            context.push('/detallescitasdoctor', extra: cita),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Nombre Usuario: ${cita.usuario?.nombre ?? '#${cita.idUsuario}'}',
                              ),
                              const SizedBox(height: 8),
                              Text(
                                "Doctor: ${cita.doctor?.nombre ?? 'Sin asignar'}",
                              ),
                              const SizedBox(height: 8),
                              Text('Fecha de Cita: $fechaFormateada'),
                              const SizedBox(height: 8),
                              Text('Hora: $horaFormateada'),
                              const SizedBox(height: 8),
                              Text('Tipo de Cita: ${cita.tipo}'),
                              const SizedBox(height: 8),
                              Text('Estado: ${cita.estado}'),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
