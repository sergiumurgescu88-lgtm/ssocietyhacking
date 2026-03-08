import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ScanResult {
  ssl?: object;
  headers?: object;
  tech?: object;
  score?: number;
}

async function checkSSL(domain: string) {
  try {
    const url = `https://${domain}`;
    const start = Date.now();
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    const latency = Date.now() - start;

    const headers = Object.fromEntries(response.headers.entries());
    const hasHSTS = !!headers["strict-transport-security"];
    const hstsMaxAge = hasHSTS
      ? parseInt(headers["strict-transport-security"]?.match(/max-age=(\d+)/)?.[1] || "0")
      : 0;

    return {
      valid: response.ok || response.status < 500,
      status_code: response.status,
      latency_ms: latency,
      hsts_enabled: hasHSTS,
      hsts_max_age: hstsMaxAge,
      hsts_includes_subdomains: headers["strict-transport-security"]?.includes("includeSubDomains") ?? false,
      hsts_preload: headers["strict-transport-security"]?.includes("preload") ?? false,
      redirects_to_https: response.url.startsWith("https://"),
    };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : "Connection failed" };
  }
}

async function checkSecurityHeaders(domain: string) {
  try {
    const response = await fetch(`https://${domain}`, { method: "GET", redirect: "follow" });
    const headers = Object.fromEntries(response.headers.entries());

    const checks = {
      "content-security-policy": { present: !!headers["content-security-policy"], value: headers["content-security-policy"] || null, severity: "critical" },
      "x-frame-options": { present: !!headers["x-frame-options"], value: headers["x-frame-options"] || null, severity: "high" },
      "x-content-type-options": { present: !!headers["x-content-type-options"], value: headers["x-content-type-options"] || null, severity: "medium" },
      "strict-transport-security": { present: !!headers["strict-transport-security"], value: headers["strict-transport-security"] || null, severity: "high" },
      "referrer-policy": { present: !!headers["referrer-policy"], value: headers["referrer-policy"] || null, severity: "medium" },
      "permissions-policy": { present: !!headers["permissions-policy"], value: headers["permissions-policy"] || null, severity: "low" },
      "x-xss-protection": { present: !!headers["x-xss-protection"], value: headers["x-xss-protection"] || null, severity: "low" },
      "cross-origin-opener-policy": { present: !!headers["cross-origin-opener-policy"], value: headers["cross-origin-opener-policy"] || null, severity: "medium" },
      "cross-origin-resource-policy": { present: !!headers["cross-origin-resource-policy"], value: headers["cross-origin-resource-policy"] || null, severity: "medium" },
    };

    const total = Object.keys(checks).length;
    const present = Object.values(checks).filter((c) => c.present).length;
    const score = Math.round((present / total) * 100);

    // Check for dangerous headers
    const serverHeader = headers["server"] || null;
    const poweredBy = headers["x-powered-by"] || null;

    return { checks, score, server_disclosed: serverHeader, powered_by_disclosed: poweredBy };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to check headers" };
  }
}

async function detectTechnology(domain: string) {
  try {
    const response = await fetch(`https://${domain}`, { redirect: "follow" });
    const html = await response.text();
    const headers = Object.fromEntries(response.headers.entries());

    const technologies: Array<{ name: string; category: string; confidence: number }> = [];

    // Server detection
    if (headers["server"]) {
      technologies.push({ name: headers["server"], category: "Web Server", confidence: 100 });
    }
    if (headers["x-powered-by"]) {
      technologies.push({ name: headers["x-powered-by"], category: "Framework", confidence: 100 });
    }

    // Frontend frameworks
    if (html.includes("__next") || html.includes("_next/static")) technologies.push({ name: "Next.js", category: "Framework", confidence: 90 });
    if (html.includes("__nuxt")) technologies.push({ name: "Nuxt.js", category: "Framework", confidence: 90 });
    if (html.includes("ng-version")) technologies.push({ name: "Angular", category: "Framework", confidence: 90 });
    if (html.includes("data-reactroot") || html.includes("__react")) technologies.push({ name: "React", category: "Library", confidence: 85 });
    if (html.includes("data-v-") || html.includes("Vue.js")) technologies.push({ name: "Vue.js", category: "Framework", confidence: 85 });

    // CMS
    if (html.includes("wp-content") || html.includes("wordpress")) technologies.push({ name: "WordPress", category: "CMS", confidence: 95 });
    if (html.includes("Shopify")) technologies.push({ name: "Shopify", category: "E-commerce", confidence: 90 });

    // CDN
    if (headers["cf-ray"]) technologies.push({ name: "Cloudflare", category: "CDN", confidence: 100 });
    if (headers["x-vercel-id"]) technologies.push({ name: "Vercel", category: "Hosting", confidence: 100 });
    if (headers["x-amz-cf-id"]) technologies.push({ name: "AWS CloudFront", category: "CDN", confidence: 100 });

    // Analytics
    if (html.includes("google-analytics") || html.includes("gtag")) technologies.push({ name: "Google Analytics", category: "Analytics", confidence: 90 });
    if (html.includes("hotjar")) technologies.push({ name: "Hotjar", category: "Analytics", confidence: 85 });

    // Security
    if (html.includes("recaptcha")) technologies.push({ name: "reCAPTCHA", category: "Security", confidence: 90 });

    return { technologies, count: technologies.length };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to detect technologies" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
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

    const { domain, scan_types, scan_id } = await req.json();

    if (!domain) {
      return new Response(JSON.stringify({ error: "Domain is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    console.log(`[SCAN] Starting scan for ${cleanDomain}, types: ${scan_types?.join(", ")}`);

    const results: ScanResult = {};
    const types = scan_types || ["ssl", "headers", "tech"];

    if (types.includes("ssl")) {
      console.log("[SCAN] Checking SSL/TLS...");
      results.ssl = await checkSSL(cleanDomain);
    }

    if (types.includes("headers")) {
      console.log("[SCAN] Checking security headers...");
      results.headers = await checkSecurityHeaders(cleanDomain);
    }

    if (types.includes("tech")) {
      console.log("[SCAN] Detecting technologies...");
      results.tech = await detectTechnology(cleanDomain);
    }

    // Calculate overall score
    let totalScore = 0;
    let scoreCount = 0;
    if (results.ssl && !(results.ssl as any).error) {
      const ssl = results.ssl as any;
      let sslScore = ssl.valid ? 50 : 0;
      if (ssl.hsts_enabled) sslScore += 20;
      if (ssl.hsts_max_age >= 31536000) sslScore += 15;
      if (ssl.redirects_to_https) sslScore += 15;
      totalScore += sslScore;
      scoreCount++;
    }
    if (results.headers && !(results.headers as any).error) {
      totalScore += (results.headers as any).score || 0;
      scoreCount++;
    }
    results.score = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

    // Update scan record if scan_id provided
    if (scan_id) {
      await supabase.from("scans").update({
        status: "completed",
        completed_at: new Date().toISOString(),
        config: { results, scan_types: types },
      }).eq("id", scan_id);
    }

    console.log(`[SCAN] Complete. Score: ${results.score}/100`);

    return new Response(JSON.stringify(results), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[SCAN] Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Scan failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
