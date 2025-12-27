-- Verify your user setup is correct
-- Run this in Supabase SQL Editor

-- 1. Check your user and organization link
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  u.organization_id,
  o.name as organization_name,
  o.slug as organization_slug,
  CASE 
    WHEN u.organization_id IS NULL THEN '❌ User not linked to organization'
    WHEN o.id IS NULL THEN '❌ Organization not found'
    ELSE '✅ User properly linked to organization'
  END as status
FROM users u
LEFT JOIN organizations o ON u.organization_id = o.id
WHERE u.email = 'amitabh.das1998@gmail.com';

-- 2. List all organizations (you should see 2)
SELECT id, name, slug, created_at 
FROM organizations 
ORDER BY created_at DESC;

-- 3. Summary
SELECT 
  'Setup Status' as check_type,
  CASE 
    WHEN (SELECT COUNT(*) FROM organizations) > 0 
      AND (SELECT COUNT(*) FROM users WHERE organization_id IS NOT NULL) > 0
    THEN '✅ Ready to test'
    ELSE '❌ Setup incomplete'
  END as status;

