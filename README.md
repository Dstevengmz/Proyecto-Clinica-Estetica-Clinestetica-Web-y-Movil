#  📱 Clinestetica Backend

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
5. Crear .env para agregar las variables de entorno
```bash
Las variables las encuentra en .env.example del codigo
```
# 💉 Clinestetica Backend

Sistema integral de gestión para una clínica estética Backend 

## 🧾 Descripción

**Clinestetica** es una aplicación web full-stack que permite gestionar usuarios, doctores, asistentes, historial médico, citas, servicios estéticos y procedimientos, integrando herramientas modernas de desarrollo backend y frontend con soporte en tiempo real, seguridad y escalabilidad.

---

## 👥 Autores

Desarrollado por:
- Darwin
- Liliana
- Constanza

---

## ⚙️ Stack Tecnológico

### 🔙 Backend
- **Node.js** 20.x con **Express.js** 5.1.0
- **MySQL** con **Sequelize ORM** 6.37.7
- **Redis** para cache y manejo de sesiones
- **Socket.IO** 4.8.1 para notificaciones en tiempo real
- **Cloudinary** para almacenamiento de imágenes
- **Nodemailer** para envío de correos

### 🔜 Frontend
- **React** con **Vite**
- **React Router DOM** para navegación
- **Bootstrap Icons** para iconografía

---

## 📦 Funcionalidades Principales

### 🔐 Sistema de Roles
- **Doctor**:
  - Registra servicios de la clínica
  - Crea y gestiona citas
  - Visualiza y edita historiales médicos
  - Visualiza documentos externos de los pacientes

- **Usuario (Paciente)**:
  - Registra y edita su historial clínico
  - Solicita servicios y agenda citas (primera cita obligatoria tipo evaluación)
  - Sube documentos externos para evaluación
  - Cancela y edita citas
  - Visualiza notificaciones

- **Asistente**:
  - Registra procedimientos **solo si el médico lo autoriza**

### 🗃️ Módulos del Sistema
- Gestión de usuarios con autenticación JWT
- Módulo de historial médico completo
- Citas médicas y procedimientos
- Carrito de compras y órdenes
- Notificaciones en tiempo real vía Socket.IO
- Subida y almacenamiento de documentos en la nube
- Seguridad por tokens, roles y control de acceso

---

## 🛠️ Instalación y Configuración

### 📋 Requisitos
- Node.js 20.x
- MySQL
- Docker (para Redis)
### 🔧 Backend

# Instalar dependencias
```bash
npm install
```
# Copiar archivo de entorno
```bash
cp .env.example .env
```
# Ejecutar migraciones
```bash
npx sequelize-cli db:migrate
```
# Insertar datos iniciales
```bash
npx sequelize-cli db:seed:all
```
# Iniciar servidor en modo desarrollador
```bash
npm run dev
```

##🔑 Variables de Entorno
```bash
Ubicadas en `.env.example`, incluye configuración para:

- Base de datos (MySQL)
- Redis
- JWT_SECRET
- Cloudinary (Cloud storage)
- Datos del administrador por defecto
- Configuración de Nodemailer para correos
```
# 🏥 Proyecto Clínica Estética Frontend

Aplicación web desarrollada en **React** para la gestión integral de una clínica estética. Permite administrar usuarios, citas médicas, procedimientos estéticos y roles de acceso diferenciados (usuarios, doctores y asistentes).

---

## 🌐 Demo
https://proyecto-clinica-estetica-app.vercel.app/inicio
---

## 📌 Características Principales

- 👩‍⚕️ Gestión de citas médicas con calendario interactivo
- 🔐 Control de acceso por roles: Usuario, Doctor, Asistente
- 📝 Administración de usuarios y validación de datos personales
- 🌍 Integración con Google Maps para mostrar ubicación de la clínica
- 📊 Dashboard con estadísticas y gráficos
- 📅 Agenda médica en tiempo real con Socket.io

---

## 🔐 Roles y Accesos

- **Usuario:** Agenda citas y visualiza su historial.
- **Asistente:** Gestiona usuarios y agenda médica.
- **Doctor:** Consulta citas asignadas y actualiza estados.

---

## 🛠️ Tecnologías Utilizadas

| Herramienta            | Versión         |
|------------------------|-----------------|
| React                  | ^19.1.0         |
| Vite                   | ^7.0.0          |
| CoreUI React           | ^5.7.0          |
| Bootstrap / Icons      | ^5.3.7 / ^1.13.1|
| React Router DOM       | ^7.6.3          |
| Redux                  | ^5.0.1          |
| Axios                  | ^1.10.0         |
| JWT Decode             | ^4.0.0          |
| Google Maps API        | ^2.20.7         |
| Socket.io-client       | ^4.8.1          |
| Chart.js               | ^4.5.0          |
| SweetAlert2            | ^11.22.1        |

---

## 🧾 Instalación y Configuración

1. **Clona el repositorio:**
    ```bash
    git clone https://github.com/Dstevengmz/Proyecto-Clinica-estetica-App.git
    cd Proyecto-Clinica-estetica-App
    ```

2. **Instala las dependencias:**
    ```bash
    npm install
    ```

3. **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

---

## 🧪 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido, las variables las encuentra en el .env.example del codigo:

```env
VITE_API_URL=http://localhost:3000
```
---
