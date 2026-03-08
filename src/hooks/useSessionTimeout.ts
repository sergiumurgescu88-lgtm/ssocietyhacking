import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_MS = 2 * 60 * 1000; // warn 2 min before

export const useSessionTimeout = () => {
  const { user, signOut } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const warningRef = useRef<ReturnType<typeof setTimeout>>();

  const resetTimer = useCallback(() => {
    if (!user) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    warningRef.current = setTimeout(() => {
      toast.warning("Your session will expire in 2 minutes due to inactivity.");
    }, SESSION_TIMEOUT_MS - WARNING_BEFORE_MS);

    timeoutRef.current = setTimeout(async () => {
      toast.error("Session expired due to inactivity.");
      await signOut();
    }, SESSION_TIMEOUT_MS);
  }, [user, signOut]);

  useEffect(() => {
    if (!user) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    const handler = () => resetTimer();

    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user, resetTimer]);
};
