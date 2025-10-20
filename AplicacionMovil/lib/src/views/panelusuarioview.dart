import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/leerrol.dart';
import '../services/citasusuarioservice.dart';
import '../controllers/notificacioncontroller.dart';

class UserDashboard extends StatefulWidget {
  const UserDashboard({Key? key}) : super(key: key);

  @override
  State<UserDashboard> createState() => _UserDashboardState();
}

class _UserDashboardState extends State<UserDashboard> {
  late final Future<int> _futureCitasCount;
  late final Future<int> _futureNotificacionesCount;
  final NotificacionesController _notificacionesController =
      NotificacionesController();

  @override
  void initState() {
    super.initState();
    _futureCitasCount = CitasUsuarioAPI.obtenerCitas()
        .then((list) => list.length)
        .catchError((_) => 0);

    _futureNotificacionesCount = _getNotificacionesCount();
  }

  Future<int> _getNotificacionesCount() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final idStr = prefs.getString('id');
      final idUsuario = int.tryParse(idStr ?? '') ?? prefs.getInt('id');

      if (idUsuario == null || idUsuario == 0) {
        return 0;
      }

      return await _notificacionesController.contarNotificacionesNoLeidas(
        idUsuario,
      );
    } catch (e) {
      return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<_DashboardItem> items = [
      _DashboardItem(
        Icons.calendar_month,
        "Mis Citas",
        0,
        Colors.green,
        '/miscitasusuario',
        countFuture: _futureCitasCount,
      ),
      _DashboardItem(
        Icons.receipt_long,
        "Mi Historial Clínico",
        1,
        Colors.green,
        '/mihistorialclinico',
      ),
      _DashboardItem(
        Icons.notifications_active,
        "Notificaciones",
        0, // valor base, se sobrescribirá con countFuture
        Colors.red,
        '/notificaciones',
        countFuture: _futureNotificacionesCount,
      ),
      _DashboardItem(
        Icons.account_circle,
        "Mi Perfil",
        0,
        Colors.purple,
        '/perfil',
      ),
      _DashboardItem(Icons.help_outline, "Ayuda", 0, Colors.teal, '/contacto'),
    ];

    return AppScaffold(
      title: 'Panel Usuario',
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
            itemBuilder: (context, index) {
              final item = items[index];
              return _DashboardCard(item: item);
            },
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
  final String route;
  final Future<int>? countFuture;

  _DashboardItem(
    this.icon,
    this.title,
    this.count,
    this.color,
    this.route, {
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
          //  Navegación usando GoRouter
          context.go(item.route);
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
