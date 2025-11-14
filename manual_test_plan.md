# Plan de Pruebas Manual - ChessNet

## 🎯 Objetivo
Verificar el funcionamiento completo de la plataforma educativa de ajedrez ChessNet.

## 🔧 Configuración Previa
- ✅ Servidor corriendo en http://localhost:5173/
- ✅ Base de datos Supabase conectada
- ✅ Autenticación mock activa para desarrollo

## 📋 Casos de Prueba

### 1. **Autenticación y Navegación Básica**
- [ ] Verificar que la página principal carga correctamente
- [ ] Comprobar redirección automática al dashboard (modo dev)
- [ ] Verificar que el usuario mock está autenticado (dev@localhost.com)
- [ ] Probar navegación entre secciones principales

### 2. **Gestión de Centros (Colleges)**
- [ ] Acceder a la sección "Centros/Colegios"
- [ ] Crear un nuevo centro educativo
- [ ] Verificar que se muestra en la lista
- [ ] Editar información del centro
- [ ] Eliminar centro (si está vacío)

### 3. **Gestión de Clases**
- [ ] Crear una nueva clase
- [ ] Asignar nivel (principiante/intermedio/avanzado)
- [ ] Configurar horarios y descripción
- [ ] Verificar que aparece en el dashboard

### 4. **Gestión de Estudiantes**
- [ ] Añadir estudiantes a una clase
- [ ] Completar información del estudiante
- [ ] Verificar datos de contacto de padres
- [ ] Probar búsqueda y filtrado de estudiantes

### 5. **Sistema de Habilidades**
- [ ] Crear nuevas habilidades de ajedrez
- [ ] Asignar categorías y niveles
- [ ] Vincular habilidades a clases
- [ ] Verificar progreso de estudiantes

### 6. **Control de Asistencia**
- [ ] Marcar asistencia para una clase
- [ ] Probar diferentes estados (Presente/Tarde/Ausente)
- [ ] Verificar estadísticas de asistencia
- [ ] Generar reportes de asistencia

### 7. **Tablero de Ajedrez Interactivo**
- [ ] Cargar el componente de tablero
- [ ] Mover piezas correctamente
- [ ] Probar ejercicios de ajedrez
- [ ] Verificar validación de movimientos

### 8. **Sistema de Torneos**
- [ ] Crear un torneo local
- [ ] Inscribir estudiantes
- [ ] Generar emparejamientos
- [ ] Registrar resultados
- [ ] Ver clasificaciones

### 9. **Dashboard y Analíticas**
- [ ] Verificar métricas del dashboard
- [ ] Comprobar gráficos y estadísticas
- [ ] Probar filtros por fecha
- [ ] Exportar reportes

### 10. **Gestión de Pagos**
- [ ] Crear registros de pagos
- [ ] Marcar como pagado/pendiente
- [ ] Verificar resúmenes financieros
- [ ] Generar facturas

## 🚨 Pruebas de Errores
- [ ] Probar formularios con datos inválidos
- [ ] Verificar manejo de errores de conexión
- [ ] Comprobar validaciones del lado cliente
- [ ] Probar límites de datos (campos muy largos)

## 📱 Pruebas de Responsividad
- [ ] Probar en pantallas móviles
- [ ] Verificar tablet
- [ ] Comprobar desktop
- [ ] Probar diferentes resoluciones

## ⚡ Pruebas de Rendimiento
- [ ] Tiempo de carga inicial
- [ ] Navegación entre páginas
- [ ] Carga de listas grandes
- [ ] Rendimiento del tablero de ajedrez

## 🔒 Pruebas de Seguridad
- [ ] Verificar políticas RLS en Supabase
- [ ] Comprobar filtrado por user_id
- [ ] Probar acceso a datos de otros usuarios
- [ ] Validar tokens de sesión

## 📊 Criterios de Aceptación
- ✅ Todas las funcionalidades principales operativas
- ✅ Sin errores críticos en consola
- ✅ Navegación fluida y intuitiva
- ✅ Datos persistentes correctamente
- ✅ Interfaz responsiva en todos los dispositivos

## 🎯 Próximos Pasos
Una vez completadas las pruebas manuales, se recomienda:
1. Implementar pruebas automatizadas con Playwright/Cypress
2. Configurar CI/CD para pruebas automáticas
3. Añadir pruebas de integración con Supabase
4. Implementar monitoreo de errores en producción
