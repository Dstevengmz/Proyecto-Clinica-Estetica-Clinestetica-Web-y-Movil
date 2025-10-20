import 'package:flutter/material.dart';

class MenuOption {
  final IconData icon;
  final String title;
  final String route;

  MenuOption({required this.icon, required this.title, required this.route});
}

class MenuHelper {
  static List<MenuOption> getMenuOptions(String? rol) {
    List<MenuOption> options = [
      MenuOption(
        icon: Icons.home,
        title: "Servicios",
        route: "/pantallaprincipal",
      ),
    ];

    if (rol == null) {
      options.add(
        MenuOption(icon: Icons.info, title: "Acerca de", route: "/acerca"),
      );
      options.add(
        MenuOption(
          icon: Icons.login,
          title: "Iniciar Sesión",
          route: "/iniciarsesion",
        ),
      );
    } else if (rol == "doctor") {
      options.add(
        MenuOption(
          icon: Icons.history,
          title: "Historial Clínico",
          route: "/historialclinico",
        ),
      );

      options.add(
        MenuOption(
          icon: Icons.dashboard,
          title: "Panel Doctor",
          route: "/doctorpanel",
        ),
      );
      options.add(
        MenuOption(
          icon: Icons.calendar_today,
          title: "Mis Citas",
          route: "/miscitasdoctor",
        ),
      );
      options.add(
        MenuOption(
          icon: Icons.notifications,
          title: "Notificaciones",
          route: "/notificaciones-doctor",
        ),
      );
    } else if (rol == "usuario") {
      options.add(
        MenuOption(
          icon: Icons.dashboard,
          title: "Panel Usuario",
          route: "/usuariopanel",
        ),
      );
      options.add(
        MenuOption(
          icon: Icons.dashboard,
          title: "Contacto",
          route: "/contacto",
        ),
      );
      options.add(
        MenuOption(icon: Icons.dashboard, title: "Perfil", route: "/perfil"),
      );
      options.add(
        MenuOption(
          icon: Icons.history,
          title: "Mi Historial Clínico",
          route: "/mihistorialclinico",
        ),
      );
      options.add(
        MenuOption(
          icon: Icons.dashboard,
          title: "Registrar Historial",
          route: "/registrarhistorialclinico",
        ),
      );

      options.add(
        MenuOption(
          icon: Icons.person,
          title: "Registrar Cita",
          route: "/registrarcita",
        ),
      );

      options.add(
        MenuOption(
          icon: Icons.dashboard,
          title: "Mis Citas",
          route: "/miscitasusuario",
        ),
      );
    } else if (rol == "asistente") {
      options.add(
        MenuOption(
          icon: Icons.assignment,
          title: "Gestión de Citas",
          route: "/gestionCitas",
        ),
      );
    }

    if (rol != null) {
      options.add(
        MenuOption(
          icon: Icons.logout,
          title: "Cerrar Sesión",
          route: "/logout",
        ),
      );
    }

    return options;
  }
}
