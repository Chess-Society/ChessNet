# ChessNet - Documentación de API Backend

## Información General

Esta documentación describe las **entidades de datos** y los **endpoints REST** que el frontend de ChessNet necesita para funcionar correctamente. Actualmente, el frontend usa `localStorage` para persistencia local, pero esta documentación define la estructura necesaria para migrar a un backend real.

---

## 📊 Entidades de Datos

### 1. **Center** (Centro)
Representa una ubicación física donde se imparten clases.

```typescript
interface Center {
    id: string;              // UUID único
    name: string;            // Nombre del centro (ej: "Club Ajedrez Madrid")
    location: string;        // Dirección o ubicación
    description?: string;    // Descripción opcional
}
```

**Relaciones:**
- Un Centro puede tener múltiples `ClassGroup` (clases)

---

### 2. **Student** (Alumno)
Representa un estudiante de ajedrez.

```typescript
interface Student {
    id: string;              // UUID único
    name: string;            // Nombre completo del alumno
    email?: string;          // Email de contacto (opcional)
    phone?: string;          // Teléfono de contacto (opcional)
    level: string;           // Nivel: "Pawn" | "Bishop" | "Rook" | "King"
    centerId?: string;       // ID del centro al que pertenece (opcional)
    notes?: string;          // Observaciones del profesor
    skills?: string[];       // Array de IDs de habilidades adquiridas
    joinedAt?: string;       // Fecha de registro (ISO 8601)
}
```

**Relaciones:**
- Pertenece a uno o ningún `Center`
- Puede estar en múltiples `ClassGroup` (relación many-to-many)
- Tiene múltiples `Skill` adquiridas
- Tiene múltiples `AttendanceRecord`
- Tiene múltiples `Payment`

---

### 3. **ClassGroup** (Grupo/Clase)
Representa un grupo de clases con horario fijo.

```typescript
interface ClassGroup {
    id: string;              // UUID único
    name: string;            // Nombre del grupo (ej: "Peones Martes")
    centerId: string;        // ID del centro donde se imparte
    schedule: string;        // Horario (ej: "L-X 17:00", "Martes 18:30")
    level: string;           // Nivel del grupo: "Pawn" | "Bishop" | "Rook" | "King"
    students: string[];      // Array de IDs de alumnos inscritos
    duration?: number;       // Duración de cada clase en minutos (opcional)
}
```

**Relaciones:**
- Pertenece a un `Center`
- Tiene múltiples `Student` (relación many-to-many)
- Tiene múltiples `AttendanceRecord`
- Puede tener múltiples `LessonPlan` asignados

---

### 4. **Skill** (Habilidad)
Representa una habilidad o concepto de ajedrez que los alumnos pueden adquirir.

```typescript
interface Skill {
    id: string;              // UUID único
    name: string;            // Nombre de la habilidad (ej: "Mate del Pastor")
    category: 'Tactics' | 'Strategy' | 'Endgame' | 'Openings';
    level: number;           // Nivel de dificultad (1-10)
    description: string;     // Descripción de la habilidad
    content?: string;        // Contenido detallado/explicación (opcional)
}
```

**Relaciones:**
- Puede ser adquirida por múltiples `Student`
- Puede ser trabajada en múltiples `AttendanceRecord` (sesiones)

---

### 5. **AttendanceRecord** (Registro de Asistencia)
Representa la asistencia de una sesión de clase específica.

```typescript
interface AttendanceRecord {
    id: string;              // UUID único
    classId: string;         // ID del grupo de clase
    date: string;            // Fecha de la sesión (formato: "YYYY-MM-DD")
    records: {
        studentId: string;   // ID del alumno
        status: 'present' | 'absent' | 'excused';  // Estado de asistencia
    }[];
    sessionNotes?: string;   // Observaciones generales de la sesión (opcional)
    skills?: string[];       // IDs de habilidades trabajadas en la sesión (opcional)
}
```

**Relaciones:**
- Pertenece a un `ClassGroup`
- Referencia múltiples `Student`
- Puede referenciar múltiples `Skill` trabajadas

**Reglas de negocio:**
- Solo puede existir **un registro por clase y fecha** (unique constraint)
- Al guardar, se reemplaza el registro existente para esa clase/fecha

---

### 6. **Payment** (Pago)
Representa un pago realizado por un alumno.

```typescript
interface Payment {
    id: string;              // UUID único
    studentId: string;       // ID del alumno que realizó el pago
    amount: number;          // Cantidad pagada (número decimal)
    concept: string;         // Concepto del pago (ej: "Mensualidad Enero")
    date: string;            // Fecha del pago (ISO 8601)
    method: 'cash' | 'transfer' | 'bizum' | 'other';  // Método de pago
    notes?: string;          // Notas adicionales (opcional)
}
```

