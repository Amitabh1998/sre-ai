-- Create a default organization if none exists
-- Run this in Supabase SQL Editor

-- Check first
SELECT COUNT(*) as org_count FROM organizations;

-- Create organization (only if it doesn't exist)
INSERT INTO organizations (name, slug)
VALUES ('My Company', 'my-company')
ON CONFLICT (slug) DO NOTHING
RETURNING id, name, slug, created_at;

-- Verify it was created
SELECT * FROM organizations WHERE slug = 'my-company';

