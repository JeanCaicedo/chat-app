# Chat App

## Descripción del proyecto
Esta aplicación es un **chat‑app** en tiempo real que permite la comunicación entre múltiples usuarios en salas de chat públicas y privadas. Incluye autenticación mediante JWT, gestión de historial de mensajes y notificaciones cuando la ventana está en segundo plano.

## Tecnologías utilizadas

### Backend
- **Node.js**  
- **Express**  
- **Socket.IO**  
- **MongoDB**  
- **Mongoose**  
- **CORS**  
- **dotenv**  
- **JSON Web Tokens (JWT)**  

### Frontend
- **React** (Create React App – PWA template)  
- **Socket.IO Client**  

### Herramientas de desarrollo
- **nodemon**  
- **concurrently**  

---

## Arquitectura general
- **Express REST API** para autenticación, carga de historial y gestión de usuarios/salas.  
- **Socket.IO** para canal de mensajería en tiempo real: conexión/desconexión, envío/recepción de mensajes y eventos de sala (join/leave).  
- **MongoDB** para almacenamiento de datos:  
  - Colecciones: `users`, `rooms`, `messages` (con índices en `roomId` y `timestamp`).

---

## Requisitos funcionales
1. **Autenticación**  
   - Registro/login mediante JWT.  
   - Middleware que valide token en peticiones REST y conexiones Socket.IO.  
2. **Salas de chat**  
   - Crear salas públicas y privadas.  
   - Unirse y salir dinámicamente.  
3. **Mensajería en tiempo real**  
   - Emisión de mensajes a todos los miembros de la sala.  
   - Indicador "usuario está escribiendo…" con evento de tipeo.  
4. **Historial de mensajes**  
   - Carga de los últimos N mensajes al unirse a una sala.  
5. **Lista de usuarios online**  
   - Mantenimiento de usuarios conectados en memoria o Redis; actualizaciones al entrar/salir.  
6. **Notificaciones**  
   - Notificaciones de navegador si la ventana está en segundo plano.  
7. **Responsive**  
   - Adaptación a escritorio y móvil con CSS flexbox/grid.

---

## Requisitos no funcionales
- **Escalabilidad**: adaptador Redis para Socket.IO en despliegues distribuidos.  
- **Baja latencia**: payloads ligeros y compresión GZIP en Express.  
- **Seguridad**: CORS restringido, sanitización contra XSS y conexión bajo SSL/TLS.  
- **Mantenibilidad**: separación en capas (controllers, services, models) y contenedorización independiente (Docker).  
- **Disponibilidad**: despliegue en plataformas como Heroku, AWS ECS o DigitalOcean, con MongoDB Atlas.

---

## Estructura de carpetas

### Backend
```
/backend
  /src
    /controllers
    /services
    /models
    /routes
    /sockets
    index.js
  package.json
```

### Frontend
```
/frontend
  /public
  /src
    /components
      /Auth
      /Chat
      /Shared
    /hooks
    /contexts
    /pages
    App.jsx
    index.jsx
  package.json
```

---

## Maquetación de pantallas

### 1. Login / Registro
- Dos campos de entrada: Email y Contraseña  
- Botón "Entrar"  
- Enlace a "Crear cuenta"  

### 2. Sala de chat principal
- **Sidebar**  
  - Listado de salas (públicas y privadas) y opción "+ Nueva sala"  
  - Listado de usuarios conectados  
- **Ventana de chat**  
  - Encabezado con nombre de sala y contador de usuarios  
  - Área de mensajes desplazable  
  - Pie de página con campo de texto y botón "Enviar" 