// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      message: string;
      details?: string;
    }
    interface Locals {
      auth(): Promise<any>;
      user: any | null;
      isAdmin: boolean;
      role: import('$lib/server/roles').UserRole;
      impersonateEmail: string | null;
      impersonateId?: string | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

}

export {};
