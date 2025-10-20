import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../controllers/notificacioncontroller.dart';
import '../models/notificacionmode.dart';
import '../widgets/leerrol.dart';

class NotificacionesDoctorView extends StatefulWidget {
  const NotificacionesDoctorView({super.key});

  @override
  State<NotificacionesDoctorView> createState() =>
      _NotificacionesDoctorViewState();
}

class _NotificacionesDoctorViewState extends State<NotificacionesDoctorView> {
  final _controller = NotificacionesController();
  Future<List<Notificacion>>? _futureNotificaciones;
  int? _idDoctor;

  @override
  void initState() {
    super.initState();
    _cargarIdYDatos();
  }

  Future<void> _cargarIdYDatos() async {
    final prefs = await SharedPreferences.getInstance();
    final idStr = prefs.getString('id');
    final idDoctor = int.tryParse(idStr ?? '') ?? prefs.getInt('id');
    setState(() {
      _idDoctor = idDoctor;
      if (idDoctor != null) {
        _futureNotificaciones = _controller.obtenerNotificacionesDoctor(
          idDoctor,
        );
      }
    });
  }

  Future<void> _recargar() async {
    if (_idDoctor == null) return;
    setState(() {
      _futureNotificaciones = _controller.obtenerNotificacionesDoctor(
        _idDoctor!,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final formatter = DateFormat('dd/MM/yyyy HH:mm');

    return AppScaffold(
      title: 'Mis Notificaciones',
      body: _futureNotificaciones == null
          ? const Center(child: CircularProgressIndicator())
          : FutureBuilder<List<Notificacion>>(
              future: _futureNotificaciones,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      "Error: ${snapshot.error}",
                      style: const TextStyle(color: Colors.red),
                    ),
                  );
                }

                final notificaciones = snapshot.data ?? [];

                if (notificaciones.isEmpty) {
                  return const Center(child: Text("No tienes notificaciones"));
                }

                return RefreshIndicator(
                  onRefresh: _recargar,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: notificaciones.length,
                    itemBuilder: (context, index) {
                      final notificacion = notificaciones[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        elevation: notificacion.leida ? 1 : 4,
                        color: notificacion.leida
                            ? Colors.grey[100]
                            : Colors.white,
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: notificacion.leida
                                ? Colors.grey
                                : Colors.blue,
                            child: Icon(
                              notificacion.leida
                                  ? Icons.mark_email_read
                                  : Icons.notifications,
                              color: Colors.white,
                            ),
                          ),
                          title: Text(
                            notificacion.titulo,
                            style: TextStyle(
                              fontWeight: notificacion.leida
                                  ? FontWeight.normal
                                  : FontWeight.bold,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                notificacion.mensaje,
                                style: TextStyle(
                                  color: notificacion.leida
                                      ? Colors.grey[600]
                                      : Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                formatter.format(notificacion.fecha),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[500],
                                ),
                              ),
                            ],
                          ),
                          trailing: !notificacion.leida
                              ? IconButton(
                                  icon: const Icon(Icons.mark_email_read),
                                  onPressed: () async {
                                    if (_idDoctor == null) return;
                                    try {
                                      await _controller
                                          .marcarNotificacionLeidaDoctor(
                                            _idDoctor!,
                                            notificacion.id,
                                          );
                                      _recargar();
                                    } catch (e) {
                                      if (mounted) {
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          SnackBar(
                                            content: Text("Error: $e"),
                                            backgroundColor: Colors.red,
                                          ),
                                        );
                                      }
                                    }
                                  },
                                )
                              : null,
                          isThreeLine: true,
                        ),
                      );
                    },
                  ),
                );
              },
            ),
    );
  }
}
