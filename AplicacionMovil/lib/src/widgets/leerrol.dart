import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
import 'package:clinica_app/src/services/carritoservice.dart';
import 'menulateral.dart';
import 'package:clinica_app/src/services/notificacionservice.dart';
import 'package:clinica_app/src/models/notificacionmode.dart';

class AppScaffold extends StatelessWidget {
  final String title;
  final Widget body;
  final bool enableDrawer;

  const AppScaffold({
    super.key,
    required this.title,
    required this.body,
    this.enableDrawer = true,
  });

  Future<Map<String, String?>> _getRol() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      "rol": prefs.getString("rol"),
      "nombre": prefs.getString("nombre"),
      "correo": prefs.getString("correo"),
    };
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, String?>>(
      future: _getRol(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final userInfo = snapshot.data;
        return Scaffold(
          appBar: AppBar(
            title: Text(title),
            actions: [
              //  Notificaciones
              FutureBuilder<int>(
                future: _getUnreadNotificationsCount(),
                builder: (context, notifSnap) {
                  final unread = notifSnap.data ?? 0;
                  if (unread < 0) return const SizedBox.shrink();
                  return Stack(
                    clipBehavior: Clip.none,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.notifications_none_outlined),
                        onPressed: () async {
                          final prefs = await SharedPreferences.getInstance();
                          final token = prefs.getString('token');
                          final loggedIn = token != null && token.isNotEmpty;
                          if (!loggedIn) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Debes iniciar sesión para ver notificaciones',
                                ),
                              ),
                            );
                            context.go('/iniciarsesion');
                          } else {
                            final rol = prefs.getString('rol');
                            if (rol == 'doctor') {
                              context.go('/notificaciones-doctor');
                            } else {
                              context.go('/notificaciones');
                            }
                          }
                        },
                      ),
                      if (unread > 0)
                        Positioned(
                          right: 6,
                          top: 6,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              color: Colors.redAccent,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            constraints: const BoxConstraints(
                              minWidth: 18,
                              minHeight: 18,
                            ),
                            child: Center(
                              child: Text(
                                unread > 99 ? '99+' : '$unread',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  );
                },
              ),
              FutureBuilder<int>(
                future: _getCartCount(),
                builder: (context, countSnap) {
                  final count = countSnap.data ?? 0;
                  return Stack(
                    clipBehavior: Clip.none,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.shopping_cart_outlined),
                        onPressed: () async {
                          final prefs = await SharedPreferences.getInstance();
                          final token = prefs.getString('token');
                          final loggedIn = token != null && token.isNotEmpty;
                          if (!loggedIn) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Debes iniciar sesión para acceder al carrito',
                                ),
                              ),
                            );
                            context.go('/iniciarsesion');
                          } else {
                            context.go('/carrito');
                          }
                        },
                      ),
                      if (count > 0)
                        Positioned(
                          right: 6,
                          top: 6,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              color: Colors.redAccent,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            constraints: const BoxConstraints(
                              minWidth: 18,
                              minHeight: 18,
                            ),
                            child: Center(
                              child: Text(
                                count > 99 ? '99+' : '$count',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  );
                },
              ),
            ],
            automaticallyImplyLeading: true,
          ),
          drawer: enableDrawer
              ? MenuLateral(
                  rol: userInfo?["rol"],
                  nombre: userInfo?["nombre"],
                  correo: userInfo?["correo"],
                )
              : null,
          body: body,
        );
      },
    );
  }
}

Future<int> _getCartCount() async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');
  if (token == null || token.isEmpty) return 0;
  try {
    final items = await CarritoAPI.listarMiCarrito();
    return items.length;
  } catch (_) {
    return 0;
  }
}

Future<int> _getUnreadNotificationsCount() async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');
  if (token == null || token.isEmpty)
    return -1; // ocultar icono si no está logueado

  // Obtener ID y rol del usuario desde prefs
  final idStr = prefs.getString('id');
  final id = int.tryParse(idStr ?? '') ?? prefs.getInt('id');
  final rol = prefs.getString('rol');

  if (id == null) return -1;

  try {
    List<Notificacion> list;

    if (rol == 'doctor') {
      // Si es doctor, usar el servicio para doctores
      list = await NotificacionesService.listarNotificacionesDoctor(id);
    } else {
      // Si es usuario, usar el servicio para usuarios
      list = await NotificacionesService.listarNotificacionesUsuario(id);
    }

    return list.where((n) => !n.leida).length;
  } catch (_) {
    return 0; // error silencioso, mostrar icono sin badge
  }
}
