import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Landing page is public - no redirect needed
  // If user is authenticated, they can navigate to dashboard from the landing page
  return {
    isAuthenticated: !!locals.user
  };
};
