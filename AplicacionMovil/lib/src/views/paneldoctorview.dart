import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/leerrol.dart';
import 'package:go_router/go_router.dart';
import '../controllers/notificacioncontroller.dart';
import '../controllers/historiaclinicacontroller.dart';
import '../controllers/usuariocontroller.dart';
import '../controllers/citasdoctorcontroller.dart';

class DoctorDashboard extends StatefulWidget {
  const DoctorDashboard({Key? key}) : super(key: key);

  @override
  State<DoctorDashboard> createState() => _DoctorDashboardState();
}

class _DoctorDashboardState extends State<DoctorDashboard> {
  late final Future<int> _futureNotificacionesCount;
  late final Future<int> _futureHistorialCount;
  late final Future<int> _futurePacientesCount;
  late final Future<int> _futureCitasHoyCount;
  final NotificacionesController _notificacionesController =
      NotificacionesController();
  final HistoriaClinicaController _historiaController =
      HistoriaClinicaController();
  final UsuarioPerfilController _usuarioController = UsuarioPerfilController();
  final CitasDoctorController _citasController = CitasDoctorController();

  @override
  void initState() {
    super.initState();
    _futureNotificacionesCount = _getNotificacionesCount();
    _futureHistorialCount = _getHistorialCount();
    _futurePacientesCount = _getPacientesCount();
    _futureCitasHoyCount = _getCitasHoyCount();
  }

  Future<int> _getNotificacionesCount() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final idStr = prefs.getString('id');
      final idDoctor = int.tryParse(idStr ?? '') ?? prefs.getInt('id');

      if (idDoctor == null || idDoctor == 0) {
        return 0;
      }

      return await _notificacionesController.contarNotificacionesNoLeidasDoctor(
        idDoctor,
      );
    } catch (e) {
      return 0;
    }
  }

  Future<int> _getHistorialCount() async {
    try {
      final historiales = await _historiaController.listarHistorias();
      return historiales.length;
    } catch (e) {
      return 0;
    }
  }

  Future<int> _getPacientesCount() async {
    try {
      final usuarios = await _usuarioController.obtenerListaUsuarios();
      final pacientes = usuarios
          .where(
            (u) =>
                u.rol?.toLowerCase() == 'usuario' ||
                u.rol?.toLowerCase() == 'paciente',
          )
          .toList();
      return pacientes.length;
    } catch (e) {
      return 0;
    }
  }

  Future<int> _getCitasHoyCount() async {
    try {
      return await _citasController.contarCitasDeHoy();
    } catch (e) {
      return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<_DashboardItem> items = [
      _DashboardItem(
        Icons.calendar_today,
        "Citas Hoy",
        0,
        Colors.green,
        countFuture: _futureCitasHoyCount,
      ),
      _DashboardItem(
        Icons.person,
        "Pacientes",
        0,
        Colors.teal,
        countFuture: _futurePacientesCount,
      ),
      _DashboardItem(
        Icons.medical_information,
        "Historial Clínico",
        0,
        Colors.orange,
        countFuture: _futureHistorialCount,
      ),
      _DashboardItem(
        Icons.notifications,
        "Notificaciones",
        0,
        Colors.redAccent,
        countFuture: _futureNotificacionesCount,
      ),
      _DashboardItem(Icons.account_circle, "Perfil", 0, Colors.blue),
    ];

    return AppScaffold(
      title: "Panel Doctor",
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const AlwaysScrollableScrollPhysics(),
            itemCount: items.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 1,
            ),
            itemBuilder: (context, index) => _DashboardCard(item: items[index]),
          ),
        ),
      ),
    );
  }
}

class _DashboardItem {
  final IconData icon;
  final String title;
  final int count;
  final Color color;
  final Future<int>? countFuture;

  _DashboardItem(
    this.icon,
    this.title,
    this.count,
    this.color, {
    this.countFuture,
  });
}

class _DashboardCard extends StatelessWidget {
  final _DashboardItem item;
  const _DashboardCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: () {
          if (item.title == "Citas Hoy") {
            context.push('/miscitasdoctor');
          } else if (item.title == "Pacientes") {
            context.push('/lista-usuarios');
          } else if (item.title == "Notificaciones") {
            context.push('/notificaciones-doctor');
          } else if (item.title == "Historial Clínico") {
            context.push('/historialclinico');
          } else if (item.title == "Perfil") {
            context.push('/perfil');
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Presionaste "${item.title}"')),
            );
          }
        },

        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              colors: [
                item.color.withValues(alpha: 0.8),
                item.color.withValues(alpha: 0.5),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(item.icon, size: 40, color: Colors.white),
              const SizedBox(height: 12),
              Flexible(
                child: Text(
                  item.title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ),
              const SizedBox(height: 6),
              if (item.countFuture != null)
                FutureBuilder<int>(
                  future: item.countFuture,
                  builder: (context, snapshot) {
                    final count = snapshot.data ?? 0;
                    if (count <= 0) return const SizedBox.shrink();
                    return Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        count.toString(),
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    );
                  },
                )
              else if (item.count > 0)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    item.count.toString(),
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
