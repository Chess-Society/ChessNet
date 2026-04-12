const load = async ({ locals }) => {
  console.log("🌍 Global Layout - No auth guard, user:", locals.user?.email || "none");
  return {
    user: locals.user || null
  };
};
export {
  load
};
