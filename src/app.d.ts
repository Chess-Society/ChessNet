// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: any | null;
      isAdmin: boolean;
      impersonateEmail: string | null;
      impersonateId?: string | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

}

export {};
