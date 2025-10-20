import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/listaserviciosmodel.dart';
import '../services/listaserviciosservice.dart';
import 'package:go_router/go_router.dart';

class PantallaServicios extends StatefulWidget {
  @override
  _PantallaServiciosState createState() => _PantallaServiciosState();
}

class _PantallaServiciosState extends State<PantallaServicios> {
  late Future<List<Servicio>> _servicios;
  final NumberFormat currencyFormat = NumberFormat("#,###", "es_CO");

  @override
  void initState() {
    super.initState();
    _servicios = ServicioListaAPI.obtenerServicios();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Servicio>>(
      future: _servicios,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text('No hay servicios disponibles.'));
        }

        final servicios = snapshot.data!;

        return ListView.builder(
          padding: const EdgeInsets.all(12),
          itemCount: servicios.length,
          itemBuilder: (context, index) {
            final servicio = servicios[index];
            return InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () {
                context.push('/detalles', extra: servicio);
              },
              child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                clipBehavior: Clip.antiAlias,
                elevation: 6,
                margin: const EdgeInsets.symmetric(vertical: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Imagen
                    Image.network(
                      servicio.imagen,
                      height: 180,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                    // Info
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            servicio.nombre,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            "Duración: ${servicio.duracion} min",
                            style: TextStyle(color: Colors.grey[700]),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Precio: \$${currencyFormat.format(servicio.precio)}",
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
