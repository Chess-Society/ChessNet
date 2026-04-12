import { error } from "@sveltejs/kit";
const load = async () => {
  throw error(404, "Not found");
};
export {
  load
};
