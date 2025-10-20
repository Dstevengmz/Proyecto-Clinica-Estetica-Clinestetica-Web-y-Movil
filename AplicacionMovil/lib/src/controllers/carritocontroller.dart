import '../models/carritomodel.dart';
import '../services/carritoservice.dart';

class CarritoController {
  Future<List<Carrito>> listarCarrito() async {
    try {
      return await CarritoAPI.listarMiCarrito();
    } catch (e) {
      throw Exception("Error obteniendo carrito: $e");
    }
  }

  Future<void> agregar(int idProcedimiento) async {
    try {
      await CarritoAPI.agregarAlCarrito(idProcedimiento);
    } catch (e) {
      throw Exception("Error agregando al carrito: $e");
    }
  }

  Future<void> eliminar(int id) async {
    try {
      await CarritoAPI.eliminarDelCarrito(id);
    } catch (e) {
      throw Exception("Error eliminando del carrito: $e");
    }
  }

  Future<void> limpiar() async {
    try {
      await CarritoAPI.limpiarMiCarrito();
    } catch (e) {
      throw Exception("Error limpiando carrito: $e");
    }
  }
}
