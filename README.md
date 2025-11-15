# Frontend para Sistema de Renta de Vehículos

Aplicación **frontend** desarrollada en **Angular** para el sistema de gestión de alquiler de vehículos **CarRenting**.  
Este frontend consume una **API REST** para gestionar clientes, vehículos, contratos, pagos, empleados y usuarios del sistema.

---

## 🎯 Resumen
Proyecto frontend desarrollado con Angular que ofrece interfaces para la administración y visualización de la información del sistema de renta de vehículos. Incluye un dashboard con gráficas (Chart.js), módulos por entidad y clases/servicios para consumir la API.

---

## 🚀 Tecnologías principales

- **Angular** (v12+ o la versión que uses)
- **TypeScript**
- **RxJS**
- **SCSS**
- **Chart.js** (gráficas del dashboard)
- **Angular Router**
- **HttpClient** (comunicacion con la API)
- **Angular Forms (ReactiveFormsModule)**

---

## 📁 Estructura principal del proyecto (resumen)

```
src/
│── app/
│   ├── core/                 # Configuración global: guards, interceptors, servicios base
│   ├── features/             # Módulos por funcionalidad
│   │   ├── auth/             # Autenticación y login
│   │   ├── cliente/          # Gestión de clientes
│   │   ├── contrato/         # Gestión de contratos
│   │   ├── dashboard/        # Dashboard con gráficas y totales
│   │   ├── empleado/         # Gestión de empleados
│   │   ├── pago/             # Gestión de pagos
│   │   ├── tipoVehiculo/     # Catálogo de tipos de vehículo
│   │   ├── usuario/          # Gestión de usuarios
│   │   └── vehiculo/         # Gestión de vehículos
│   ├── shared/
│   │   ├── components/       # Componentes reutilizables (tablas, modales...)
│   │   └── models/           # Interfaces y modelos TS
│   ├── app.component.*       # Componente raíz
│   ├── app.routes.ts         # Rutas globales
│   └── app.config.ts         # Configuración general
├── assets/                   # Recursos estáticos (imágenes, icons...)
├── environments/             # environment.ts / environment.prod.ts
└── ...
```

---

## 🔌 Configuración de la API (entornos)
Define la URL base de la API en los archivos de entorno:

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000' // <-- Cambia por tu endpoint real
}
```

## 📦 Instalación (local)

```bash
# clonar
git clone https://github.com/mengrau/CarRentingFrontEnd.git
cd .\FrontEnd\

# instalar dependencias
npm install
```

---

## ▶️ Ejecutar en desarrollo

```bash
# con angular cli
ng serve

Abre: `http://localhost:4200/`
```

---

## 🧑‍💻 Autores

**Emmanuel Orozco Muñoz**
**Andrés Felipe Méndez Cano**  
💼 Desarrolladores de software

---