**Relaciones:**
- Pertenece a un `Student`

---

### 7. **LessonPlan** (Plan de Clase)
Representa una planificación de clase con segmentos temporales.

```typescript
interface LessonSegment {
    id: string;              // UUID único del segmento
    type: 'opening' | 'tactics' | 'strategy' | 'endgame' | 'game' | 'analysis' | 'other';
    title: string;           // Título del segmento
    duration: number;        // Duración en minutos
    notes?: string;          // Notas del segmento (opcional)
}

interface LessonPlan {
    id: string;              // UUID único
    title: string;           // Título del plan de clase
    date?: string;           // Fecha prevista (ISO 8601, opcional)
    classId?: string;        // ID del grupo asignado (opcional)
    segments: LessonSegment[];  // Array de segmentos de la clase
    totalDuration: number;   // Duración total calculada (suma de segmentos)
    createdAt: string;       // Fecha de creación (ISO 8601)
}
```

**Relaciones:**
- Puede estar asignado a un `ClassGroup` (opcional)

---

### 8. **Lead** (Prospecto/Lead CRM)
Representa un contacto potencial interesado en las clases.

```typescript
interface Lead {
    id: string;              // UUID único
    name: string;            // Nombre del prospecto
    contact: string;         // Email o teléfono de contacto
    status: 'new' | 'contacted' | 'trial' | 'converted' | 'lost';
    source?: 'web' | 'referral' | 'flyer' | 'other';  // Origen del lead (opcional)
    notes?: string;          // Notas sobre el prospecto (opcional)
    createdAt: string;       // Fecha de creación (ISO 8601)
}
```

**Relaciones:**
- Ninguna (entidad independiente)

---

### 9. **Tournament** (Torneo)
Representa un torneo de ajedrez con participantes y partidas.

```typescript
interface Match {
    id: string;              // UUID único de la partida
    round: number;           // Número de ronda
    whiteId: string;         // ID del jugador con blancas
    blackId: string;         // ID del jugador con negras
    result: '1-0' | '0-1' | '0.5-0.5' | null;  // Resultado (null = pendiente)
}

interface Tournament {
    id: string;              // UUID único
    name: string;            // Nombre del torneo
    date: string;            // Fecha del torneo (ISO 8601)
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    participants: string[];  // Array de IDs de estudiantes participantes
    matches: Match[];        // Array de partidas del torneo
    format: string;          // Formato del torneo (ej: "Suizo", "Round Robin")
}
```

**Relaciones:**
- Tiene múltiples `Student` como participantes
- Contiene múltiples `Match` (partidas)

---

### 10. **Settings** (Configuración)
Configuración global de la aplicación.

```typescript
interface Settings {
    plan: 'free' | 'profe' | 'club';  // Plan de suscripción activo
    academyName?: string;              // Nombre de la academia (opcional)
    academyLogo?: string;              // URL del logo (opcional)
    currency?: string;                 // Moneda (ej: "EUR", opcional)
    theme?: 'dark' | 'light' | 'system';  // Tema visual (opcional)
    language?: 'es' | 'en';            // Idioma (opcional)
}
```

---

### 11. **Achievement** (Logro)
Representa logros desbloqueados por el usuario (gamificación).

```typescript
interface UnlockedAchievement {
    id: string;              // ID del logro desbloqueado
    unlockedAt: string;      // Fecha de desbloqueo (ISO 8601)
}
```

**Nota:** Los logros disponibles están definidos en `src/lib/services/achievements.ts` y se calculan dinámicamente basándose en el estado de la aplicación.

---

## 🔌 Endpoints REST Necesarios

### **Centros (Centers)**

#### `GET /api/centers`
Obtiene todos los centros del usuario.

**Response:**
```json
{
  "centers": [
    {
      "id": "uuid",
      "name": "Club Ajedrez Madrid",
      "location": "Calle Mayor 1",
      "description": "Centro principal"
    }
  ]
}
```

#### `POST /api/centers`
Crea un nuevo centro.

**Request Body:**
```json
{
  "name": "Nuevo Centro",
  "location": "Dirección",
  "description": "Descripción opcional"
}
```

**Response:** `201 Created` + objeto `Center` creado

#### `DELETE /api/centers/:id`
Elimina un centro.

**Response:** `204 No Content`

---

### **Alumnos (Students)**

#### `GET /api/students`
Obtiene todos los alumnos.

