import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../helpers/menulateralhelper.dart';
import '../services/cerrarsesionservice.dart';
import '../utils/alertasutil.dart';

class MenuLateral extends StatelessWidget {
  final String? rol;
  final String? nombre;
  final String? correo;
  const MenuLateral({super.key, this.rol, this.nombre, this.correo});
  @override
  Widget build(BuildContext context) {
    final options = MenuHelper.getMenuOptions(rol);

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.asset(
                    'assets/icon/icon.png',
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Clinestetica',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        "Rol: ${rol ?? "Invitado"}",
                        style: const TextStyle(color: Colors.white70),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        "Nombre: ${nombre ?? "—"}",
                        style: const TextStyle(color: Colors.white70),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        "Correo: ${correo ?? "—"}",
                        style: const TextStyle(color: Colors.white70),
                        overflow: TextOverflow.ellipsis,
                        maxLines: 1,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          ...options.map(
            (opt) => ListTile(
              leading: Icon(opt.icon),
              title: Text(opt.title),
              onTap: () async {
                if (opt.route == "/logout") {
                  AlertasApp.confirmarCerrarSesion(
                    context,
                    onConfirmar: () async {
                      await AuthService.logout();
                      if (!context.mounted) return;
                      // Navegación condicional:
                      // - Si ya estamos en /pantallaprincipal, vamos a /iniciarsesion
                      // - Desde cualquier otra ruta, redirigimos a /pantallaprincipal
                      final current = GoRouter.of(
                        context,
                      ).routeInformationProvider.value.uri.path;
                      final isHome =
                          current == "/pantallaprincipal" || current == "/";
                      final target = isHome
                          ? "/iniciarsesion"
                          : "/pantallaprincipal";
                      context.go(target);
                    },
                  );
                } else {
                  context.go(opt.route);
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
