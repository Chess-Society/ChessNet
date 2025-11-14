import { json } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, { ...options, path: "/" }),
        remove: (key, options) => cookies.delete(key, { ...options, path: "/" })
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data, error } = await supabase.from("tournaments").insert({
      user_id: user.id,
      name: body.name,
      description: body.description,
      format: body.format,
      time_control: body.time_control,
      max_players: body.max_players,
      entry_fee: body.entry_fee,
      prize_pool: body.prize_pool,
      start_date: body.start_date,
      end_date: body.end_date,
      registration_deadline: body.registration_deadline,
      status: body.status || "draft",
      current_round: body.current_round || 0,
      total_rounds: body.total_rounds || 0,
      players_registered: 0,
      // Set default value
      location: body.location,
      organizer: body.organizer,
      notes: body.notes,
      rules: body.rules
    }).select().single();
    if (error) {
      console.error("❌ Error creating tournament:", error);
      return json({ error: "Failed to create tournament" }, { status: 500 });
    }
    return json({ success: true, data });
  } catch (error) {
    console.error("❌ Error in POST /api/tournaments:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
export {
  POST
};
