import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { authorization: authHeader } } }
    );
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { findings, scan_target, action } = await req.json();

    let systemPrompt: string;
    let userPrompt: string;

    if (action === "analyze") {
      systemPrompt = `You are a senior cybersecurity analyst at SSocietySafe. Analyze the vulnerability findings and provide:
1. Executive summary (2-3 sentences)
2. Risk assessment (overall risk score 0-100)
3. Priority list (which to fix first and why)
4. False positive assessment (which findings might be false positives)
5. Attack chain analysis (how findings could be chained together)
Keep the language professional but concise. Use markdown formatting.`;

      userPrompt = `Analyze these vulnerability scan findings for target "${scan_target}":\n\n${JSON.stringify(findings, null, 2)}`;
    } else if (action === "remediate") {
      systemPrompt = `You are a senior security engineer. For each vulnerability finding, provide:
1. Specific code fix or configuration change
2. Step-by-step remediation guide
3. Verification steps to confirm the fix
4. Prevention measures for the future
Use markdown with code blocks for fixes. Be specific to the technology stack when possible.`;

      userPrompt = `Provide detailed remediation for these findings on "${scan_target}":\n\n${JSON.stringify(findings, null, 2)}`;
    } else if (action === "report") {
      systemPrompt = `You are a security report writer. Generate a professional security assessment report with:
1. Executive Summary
2. Scope and Methodology
3. Findings Summary Table (severity counts)
4. Detailed Findings (each with description, impact, remediation)
5. Risk Matrix
6. Recommendations (prioritized)
7. Appendix with technical details
Use markdown formatting. Make it suitable for both technical and non-technical stakeholders.`;

      userPrompt = `Generate a comprehensive security report for "${scan_target}" based on these findings:\n\n${JSON.stringify(findings, null, 2)}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid action. Use: analyze, remediate, or report" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
