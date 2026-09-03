-- ==============================================================================
-- CAD PORTFOLIO: SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT DEFAULT '',
  client TEXT DEFAULT '',
  role TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  live_url TEXT DEFAULT '#',
  aspect_ratio TEXT DEFAULT '16/9',
  image TEXT DEFAULT '',
  video TEXT DEFAULT '',
  gallery JSONB DEFAULT '[]'::jsonb,
  link TEXT DEFAULT '#',
  description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Create Secure RLS Policies for projects
-- Allow everyone to read projects (Public Portfolio View)
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (true);

-- Allow inserting projects (Authenticated Admin Only)
DROP POLICY IF EXISTS "Allow insert projects" ON public.projects;
CREATE POLICY "Allow insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow updating projects (Authenticated Admin Only)
DROP POLICY IF EXISTS "Allow update projects" ON public.projects;
CREATE POLICY "Allow update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow deleting projects (Authenticated Admin Only)
DROP POLICY IF EXISTS "Allow delete projects" ON public.projects;
CREATE POLICY "Allow delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- 4. Create Public Storage Bucket for Project Media (Images & MP4 Videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Storage Policies for 'portfolio-media' bucket
-- Allow public access to view media
DROP POLICY IF EXISTS "Public Media Access" ON storage.objects;
CREATE POLICY "Public Media Access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-media');

-- Allow uploading media (Authenticated Admin Only)
DROP POLICY IF EXISTS "Allow Media Uploads" ON storage.objects;
CREATE POLICY "Allow Media Uploads"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

-- Allow updating media (Authenticated Admin Only)
DROP POLICY IF EXISTS "Allow Media Updates" ON storage.objects;
CREATE POLICY "Allow Media Updates"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-media');

-- Allow deleting media (Authenticated Admin Only)
DROP POLICY IF EXISTS "Allow Media Deletion" ON storage.objects;
CREATE POLICY "Allow Media Deletion"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-media');
