import 'package:flutter/material.dart';
import '../services/citasusuarioservice.dart';
import '../models/citasusuariomodel.dart';
import '../widgets/leerrol.dart';
import 'package:go_router/go_router.dart';
import '../helpers/fechahelper.dart';

class ListaCitasUsuario extends StatefulWidget {
  const ListaCitasUsuario({Key? key}) : super(key: key);

  @override
  State<ListaCitasUsuario> createState() => _ListaCitasUsuarioState();
}

class _ListaCitasUsuarioState extends State<ListaCitasUsuario> {
  late Future<List<Citas>> _future;

  @override
  void initState() {
    super.initState();
    _future = CitasUsuarioAPI.obtenerCitas();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: "Citas de Usuario",
      body: FutureBuilder<List<Citas>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error, color: Colors.red, size: 48),
                    const SizedBox(height: 12),
                    Text('Error: ${snapshot.error}'),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () => setState(() {
                        _future = CitasUsuarioAPI.obtenerCitas();
                      }),
                      icon: const Icon(Icons.refresh),
                      label: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            );
          }

          final lista = snapshot.data ?? [];

          if (lista.isEmpty) {
            return const Center(child: Text('No tienes citas programadas'));
          }

          return ListView.builder(
            itemCount: lista.length,
            itemBuilder: (context, index) {
              final h = lista[index];
              final fechaFormateada = FechaHelper.formatFecha(h.fecha);
              final horaFormateada = FechaHelper.formatHora(h.fecha);

              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    context.push('/detallescitasusuario', extra: h);
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        Text(
                          'Nombre Usuario: ${h.usuario?.nombre ?? '#${h.idUsuario}'}',
                        ),
                        const SizedBox(height: 8),
                        Text('Fecha de Cita: $fechaFormateada'),
                        const SizedBox(height: 8),
                        Text('Hora: $horaFormateada'),
                        const SizedBox(height: 8),
                        Text('Tipo de Cita: ${h.tipo}'),
                        const SizedBox(height: 8),
                        Text('Estado: ${h.estado}'),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
