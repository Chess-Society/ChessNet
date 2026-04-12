import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies }) => {
  try {
    let user = locals.user;

    if (!user) {
      const session = cookies.get('sb-auth-token');
      if (session) {
        try {
          user = JSON.parse(decodeURIComponent(session));
        } catch (e) {
          user = null;
        }
      }
    }

    const response = {
      authenticated: !!user,
      user: user,
      session: user ? {
        user: {
          id: user.id || user.uid,
          email: user.email
        },
        expires_at: Math.floor(Date.now() / 1000) + 3600 // Mock expiration
      } : null,
      error: null
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      authenticated: false,
      user: null,
      session: null,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
