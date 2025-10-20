# 💉 Clinestetica – Sistema Integral para Clínicas Estéticas

Clinestetica es una solución tecnológica completa que combina una aplicación **web**, una aplicación **móvil** y un **backend robusto**, permitiendo la gestión eficiente de usuarios, doctores, asistentes, citas médicas, historiales clínicos y procedimientos estéticos en clínicas especializadas.

---

## 📑 Tabla de Contenidos

- [📱 Aplicación Móvil](#-aplicación-móvil)
- [🌐 Aplicación Web (Frontend)](#-aplicación-web-frontend)
- [🛠️ Backend (API REST)](#️-backend-api-rest)
- [⚙️ Stack Tecnológico General](#️-stack-tecnológico-general)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [👥 Autores](#-autores)
- [📄 Licencia](#-licencia)

---

## 📱 Aplicación Móvil

Aplicación multiplataforma desarrollada en **Flutter**, conectada con el backend de Clinestetica, permitiendo acceso móvil a funcionalidades críticas como citas, procedimientos y notificaciones.

### 🧾 Descripción

- Sincronización de datos en tiempo real con el backend mediante API REST.
- Accesible para doctores y pacientes desde cualquier dispositivo móvil.
- Envío y recepción de notificaciones instantáneas.

### 👥 Roles y Funcionalidades

#### 👨‍⚕️ Doctor
- Visualiza agenda de citas y procedimientos.
- Consulta detalles de cada cita (paciente, fecha, hora, servicio, estado).
- Accede a historiales clínicos.
- Gestiona su disponibilidad en un calendario interactivo.

#### 👤 Paciente
- Agenda citas según disponibilidad del médico.
- Registra procedimientos estéticos desde la app.
- Consulta, edita o cancela citas.
- Recibe notificaciones en tiempo real.

### ⚙️ Tecnologías
- **Flutter 3.x (Dart)**
- **Socket.IO** para notificaciones en tiempo real
- **JWT** para autenticación
- **API REST** segura con tokens

---

## 🌐 Aplicación Web (Frontend)

Interfaz web desarrollada en **React** para la gestión integral del ecosistema Clinestetica, incluyendo paneles administrativos, dashboards, historial médico y control de roles.

### 📌 Funcionalidades Principales

- Gestión de citas médicas con calendario interactivo.
- Dashboard con estadísticas y gráficas.
- Control de acceso según el rol (Usuario, Doctor, Asistente).
- Visualización de mapas mediante integración con Google Maps.
- Gestión de documentos médicos y procedimientos.

### 🔐 Roles

| Rol       | Funcionalidades Clave |
|-----------|------------------------|
| Usuario   | Agenda citas, consulta historial médico, sube documentos. |
| Doctor    | Administra citas, servicios, consulta historiales. |
| Asistente | Apoya en la gestión de usuarios, agenda y procedimientos autorizados. |

### 💻 Tecnologías Usadas

| Herramienta            | Versión         |
|------------------------|-----------------|
| React                  | ^19.1.0         |
| Vite                   | ^7.0.0          |
| Redux                  | ^5.0.1          |
| React Router DOM       | ^7.6.3          |
| CoreUI / Bootstrap     | ^5.7.0 / ^5.3.7 |
| SweetAlert2 / Chart.js | ^11.22.1 / ^4.5.0 |
| Axios                  | ^1.10.0         |
| JWT Decode             | ^4.0.0          |
| Google Maps API        | ^2.20.7         |
| Socket.io-client       | ^4.8.1          |

---

## 🛠️ Backend (API REST)

API desarrollada con **Node.js + Express** que administra usuarios, doctores, asistentes, historiales médicos, servicios, procedimientos y citas médicas. Integra tecnologías modernas para seguridad, escalabilidad y rendimiento en tiempo real.

### 📌 Módulos y Funcionalidades

- Autenticación con **JWT** y manejo de roles.
- Citas médicas y procedimientos con validaciones.
- Historial médico completo editable por el doctor y visible para el paciente.
- Subida de documentos médicos (PDFs, imágenes) con almacenamiento en la nube.
- Notificaciones en tiempo real vía **Socket.IO**.
- Envío de correos electrónicos automáticos con **Nodemailer**.
- Control de sesiones y caché con **Redis**.

### 👥 Roles y Acciones

| Rol        | Funciones Disponibles |
|------------|------------------------|
| Doctor     | Administra servicios, citas, historial médico, documentos. |
| Paciente   | Agenda citas, gestiona historial, sube documentos. |
| Asistente  | Registra procedimientos autorizados, apoya en gestión de agenda. |

### 🔧 Tecnologías Backend

- **Node.js 20.x**
- **Express.js 5.1.0**
- **MySQL + Sequelize ORM 6.37.7**
- **Socket.IO 4.8.1**
- **Redis** (cache y sesiones)
- **Cloudinary** (almacenamiento en la nube)
- **Nodemailer** (emails automáticos)

---

## ⚙️ Stack Tecnológico General

| Componente        | Tecnología                         |
|-------------------|-------------------------------------|
| Web Frontend      | React + Vite                       |
| Móvil Frontend    | Flutter                            |
| Backend API       | Node.js + Express                  |
| Base de Datos     | MySQL + Sequelize                  |
| Tiempo Real       | Socket.IO                          |
| Autenticación     | JWT (JSON Web Token)               |
| Almacenamiento    | Cloudinary                         |
| Correo            | Nodemailer                         |
| Cache / Sesiones  | Redis                              |
| Mapas             | Google Maps API                    |
| Otros             | Redux, Chart.js, SweetAlert2       |

---

## 🚀 Instalación y Configuración

### 🔧 Requisitos Generales

- Node.js 20.x
- Flutter SDK
- MySQL
- Docker (opcional para Redis)

---

### 📲 Móvil (Flutter)

```bash
git clone https://github.com/tuusuario/Clinestetica-Movil.git
cd Clinestetica-Movil
flutter pub get
flutter run
```
### 🌐 Web (React)
```bash
git clone https://github.com/Dstevengmz/Proyecto-Clinica-estetica-App.git
cd Proyecto-Clinica-estetica-App
npm install
npm run dev
Crear archivo .env: en .env.example estan las variables
VITE_API_URL=http://localhost:3000
```
### 🔙 Backend (Node.js + MySQL)
```bash
git clone https://github.com/tuusuario/Clinestetica-Backend.git
cd Clinestetica-Backend
npm install
cp .env.example estan las variables crear un .env
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
Configura las variables en .env:
```
👥 Autores

Desarrollado por:

- Darwin
- Liliana
- Constanza
Proyecto final – SENA, Centro de Teleinformática y Producción Industrial.
