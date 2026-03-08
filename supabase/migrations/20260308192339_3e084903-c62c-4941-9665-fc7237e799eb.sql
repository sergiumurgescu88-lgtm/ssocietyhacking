
-- Create authorizations table
CREATE TABLE public.authorizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_domain TEXT NOT NULL,
  auth_type TEXT NOT NULL CHECK (auth_type IN ('domain_ownership', 'bug_bounty', 'written_authorization', 'client_contract')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'expired', 'rejected')),
  expires_at TIMESTAMP WITH TIME ZONE,
  file_url TEXT,
  program_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.authorizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own authorizations"
  ON public.authorizations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own authorizations"
  ON public.authorizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own authorizations"
  ON public.authorizations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own authorizations"
  ON public.authorizations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_authorizations_updated_at
  BEFORE UPDATE ON public.authorizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for authorization files
INSERT INTO storage.buckets (id, name, public) VALUES ('authorization-files', 'authorization-files', false);

-- Storage RLS
CREATE POLICY "Users can upload auth files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'authorization-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view their auth files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'authorization-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their auth files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'authorization-files' AND (storage.foldername(name))[1] = auth.uid()::text);
