# 🚀 Configuración de ChessNet

## ❌ Error: "No API key found in request"

Este error indica que las variables de entorno de Supabase no están configuradas correctamente.

## 🔧 Solución Paso a Paso

### 1. Configuración Local (Desarrollo)

1. **Crea el archivo `.env`** en la raíz del proyecto:
   ```bash
   cp env.example .env
   ```

2. **Obtén tus credenciales de Supabase**:
   - Ve a [Supabase Dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto
   - Ve a **Settings** > **API**
   - Copia la **URL** y la **anon key**

3. **Edita el archivo `.env`** con tus credenciales reales:
   ```env
   PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   PUBLIC_SITE_URL=https://chessnet.app
   ```

### 2. Configuración en Netlify (Producción)

1. **Ve a tu dashboard de Netlify**
2. **Selecciona tu sitio** (chessnet.app)
3. **Ve a Site Settings** > **Environment Variables**
4. **Agrega las siguientes variables**:

   | Variable | Valor |
   |----------|-------|
   | `PUBLIC_SUPABASE_URL` | `https://tu-proyecto-id.supabase.co` |
   | `PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
   | `PUBLIC_SITE_URL` | `https://chessnet.app` |

5. **Redeploya tu sitio** para que los cambios tomen efecto

### 3. Verificación

Después de configurar las variables:

1. **En desarrollo**: Reinicia el servidor de desarrollo
   ```bash
   npm run dev
   ```

2. **En producción**: Haz un nuevo deploy en Netlify

3. **Verifica en la consola del navegador** que aparezca:
   ```
   ✅ Supabase configurado correctamente
   ```

## 🔍 Troubleshooting

### Error persiste después de configurar variables

1. **Verifica que las variables estén correctas**:
   - La URL debe terminar en `.supabase.co`
   - La anon key debe ser un JWT válido

2. **Limpia la caché del navegador**

3. **Verifica en Netlify** que las variables estén configuradas:
   - Ve a Site Settings > Environment Variables
   - Asegúrate de que no haya espacios extra
   - Las variables deben estar en mayúsculas

### Variables no se cargan en desarrollo

1. **Verifica que el archivo `.env` esté en la raíz del proyecto**
2. **Reinicia el servidor de desarrollo**
3. **Verifica que no haya errores de sintaxis en `.env`**

## 📞 Soporte

Si el problema persiste:
1. Verifica los logs en la consola del navegador
2. Revisa los logs de Netlify en el dashboard
3. Asegúrate de que tu proyecto de Supabase esté activo
