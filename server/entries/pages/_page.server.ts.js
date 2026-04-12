const load = async ({ locals }) => {
  return {
    isAuthenticated: !!locals.user
  };
};
export {
  load
};
