-- Seed Initial Data for Testing
-- Run this AFTER running 001_initial_schema.sql migration
-- Replace the values below with your actual information

-- Step 1: Create an organization
-- Replace 'My Company' and 'my-company' with your organization name and slug
INSERT INTO organizations (name, slug)
VALUES ('My Company', 'my-company')
ON CONFLICT (slug) DO NOTHING
RETURNING id, name, slug;

-- Step 2: Note the organization_id from above, then create a user
-- IMPORTANT: The user ID must match your Supabase Auth user ID
-- You'll get this from Authentication → Users in Supabase dashboard
-- Replace 'auth-user-uuid-here' with your actual Supabase Auth user UUID
-- Replace 'your-email@example.com' with your email
-- Replace 'your-org-id-here' with the organization ID from Step 1

-- First, check if user exists, if not create it
-- Note: You must create the auth user first in Supabase Authentication dashboard
INSERT INTO users (id, email, name, organization_id, role)
VALUES (
  'auth-user-uuid-here',  -- Replace with Supabase Auth user UUID
  'your-email@example.com',  -- Replace with your email
  'Your Name',  -- Replace with your name
  (SELECT id FROM organizations WHERE slug = 'my-company' LIMIT 1),  -- Auto-get org ID
  'admin'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    name = EXCLUDED.name,
    organization_id = EXCLUDED.organization_id,
    role = EXCLUDED.role
RETURNING id, email, name, organization_id, role;

-- Step 3: Verify the setup
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  u.role,
  o.id as organization_id,
  o.name as organization_name
FROM users u
JOIN organizations o ON u.organization_id = o.id;

