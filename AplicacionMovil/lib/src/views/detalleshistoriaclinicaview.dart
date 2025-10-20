import 'package:flutter/material.dart';
import '../models/historiaclinicamodel.dart';

class DetalleHistorialClinico extends StatelessWidget {
  final HistoriaClinica historial;
  const DetalleHistorialClinico({super.key, required this.historial});

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
        title: Text('Historial Usuario #${historial.idUsuario}'),
        backgroundColor: Colors.deepPurple,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Datos Clínicos',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _campoTexto('Enfermedades', historial.enfermedades),
            _campoTexto('Alergias', historial.alergias),
            _campoTexto('Cirugías previas', historial.cirugiasPrevias),
            _campoTexto('Condiciones de la piel', historial.condicionesPiel),
            _campoTexto('Medicamentos', historial.medicamentos),
            _campoTexto(
              'Detalles anticonceptivos',
              historial.detallesAnticonceptivos,
            ),
            _campoTexto('Otras condiciones', historial.otrasCondiciones),
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
                  'Embarazo / Lactancia',
                  historial.embarazoLactancia,
                ),
                _checkboxDato('Consume tabaco', historial.consumeTabaco),
                _checkboxDato('Consume alcohol', historial.consumeAlcohol),
                _checkboxDato(
                  'Usa anticonceptivos',
                  historial.usaAnticonceptivos,
                ),
                _checkboxDato('Diabetes', historial.diabetes),
                _checkboxDato('Hipertensión', historial.hipertension),
                _checkboxDato('Historial cáncer', historial.historialCancer),
                _checkboxDato(
                  'Problemas coagulación',
                  historial.problemasCoagulacion,
                ),
                _checkboxDato('Epilepsia', historial.epilepsia),
              ],
            ),
            const SizedBox(height: 24),
            if (historial.createdAt != null)
              Text('Creado: ${historial.createdAt}'),
            if (historial.updatedAt != null)
              Text('Actualizado: ${historial.updatedAt}'),
          ],
        ),
      ),
    );
  }
}
