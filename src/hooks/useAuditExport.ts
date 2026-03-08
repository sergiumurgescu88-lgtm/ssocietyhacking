import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useAuditExport = () => {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);

  const exportCSV = useCallback(async () => {
    if (!user) return;
    setExporting(true);
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data?.length) {
        toast.info("No activity logs to export.");
        setExporting(false);
        return;
      }

      const headers = ["Date", "Action", "Target", "IP Address", "User Agent"];
      const rows = data.map((log) => [
        new Date(log.created_at).toISOString(),
        log.action,
        log.target || "",
        log.ip_address || "",
        `"${(log.user_agent || "").replace(/"/g, '""')}"`,
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Audit log exported successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export audit log.");
    } finally {
      setExporting(false);
    }
  }, [user]);

  return { exportCSV, exporting };
};
