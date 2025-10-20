import 'package:flutter/material.dart';
import '../models/usuariomodel.dart';
import '../controllers/usuariocontroller.dart';
import '../widgets/leerrol.dart';

/// Vista para mostrar la lista de usuarios disponible para doctores
/// Muestra información básica de cada usuario con opciones de visualización
class ListaUsuariosView extends StatefulWidget {
  const ListaUsuariosView({Key? key}) : super(key: key);

  @override
  State<ListaUsuariosView> createState() => _ListaUsuariosViewState();
}

class _ListaUsuariosViewState extends State<ListaUsuariosView> {
  final UsuarioPerfilController _controller = UsuarioPerfilController();
  late Future<List<Usuario>> _futureUsuarios;
  List<Usuario> _usuariosFiltrados = [];
  List<Usuario> _todosLosUsuarios = [];

  final TextEditingController _busquedaController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _cargarUsuarios();
  }

  @override
  void dispose() {
    _busquedaController.dispose();
    super.dispose();
  }

  /// Carga la lista de usuarios desde el servicio
  void _cargarUsuarios() {
    setState(() {
      _futureUsuarios = _controller.obtenerListaUsuarios();
    });
  }

  /// Filtra usuarios basado en el texto de búsqueda
  void _filtrarUsuarios(String consulta) {
    setState(() {
      if (consulta.isEmpty) {
        _usuariosFiltrados = List.from(_todosLosUsuarios);
      } else {
        _usuariosFiltrados = _todosLosUsuarios.where((usuario) {
          final nombre = usuario.nombre?.toLowerCase() ?? '';
          final correo = usuario.correo?.toLowerCase() ?? '';
          final documento = usuario.numerodocumento?.toLowerCase() ?? '';
          final busqueda = consulta.toLowerCase();

          return nombre.contains(busqueda) ||
              correo.contains(busqueda) ||
              documento.contains(busqueda);
        }).toList();
      }
    });
  }

  /// Refresca la lista de usuarios
  Future<void> _refrescarLista() async {
    _cargarUsuarios();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Lista de Usuarios',
      body: Column(
        children: [
          // Barra de búsqueda
          _construirBarraBusqueda(),

          // Lista de usuarios
          Expanded(
            child: FutureBuilder<List<Usuario>>(
              future: _futureUsuarios,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return _construirErrorWidget(snapshot.error.toString());
                }

                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return _construirSinDatosWidget();
                }

                // Inicializar listas si es la primera carga
                if (_todosLosUsuarios.isEmpty) {
                  _todosLosUsuarios = snapshot.data!;
                  _usuariosFiltrados = List.from(_todosLosUsuarios);
                }

                return _construirListaUsuarios();
              },
            ),
          ),
        ],
      ),
    );
  }

  /// Construye la barra de búsqueda
  Widget _construirBarraBusqueda() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: TextField(
        controller: _busquedaController,
        decoration: InputDecoration(
          hintText: 'Buscar por nombre, correo o documento...',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: _busquedaController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _busquedaController.clear();
                    _filtrarUsuarios('');
                  },
                )
              : null,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          filled: true,
          fillColor: Colors.grey[100],
        ),
        onChanged: _filtrarUsuarios,
      ),
    );
  }

  /// Construye la lista de usuarios
  Widget _construirListaUsuarios() {
    return RefreshIndicator(
      onRefresh: _refrescarLista,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _usuariosFiltrados.length,
        itemBuilder: (context, index) {
          final usuario = _usuariosFiltrados[index];
          return _construirTarjetaUsuario(usuario);
        },
      ),
    );
  }

  /// Construye una tarjeta individual de usuario
  Widget _construirTarjetaUsuario(Usuario usuario) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () => _mostrarDetallesUsuario(usuario),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Avatar
              CircleAvatar(
                backgroundColor: Colors.blue[100],
                radius: 25,
                child: Text(
                  _obtenerIniciales(usuario.nombre ?? 'Usuario'),
                  style: TextStyle(
                    color: Colors.blue[800],
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Contenido principal
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Nombre
                    Text(
                      usuario.nombre ?? 'Sin nombre',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    // Correo
                    Row(
                      children: [
                        const Icon(Icons.email, size: 16, color: Colors.grey),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            usuario.correo ?? 'Sin correo',
                            style: const TextStyle(fontSize: 14),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    // Documento
                    Row(
                      children: [
                        const Icon(Icons.badge, size: 16, color: Colors.grey),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '${usuario.tipodocumento ?? ''} ${usuario.numerodocumento ?? ''}',
                            style: const TextStyle(fontSize: 14),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    // Teléfono (si existe)
                    if (usuario.telefono != null &&
                        usuario.telefono!.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.phone, size: 16, color: Colors.grey),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              usuario.telefono!,
                              style: const TextStyle(fontSize: 14),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(width: 12),
              // Chips de estado y rol
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _construirEstadoChip(usuario.estado ?? false),
                  const SizedBox(height: 4),
                  _construirRolChip(usuario.rol ?? 'Usuario'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Construye el chip de estado del usuario
  Widget _construirEstadoChip(bool estado) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: estado ? Colors.green[100] : Colors.red[100],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        estado ? 'Activo' : 'Inactivo',
        style: TextStyle(
          color: estado ? Colors.green[800] : Colors.red[800],
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  /// Construye el chip de rol del usuario
  Widget _construirRolChip(String rol) {
    Color color = Colors.blue;
    switch (rol.toLowerCase()) {
      case 'doctor':
        color = Colors.purple;
        break;
      case 'admin':
        color = Colors.orange;
        break;
      default:
        color = Colors.blue;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        rol,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  /// Construye el widget de error
  Widget _construirErrorWidget(String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
          const SizedBox(height: 16),
          Text(
            'Error al cargar usuarios',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[700],
            ),
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600]),
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _refrescarLista,
            icon: const Icon(Icons.refresh),
            label: const Text('Reintentar'),
          ),
        ],
      ),
    );
  }

  /// Construye el widget cuando no hay datos
  Widget _construirSinDatosWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.people_outline, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'No hay usuarios registrados',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[700],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'La lista de usuarios está vacía',
            style: TextStyle(color: Colors.grey[600]),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _refrescarLista,
            icon: const Icon(Icons.refresh),
            label: const Text('Actualizar'),
          ),
        ],
      ),
    );
  }

  /// Obtiene las iniciales del nombre de usuario
  String _obtenerIniciales(String nombre) {
    final palabras = nombre.trim().split(' ');
    if (palabras.isEmpty) return 'U';

    if (palabras.length == 1) {
      return palabras[0].substring(0, 1).toUpperCase();
    }

    return '${palabras[0].substring(0, 1)}${palabras[1].substring(0, 1)}'
        .toUpperCase();
  }

  /// Muestra los detalles del usuario en un diálogo
  void _mostrarDetallesUsuario(Usuario usuario) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(usuario.nombre ?? 'Usuario'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              _construirDetalle('Correo', usuario.correo),
              _construirDetalle(
                'Documento',
                '${usuario.tipodocumento} ${usuario.numerodocumento}',
              ),
              _construirDetalle('Teléfono', usuario.telefono),
              _construirDetalle('Género', usuario.genero),
              _construirDetalle('Dirección', usuario.direccion),
              _construirDetalle('Fecha de Nacimiento', usuario.fechaNacimiento),
              _construirDetalle('Ocupación', usuario.ocupacion),
              _construirDetalle('Estado Civil', usuario.estadoCivil),
              _construirDetalle('Rol', usuario.rol),
              _construirDetalle(
                'Estado',
                usuario.estado == true ? 'Activo' : 'Inactivo',
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cerrar'),
          ),
        ],
      ),
    );
  }

  /// Construye una fila de detalle para el diálogo
  Widget _construirDetalle(String titulo, String? valor) {
    if (valor == null || valor.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            titulo,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          Text(valor, style: const TextStyle(fontSize: 14)),
          const Divider(),
        ],
      ),
    );
  }
}
