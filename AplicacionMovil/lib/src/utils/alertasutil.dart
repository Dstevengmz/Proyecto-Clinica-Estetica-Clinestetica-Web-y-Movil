import 'package:flutter/material.dart';
import 'package:rflutter_alert/rflutter_alert.dart';

class AlertasApp {
  static void inicioSesionExitoso(
    BuildContext context,
    String mensaje,
    VoidCallback onConfirm,
  ) {
    Alert(
      context: context,
      type: AlertType.success,
      title: "Éxito",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "OK",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () {
            if (Navigator.of(context, rootNavigator: true).canPop()) {
              Navigator.of(context, rootNavigator: true).pop();
            } else {
              Navigator.pop(context);
            }

            Future.microtask(onConfirm);
          },
        ),
      ],
    ).show();
  }

  static void mostrarError(BuildContext context, String mensaje) {
    Alert(
      context: context,
      type: AlertType.error,
      title: "Error",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "Cerrar",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () => Navigator.pop(context),
        ),
      ],
    ).show();
  }

  static void mostrarMensajeConfirmacionCrearCuenta(
    BuildContext context,
    String mensaje, {
    required VoidCallback onConfirmar,
  }) {
    Alert(
      context: context,
      type: AlertType.warning,
      title: "Estás a punto de crear una cuenta",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "CANCELAR",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => Navigator.pop(context),
          color: const Color.fromRGBO(0, 179, 134, 1.0),
        ),
        DialogButton(
          child: const Text(
            "ACEPTAR",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () {
            Navigator.pop(context);
            onConfirmar();
          },
          gradient: const LinearGradient(
            colors: [
              Color.fromRGBO(116, 116, 191, 1.0),
              Color.fromRGBO(52, 138, 199, 1.0),
            ],
          ),
        ),
      ],
    ).show();
  }

  static void mensajeConfirmacionCuenta(
    BuildContext context,
    String titulo,
    String mensaje, {
    VoidCallback? onAceptar,
  }) {
    Alert(
      context: context,
      type: AlertType.success,
      title: titulo,
      desc: mensaje,
      image: Image.asset("assets/success.png"),
      buttons: [
        DialogButton(
          child: const Text(
            "Aceptar",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () {
            Navigator.of(context, rootNavigator: true).pop();
            Future.microtask(() {
              if (onAceptar != null) onAceptar();
            });
          },
          color: Colors.green,
        ),
      ],
    ).show();
  }

  static void agregarAlCarrito(
    BuildContext context,
    String mensaje,
    VoidCallback onConfirm,
  ) {
    Alert(
      context: context,
      type: AlertType.success,
      title: "Éxito",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "OK",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () {
            Navigator.pop(context);
            onConfirm();
          },
        ),
      ],
    ).show();
  }

  static void errorAgregarAlCarrito(BuildContext context, String mensaje) {
    Alert(
      context: context,
      type: AlertType.error,
      title: "Error",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "Cerrar",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () => Navigator.pop(context),
        ),
      ],
    ).show();
  }

  static void confirmarEliminarDelCarrito(
    BuildContext context, {
    required VoidCallback onConfirmar,
  }) {
    Alert(
      context: context,
      type: AlertType.warning,
      title: "Eliminar del carrito",
      desc: "¿Seguro que deseas eliminar este servicio del carrito?",
      buttons: [
        DialogButton(
          child: const Text(
            "CANCELAR",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => Navigator.pop(context),
          color: const Color.fromRGBO(0, 179, 134, 1.0),
        ),
        DialogButton(
          child: const Text(
            "ELIMINAR",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () {
            if (Navigator.of(context, rootNavigator: true).canPop()) {
              Navigator.of(context, rootNavigator: true).pop();
            }
            onConfirmar();
          },
          color: Colors.red,
        ),
      ],
    ).show();
  }

  static void confirmarCerrarSesion(
    BuildContext context, {
    required VoidCallback onConfirmar,
  }) {
    Alert(
      context: context,
      type: AlertType.warning,
      title: "Cerrar sesión",
      desc: "¿Seguro que deseas cerrar tu sesión?",
      buttons: [
        DialogButton(
          child: const Text(
            "CANCELAR",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
          color: const Color.fromRGBO(0, 179, 134, 1.0),
        ),
        DialogButton(
          child: const Text(
            "CERRAR SESIÓN",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () {
            Navigator.of(context, rootNavigator: true).pop();
            onConfirmar();
          },
          color: Colors.red,
        ),
      ],
    ).show();
  }

  static void exitoCrearHistorial(
    BuildContext context,
    String mensaje,
    VoidCallback onConfirm,
  ) {
    Alert(
      context: context,
      type: AlertType.success,
      title: "Éxito",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "OK",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () {
            Navigator.pop(context);
            onConfirm();
          },
        ),
      ],
    ).show();
  }

  static void noSePuedeCrearCitaLosDomingos(
    BuildContext context,
    String mensaje,
    VoidCallback onConfirm,
  ) {
    Alert(
      context: context,
      type: AlertType.error,
      title: "Error",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "OK",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () {
            Navigator.pop(context);
            onConfirm();
          },
        ),
      ],
    ).show();
  }

  static void seleccioneHorarioValidos(
    BuildContext context,
    String mensaje,
    VoidCallback onConfirm,
  ) {
    Alert(
      context: context,
      type: AlertType.error,
      title: "Error",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "OK",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () {
            Navigator.pop(context);
            onConfirm();
          },
        ),
      ],
    ).show();
  }

  static void horarioOcupado(
    BuildContext context,
    String mensaje,
    VoidCallback onConfirm,
  ) {
    Alert(
      context: context,
      type: AlertType.error,
      title: "Error",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "OK",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () {
            Navigator.pop(context);
            onConfirm();
          },
        ),
      ],
    ).show();
  }

  static void seleccioneDoctor(
    BuildContext context,
    String mensaje,
    VoidCallback onConfirm,
  ) {
    Alert(
      context: context,
      type: AlertType.error,
      title: "Error",
      desc: mensaje,
      buttons: [
        DialogButton(
          child: const Text(
            "OK",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          onPressed: () {
            Navigator.pop(context);
            onConfirm();
          },
        ),
      ],
    ).show();
  }

  // Alerta con dos botones cuando el carrito está vacío y se intenta registrar una cita
  static void citaCarritoVacio(
    BuildContext context, {
    required VoidCallback onIrServicios,
  }) {
    Alert(
      context: context,
      type: AlertType.warning,
      title: "No puedes registrar una cita",
      desc: "No puedes registrar una cita sin haber seleccionado un servicio.",
      buttons: [
        DialogButton(
          child: const Text(
            "CANCELAR",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
          color: Colors.grey,
        ),
        DialogButton(
          child: const Text(
            "IR A SERVICIOS",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () {
            Navigator.of(context, rootNavigator: true).pop();
            onIrServicios();
          },
          color: Colors.green,
        ),
      ],
    ).show();
  }

  static void confirmarCita(
    BuildContext context, {
    required String doctor,
    required String horario,
    required String tipo,
    required Future<void> Function() onConfirmar,
  }) {
    Alert(
      context: context,
      type: AlertType.warning,
      title: "Confirmar cita",
      desc: "Doctor: $doctor\nHorario: $horario\nTipo: $tipo",
      buttons: [
        DialogButton(
          child: const Text(
            "CANCELAR",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => Navigator.pop(context),
          color: const Color.fromRGBO(0, 179, 134, 1.0),
        ),
        DialogButton(
          child: const Text(
            "GUARDAR",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () async {
            Navigator.pop(context);
            await onConfirmar();
          },
          gradient: const LinearGradient(
            colors: [
              Color.fromRGBO(116, 116, 191, 1.0),
              Color.fromRGBO(52, 138, 199, 1.0),
            ],
          ),
        ),
      ],
    ).show();
  }
}
