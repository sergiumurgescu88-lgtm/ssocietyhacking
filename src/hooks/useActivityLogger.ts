import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type LogAction =
  | "scan_started"
  | "scan_completed"
  | "authorization_created"
  | "authorization_updated"
  | "authorization_deleted"
  | "report_exported"
  | "report_created"
  | "settings_changed"
  | "login"
  | "logout"
  | "2fa_enabled"
  | "2fa_disabled";

export const useActivityLogger = () => {
  const { user } = useAuth();

  const logActivity = useCallback(
    async (action: LogAction, target?: string) => {
      if (!user) return;
      try {
        await supabase.from("activity_logs").insert({
          user_id: user.id,
          action,
          target,
          ip_address: null, // populated server-side if needed
          user_agent: navigator.userAgent,
        });
      } catch (err) {
        console.error("Failed to log activity:", err);
      }
    },
    [user]
  );

  return { logActivity };
};
