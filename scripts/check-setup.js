#!/usr/bin/env node

/**
 * Setup checker - helps verify your environment is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking ReliOps AI Setup...\n');

const checks = {
  envFile: false,
  supabaseUrl: false,
  supabaseAnonKey: false,
  supabaseServiceKey: false,
  nextAuthSecret: false,
  llmKey: false,
};

// Check for .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  checks.envFile = true;
  console.log('✅ .env.local file exists');
  
  // Read and check contents
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL') && !envContent.includes('your_supabase')) {
    checks.supabaseUrl = true;
    console.log('✅ Supabase URL configured');
  } else {
    console.log('❌ Supabase URL not configured');
  }
  
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY') && !envContent.includes('your_anon')) {
    checks.supabaseAnonKey = true;
    console.log('✅ Supabase Anon Key configured');
  } else {
    console.log('❌ Supabase Anon Key not configured');
  }
  
  if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY') && !envContent.includes('your_service')) {
    checks.supabaseServiceKey = true;
    console.log('✅ Supabase Service Role Key configured');
  } else {
    console.log('❌ Supabase Service Role Key not configured');
  }
  
  if (envContent.includes('NEXTAUTH_SECRET') && !envContent.includes('your_nextauth')) {
    checks.nextAuthSecret = true;
    console.log('✅ NextAuth Secret configured');
  } else {
    console.log('❌ NextAuth Secret not configured');
  }
  
  if (envContent.includes('OPENAI_API_KEY') && !envContent.includes('your_openai')) {
    checks.llmKey = true;
    console.log('✅ LLM API Key configured (OpenAI)');
  } else if (envContent.includes('ANTHROPIC_API_KEY') && !envContent.includes('your_anthropic')) {
    checks.llmKey = true;
    console.log('✅ LLM API Key configured (Anthropic)');
  } else {
    console.log('❌ LLM API Key not configured');
  }
} else {
  console.log('❌ .env.local file not found');
  console.log('   Create it by copying .env.local.example or following SETUP_GUIDE.md\n');
}

console.log('\n📋 Summary:');
const allPassed = Object.values(checks).every(v => v);
if (allPassed) {
  console.log('✅ All checks passed! You\'re ready to run the app.\n');
} else {
  console.log('⚠️  Some configuration is missing. See SETUP_GUIDE.md for details.\n');
}

