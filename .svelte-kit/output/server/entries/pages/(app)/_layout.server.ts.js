const load = async ({ locals }) => {
  console.log("✅ App layout - User:", locals.user?.email || "none");
  return {
    user: locals.user
  };
};
export {
  load
};
