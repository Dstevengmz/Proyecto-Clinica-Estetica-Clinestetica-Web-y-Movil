import 'package:flutter/material.dart';
import './src/widgets/leerrol.dart';
import './src/views/listaserviciosview.dart';

class PantallaPrincipal extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AppScaffold(title: 'Servicios', body: PantallaServicios());
  }
}
