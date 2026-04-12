<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Política de Privacidad - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 text-slate-100">
  <!-- Header -->
  <div class="bg-slate-800/50 border-b border-slate-700/50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <button
          on:click={() => history.back()}
          class="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div class="flex items-center space-x-3">
          <Shield class="w-6 h-6 text-green-400" />
          <h1 class="text-2xl font-bold text-white">Política de Privacidad</h1>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <p class="text-slate-400 text-sm mb-8">
      Última actualización: {new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    </p>

    <div class="prose prose-slate prose-invert max-w-none">
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">1. Información que Recopilamos</h2>
        
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4">
          <div class="flex items-start space-x-3">
            <Database class="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 class="font-medium text-blue-300 mb-2">Información de Cuenta</h4>
              <ul class="list-disc list-inside text-slate-300 text-sm space-y-1">
                <li>Email y nombre de tu cuenta de Google</li>
                <li>Información de perfil básica</li>
                <li>Fecha de registro y última conexión</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4">
          <div class="flex items-start space-x-3">
            <Eye class="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 class="font-medium text-purple-300 mb-2">Información de Uso</h4>
              <ul class="list-disc list-inside text-slate-300 text-sm space-y-1">
                <li>Datos de estudiantes y centros que gestionas</li>
                <li>Registros de asistencia y progreso académico</li>
                <li>Configuraciones y preferencias de la plataforma</li>
                <li>Información de torneos y competiciones</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4">
          <div class="flex items-start space-x-3">
            <Lock class="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h4 class="font-medium text-green-300 mb-2">Información Técnica</h4>
              <ul class="list-disc list-inside text-slate-300 text-sm space-y-1">
                <li>Dirección IP y ubicación aproximada</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de uso</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">2. Cómo Utilizamos tu Información</h2>
        <p class="text-slate-300 mb-4">Utilizamos la información recopilada para:</p>
        <ul class="list-disc list-inside text-slate-300 mb-4 space-y-2">
          <li>Proporcionar y mantener nuestros servicios educativos</li>
          <li>Personalizar tu experiencia en la plataforma</li>
          <li>Comunicarnos contigo sobre actualizaciones y cambios</li>
          <li>Mejorar nuestros servicios mediante análisis de uso</li>
          <li>Detectar y prevenir actividades fraudulentas</li>
          <li>Cumplir con obligaciones legales</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">3. Compartir Información</h2>
        <p class="text-slate-300 mb-4">
          <strong>No vendemos, alquilamos o compartimos</strong> tu información personal 
          con terceros para fines comerciales. Podemos compartir información en estas situaciones:
        </p>
        <ul class="list-disc list-inside text-slate-300 mb-4 space-y-2">
          <li>Con tu consentimiento explícito</li>
          <li>Para cumplir con requerimientos legales</li>
          <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
          <li>Para proteger nuestros derechos y seguridad</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">4. Cookies y Tecnologías Similares</h2>
        <p class="text-slate-300 mb-4">Utilizamos cookies para:</p>
        <ul class="list-disc list-inside text-slate-300 mb-4 space-y-2">
          <li><strong>Esenciales:</strong> Autenticación y funcionalidad básica</li>
          <li><strong>Análisis:</strong> Google Analytics para mejorar el servicio</li>
          <li><strong>Preferencias:</strong> Recordar configuraciones del usuario</li>
        </ul>
        <p class="text-slate-300 mb-4">
          Puedes controlar las cookies a través de la configuración de tu navegador.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">5. Seguridad de los Datos</h2>
        <p class="text-slate-300 mb-4">
          Implementamos medidas de seguridad técnicas y organizativas para proteger 
          tu información personal, incluyendo:
        </p>
        <ul class="list-disc list-inside text-slate-300 mb-4 space-y-2">
          <li>Cifrado de datos en tránsito y en reposo</li>
          <li>Autenticación segura mediante Google OAuth</li>
          <li>Controles de acceso basados en roles</li>
          <li>Monitoreo continuo de seguridad</li>
          <li>Copias de seguridad regulares</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">6. Tus Derechos</h2>
        <p class="text-slate-300 mb-4">Según el RGPD, tienes derecho a:</p>
        <ul class="list-disc list-inside text-slate-300 mb-4 space-y-2">
          <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
          <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
          <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos</li>
          <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
          <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
          <li><strong>Limitación:</strong> Restringir el procesamiento de tus datos</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">7. Retención de Datos</h2>
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p class="text-yellow-200 text-sm">
            <strong>Versión Beta:</strong> Durante la fase beta, los datos se conservarán 
            hasta que se lance la versión comercial. Te notificaremos con al menos 30 días 
            de antelación sobre cualquier eliminación de datos.
          </p>
        </div>
        <p class="text-slate-300 mb-4">
          En la versión comercial, conservaremos tus datos mientras mantengas una cuenta 
          activa y durante el tiempo necesario para cumplir con obligaciones legales.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">8. Transferencias Internacionales</h2>
        <p class="text-slate-300 mb-4">
          Tus datos se almacenan en servidores ubicados en la Unión Europea. 
          Si necesitamos transferir datos fuera de la UE, implementaremos las 
          salvaguardias adecuadas según el RGPD.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">9. Menores de Edad</h2>
        <p class="text-slate-300 mb-4">
          ChessNet está dirigido a profesores adultos. Si un menor utiliza la plataforma, 
          debe hacerlo bajo la supervisión de un adulto responsable. No recopilamos 
          intencionalmente información personal de menores de 13 años.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">10. Cambios en esta Política</h2>
        <p class="text-slate-300 mb-4">
          Podemos actualizar esta Política de Privacidad ocasionalmente. 
          Te notificaremos sobre cambios significativos mediante email o 
          un aviso prominente en la plataforma.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">11. Contacto</h2>
        <p class="text-slate-300 mb-4">
          Para ejercer tus derechos o resolver dudas sobre privacidad, contacta con nosotros:
        </p>
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <p class="text-slate-300">
            <strong>Email:</strong> chessnetappweb@gmail.com<br>
            <strong>Asunto:</strong> "Privacidad - ChessNet"<br>
            <strong>Respuesta:</strong> Dentro de 30 días hábiles
          </p>
        </div>
      </section>
    </div>
  </div>
</div>
