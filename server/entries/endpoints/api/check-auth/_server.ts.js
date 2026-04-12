const GET = async ({ locals }) => {
  try {
    const response = {
      authenticated: !!locals.user,
      user: locals.user,
      session: locals.user ? {
        user: {
          id: locals.user.id,
          email: locals.user.email
        },
        expires_at: Math.floor(Date.now() / 1e3) + 3600
        // Mock expiration
      } : null,
      error: null
    };
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      authenticated: false,
      user: null,
      session: null,
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
export {
  GET
};