**Query Parameters (opcionales):**
- `centerId`: Filtrar por centro
- `classId`: Filtrar por clase
- `level`: Filtrar por nivel

**Response:**
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "level": "Pawn",
      "skills": ["skill-id-1", "skill-id-2"],
      "notes": "Progresa bien",
      "joinedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### `POST /api/students`
Crea un nuevo alumno.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+34600000000",
  "level": "Pawn",
  "centerId": "center-uuid",
  "notes": "Observaciones iniciales"
}
```

**Response:** `201 Created` + objeto `Student` creado

#### `PUT /api/students/:id`
Actualiza un alumno existente.

**Request Body:** Campos a actualizar (parcial)

**Response:** `200 OK` + objeto `Student` actualizado

#### `DELETE /api/students/:id`
Elimina un alumno.

**Response:** `204 No Content`

#### `POST /api/students/:id/skills/:skillId`
Asigna una habilidad a un alumno.

**Response:** `200 OK`

#### `DELETE /api/students/:id/skills/:skillId`
Quita una habilidad de un alumno.

**Response:** `200 OK`

---

### **Clases (ClassGroups)**

#### `GET /api/classes`
Obtiene todos los grupos de clases.

**Query Parameters (opcionales):**
- `centerId`: Filtrar por centro

**Response:**
```json
{
  "classes": [
    {
      "id": "uuid",
      "name": "Peones Martes",
      "centerId": "center-uuid",
      "schedule": "Martes 17:00",
      "level": "Pawn",
      "students": ["student-id-1", "student-id-2"],
      "duration": 60
    }
  ]
}
```

#### `POST /api/classes`
Crea un nuevo grupo de clase.

**Request Body:**
```json
{
  "name": "Peones Martes",
  "centerId": "center-uuid",
  "schedule": "Martes 17:00",
  "level": "Pawn",
  "duration": 60
}
```

**Response:** `201 Created` + objeto `ClassGroup` creado

#### `PUT /api/classes/:id`
Actualiza un grupo de clase.

**Request Body:** Campos a actualizar

**Response:** `200 OK` + objeto `ClassGroup` actualizado

#### `DELETE /api/classes/:id`
Elimina un grupo de clase.

**Response:** `204 No Content`

#### `POST /api/classes/:id/students/:studentId`
Añade un alumno a una clase.

**Response:** `200 OK`

#### `DELETE /api/classes/:id/students/:studentId`
Quita un alumno de una clase.

**Response:** `200 OK`

---

### **Habilidades (Skills)**

#### `GET /api/skills`
Obtiene todas las habilidades disponibles.

**Query Parameters (opcionales):**
- `category`: Filtrar por categoría ('Tactics', 'Strategy', 'Endgame', 'Openings')
- `level`: Filtrar por nivel de dificultad

**Response:**
```json
{
  "skills": [
    {
      "id": "uuid",
      "name": "Mate del Pastor",
      "category": "Tactics",
      "level": 2,
      "description": "Patrón de mate rápido",
      "content": "Explicación detallada..."
    }
  ]
}
```

#### `POST /api/skills`
Crea una nueva habilidad.

**Request Body:**
```json
{
  "name": "Nueva Habilidad",
  "category": "Tactics",
  "level": 5,
  "description": "Descripción",
  "content": "Contenido detallado"
}
```

**Response:** `201 Created` + objeto `Skill` creado

#### `PUT /api/skills/:id`
Actualiza una habilidad.

**Request Body:** Campos a actualizar

**Response:** `200 OK` + objeto `Skill` actualizado

#### `DELETE /api/skills/:id`
Elimina una habilidad.

**Response:** `204 No Content`

**Nota:** Al eliminar una habilidad, debe eliminarse también de todos los alumnos que la tenían asignada.

---

### **Asistencia (Attendance)**

#### `GET /api/attendance`
Obtiene registros de asistencia.

**Query Parameters (opcionales):**
- `classId`: Filtrar por clase
- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `studentId`: Filtrar por alumno específico

**Response:**
```json
{
  "attendance": [
    {
      "id": "uuid",
      "classId": "class-uuid",
      "date": "2024-01-15",
      "records": [
        {
          "studentId": "student-uuid",
          "status": "present"
        }
      ],
      "sessionNotes": "Trabajamos aperturas",
      "skills": ["skill-id-1"]
    }
  ]
}
```

#### `POST /api/attendance`
Guarda un registro de asistencia.

**Request Body:**
```json
{
  "classId": "class-uuid",
  "date": "2024-01-15",
  "records": [
    {
      "studentId": "student-uuid",
      "status": "present"
    }
  ],
  "sessionNotes": "Notas de la sesión",
  "skills": ["skill-id-1"]
}
```

**Response:** `201 Created` + objeto `AttendanceRecord` creado

**Regla de negocio:** Si ya existe un registro para la misma `classId` y `date`, debe reemplazarse.

---

### **Pagos (Payments)**

#### `GET /api/payments`
Obtiene todos los pagos.

**Query Parameters (opcionales):**
- `studentId`: Filtrar por alumno
- `startDate`: Fecha inicio
- `endDate`: Fecha fin
- `method`: Filtrar por método de pago

**Response:**
```json
{
  "payments": [
    {
      "id": "uuid",
      "studentId": "student-uuid",
      "amount": 50.00,
      "concept": "Mensualidad Enero",
      "date": "2024-01-05T10:00:00Z",
      "method": "transfer",
      "notes": "Transferencia recibida"
    }
  ]
}
```

#### `POST /api/payments`
Registra un nuevo pago.

**Request Body:**
```json
{
  "studentId": "student-uuid",
  "amount": 50.00,
  "concept": "Mensualidad Enero",
  "date": "2024-01-05T10:00:00Z",
  "method": "transfer",
  "notes": "Notas opcionales"
}
```

**Response:** `201 Created` + objeto `Payment` creado

#### `DELETE /api/payments/:id`
Elimina un pago.

**Response:** `204 No Content`

---

### **Planes de Clase (Lesson Plans)**

#### `GET /api/lesson-plans`
Obtiene todos los planes de clase.

**Query Parameters (opcionales):**
- `classId`: Filtrar por clase asignada
- `date`: Filtrar por fecha

**Response:**
```json
{
  "plans": [
    {
      "id": "uuid",
      "title": "Clase de Aperturas",
      "date": "2024-01-20",
      "classId": "class-uuid",
      "segments": [
        {
          "id": "segment-uuid",
          "type": "opening",
          "title": "Apertura Italiana",
          "duration": 20,
          "notes": "Explicar conceptos básicos"
        }
      ],
      "totalDuration": 60,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### `POST /api/lesson-plans`
Crea un nuevo plan de clase.

**Request Body:**
```json
{
  "title": "Clase de Aperturas",
  "date": "2024-01-20",
  "classId": "class-uuid",
  "segments": [
    {
      "type": "opening",
      "title": "Apertura Italiana",
      "duration": 20,
      "notes": "Notas del segmento"
    }
  ]
}
```

**Response:** `201 Created` + objeto `LessonPlan` creado

**Nota:** `totalDuration` se calcula automáticamente sumando la duración de todos los segmentos.

#### `DELETE /api/lesson-plans/:id`
Elimina un plan de clase.

**Response:** `204 No Content`

---

### **Leads (CRM)**

#### `GET /api/leads`
Obtiene todos los prospectos.

**Query Parameters (opcionales):**
- `status`: Filtrar por estado
- `source`: Filtrar por origen

**Response:**
```json
{
  "leads": [
    {
      "id": "uuid",
      "name": "María García",
      "contact": "maria@example.com",
      "status": "new",
      "source": "web",
      "notes": "Interesada en clases para niños",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

#### `POST /api/leads`
Crea un nuevo prospecto.

**Request Body:**
```json
{
  "name": "María García",
  "contact": "maria@example.com",
  "status": "new",
  "source": "web",
  "notes": "Notas iniciales"
}
```

**Response:** `201 Created` + objeto `Lead` creado

#### `PUT /api/leads/:id`
Actualiza un prospecto.

**Request Body:** Campos a actualizar

**Response:** `200 OK` + objeto `Lead` actualizado

#### `DELETE /api/leads/:id`
Elimina un prospecto.

**Response:** `204 No Content`

---

### **Torneos (Tournaments)**

#### `GET /api/tournaments`
Obtiene todos los torneos.

**Query Parameters (opcionales):**
- `status`: Filtrar por estado

**Response:**
```json
{
  "tournaments": [
    {
      "id": "uuid",
      "name": "Torneo Primavera 2024",
      "date": "2024-03-15T10:00:00Z",
      "status": "Upcoming",
      "participants": ["student-id-1", "student-id-2"],
      "matches": [
        {
          "id": "match-uuid",
          "round": 1,
          "whiteId": "student-id-1",
          "blackId": "student-id-2",
          "result": null
        }
      ],
      "format": "Suizo"
    }
  ]
}
```

#### `POST /api/tournaments`
Crea un nuevo torneo.

**Request Body:**
```json
{
  "name": "Torneo Primavera 2024",
  "date": "2024-03-15T10:00:00Z",
  "status": "Upcoming",
  "participants": ["student-id-1", "student-id-2"],
  "format": "Suizo"
}
```

**Response:** `201 Created` + objeto `Tournament` creado

#### `PUT /api/tournaments/:id`
Actualiza un torneo (incluye actualización de partidas).

**Request Body:** Objeto `Tournament` completo actualizado

**Response:** `200 OK` + objeto `Tournament` actualizado

#### `DELETE /api/tournaments/:id`
Elimina un torneo.

**Response:** `204 No Content`

---

### **Configuración (Settings)**

#### `GET /api/settings`
Obtiene la configuración del usuario.

**Response:**
```json
{
  "settings": {
    "plan": "profe",
    "academyName": "Academia de Ajedrez",
    "academyLogo": "https://...",
    "currency": "EUR",
    "theme": "dark",
    "language": "es"
  }
}
```

#### `PUT /api/settings`
Actualiza la configuración.

**Request Body:** Campos a actualizar (parcial)

**Response:** `200 OK` + objeto `Settings` actualizado

---

### **Logros (Achievements)**

#### `GET /api/achievements`
Obtiene los logros desbloqueados del usuario.

**Response:**
```json
{
  "unlockedAchievements": [
    {
      "id": "first-student",
      "unlockedAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

#### `POST /api/achievements/:id/unlock`
Desbloquea un logro.

**Response:** `200 OK`

**Nota:** Los logros se calculan automáticamente en el frontend basándose en el estado de la aplicación. Este endpoint solo registra el desbloqueo.

---

### **Dashboard**

#### `GET /api/dashboard/layout`
Obtiene el orden personalizado de acciones rápidas del dashboard.

**Response:**
```json
{
  "dashboardLayout": ["students", "classes", "attendance", "payments"]
}
```

#### `PUT /api/dashboard/layout`
Actualiza el orden del dashboard.

**Request Body:**
```json
{
  "dashboardLayout": ["students", "classes", "attendance", "payments"]
}
```

**Response:** `200 OK`

---

## 🔒 Límites de Plan

El sistema implementa límites según el plan de suscripción:

```typescript
const PLAN_LIMITS = {
    free: { 
        centers: 1, 
        classes: 2, 
        students: 10, 
        tournaments: false,  // No permitido
        reports: false       // No permitido
    },
    profe: { 
        centers: 3, 
        classes: 10, 
        students: 50, 
        tournaments: false,  // No permitido
        reports: true 
    },
    club: { 
        centers: Infinity,   // Sin límite
        classes: Infinity,   // Sin límite
        students: Infinity,  // Sin límite
        tournaments: true, 
        reports: true 
    }
};
```

**El backend debe validar estos límites antes de crear nuevos recursos.**

---

## 📝 Notas de Implementación

1. **Autenticación:** Todos los endpoints requieren autenticación JWT (no implementada en el frontend actual).

2. **IDs:** El frontend genera UUIDs usando `crypto.randomUUID()`. El backend puede generar sus propios IDs o aceptar los del cliente.

3. **Fechas:** Todas las fechas deben estar en formato ISO 8601 (UTC).

4. **Validación:** El backend debe validar:
   - Límites de plan antes de crear recursos
   - Unicidad de registros de asistencia (classId + date)
   - Existencia de referencias (ej: centerId, studentId)

5. **Sincronización:** El frontend actual usa `BroadcastChannel` para sincronizar pestañas. Con un backend, esto se puede reemplazar con WebSockets o polling.

6. **Paginación:** Para endpoints que devuelven listas grandes (students, payments, attendance), se recomienda implementar paginación:
   ```
   GET /api/students?page=1&limit=50
   ```

7. **Búsqueda:** Endpoints como `/api/students` deberían soportar búsqueda por texto:
   ```
   GET /api/students?search=juan
   ```

---

## 🚀 Migración desde localStorage

El frontend actual usa `src/lib/services/storage.ts` para gestionar el estado. Para migrar a un backend:

1. Reemplazar `storeActions` con llamadas HTTP
2. Implementar manejo de errores y estados de carga
3. Añadir caché optimista para mejor UX
4. Implementar sincronización en tiempo real (opcional)

**Ejemplo de migración:**

```typescript
// Antes (localStorage)
storeActions.addStudent(student);

// Después (API)
const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
});
const newStudent = await response.json();
appStore.update(s => ({ ...s, students: [...s.students, newStudent] }));
```

---

## 📞 Contacto

Para dudas sobre la implementación, consultar el código fuente en:
- **Entidades:** `src/lib/services/storage.ts`
- **Componentes:** `src/routes/panel/`
- **Lógica de negocio:** `src/lib/services/achievements.ts`
