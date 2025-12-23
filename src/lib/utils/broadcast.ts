import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * BroadcastChannel for real-time updates across tabs
 * Allows spectator mode to receive live updates when tournament data changes
 */

const CHANNEL_NAME = 'chessnet-updates';

let channel: BroadcastChannel | null = null;

if (browser && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
}

export interface BroadcastMessage {
    type: 'tournament-update' | 'storage-update';
    tournamentId?: string;
    timestamp: number;
}

/**
 * Send a broadcast message to all tabs
 */
export function broadcastUpdate(message: Omit<BroadcastMessage, 'timestamp'>) {
    if (channel) {
        const fullMessage: BroadcastMessage = {
            ...message,
            timestamp: Date.now()
        };
        channel.postMessage(fullMessage);
    }
}

/**
 * Listen for broadcast messages
 */
export function onBroadcastMessage(callback: (message: BroadcastMessage) => void) {
    if (channel) {
        channel.onmessage = (event) => {
            callback(event.data);
        };
    }

    // Cleanup function
    return () => {
        if (channel) {
            channel.onmessage = null;
        }
    };
}

/**
 * Close the broadcast channel (cleanup)
 */
export function closeBroadcastChannel() {
    if (channel) {
        channel.close();
        channel = null;
    }
}

/**
 * Create a store that syncs across tabs
 */
export function createSyncedStore<T>(key: string, initialValue: T) {
    const store = writable<T>(initialValue);

    if (browser) {
        // Load from localStorage on init
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                store.set(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing stored value:', e);
            }
        }

        // Listen for storage events (changes from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === key && e.newValue) {
                try {
                    store.set(JSON.parse(e.newValue));
                } catch (err) {
                    console.error('Error parsing storage event:', err);
                }
            }
        });

        // Listen for broadcast messages
        onBroadcastMessage((message) => {
            if (message.type === 'storage-update') {
                const stored = localStorage.getItem(key);
                if (stored) {
                    try {
                        store.set(JSON.parse(stored));
                    } catch (e) {
                        console.error('Error parsing broadcast update:', e);
                    }
                }
            }
        });
    }

    return store;
}
