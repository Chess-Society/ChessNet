import type { LoginInput } from '$lib/schemas';

// Simulación de estructura de respuesta de API
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'user';
    };
}

/**
 * Servicio de Autenticación
 * 
 * Preparado para realizar llamadas REST a la API real.
 * Actualmente usa Mocks para permitir el desarrollo del Front.
 */
export const AuthService = {
    /**
     * Inicia sesión en el sistema.
     * Endpoint esperado: POST /api/auth/login
     */
    async login(data: LoginInput): Promise<AuthResponse> {
        console.log('[AuthService] Iniciando login...', data);

        // Simulación de latencia de red (Network Delay)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulación de error si el email es específico (para pruebas)
        if (data.email.includes('error')) {
            throw new Error('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
        }

        // TODO: Reemplazar con llamada real a API cuando esté disponible
        // const response = await fetch(`${API_URL}/auth/login`, {
        //     method: 'POST',
        //     body: JSON.stringify(data),
        //     headers: { 'Content-Type': 'application/json' }
        // });
        // return await response.json();

        // Respuesta Exitosa Simulada (Mock)
        return {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
                id: 'user_001',
                name: 'Administrador Ajedrez',
                email: data.email,
                role: 'admin'
            }
        };
    },

    /**
     * Cierra la sesión del usuario.
     * Endpoint esperado: POST /api/auth/logout
     */
    async logout(): Promise<void> {
        console.log('[AuthService] Cerrando sesión...');

        // Simulación de latencia
        await new Promise(resolve => setTimeout(resolve, 500));

        // TODO: Llamada real
        // await fetch(`${API_URL}/auth/logout`, { method: 'POST' });

        // Limpieza local
        localStorage.removeItem('chessnet_session');
    }
};
