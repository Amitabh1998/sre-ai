#!/usr/bin/env node

/**
 * Verify setup - checks if environment is configured and database is ready
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ReliOps AI Setup...\n');

// Check environment variables
const envPath = path.join(process.cwd(), '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!value.includes('YOUR_') && !value.includes('your_') && value.length > 0) {
        envVars[key] = value;
      }
    }
  });
}

console.log('📋 Environment Variables:');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'OPENAI_API_KEY'
];

let allEnvConfigured = true;
requiredVars.forEach(varName => {
  if (envVars[varName]) {
    const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
      ? `${envVars[varName].substring(0, 20)}...` 
      : envVars[varName];
    console.log(`  ✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ❌ ${varName}: Not configured`);
    allEnvConfigured = false;
  }
});

console.log('\n📊 Database Migration:');
console.log('  Run the verification SQL script in Supabase SQL Editor:');
console.log('  → scripts/verify-migration.sql');
console.log('  Or manually check that all 7 tables exist in your Supabase dashboard.');

console.log('\n📝 Next Steps:');
if (allEnvConfigured) {
  console.log('  1. ✅ Environment variables configured');
  console.log('  2. ⏭️  Run database migration (001_initial_schema.sql)');
  console.log('  3. ⏭️  Create initial organization and user');
  console.log('  4. ⏭️  Start the development server: npm run dev');
} else {
  console.log('  1. ⏭️  Complete environment variable configuration');
  console.log('  2. ⏭️  Run database migration');
  console.log('  3. ⏭️  Create initial organization and user');
}

console.log('\n');

