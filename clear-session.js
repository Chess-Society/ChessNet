// Script para limpiar la sesión completamente
console.log('🧹 Limpiando sesión...');

// Limpiar localStorage
localStorage.clear();

// Limpiar sessionStorage
sessionStorage.clear();

// Limpiar cookies manualmente
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log('✅ Sesión limpiada');
window.location.href = '/login';
