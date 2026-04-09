import { json } from "@sveltejs/kit";
import { d as db } from "../../../../chunks/firebase.js";
import { query, collection, where, orderBy, getDocs, limit } from "firebase/firestore";
const toData = (doc2) => {
  return { id: doc2.id, ...doc2.data() };
};
const GET = async ({ url, locals }) => {
  console.log("📡 API Subscriptions GET - Getting subscription plans");
  const endpoint = url.searchParams.get("endpoint") || "plans";
  url.hostname === "localhost" || url.hostname === "127.0.0.1";
  try {
    if (!locals.user) {
      return json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    if (endpoint === "plans") {
      const q = query(
        collection(db, "subscription_plans"),
        where("is_active", "==", true),
        orderBy("sort_order")
      );
      const snapshot = await getDocs(q);
      const plans = snapshot.docs.map((doc2) => toData(doc2));
      return json({ success: true, plans });
    }
    if (endpoint === "current") {
      const q = query(
        collection(db, "user_subscriptions"),
        where("user_id", "==", locals.user.id),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return json({
          success: true,
          user_plan: {
            plan_name: "free",
            display_name: "Profesor Individual",
            status: "active",
            max_students: 15,
            max_classes: 3,
            max_colleges: 1,
            max_tournaments: 2,
            max_storage_mb: 100,
            max_custom_skills: 5
          }
        });
      }
      const userSub = toData(snapshot.docs[0]);
      return json({ success: true, user_plan: userSub });
    }
    return json({ success: false, error: "Invalid endpoint" }, { status: 400 });
  } catch (error) {
    console.error("❌ Error in subscriptions API:", error);
    return json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
};
const POST = async ({ request, url, locals }) => {
  console.log("📡 API Subscriptions POST - Processing subscription action");
  const { action, ...data } = await request.json();
  url.hostname === "localhost" || url.hostname === "127.0.0.1";
  try {
    if (!locals.user) {
      return json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    if (action === "check-limit") {
      return json({
        success: true,
        can_proceed: true,
        current_limit: -1,
        current_count: data.current_count
      });
    }
    if (action === "create-payment") {
      return json({
        success: false,
        error: "Payment integration migration in progress"
      }, { status: 501 });
    }
    return json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("❌ Error in subscriptions POST:", error);
    return json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
};
export {
  GET,
  POST
};
