import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AcercaDeView extends StatelessWidget {
  const AcercaDeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          'Acerca de Clinestética',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color.fromARGB(255, 46, 125, 50),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // LOGO O IMAGEN PRINCIPAL
            Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.network(
                  'https://proyecto-clinica-estetica-app.vercel.app/icon.png',
                  height: 160,
                ),
              ),
            ),
            const SizedBox(height: 25),

            // DESCRIPCIÓN PRINCIPAL
            const Text(
              'CLINESTÉTICA – Clínica Estética Dr. Kevin Maldonado',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2E7D32),
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Somos una clínica especializada en medicina estética avanzada ubicada en Popayán, Colombia. '
              'Nos dedicamos al cuidado integral de la salud, la belleza y el bienestar, ofreciendo procedimientos '
              'faciales y corporales con tecnología de última generación y atención personalizada.',
              style: TextStyle(fontSize: 16, height: 1.4),
            ),
            const SizedBox(height: 25),

            // MISIÓN
            _seccionTitulo('Misión'),
            _seccionTexto(
              'Brindar servicios médicos estéticos de alta calidad, promoviendo la armonía corporal y el bienestar '
              'de nuestros pacientes mediante tratamientos seguros, efectivos y realizados por profesionales altamente calificados.',
            ),

            // VISIÓN
            _seccionTitulo('Visión'),
            _seccionTexto(
              'Ser reconocidos a nivel nacional como una clínica líder en medicina estética, destacándonos por la excelencia, '
              'innovación tecnológica y compromiso humano con nuestros pacientes.',
            ),

            // VALORES
            _seccionTitulo('Valores'),
            _seccionTexto(
              'Ética profesional, responsabilidad, respeto, compromiso, innovación y calidez humana en cada uno de nuestros servicios.',
            ),

            // SERVICIOS DESTACADOS
            _seccionTitulo('Servicios Destacados'),
            const SizedBox(height: 10),
            _listaServicios([
              '✔️ Procedimientos faciales y corporales',
              '✔️ Rejuvenecimiento facial con tecnología avanzada',
              '✔️ Aplicación de toxina botulínica y rellenos dérmicos',
              '✔️ Tratamientos reductores y moldeadores',
              '✔️ Medicina regenerativa y terapias personalizadas',
              '✔️ Asesoría estética integral',
            ]),
            const SizedBox(height: 25),

            // UBICACIÓN Y CONTACTO
            _seccionTitulo('Ubicación'),
            _seccionTexto(
              ' Calle 5 #7-12, Barrio Centro, Popayán, Cauca – Colombia',
            ),
            _seccionTitulo('Contacto'),
            _seccionTexto(
              ' Teléfono: +57 320 555 9988\n'
              'Correo: contacto@clinestetica.com\n'
              'Sitio web: https://proyecto-clinica-estetica-app.vercel.app',
            ),
            const SizedBox(height: 40),

            Center(
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 46, 125, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 30,
                    vertical: 12,
                  ),
                ),
                icon: const Icon(Icons.home_outlined, color: Colors.white),
                label: const Text(
                  'Volver al inicio',
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
                onPressed: () => {context.go('/pantallaprincipal')},
              ),
            ),
          ],
        ),
      ),
    );
  }

  //WIDGETS AUXILIARES

  static Widget _seccionTitulo(String titulo) {
    return Padding(
      padding: const EdgeInsets.only(top: 10, bottom: 5),
      child: Text(
        titulo,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Color.fromARGB(255, 46, 125, 50),
        ),
      ),
    );
  }

  static Widget _seccionTexto(String texto) {
    return Text(
      texto,
      style: const TextStyle(fontSize: 15.5, height: 1.5),
      textAlign: TextAlign.justify,
    );
  }

  static Widget _listaServicios(List<String> servicios) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: servicios
          .map(
            (s) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Text(s, style: const TextStyle(fontSize: 15.5)),
            ),
          )
          .toList(),
    );
  }
}
