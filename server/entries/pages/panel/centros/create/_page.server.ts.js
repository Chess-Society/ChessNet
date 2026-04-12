const load = async ({ locals }) => {
  console.log("🏫 Create school page server load - User:", locals.user?.email || "none");
  return {
    user: locals.user
  };
};
export {
  load
};
