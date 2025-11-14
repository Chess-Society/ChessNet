const load = async ({ locals, params }) => {
  console.log("🏆 Tournaments page server load - User:", locals.user?.email || "none", "SchoolId:", params.schoolId);
  return {
    user: locals.user,
    schoolId: params.schoolId
  };
};
export {
  load
};
