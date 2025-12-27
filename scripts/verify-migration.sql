-- Verification Script: Check if migration ran successfully
-- Run this in Supabase SQL Editor after running 001_initial_schema.sql

-- Check if all tables exist
SELECT 
  'Tables Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 7 THEN '✅ All tables created'
    ELSE '❌ Missing tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'organizations',
    'users', 
    'incidents',
    'timeline_events',
    'hypotheses',
    'integrations',
    'ai_activities'
  );

-- List all tables
SELECT 
  'Table List' as check_type,
  table_name,
  '✅ Exists' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'organizations',
    'users', 
    'incidents',
    'timeline_events',
    'hypotheses',
    'integrations',
    'ai_activities'
  )
ORDER BY table_name;

-- Check if enums exist
SELECT 
  'Enums Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 5 THEN '✅ All enums created'
    ELSE '❌ Missing enums'
  END as status
FROM pg_type 
WHERE typname IN (
  'user_role',
  'incident_severity',
  'incident_status',
  'timeline_event_type',
  'ai_activity_type',
  'integration_category'
);

-- Check if indexes exist
SELECT 
  'Indexes Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 13 THEN '✅ All indexes created'
    ELSE '⚠️ Some indexes missing'
  END as status
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%';

-- Check if RLS is enabled
SELECT 
  'RLS Check' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'organizations',
    'users', 
    'incidents',
    'timeline_events',
    'hypotheses',
    'integrations',
    'ai_activities'
  )
ORDER BY tablename;

-- Summary
SELECT 
  '✅ Migration Verification Complete!' as message,
  'If all checks show ✅, your migration was successful!' as note;

