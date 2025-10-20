import 'package:flutter/material.dart';
import '../services/historiaclinicaservice.dart';
import '../models/historiaclinicamodel.dart';
import '../widgets/leerrol.dart';
import 'package:go_router/go_router.dart';

class ListaHistorialClinico extends StatefulWidget {
  const ListaHistorialClinico({Key? key}) : super(key: key);

  @override
  State<ListaHistorialClinico> createState() => _ListaHistorialClinicoState();
}

class _ListaHistorialClinicoState extends State<ListaHistorialClinico> {
  late Future<List<HistoriaClinica>> _future;

  @override
  void initState() {
    super.initState();
    _future = HistoriaClinicaAPI.obtenerHistorialClinico();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: "Historiales Clínicos",
      body: FutureBuilder<List<HistoriaClinica>>(
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
                        _future = HistoriaClinicaAPI.obtenerHistorialClinico();
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
            return const Center(child: Text('No hay historiales clínicos'));
          }

          return ListView.builder(
            itemCount: lista.length,
            itemBuilder: (context, index) {
              final h = lista[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    context.push('/detalleshistorialclinica', extra: h);
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        Text(
                          'Nombre: ${h.usuario?.nombre ?? '#${h.idUsuario}'}',
                        ),
                        Text('Correo: ${h.usuario?.correo ?? '—'}'),
                        Text('Rol: ${h.usuario?.rol ?? '—'}'),
                        Text('Género: ${h.usuario?.genero ?? '—'}'),
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
