const load = async ({ locals }) => {
  console.log("🎯 Skills create page server load - User:", locals.user?.email || "none");
  return {
    user: locals.user
  };
};
export {
  load
};
