import 'package:flutter/material.dart';
import '../models/citasusuariomodel.dart';

class DetallesCitaUsuario extends StatelessWidget {
  final Citas citas;
  const DetallesCitaUsuario({super.key, required this.citas});

  Widget _campoTexto(String label, String? valor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Text(valor?.isNotEmpty == true ? valor! : '—'),
          ),
        ],
      ),
    );
  }

  Widget _checkboxDato(String label, bool? valor) {
    return Row(
      children: [
        Icon(
          valor == true ? Icons.check_box : Icons.check_box_outline_blank,
          color: valor == true ? Colors.green : Colors.grey,
        ),
        const SizedBox(width: 8),
        Expanded(child: Text(label)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Cita Usuario #${citas.idUsuario}'),
        backgroundColor: Colors.deepPurple,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Detalles Cita Usuario',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _campoTexto('Nombre Usuario:', citas.usuario?.nombre),
            // _campoTexto('Fecha Cita:', citas.fecha),
            _campoTexto('Estado:', citas.estado),
            _campoTexto('Tipo:', citas.tipo),
            _campoTexto('Observaciones:', citas.observaciones),
            const SizedBox(height: 16),
            const Text(
              'Indicadores',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Wrap(
              runSpacing: 8,
              children: [
                _checkboxDato(
                  'Nombre usuario',
                  citas.usuario?.nombre?.isNotEmpty,
                ),
                _checkboxDato('Estado', citas.estado.isNotEmpty),
                _checkboxDato('Tipo', citas.tipo.isNotEmpty),
                _checkboxDato(
                  'Observaciones',
                  citas.observaciones?.isNotEmpty ?? false,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
