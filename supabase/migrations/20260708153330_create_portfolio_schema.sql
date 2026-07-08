/*
# Portfolio CMS - Full Schema

## Overview
Creates the complete database schema for a developer portfolio with built-in CMS.
Admin manages all content; visitors/viewers have read-only access.

## New Tables

### profiles
- `id` (uuid, PK, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `avatar_url` (text)
- `role` (text, default 'viewer') — 'viewer' or 'admin'
- `created_at`, `updated_at`

### projects
- `id` (uuid, PK)
- `title`, `slug` (text, unique)
- `description`, `long_description` (text)
- `status` (text) — 'published', 'draft', 'archived'
- `featured` (boolean)
- `cover_image` (text)
- `github_url`, `live_url` (text)
- `tags` (text[])
- `order_index` (int)
- `created_at`, `updated_at`

### project_gallery
- `id`, `project_id` (FK), `image_url`, `caption`, `order_index`

### technologies
- `id`, `name`, `icon_url`, `category`, `order_index`

### project_technologies (join)
- `project_id`, `technology_id`

### journey
- `id`, `title`, `description`, `type` (job/education/milestone), `company`, `location`, `start_date`, `end_date`, `current`, `order_index`

### roadmap
- `id`, `title`, `description`, `status` (planned/in_progress/completed/archived), `priority`, `order_index`, `created_at`, `updated_at`

### settings
- `id`, `key` (unique), `value` (jsonb), `updated_at`

### activity_logs
- `id`, `action`, `entity_type`, `entity_id`, `metadata` (jsonb), `created_at`

## Security
- RLS enabled on all tables
- Public (anon) SELECT on projects (published), technologies, journey, roadmap, settings
- Admin full CRUD via role check in profiles
- profiles readable by authenticated, writable only by owner
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  long_description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  featured boolean NOT NULL DEFAULT false,
  cover_image text,
  github_url text,
  live_url text,
  tags text[] DEFAULT '{}',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_public" ON projects;
CREATE POLICY "projects_select_public" ON projects FOR SELECT
  TO anon, authenticated USING (status = 'published' OR (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ));

DROP POLICY IF EXISTS "projects_insert_admin" ON projects;
CREATE POLICY "projects_insert_admin" ON projects FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "projects_update_admin" ON projects;
CREATE POLICY "projects_update_admin" ON projects FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "projects_delete_admin" ON projects;
CREATE POLICY "projects_delete_admin" ON projects FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- PROJECT GALLERY
CREATE TABLE IF NOT EXISTS project_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gallery_select_public" ON project_gallery;
CREATE POLICY "gallery_select_public" ON project_gallery FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "gallery_insert_admin" ON project_gallery;
CREATE POLICY "gallery_insert_admin" ON project_gallery FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "gallery_update_admin" ON project_gallery;
CREATE POLICY "gallery_update_admin" ON project_gallery FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "gallery_delete_admin" ON project_gallery;
CREATE POLICY "gallery_delete_admin" ON project_gallery FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- TECHNOLOGIES
CREATE TABLE IF NOT EXISTS technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon_url text,
  category text DEFAULT 'other',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "technologies_select_public" ON technologies;
CREATE POLICY "technologies_select_public" ON technologies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "technologies_insert_admin" ON technologies;
CREATE POLICY "technologies_insert_admin" ON technologies FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "technologies_update_admin" ON technologies;
CREATE POLICY "technologies_update_admin" ON technologies FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "technologies_delete_admin" ON technologies;
CREATE POLICY "technologies_delete_admin" ON technologies FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- PROJECT_TECHNOLOGIES
CREATE TABLE IF NOT EXISTS project_technologies (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_id uuid NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_tech_select_public" ON project_technologies;
CREATE POLICY "project_tech_select_public" ON project_technologies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "project_tech_insert_admin" ON project_technologies;
CREATE POLICY "project_tech_insert_admin" ON project_technologies FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "project_tech_delete_admin" ON project_technologies;
CREATE POLICY "project_tech_delete_admin" ON project_technologies FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- JOURNEY
CREATE TABLE IF NOT EXISTS journey (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'milestone' CHECK (type IN ('job', 'education', 'milestone')),
  company text,
  location text,
  start_date date,
  end_date date,
  current boolean NOT NULL DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE journey ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "journey_select_public" ON journey;
CREATE POLICY "journey_select_public" ON journey FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "journey_insert_admin" ON journey;
CREATE POLICY "journey_insert_admin" ON journey FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "journey_update_admin" ON journey;
CREATE POLICY "journey_update_admin" ON journey FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "journey_delete_admin" ON journey;
CREATE POLICY "journey_delete_admin" ON journey FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ROADMAP
CREATE TABLE IF NOT EXISTS roadmap (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'archived')),
  priority integer DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE roadmap ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roadmap_select_public" ON roadmap;
CREATE POLICY "roadmap_select_public" ON roadmap FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "roadmap_insert_admin" ON roadmap;
CREATE POLICY "roadmap_insert_admin" ON roadmap FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "roadmap_update_admin" ON roadmap;
CREATE POLICY "roadmap_update_admin" ON roadmap FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "roadmap_delete_admin" ON roadmap;
CREATE POLICY "roadmap_delete_admin" ON roadmap FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_select_public" ON settings;
CREATE POLICY "settings_select_public" ON settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "settings_insert_admin" ON settings;
CREATE POLICY "settings_insert_admin" ON settings FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "settings_update_admin" ON settings;
CREATE POLICY "settings_update_admin" ON settings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "settings_delete_admin" ON settings;
CREATE POLICY "settings_delete_admin" ON settings FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "logs_select_admin" ON activity_logs;
CREATE POLICY "logs_select_admin" ON activity_logs FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "logs_insert_admin" ON activity_logs;
CREATE POLICY "logs_insert_admin" ON activity_logs FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_roadmap_status ON roadmap(status);
CREATE INDEX IF NOT EXISTS idx_journey_order ON journey(order_index);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- SEED DEFAULT SETTINGS
INSERT INTO settings (key, value) VALUES
  ('contact', '{"name": "Vincent Paul Ecaldre", "email": "vincentecaldre25@gmail.com", "facebook": "https://www.facebook.com/share/1bTEbZPFm4/", "github": "https://github.com/Hawkin20"}'),
  ('hero', '{"heading": "Full Stack Developer", "subheading": "Building premium digital experiences with modern technology", "cta_primary": "View Projects", "cta_secondary": "About Me"}'),
  ('about', '{"bio": "I am a passionate full stack developer who loves building clean, modern web applications. I specialize in React, TypeScript, and Node.js with a focus on performance and user experience.", "philosophy": "Code is craft. Every line should be intentional, readable, and serve a purpose.", "fun_facts": ["Coffee-driven developer", "Open source contributor", "Night owl coder"]}'),
  ('theme', '{"accent": "#E8B86D", "background": "#090909", "surface": "#131313"}'),
  ('seo', '{"title": "Vincent Paul Ecaldre - Full Stack Developer", "description": "Premium developer portfolio showcasing modern web projects, technical journey, and future roadmap.", "keywords": ["full stack developer", "react", "typescript", "next.js"]}')
ON CONFLICT (key) DO NOTHING;
