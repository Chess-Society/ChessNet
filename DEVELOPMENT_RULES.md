# ⚡ ChessNet — Reglas de Integridad del Sistema
**Documento normativo técnico para todos los contributors y sesiones de desarrollo.**

---

## 🔒 REGLA 1 — Nunca escribir en Firestore directamente desde el cliente para colecciones protegidas

Las siguientes colecciones **SOLO** pueden ser escritas mediante la API de servidor (`/api/...`) que usa `adminDb` (Firebase Admin SDK). Escribir con el SDK cliente viola las Firestore Rules y produce errores silenciosos o visibles.

| Colección | Operaciones via API | Endpoint |
|---|---|---|
| `payments` | CREATE, DELETE | `POST/DELETE /api/payments` |
| `achievements` | CREATE, PATCH | `POST/PATCH /api/achievements` |
| `user_subscriptions` | CREATE, UPDATE | Solo desde el servidor Stripe |
| `system/*` | Todas | Solo admin directo |
| `lobby_reports` | UPDATE (status) | Solo admin |

**Colecciones que SÍ puede escribir el cliente (SDK normal):**
`schools`, `classes`, `students`, `attendance`, `skills`, `app_settings`, `lobby_suggestions`, `lobby_reports` (solo create/update-sin-campos-sensibles).

---

## 🔒 REGLA 2 — El mock de desarrollo NUNCA va a producción

El sistema tiene un bypass de autenticación para desarrollo local:
```
Cookie: __session = "mock-session-chessnet"
Token:  "mock-chessnet-token"
UID:    "chessnet-dev-uid"
```

**Estas credenciales están bloqueadas en producción** por `process.env.NODE_ENV === 'development'` tanto en:
- `src/lib/server/auth.ts` (bypass de cookie)
- `src/routes/api/auth/session/+server.ts` (bypass de token)

> [!CAUTION]
> NUNCA registrar, commitear ni documentar estas credenciales en código de producción.
> Si se necesita probar en staging, crear un usuario de prueba real en Firebase Auth.

---

## 🔒 REGLA 3 — deleteAccount siempre usa /api/users/me

El borrado de cuenta DEBE pasar siempre por el endpoint `DELETE /api/users/me` que:
1. Usa `adminDb` para limpiar **todas** las colecciones (batch de 25 colecciones)
2. Borra el perfil `/users/{uid}` y `/app_settings/{uid}`
3. Llama a `adminAuth.deleteUser(uid)`
4. Limpia la cookie de sesión

**Nunca** hacer `deleteDoc(doc(db, 'users', uid))` + `user.delete()` directamente porque deja todos los datos de negocio huérfanos en Firestore.

---

## 🔒 REGLA 4 — Toda nueva API debe validar el usuario autenticado

Toda nueva `RequestHandler` debe comenzar con:
```typescript
const { user } = await authenticate(event);
if (!user) return json({ error: 'No autorizado' }, { status: 401 });
```

Y si la operación es sensible (borrar, modificar otro usuario, etc.):
```typescript
const { user, isAdmin } = await authenticate(event);
if (!user) return json({ error: 'No autorizado' }, { status: 401 });
if (!isAdmin) return json({ error: 'Sin permisos' }, { status: 403 });
```

---

## 🔒 REGLA 5 — Toda operación async en UI debe manejar errores

Los handlers de Svelte que llaman a funciones async **deben ser async** y **deben capturar errores**:

```typescript
// ❌ INCORRECTO — Error silencioso
const handleSave = () => {
  appStore.updateSettings({...}); // Promise ignorada
  saved = true; // Siempre muestra éxito
};

// ✅ CORRECTO
const handleSave = async () => {
  try {
    await appStore.updateSettings({...});
    saved = true;
  } catch (err: any) {
    toast.error(err?.message || 'Error guardando');
  }
};
```

---

## 🔒 REGLA 6 — Protección de rutas premium en el servidor

Las rutas premium deben tener un guard en `+page.server.ts`, no solo en el componente:

```typescript
// src/routes/panel/payments/+page.server.ts
import { requireUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  const { user } = await requireUser(event);
  const plan = await getUserPlan(user.uid);
  if (plan === 'free') throw redirect(303, '/panel/upgrade');
  return { user };
};
```

---

## 🔒 REGLA 7 — La lista de admins tiene ÚNICA fuente de verdad

Los emails de administradores se mantienen en **`src/lib/constants.ts` únicamente**.

Las Firestore Rules usan su propia lista hardcodeada (requerimiento de sintaxis de Rules). Si se añade un nuevo admin:
1. Añadir a `ADMIN_EMAILS` en `src/lib/constants.ts`
2. Añadir a la función `isSuperAdmin()` en `firestore.rules`
3. Añadir el Custom Claim `admin: true` en Firebase Console (o con Admin SDK)

**Solución ideal a largo plazo:** Usar `request.auth.token.admin == true` en las Firestore Rules y gestionar todo con Firebase Custom Claims.

---

## 🔒 REGLA 8 — onSnapshot solo para colecciones del usuario

Los listeners de Firestore `onSnapshot` **siempre** deben filtrar por `owner_id`:
```typescript
const q = query(
  collection(db, 'cualquier_coleccion'),
  where('owner_id', '==', user.uid) // OBLIGATORIO
);
```
Sin este filtro, el usuario podría intentar leer datos de otros usuarios (aunque las Firestore Rules lo bloquearían, genera errores en consola y baja el rendimiento).

---

## 🔒 REGLA 9 — Los archivos .zip nunca van al repositorio

Los archivos de build (`.zip`, `dist/`, `build/`) no deben commitearse ni mantenerse en el repo.
Verificar que `.gitignore` incluye:
```
*.zip
build/
dist/
.netlify/
```

---

## 🔒 REGLA 10 — Estructura de una nueva feature

Al añadir una nueva funcionalidad, seguir esta secuencia:

```
1. Definir el esquema de datos en Firestore
2. Añadir la regla de seguridad en firestore.rules
3. Crear el endpoint API en /api/[feature]/+server.ts (usando adminDb)
4. Actualizar el appStore (usando fetch a la API, nunca addDoc/deleteDoc directos para colecciones protegidas)
5. Crear el componente Svelte
6. Añadir traducciones en src/lib/i18n/
7. Verificar con npm run build antes de commit
```

---

## 📋 Checklist de Deploy

Antes de cada deploy a producción, verificar:

- [ ] `npm run build` completado sin errores
- [ ] Variables de entorno en Netlify: `FB_PROJECT_ID`, `FB_CLIENT_EMAIL`, `FB_PRIVATE_KEY`
- [ ] Reglas de Firestore deployadas: `firebase deploy --only firestore:rules`
- [ ] No hay archivos `.zip` o carpetas `build/` commiteados
- [ ] No hay `console.log` con datos sensibles en código de producción
- [ ] El modo mantenimiento está desactivado en `/system/config`
