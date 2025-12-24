# Sistema de Logs de ChessNet

## 📋 Descripción

Sistema centralizado de logging para monitoreo, depuración y diagnóstico de errores en la aplicación ChessNet. Captura automáticamente errores globales, permite logging manual en cualquier parte del código, y proporciona una interfaz visual para inspeccionar los logs.

## 🔐 Acceso

**URL del Visor de Logs:** `/panel/__logs`

Esta ruta está oculta (prefijo `__`) y solo es accesible para desarrolladores/administradores que conozcan la URL.

## 📊 Niveles de Log

- **`debug`**: Información detallada para debugging (ej: valores de variables, flujo de ejecución)
- **`info`**: Eventos informativos normales (ej: "Usuario creó un alumno")
- **`warn`**: Advertencias que no son errores pero requieren atención
- **`error`**: Errores recuperables que no rompen la aplicación
- **`critical`**: Errores graves que pueden afectar la funcionalidad

## 💻 Uso del Logger

### Importar el Logger

```typescript
import { logger } from '$lib/services/logger';
```

### Ejemplos de Uso

```typescript
// Log de información
logger.info('Usuario inició sesión', 'Auth', { userId: '123' });

// Log de advertencia
logger.warn('Límite de plan alcanzado', 'PlanLimits', { 
    plan: 'free', 
    resource: 'students', 
    current: 10, 
    max: 10 
});

// Log de error
try {
    // código que puede fallar
    await saveData();
} catch (error) {
    logger.error('Error al guardar datos', 'Storage', error);
}

// Log crítico
logger.critical('Base de datos inaccesible', 'Database', error);

// Log de debug (solo en desarrollo)
logger.debug('Valor de formulario', 'StudentForm', { formData });
```

### Contextos Recomendados

Usa contextos descriptivos para facilitar el filtrado:

- `Auth` - Autenticación y sesiones
- `Storage` - Operaciones de localStorage
- `StudentForm` - Formulario de alumnos
- `PaymentService` - Servicio de pagos
- `TournamentLogic` - Lógica de torneos
- `GlobalErrorHandler` - Errores no capturados

## 🎯 Características del Visor

### Filtros Disponibles

1. **Búsqueda por texto**: Busca en mensajes y contextos
2. **Filtro por nivel**: Muestra solo logs de un nivel específico
3. **Filtro por contexto**: Filtra por módulo/componente

### Acciones

- **Actualizar**: Refresca manualmente los logs
- **Auto-refresh**: Actualización automática en tiempo real
- **Exportar**: Descarga logs como JSON para análisis externo
- **Limpiar**: Borra todos los logs (requiere confirmación)

### Detalles de Cada Log

- **Timestamp**: Fecha y hora exacta
- **Nivel**: Severidad del evento
- **Contexto**: Módulo/componente de origen
- **Mensaje**: Descripción del evento
- **Datos adicionales**: Información extra (expandible)
- **Stack trace**: Para errores, muestra el stack completo
- **URL**: Página donde ocurrió el evento

## 🔧 Configuración

### Límite de Logs

Por defecto se mantienen los últimos **500 logs** en memoria. Esto se puede ajustar en `logger.ts`:

```typescript
const MAX_LOG_ENTRIES = 500;
```

### Persistencia

Los logs se guardan automáticamente en `localStorage` con la clave `chessnet_debug_logs`. Sobreviven a recargas de página pero se limpian si el usuario borra los datos del navegador.

### Captura Automática de Errores

El logger captura automáticamente:

- **Errores no capturados** (`window.onerror`)
- **Promesas rechazadas** (`unhandledrejection`)

## 📝 Mejores Prácticas

1. **Usa el nivel apropiado**: No uses `error` para advertencias ni `info` para errores
2. **Contextos consistentes**: Usa los mismos nombres de contexto en módulos relacionados
3. **Mensajes descriptivos**: Escribe mensajes claros que expliquen QUÉ pasó
4. **Incluye datos relevantes**: Pasa objetos con información útil para debugging
5. **No loguees datos sensibles**: Evita passwords, tokens, datos personales

## 🚀 Integración en Nuevos Módulos

Cuando crees un nuevo servicio o componente:

```typescript
// En el archivo del servicio
import { logger } from '$lib/services/logger';

export class MiServicio {
    async hacerAlgo() {
        try {
            logger.info('Iniciando operación', 'MiServicio');
            
            // ... lógica ...
            
            logger.info('Operación completada', 'MiServicio', { resultado });
        } catch (error) {
            logger.error('Error en operación', 'MiServicio', error);
            throw error; // Re-lanzar si es necesario
        }
    }
}
```

## 🐛 Debugging con Logs

### Encontrar un Bug

1. Reproduce el error
2. Ve a `/panel/__logs`
3. Filtra por nivel `error` o `critical`
4. Busca el timestamp cercano al momento del error
5. Expande "Stack trace" y "Datos adicionales"
6. Exporta los logs si necesitas compartirlos

### Monitorear Rendimiento

```typescript
logger.debug('Inicio de operación pesada', 'Performance');
const start = performance.now();

// ... operación ...

const duration = performance.now() - start;
logger.debug('Operación completada', 'Performance', { duration: `${duration}ms` });
```

## 📦 Exportación de Logs

El botón "Exportar" genera un archivo JSON con todos los logs:

```json
[
  {
    "id": "1735084800000-abc123",
    "timestamp": "2025-12-25T00:00:00.000Z",
    "level": "error",
    "message": "Error al guardar alumno",
    "context": "StudentForm",
    "data": { "studentId": "123" },
    "stack": "Error: ...",
    "url": "http://localhost:5173/panel/alumnos"
  }
]
```

Este archivo puede ser:
- Compartido con otros desarrolladores
- Analizado con herramientas externas
- Archivado para auditorías

## ⚠️ Consideraciones de Producción

- Los logs se almacenan localmente en el navegador del usuario
- No se envían a ningún servidor (privacidad)
- El límite de 500 logs evita consumo excesivo de memoria
- En producción, considera implementar un servicio de logging remoto para monitoreo centralizado

## 🔮 Futuras Mejoras

- [ ] Integración con servicios externos (Sentry, LogRocket)
- [ ] Gráficos de tendencias de errores
- [ ] Alertas automáticas para errores críticos
- [ ] Filtros por rango de fechas
- [ ] Búsqueda con expresiones regulares
