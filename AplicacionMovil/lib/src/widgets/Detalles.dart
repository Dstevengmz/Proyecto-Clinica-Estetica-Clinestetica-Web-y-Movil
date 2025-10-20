import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/listaserviciosmodel.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
import '../controllers/carritocontroller.dart';
import '../utils/alertasutil.dart';

class DetalleServicioWidget extends StatelessWidget {
  final Servicio servicio;
  final NumberFormat currencyFormat = NumberFormat("#,###", "es_CO");
  final _carritoController = CarritoController();

  DetalleServicioWidget({Key? key, required this.servicio}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Detalles del Servicio"),
        backgroundColor: Colors.teal,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
              child: Image.network(
                servicio.imagen,
                width: double.infinity,
                height: MediaQuery.of(context).size.height * 0.35,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    height: MediaQuery.of(context).size.height * 0.35,
                    color: Colors.grey[300],
                    child: const Icon(
                      Icons.broken_image,
                      size: 80,
                      color: Colors.grey,
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    servicio.nombre,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  const SizedBox(height: 12),

                  Text(
                    "Duración: ${servicio.duracion} min",
                    style: TextStyle(
                      fontSize: 16,
                      color: const Color.fromARGB(255, 0, 0, 0),
                    ),
                  ),
                  const SizedBox(height: 12),

                  Text(
                    "Precio: \$${currencyFormat.format(servicio.precio)}",
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: Color.fromARGB(255, 0, 0, 0),
                    ),
                  ),
                  const SizedBox(height: 20),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Descripción",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.teal,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        servicio.descripcion,
                        textAlign: TextAlign.justify,
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.black87,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 40),
                  FutureBuilder<bool>(
                    future: SharedPreferences.getInstance().then(
                      (prefs) =>
                          (prefs.getString('token')?.isNotEmpty ?? false),
                    ),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      }
                      final loggedIn = snapshot.data == true;
                      return SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.teal,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          onPressed: () async {
                            if (!loggedIn) {
                              context.push('/iniciarsesion');
                              return;
                            }

                            try {
                              await _carritoController.agregar(servicio.id);

                              AlertasApp.agregarAlCarrito(
                                context,
                                "Servicio agregado al carrito 🛒",
                                () => context.push('/pantallaprincipal'),
                              );
                            } catch (e) {
                              AlertasApp.errorAgregarAlCarrito(
                                context,
                                "Error: $e",
                              );
                            }
                          },
                          icon: Icon(
                            loggedIn ? Icons.add_shopping_cart : Icons.login,
                            color: Colors.white,
                          ),
                          label: Text(
                            loggedIn ? 'Agregar Servicio' : 'Iniciar sesión',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 12),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
