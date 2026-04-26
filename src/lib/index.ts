// Punto de entrada principal para el paquete ChessNet
// Este archivo exporta las APIs públicas de la biblioteca interna

// Componentes UI
export { default as ConfirmModal } from './components/ui/ConfirmModal.svelte';
export { default as LegalLayout } from './components/ui/LegalLayout.svelte';

// Componentes Comunes
export { default as Logo } from './components/Logo.svelte';
export { default as Toast } from './components/Toast.svelte';
export { default as LoadingSpinner } from './components/LoadingSpinner.svelte';
export { default as SkeletonLoader } from './components/SkeletonLoader.svelte';
export { default as ChessBoard } from './components/ChessBoard.svelte';

// Firebase
export * from './firebase';

// I18n
export * from './i18n';

// Stores
export * from './stores/uiStore';
export * from './stores/auth';
export * from './stores/appStore';
export * from './stores/configStore';
export * from './stores/toast';

// Utils
export * from './utils';

// Schemas
export * from './schemas/school';

// Constants
export * from './constants';
