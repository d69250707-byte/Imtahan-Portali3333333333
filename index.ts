// Supabase Edge Function: admin-api
// Secret values must be configured in Supabase Edge Function Secrets, never in HTML.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ ok: false, error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const supplied = String(body?.password ?? "");
    const expected = Deno.env.get("ADMIN_PASSWORD") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!expected || !supabaseUrl || !serviceKey) {
      return reply({ ok: false, error: "Server konfiqurasiyası tamamlanmayıb." }, 500);
    }
    if (!supplied || supplied !== expected) {
      // Same response for all protected actions.
      return reply({ ok: false, error: "Parol yanlışdır (Unauthorized)." }, 401);
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const action = String(body?.action ?? "");

    if (action === "list") {
      const { data, error } = await supabase
        .from("participants")
        .select("id,name,started_at,finished_at,status")
        .order("started_at", { ascending: false });
      if (error) throw error;
      return reply({ ok: true, participants: data ?? [] });
    }
    if (action === "delete") {
      const id = String(body?.id ?? "");
      if (!id) return reply({ ok: false, error: "İştirakçı ID-si çatışmır." }, 400);
      const { error } = await supabase.from("participants").delete().eq("id", id);
      if (error) throw error;
      return reply({ ok: true });
    }
    if (action === "clear") {
      const { error } = await supabase.from("participants").delete().not("id", "is", null);
      if (error) throw error;
      return reply({ ok: true });
    }
    return reply({ ok: false, error: "Naməlum əməliyyat." }, 400);
  } catch (_error) {
    return reply({ ok: false, error: "Server sorğusu uğursuz oldu. Funksiya və baza konfiqurasiyasını yoxla." }, 500);
  }
});

function reply(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
