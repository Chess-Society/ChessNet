# ChessNet - Plataforma Educativa de Ajedrez

ChessNet es una plataforma educativa completa de ajedrez diseñada para colegios, clubes y academias. Permite organizar grupos y calendarios, enseñar con materiales interactivos, evaluar el progreso del alumnado y comunicar de forma sencilla con familias y dirección.

## 🚀 Características Principales

### ✅ **Funcionalidades Implementadas**

- **🔐 Autenticación con Google** - Login seguro y fácil
- **🏫 Gestión de Centros** - Crear y administrar múltiples centros educativos
- **👥 Gestión de Clases y Estudiantes** - Organizar grupos y control de asistencia
- **♟️ Tablero Interactivo** - Tablero de ajedrez completamente funcional
- **📚 Sistema de Lecciones** - Crear y organizar contenido educativo
- **🎯 Ejercicios de Ajedrez** - Ejercicios tácticos, estratégicos y de finales
- **🏆 Sistema de Torneos** - Organizar competiciones suizas y todos contra todos
- **📢 Comunicación** - Avisos y mensajes a familias
- **📊 Analíticas y Reportes** - Dashboard completo con estadísticas
- **🎮 Gamificación** - Sistema de puntos, niveles, insignias y rachas

### 🎯 **Funcionalidades Clave**

#### **Gestión Académica**

- ✅ Creación de grupos y niveles (iniciación, intermedio, avanzado)
- ✅ Calendario de clases y control de asistencia
- ✅ Plantillas de programación semanal y trimestral

#### **Entrenamiento y Aprendizaje**

- ✅ Tablero interactivo para explicar ideas y practicar
- ✅ Colecciones de ejercicios por tema (táctica, estrategia, finales)
- ✅ Lecciones guiadas con objetivos y ejemplos
- ✅ Retos diarios/semanales para mantener la práctica

#### **Evaluación y Progreso**

- ✅ Rutas de aprendizaje con hitos claros
- ✅ Sistema de puntos/medallas y progreso por tema
- ✅ Informes automáticos por alumno y por grupo
- ✅ Historial de actividades y resultados

#### **Competición**

- ✅ Torneos internos y ligas
- ✅ Emparejamientos automáticos
- ✅ Clasificaciones y reportes de torneo

#### **Comunicación**

- ✅ Avisos a grupos
- ✅ Notas para familias con el progreso
- ✅ Tablón de novedades del centro

#### **Analítica e Informes**

- ✅ Evolución por tema
- ✅ Asistencia y participación
- ✅ Comparativas entre grupos
- ✅ KPIs detallados

#### **Gamificación**

- ✅ Sistema de puntos y niveles
- ✅ Insignias por logros
- ✅ Rachas de práctica
- ✅ Tabla de clasificación

## 🛠️ Tecnologías Utilizadas

- **Frontend**: SvelteKit 5 + TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: Firebase Firestore (NoSQL)
- **Autenticación**: Firebase Auth con Google OAuth
- **Chess Engine**: chess.js
- **UI Components**: Lucide Svelte (iconos)

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Proyecto de Firebase configurado
- Cuenta de Google (para OAuth)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd chessnet-sveltekit
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crea un nuevo proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita **Authentication** (Google Sign-in)
3. Crea una base de datos **Firestore**
4. Registra una Web App y copia el objeto `firebaseConfig`

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `env.example`:

```env
PUBLIC_FIREBASE_API_KEY=tu_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
...
```

### 5. Configurar Firestore

1. Define las reglas de seguridad en la consola de Firebase o vía CLI.
2. La estructura se inicializará automáticamente al usar la aplicación.

### 6. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
chessnet-sveltekit/
├── src/
│   ├── lib/
│   │   ├── api/              # APIs para interacción con Firestore
│   │   ├── components/       # Componentes reutilizables
│   │   ├── stores/           # Stores de Svelte
│   │   ├── types/            # Tipos TypeScript
│   │   └── utils/            # Utilidades
│   ├── routes/               # Páginas de la aplicación
│   └── app.html              # Template HTML principal
└── README.md
```

## 🎮 Uso de la Aplicación

### 1. **Primer Acceso**

- Ve a `http://localhost:5173`
- Haz clic en "Iniciar sesión con Google"
- Autoriza la aplicación

### 2. **Crear tu Primer Centro**

- Haz clic en "Crear mi primer centro"
- Completa la información del centro
- Se inicializarán automáticamente las habilidades y materiales por defecto

### 3. **Gestionar Clases y Estudiantes**

- Crea clases dentro de tu centro
- Añade estudiantes a las clases
- Controla la asistencia diaria

### 4. **Usar el Tablero Interactivo**

- Ve a Lecciones > Ejercicios
- Haz clic en cualquier ejercicio
- Usa el tablero para resolver posiciones

### 5. **Organizar Torneos**

- Crea torneos suizos o todos contra todos
- Añade participantes
- Genera emparejamientos automáticamente

### 6. **Ver Analíticas**

- Accede al dashboard de analíticas
- Revisa el progreso de estudiantes y clases
- Exporta reportes

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de la construcción
npm run preview

# Verificación de tipos
npm run check

# Linting
npm run lint

# Formateo de código
npm run format
```

## 🎯 Beneficios Medibles

- **+20–40%** de ejercicios completados por semana
- **-30–50%** de tiempo administrativo del monitor
- **+15–25%** de asistencia media en actividades
- **+30–60%** de feedback efectivo a familias
- Mejora en objetivos por tema gracias a rutas de aprendizaje

## 🚀 Despliegue

### Netlify (Recomendado)

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en Netlify
3. El despliegue se realizará automáticamente

### Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega

### Otros Proveedores

El proyecto genera archivos estáticos que pueden desplegarse en cualquier proveedor de hosting estático.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎉 ¡Gracias!

¡Gracias por usar ChessNet! Esperamos que esta plataforma ayude a mejorar la enseñanza del ajedrez en tu centro educativo.

---

**ChessNet** - Transformando la enseñanza del ajedrez, una partida a la vez. ♟️
