import { writable, get } from 'svelte/store';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
    id: string;
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: string; // e.g., 'StudentForm', 'PaymentService'
    data?: any; // Additional data for debugging
    stack?: string; // Stack trace for errors
    userAgent?: string;
    url?: string;
}

interface LogStore {
    entries: LogEntry[];
    maxEntries: number;
}

const MAX_LOG_ENTRIES = 500; // Keep last 500 logs in memory
const STORAGE_KEY = 'chessnet_debug_logs';

// Initialize from localStorage if available
function initLogs(): LogStore {
    if (typeof window === 'undefined') return { entries: [], maxEntries: MAX_LOG_ENTRIES };

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                entries: parsed.entries || [],
                maxEntries: MAX_LOG_ENTRIES
            };
        }
    } catch (e) {
        console.warn('Failed to load logs from localStorage:', e);
    }

    return { entries: [], maxEntries: MAX_LOG_ENTRIES };
}

const logStore = writable<LogStore>(initLogs());

// Persist to localStorage on changes (debounced)
let persistTimeout: ReturnType<typeof setTimeout>;
logStore.subscribe(store => {
    if (typeof window === 'undefined') return;

    clearTimeout(persistTimeout);
    persistTimeout = setTimeout(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                entries: store.entries.slice(-MAX_LOG_ENTRIES) // Only keep last N
            }));
        } catch (e) {
            console.warn('Failed to persist logs:', e);
        }
    }, 1000);
});

function createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    data?: any,
    error?: Error
): LogEntry {
    return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        level,
        message,
        context,
        data,
        stack: error?.stack,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined
    };
}

function addLog(entry: LogEntry) {
    logStore.update(store => {
        const newEntries = [...store.entries, entry];

        // Keep only last N entries
        if (newEntries.length > store.maxEntries) {
            newEntries.shift();
        }

        return { ...store, entries: newEntries };
    });

    // Also log to console in development
    if (import.meta.env.DEV) {
        const consoleMethod = entry.level === 'error' || entry.level === 'critical' ? 'error'
            : entry.level === 'warn' ? 'warn'
                : 'log';

        console[consoleMethod](
            `[${entry.level.toUpperCase()}] ${entry.context ? `[${entry.context}] ` : ''}${entry.message}`,
            entry.data || ''
        );
    }
}

export const logger = {
    debug: (message: string, context?: string, data?: any) => {
        addLog(createLogEntry('debug', message, context, data));
    },

    info: (message: string, context?: string, data?: any) => {
        addLog(createLogEntry('info', message, context, data));
    },

    warn: (message: string, context?: string, data?: any) => {
        addLog(createLogEntry('warn', message, context, data));
    },

    error: (message: string, context?: string, error?: Error | any) => {
        const errorObj = error instanceof Error ? error : undefined;
        const data = error instanceof Error ? undefined : error;
        addLog(createLogEntry('error', message, context, data, errorObj));
    },

    critical: (message: string, context?: string, error?: Error | any) => {
        const errorObj = error instanceof Error ? error : undefined;
        const data = error instanceof Error ? undefined : error;
        addLog(createLogEntry('critical', message, context, data, errorObj));
    },

    // Get all logs (for viewer)
    getLogs: () => get(logStore).entries,

    // Subscribe to logs
    subscribe: logStore.subscribe,

    // Clear all logs
    clear: () => {
        logStore.set({ entries: [], maxEntries: MAX_LOG_ENTRIES });
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    },

    // Export logs as JSON
    export: () => {
        const logs = get(logStore).entries;
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chessnet-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Global error handler
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        logger.critical(
            `Uncaught error: ${event.message}`,
            'GlobalErrorHandler',
            event.error
        );
    });

    window.addEventListener('unhandledrejection', (event) => {
        logger.critical(
            `Unhandled promise rejection: ${event.reason}`,
            'GlobalErrorHandler',
            event.reason
        );
    });
}

// Log app initialization
logger.info('ChessNet application initialized', 'App');
