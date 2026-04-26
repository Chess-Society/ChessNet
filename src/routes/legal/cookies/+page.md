---
title: Política de Cookies
subtitle: Gobernanza de Datos & Privacidad
updatedDate: Abril 2026
---

<script>
  import LegalLayout from '$lib/components/ui/LegalLayout.svelte';
  import { Cookie, Shield, Activity, UserCheck } from 'lucide-svelte';
</script>

<LegalLayout {title} {subtitle} {updatedDate} icon={Cookie}>

## 🛡️ Almacenamiento Crítico
ChessNet minimiza el uso de rastreadores externos, priorizando tecnologías esenciales para la operatividad del sistema.

### 1. Sesión y Autenticación
- **Firebase Auth:** Gestiona tu identidad de forma segura (`chessnet-auth`).
- **Estado de Sesión:** Mantiene tu conexión activa mientras navegas.

### 2. Preferencias Locales (`localStorage`)
- **UI State:** Recordamos si prefieres el modo oscuro o el tamaño de los componentes.
- **Filtros:** Persistencia de tus búsquedas recientes en el panel.

## ⚙️ Control Total
Al utilizar nuestra plataforma, aceptas estas tecnologías necesarias. Puedes limpiar los datos desde los ajustes de tu navegador en cualquier momento, aunque esto requerirá iniciar sesión nuevamente.

---

**Soporte Técnico:** [chessnetappweb@gmail.com](mailto:chessnetappweb@gmail.com)

</LegalLayout>
