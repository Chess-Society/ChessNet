import { get } from 'svelte/store';
import { toast } from '../toast';
import { t } from '$lib/i18n';

/**
 * Generic helper for API calls with standard error handling and toast notifications.
 */
export async function apiFetch(url: string, options: RequestInit = {}, errorMessage?: string) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      const msg = result.error || result.message || errorMessage || 'Error in request';
      console.error(`❌ [API] Error at ${url}:`, msg);
      throw new Error(msg);
    }

    return result;
  } catch (error: any) {
    console.error(`❌ [API] Fatal error at ${url}:`, error.message);
    throw error;
  }
}
