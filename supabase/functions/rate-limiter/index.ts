import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory rate limit store (per isolate lifecycle)
const rateLimits = new Map<string, { count: number; windowStart: number }>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 100; // 100 per minute per user

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { authorization: authHeader } } }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const key = user.id;
    const now = Date.now();
    const entry = rateLimits.get(key);

    if (!entry || now - entry.windowStart > WINDOW_MS) {
      rateLimits.set(key, { count: 1, windowStart: now });
    } else {
      entry.count++;
      if (entry.count > MAX_REQUESTS) {
        const retryAfter = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);
        return new Response(
          JSON.stringify({ error: "Too many requests", retry_after: retryAfter }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "Retry-After": String(retryAfter),
            },
          }
        );
      }
    }

    const body = await req.json().catch(() => ({}));

    return new Response(
      JSON.stringify({
        allowed: true,
        remaining: MAX_REQUESTS - (rateLimits.get(key)?.count ?? 0),
        action: body.action ?? "unknown",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
