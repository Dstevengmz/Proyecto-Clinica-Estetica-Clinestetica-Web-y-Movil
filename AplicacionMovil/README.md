📱 Clinestetica Móvil

Aplicación móvil multiplataforma desarrollada en Flutter, conectada al ecosistema de Clinestetica Web, que facilita la gestión integral de citas, procedimientos y pacientes en clínicas estéticas.

🧾 Descripción

Clinestetica Móvil permite a doctores y usuarios (pacientes) acceder a las funcionalidades principales del sistema desde cualquier dispositivo móvil.
La aplicación sincroniza datos en tiempo real con el backend (Node.js + MySQL) mediante API REST, ofreciendo una experiencia fluida, segura y moderna.

👥 Roles y Funcionalidades
👨‍⚕️ Doctor

Visualiza su agenda completa de citas y procedimientos.

Consulta los detalles de cada cita (paciente, fecha, hora, servicio y estado).

Accede a los historiales clínicos de sus pacientes.

Gestiona su disponibilidad mediante el calendario interactivo.

👤 Usuario (Paciente)

Registra procedimientos estéticos desde la aplicación.

Agenda citas en función de la disponibilidad del doctor seleccionado.

Consulta y gestiona sus citas activas y pasadas.

Recibe notificaciones y actualizaciones en tiempo real.

⚙️ Stack Tecnológico

Frontend móvil: Flutter 3.x (Dart)

Backend: Node.js + Express

Base de datos: MySQL (Sequelize ORM)

Autenticación: JWT (JSON Web Token)

Comunicación: API REST con consumo seguro mediante tokens

Sincronización: Socket.IO para notificaciones en tiempo real

🚀 Características Destacadas

Interfaz moderna y responsiva.

Integración completa con el sistema web Clinestetica.

Manejo de roles y autenticación segura.

Agendamiento inteligente basado en disponibilidad.

Visualización de citas mediante calendario interactivo.

👩‍💻 Autores
Desarrollado por Darwin, Liliana y Constanza
Proyecto final – SENA, Centro de Teleinformática y Producción Industrial

Instalacion
1. Clonar repositorio
```bash
git clone https://github.com/tuusuario/Clinestetica-Movil.git
cd tu-repo
```
2. Instalar dependencias
```bash
flutter pub get
```
4. Ejecutar la app
```bash
flutter run
```
5. crear el .env y el .env.example contiene las variales que deben agregarse.
```bash
7. El backend con frontend estan en el siguiente link
Backend : https://github.com/Dstevengmz/Proyecto-Sena-Clinica-Estetica-Frontend-Backend
Frontend: https://github.com/Dstevengmz/Proyecto-Clinica-estetica-App
```
