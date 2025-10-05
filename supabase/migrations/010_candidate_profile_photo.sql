-- Add photo storage fields to candidate_profiles
ALTER TABLE public.candidate_profiles
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Optional index for quick filtering by presence of photo
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_photo_url
  ON public.candidate_profiles(photo_url);
