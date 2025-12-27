-- Step 5: Create Initial Organization and User
-- Follow these steps IN ORDER:

-- ============================================
-- STEP 1: Create an Organization
-- ============================================
-- Replace 'My Company' and 'my-company' with your organization name and slug
INSERT INTO organizations (name, slug)
VALUES ('My Company', 'my-company')
ON CONFLICT (slug) DO NOTHING
RETURNING id, name, slug;

-- After running above, COPY the organization ID (UUID) - you'll need it for Step 2
-- It will look like: 123e4567-e89b-12d3-a456-426614174000

-- ============================================
-- STEP 2: Create Supabase Auth User
-- ============================================
-- Go to Supabase Dashboard → Authentication → Users → Add user
-- Enter:
--   - Email: your-email@example.com
--   - Password: (choose a password)
--   - Auto Confirm User: ✅ (check this)
-- Click "Create user"
-- COPY the User UUID from the created user (it will be shown in the user list)

-- ============================================
-- STEP 3: Link User to Organization
-- ============================================
-- Replace these values:
--   - 'auth-user-uuid-here' → The UUID from Step 2 (Supabase Auth user)
--   - 'your-email@example.com' → Your email
--   - 'Your Name' → Your name
--   - 'your-org-id-here' → The organization ID from Step 1

INSERT INTO users (id, email, name, organization_id, role)
VALUES (
  'auth-user-uuid-here'::uuid,  -- Replace with Supabase Auth user UUID
  'your-email@example.com',     -- Replace with your email
  'Your Name',                   -- Replace with your name
  (SELECT id FROM organizations WHERE slug = 'my-company' LIMIT 1),  -- Auto-get org ID
  'admin'::user_role
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    name = EXCLUDED.name,
    organization_id = EXCLUDED.organization_id,
    role = EXCLUDED.role
RETURNING id, email, name, organization_id, role;

-- ============================================
-- STEP 4: Verify Setup
-- ============================================
-- Run this to verify everything is set up correctly:
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  u.role,
  o.id as organization_id,
  o.name as organization_name,
  o.slug as organization_slug
FROM users u
JOIN organizations o ON u.organization_id = o.id;

-- You should see your user and organization listed!

