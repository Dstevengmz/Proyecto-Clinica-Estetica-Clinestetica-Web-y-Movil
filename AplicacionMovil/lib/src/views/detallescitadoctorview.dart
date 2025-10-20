import 'package:flutter/material.dart';
import '../models/citasdoctormodel.dart';
import '../helpers/fechahelper.dart';
import '../enums/estadoorden.dart';

class DetallesCitaDoctor extends StatelessWidget {
  final CitasDoctor citas;
  const DetallesCitaDoctor({super.key, required this.citas});

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
            const Text(
              'Información Usuario',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            _campoTexto('Nombre Usuario:', citas.usuario?.nombre),
            _campoTexto('Email Usuario:', citas.usuario?.correo),
            _campoTexto('Celular Usuario:', citas.usuario?.telefono),
            const Text(
              'Información Doctor',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            _campoTexto('Nombre Doctor:', citas.doctor?.nombre),
            _campoTexto('Profesión:', citas.doctor?.especialidad),
            const Text(
              'Información Cita',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            _campoTexto('Fecha de Cita:', FechaHelper.formatFecha(citas.fecha)),
            _campoTexto('Hora:', FechaHelper.formatHora(citas.fecha)),
            _campoTexto('Estado:', citas.estado),
            _campoTexto('Tipo de Cita:', citas.tipo),
            _campoTexto('Observaciones:', citas.observaciones),
            const SizedBox(height: 16),
            const Text(
              'Información Historial Médico',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            _campoTexto('Enfermedades:', citas.historialMedico?.enfermedades),
            _campoTexto('Alergias:', citas.historialMedico?.alergias),
            _campoTexto(
              'Cirugías Previas:',
              citas.historialMedico?.cirugiasPrevias,
            ),
            _campoTexto(
              'Condiciones de piel:',
              citas.historialMedico?.condicionesPiel,
            ),
            _campoTexto(
              'Embarazo o lactancia:',
              citas.historialMedico?.embarazoLactancia == true
                  ? 'Sí'
                  : citas.historialMedico?.embarazoLactancia == false
                  ? 'No'
                  : null,
            ),
            _campoTexto('Medicamentos:', citas.historialMedico?.medicamentos),
            _campoTexto(
              'Consume tabaco:',
              citas.historialMedico?.consumeTabaco == true
                  ? 'Sí'
                  : citas.historialMedico?.consumeTabaco == false
                  ? 'No'
                  : null,
            ),
            _campoTexto(
              'Consume alcohol:',
              citas.historialMedico?.consumeAlcohol == true
                  ? 'Sí'
                  : citas.historialMedico?.consumeAlcohol == false
                  ? 'No'
                  : null,
            ),
            _campoTexto(
              'Usa anticonceptivos:',
              citas.historialMedico?.usaAnticonceptivos == true
                  ? 'Sí'
                  : citas.historialMedico?.usaAnticonceptivos == false
                  ? 'No'
                  : null,
            ),
            _campoTexto(
              'Detalles anticonceptivos:',
              citas.historialMedico?.detallesAnticonceptivos,
            ),
            _campoTexto(
              'Diabetes:',
              citas.historialMedico?.diabetes == true
                  ? 'Sí'
                  : citas.historialMedico?.diabetes == false
                  ? 'No'
                  : null,
            ),
            _campoTexto(
              'Hipertensión:',
              citas.historialMedico?.hipertension == true
                  ? 'Sí'
                  : citas.historialMedico?.hipertension == false
                  ? 'No'
                  : null,
            ),
            _campoTexto(
              'Historial de cáncer:',
              citas.historialMedico?.historialCancer == true
                  ? 'Sí'
                  : citas.historialMedico?.historialCancer == false
                  ? 'No'
                  : null,
            ),
            _campoTexto(
              'Problemas de coagulación:',
              citas.historialMedico?.problemasCoagulacion == true
                  ? 'Sí'
                  : citas.historialMedico?.problemasCoagulacion == false
                  ? 'No'
                  : null,
            ),
            _campoTexto(
              'Epilepsia:',
              citas.historialMedico?.epilepsia == true
                  ? 'Sí'
                  : citas.historialMedico?.epilepsia == false
                  ? 'No'
                  : null,
            ),
            _campoTexto(
              'Otras condiciones:',
              citas.historialMedico?.otrasCondiciones,
            ),
            const SizedBox(height: 20),
            const Text(
              'Información Procedimientos Asociados ',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            _campoTexto('orden #:', citas.orden?.id.toString()),
            const SizedBox(height: 20),
            _campoTexto('Estado :', citas.orden?.estado.nombre),
            const SizedBox(height: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children:
                  citas.orden?.procedimientos.map((p) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Text(
                        "${p.nombre} - \$${p.precio.toStringAsFixed(2)}\n${p.descripcion}",
                        style: const TextStyle(fontSize: 14),
                      ),
                    );
                  }).toList() ??
                  [],
            ),
          ],
        ),
      ),
    );
  }
}
