import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../controllers/notificacioncontroller.dart';
import '../models/notificacionmode.dart';
import '../widgets/leerrol.dart';

class NotificacionesView extends StatefulWidget {
  const NotificacionesView({super.key});

  @override
  State<NotificacionesView> createState() => _NotificacionesViewState();
}

class _NotificacionesViewState extends State<NotificacionesView> {
  final _controller = NotificacionesController();
  Future<List<Notificacion>>? _futureNotificaciones;
  int? _idUsuario;

  @override
  void initState() {
    super.initState();
    _cargarIdYDatos();
  }

  Future<void> _cargarIdYDatos() async {
    final prefs = await SharedPreferences.getInstance();
    final idStr = prefs.getString('id');
    final idUsuario = int.tryParse(idStr ?? '') ?? prefs.getInt('id');
    setState(() {
      _idUsuario = idUsuario;
      if (idUsuario != null) {
        _futureNotificaciones = _controller.obtenerNotificaciones(idUsuario);
      }
    });
  }

  Future<void> _recargar() async {
    if (_idUsuario == null) return;
    setState(() {
      _futureNotificaciones = _controller.obtenerNotificaciones(_idUsuario!);
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
                    physics: const AlwaysScrollableScrollPhysics(),
                    itemCount: notificaciones.length,
                    itemBuilder: (context, index) {
                      final n = notificaciones[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        elevation: 3,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: ListTile(
                          leading: Icon(
                            n.leida
                                ? Icons.notifications_none
                                : Icons.notifications_active,
                            color: n.leida
                                ? Colors.grey
                                : Theme.of(context).colorScheme.primary,
                            size: 28,
                          ),
                          title: Text(
                            n.titulo,
                            style: TextStyle(
                              fontWeight: n.leida
                                  ? FontWeight.normal
                                  : FontWeight.bold,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),
                              Text(n.mensaje),
                              const SizedBox(height: 6),
                              Text(
                                formatter.format(n.fecha),
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                          onTap: () async {
                            if (_idUsuario == null) return;
                            await _controller.marcarNotificacionLeida(
                              _idUsuario!,
                              n.id,
                            );
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  "Notificación '${n.titulo}' marcada como leída",
                                ),
                                duration: const Duration(seconds: 2),
                              ),
                            );
                            _recargar();
                          },
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
