-- Check if organizations exist in your database
-- Run this in Supabase SQL Editor

-- 1. Check if organizations table exists and has data
SELECT 
  COUNT(*) as total_organizations,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Organizations found'
    ELSE '❌ No organizations found'
  END as status
FROM organizations;

-- 2. List all organizations (if any exist)
SELECT 
  id,
  name,
  slug,
  created_at
FROM organizations
ORDER BY created_at DESC;

-- 3. Check if users table has any users linked to organizations
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  u.organization_id,
  o.name as organization_name,
  CASE 
    WHEN o.id IS NULL THEN '❌ User not linked to organization'
    ELSE '✅ User linked to organization'
  END as link_status
FROM users u
LEFT JOIN organizations o ON u.organization_id = o.id
ORDER BY u.created_at DESC;

-- 4. Summary
SELECT 
  (SELECT COUNT(*) FROM organizations) as total_orgs,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE organization_id IS NOT NULL) as users_with_org;

