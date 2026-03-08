import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-analyze`;

export async function streamAIAnalysis({
  findings,
  scanTarget,
  action,
  onDelta,
  onDone,
  onError,
}: {
  findings: any[];
  scanTarget: string;
  action: "analyze" | "remediate" | "report";
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      onError("Not authenticated");
      return;
    }

    const resp = await fetch(AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ findings, scan_target: scanTarget, action }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "AI request failed" }));
      onError(err.error || `Request failed with status ${resp.status}`);
      return;
    }

    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Unknown error");
  }
}

export async function runSecurityScan(domain: string, scanTypes: string[], scanId?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/security-scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ domain, scan_types: scanTypes, scan_id: scanId }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Scan failed" }));
    throw new Error(err.error || "Scan failed");
  }

  return resp.json();
}
