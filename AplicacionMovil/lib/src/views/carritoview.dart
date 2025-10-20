import 'package:flutter/material.dart';
import 'package:clinica_app/src/widgets/leerrol.dart';
import 'package:clinica_app/src/controllers/carritocontroller.dart';
import 'package:clinica_app/src/models/carritomodel.dart';
import 'package:clinica_app/src/utils/alertasutil.dart';
import 'package:go_router/go_router.dart';
import 'package:clinica_app/src/controllers/historiaclinicacontroller.dart';

class CarritoView extends StatefulWidget {
  const CarritoView({super.key});

  @override
  State<CarritoView> createState() => _CarritoViewState();
}

class _CarritoViewState extends State<CarritoView> {
  final _carritoController = CarritoController();

  late Future<List<Carrito>> _futureCarrito;

  @override
  void initState() {
    super.initState();
    _futureCarrito = _carritoController.listarCarrito();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Mi Carrito 🛒',
      body: FutureBuilder<List<Carrito>>(
        future: _futureCarrito,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final carrito = snapshot.data ?? [];

          if (carrito.isEmpty) {
            return const Center(
              child: Text(
                'Tu carrito está vacío 🛒',
                style: TextStyle(fontSize: 18),
              ),
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: carrito.length,
                  itemBuilder: (context, index) {
                    final item = carrito[index];
                    final proc = item.procedimiento;

                    return Card(
                      elevation: 4,
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      child: ListTile(
                        leading: _buildLeading(proc?.imagen),
                        title: Text(proc?.nombre ?? 'Servicio'),
                        subtitle: Text(
                          proc?.descripcion ?? 'Sin descripción',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () {
                            AlertasApp.confirmarEliminarDelCarrito(
                              context,
                              onConfirmar: () async {
                                try {
                                  await _carritoController.eliminar(item.id);
                                  setState(() {
                                    _futureCarrito = _carritoController
                                        .listarCarrito();
                                  });
                                  if (!mounted) return;
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text("Eliminado del carrito"),
                                      backgroundColor: Colors.green,
                                      duration: Duration(seconds: 2),
                                    ),
                                  );
                                } catch (e) {
                                  if (!mounted) return;
                                  AlertasApp.mostrarError(context, 'Error: $e');
                                }
                              },
                            );
                          },
                        ),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    icon: const Icon(
                      Icons.event_available,
                      color: Colors.white,
                    ),
                    label: const Text(
                      'Agendar cita',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.teal,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    onPressed: () async {
                      try {
                        final controller = HistoriaClinicaController();
                        final tieneHistorial = await controller
                            .verificarHistorialUsuario();

                        if (!mounted) return;

                        if (tieneHistorial) {
                          context.go('/registrarcita');
                        } else {
                          context.go('/registrarhistorialclinico');
                        }
                      } catch (e) {
                        if (!mounted) return;
                        AlertasApp.mostrarError(
                          context,
                          "Error al verificar historial: $e",
                        );
                      }
                    },
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

Widget _buildLeading(String? imagenUrl) {
  if (imagenUrl == null || imagenUrl.isEmpty) {
    return const Icon(Icons.medical_services, color: Colors.teal, size: 36);
  }
  return ClipRRect(
    borderRadius: BorderRadius.circular(8),
    child: Image.network(
      imagenUrl,
      width: 56,
      height: 56,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) =>
          const Icon(Icons.broken_image, color: Colors.grey, size: 36),
    ),
  );
}
