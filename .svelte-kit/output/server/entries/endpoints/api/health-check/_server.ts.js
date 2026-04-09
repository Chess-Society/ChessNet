const GET = async ({ locals, url }) => {
  try {
    const healthInfo = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV || "unknown",
        FIREBASE_STATUS: "INTEGRATED",
        url: url.toString(),
        hostname: url.hostname
      },
      locals: {
        hasUser: !!locals.user,
        userEmail: locals.user?.email || null
      },
      status: "healthy"
    };
    return new Response(JSON.stringify(healthInfo, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "error",
      error: {
        message: error.message,
        stack: error.stack
      }
    }, null, 2), {
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
