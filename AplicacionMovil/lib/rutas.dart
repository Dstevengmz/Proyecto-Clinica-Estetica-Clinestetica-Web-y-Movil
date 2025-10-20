import 'package:go_router/go_router.dart';
import './principal.dart';
import './src/views/iniciarsesionview.dart';
import 'src/views/registrarusuarioview.dart';
import './src/widgets/Detalles.dart';
import './src/models/listaserviciosmodel.dart';
import 'src/views/paneldoctorview.dart';
import 'src/views/panelusuarioview.dart';
import './src/views/historiaclinicaview.dart';
import './src/views/detalleshistoriaclinicaview.dart';
import 'src/models/historiaclinicamodel.dart';
import 'src/views/citasusuarioview.dart';
import './src/views/detallescitausuarioview.dart';
import 'src/models/citasusuariomodel.dart';
import './src/views/citasdoctorview.dart';
import 'src/views/detallescitadoctorview.dart';
import 'src/models/citasdoctormodel.dart';
import './src/views/registrarcitaview.dart';
import './src/views/carritoview.dart';
import 'src/views/registrarhistoriaclinicaview.dart';
import './src//views/mihistorialclinicoview.dart';
import 'src/views/editar_historial_clinico_view.dart';
import 'src/views/perfil_view.dart';
import 'src/views/editar_perfil_view.dart';
import 'src/models/usuariomodel.dart';
import 'src/views/contactoview.dart';
import 'src/views/notificacionview.dart';
import 'src/views/notificaciones_doctor_view.dart';
import 'src/views/lista_usuarios_view.dart';
import './src/views/acercadeview.dart';

// import './src/widgets/splash.dart';
final appRouter = GoRouter(
  initialLocation: '/pantallaprincipal',
  routes: [
    // GoRoute(path: '/splash', builder: (context, state) => SplashScreen()),
    GoRoute(
      path: '/pantallaprincipal',
      builder: (context, state) => PantallaPrincipal(),
    ),
    GoRoute(
      path: '/registrarusuario',
      builder: (context, state) => RegistrarUsuarioView(),
    ),
    GoRoute(
      path: '/detalles',
      builder: (context, state) {
        final servicio = state.extra as Servicio;
        return DetalleServicioWidget(servicio: servicio);
      },
    ),
    GoRoute(
      path: '/iniciarsesion',
      builder: (context, state) => const LoginView(),
    ),

    GoRoute(
      path: '/doctorpanel',
      builder: (context, state) => const DoctorDashboard(),
    ),
    GoRoute(path: '/logout', builder: (context, state) => PantallaPrincipal()),
    GoRoute(
      path: '/usuariopanel',
      builder: (context, state) => const UserDashboard(),
    ),
    GoRoute(
      path: '/historialclinico',
      builder: (context, state) => const ListaHistorialClinico(),
    ),
    GoRoute(
      path: '/detalleshistorialclinica',
      builder: (context, state) {
        final historial = state.extra as HistoriaClinica;
        return DetalleHistorialClinico(historial: historial);
      },
    ),
    GoRoute(
      path: '/miscitasusuario',
      builder: (context, state) => const ListaCitasUsuario(),
    ),
    GoRoute(
      path: '/detallescitasusuario',
      builder: (context, state) {
        final citas = state.extra as Citas;
        return DetallesCitaUsuario(citas: citas);
      },
    ),
    GoRoute(
      path: '/miscitasdoctor',
      builder: (context, state) => const ListarCitasDoctor(),
    ),
    GoRoute(
      path: '/detallescitasdoctor',
      builder: (context, state) {
        final citas = state.extra as CitasDoctor;
        return DetallesCitaDoctor(citas: citas);
      },
    ),
    GoRoute(
      path: '/registrarcita',
      builder: (context, state) => const PerfilUsuarioView(),
    ),
    GoRoute(path: '/carrito', builder: (context, state) => const CarritoView()),
    GoRoute(
      path: '/historial/crear',
      builder: (context, state) => const RegistrarHistorialScreen(),
    ),
    GoRoute(
      path: '/historial/editar',
      builder: (context, state) {
        final extra = state.extra;
        return EditarHistorialClinicoView(
          existing: extra is HistoriaClinica ? extra : null,
        );
      },
    ),
    GoRoute(
      path: '/registrarhistorialclinico',
      builder: (context, state) => const RegistrarHistorialScreen(),
    ),
    GoRoute(
      path: '/mihistorialclinico',
      builder: (context, state) => const MiHistorialClinicoView(),
    ),
    GoRoute(path: '/perfil', builder: (context, state) => const PerfilView()),
    GoRoute(
      path: '/perfil/editar',
      builder: (context, state) {
        final extra = state.extra;
        return EditarPerfilView(existing: extra is Usuario ? extra : null);
      },
    ),
    GoRoute(
      path: '/contacto',
      builder: (context, state) => const ContactoView(),
    ),
    GoRoute(
      path: '/notificaciones',
      builder: (context, state) => const NotificacionesView(),
    ),
    GoRoute(
      path: '/notificaciones-doctor',
      builder: (context, state) => const NotificacionesDoctorView(),
    ),
    GoRoute(
      path: '/lista-usuarios',
      builder: (context, state) => const ListaUsuariosView(),
    ),
    GoRoute(path: '/acerca', builder: (context, state) => const AcercaDeView()),
  ],
);
