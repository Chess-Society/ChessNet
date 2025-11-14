@echo off
echo Limpiando archivos anteriores...
if exist .svelte-kit rmdir /s /q .svelte-kit
if exist .netlify rmdir /s /q .netlify

echo Instalando dependencias...
npm install --legacy-peer-deps

echo Construyendo proyecto...
npm run build

echo Desplegando a Netlify...
npx netlify deploy --prod

echo ¡Despliegue completado!
pause
