-- Auto-delete function for 2-year data retention
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete activity logs older than 2 years
  DELETE FROM public.activity_logs WHERE created_at < now() - interval '2 years';
  -- Delete completed scans older than 2 years
  DELETE FROM public.scans WHERE created_at < now() - interval '2 years' AND status = 'completed';
  -- Delete old scan results (cascaded from scans, but also direct cleanup)
  DELETE FROM public.scan_results WHERE created_at < now() - interval '2 years';
  -- Delete old vulnerabilities
  DELETE FROM public.vulnerabilities WHERE created_at < now() - interval '2 years';
END;
$$;