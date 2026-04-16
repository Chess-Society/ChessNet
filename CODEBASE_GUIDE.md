# Guía de Estructura y Código - ChessNet

Este documento detalla la organización actual del proyecto ChessNet para facilitar su mantenimiento y escalabilidad.

## 1. Stack Tecnológico
- **Framework:** SvelteKit (Svelte 5 con Runes).
- **Estilos:** Tailwind CSS.
- **Backend:** Firebase (Firestore & Auth).
- **Despliegue:** Netlify.
- **Pagos/Soporte:** Stripe.

---

## 2. Estructura de Directorios

### `/src` (Núcleo de la aplicación)
- **`hooks.server.ts`**: Maneja la validación de sesiones y cookies del lado del servidor para proteger rutas.
- **`app.html`**: Plantilla base del HTML.
- **`app.css`**: Estilos globales.

### `/src/lib` (Recursos compartidos)
- **`/api`**: Contiene la lógica modularizada para interactuar con Firebase.
  - `admin.ts`: Funciones para roles administrativos.
  - `schools.ts` / `classes.ts` / `students.ts`: CRUD de entidades base.
  - `payments.ts`: Funciones auxiliares para el registro manual de cobros e ingresos.
  - `local-tournaments.ts`: Motor de emparejamientos y torneos internos.
- **`/components`**: Componentes UI reutilizables.
  - `ChessBoard.svelte`: Visualizador de tableros.
  - `TournamentCreator.svelte`: Modal de creación de torneos.
  - `Toast.svelte`: Sistema de notificaciones.
- **`/stores`**: Gestión del estado global.
  - `appStore.ts`: **El corazón del estado**. Contiene toda la información de escuelas, alumnos y clases en sincronía con Firestore.
  - `auth.ts`: Estado de autenticación del profesor.
- **`/types`**: Definiciones de TypeScript para asegurar la integridad de los datos (School, Student, Class, etc.).
- **`firebase.ts`**: Configuración de Firebase Client.
- **`firebase-admin.ts`**: Configuración de Firebase Admin para operaciones en el servidor.

### `/src/routes` (Enrutamiento)
- **`/` (Raíz)**: Landing page principal de marketing.
- **`/login`**: Página de acceso mediante Google/Email para el profesor.
- **`/panel`**: **Dashboard principal (Protegido)**.
  - `/schools`, `/classes`, `/students`: Gestión de las entidades.
  - `/reports`: Generación de boletines y estadísticas.
  - `/payments`: Diario de ingresos donde el profesor anota manualmente quién ha pagado, cuánto, cuándo y mediante qué método.
  - `/skills`: Gestión de mapa de habilidades ajedrecísticas.
- **`/api`**: Endpoints internos (ej. `/api/auth/session` para manejar cookies de Firebase).
- **`/pricing`, `/donate`, `/roadmap`**: Páginas de información y monetización.

---

## 3. Lógica de Negocio (Modelo del Profesor)

**Regla de Oro:** Solo existe un tipo de usuario con cuenta: **El Profesor**.

1. **Usuarios vs Registros:**
   - La gente que aparece en los listados (Alumnos) **no son usuarios con login**.
   - Son registros creados y gestionados por el Profesor.
2. **Flujo de Datos:**
   - El profesor se loguea -> El `appStore` se suscribe a sus colecciones de Firestore -> La UI se actualiza en tiempo real.
3. **Privacidad:**
   - Los datos están particionados por `userId` (el ID del profesor). Un profesor no puede ver los alumnos de otro.

---

## 4. Configuración del Proyecto (Raíz)
- `package.json`: Dependencias (Sin Supabase, sin Ko-fi).
- `tailwind.config.js`: Sistema de diseño basado en Violeta e Índigo.
- `netlify.toml`: Configuración de despliegue y headers de seguridad.
- `firestore.rules`: Reglas de seguridad de la base de datos que refuerzan que solo el dueño de los datos pueda leerlos/escribirlos.

---

## 5. Orden del Código en Componentes
Para mantener la limpieza, los archivos `.svelte` siguen este orden:
1. `<script lang="ts">` con imports y lógica de Svelte 5 (Runes).
2. `<svelte:head>` para SEO y títulos.
3. Marcado HTML semántico.
4. `<style>` (solo si es estrictamente necesario, priorizando Tailwind).
