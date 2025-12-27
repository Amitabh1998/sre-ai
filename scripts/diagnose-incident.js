/**
 * Diagnostic script to check if an incident exists and verify organization matching
 * Run with: node scripts/diagnose-incident.js <incident-id>
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const incidentId = process.argv[2] || 'c2770722-b1f2-42b3-a033-5858fc97513b';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  console.error('Found:', { 
    hasUrl: !!supabaseUrl, 
    hasServiceKey: !!supabaseServiceKey 
  });
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey
);

async function diagnose() {
  console.log(`\n🔍 Diagnosing incident: ${incidentId}\n`);

  // Check if incident exists
  console.log('1. Checking if incident exists...');
  const { data: incident, error: incidentError } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', incidentId)
    .single();

  if (incidentError) {
    console.error('❌ Error fetching incident:', {
      code: incidentError.code,
      message: incidentError.message,
      details: incidentError.details,
      hint: incidentError.hint,
    });
  } else if (!incident) {
    console.log('❌ Incident not found in database');
  } else {
    console.log('✅ Incident found:', {
      id: incident.id,
      title: incident.title,
      organization_id: incident.organization_id,
      status: incident.status,
      created_at: incident.created_at,
    });
  }

  // Check all incidents
  console.log('\n2. Checking all incidents...');
  const { data: allIncidents, error: allError } = await supabase
    .from('incidents')
    .select('id, title, organization_id, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (allError) {
    console.error('❌ Error fetching all incidents:', allError.message);
  } else {
    console.log(`✅ Found ${allIncidents?.length || 0} incidents:`);
    allIncidents?.forEach((inc) => {
      console.log(`   - ${inc.id.substring(0, 8)}... | ${inc.title} | org: ${inc.organization_id?.substring(0, 8)}...`);
    });
  }

  // Check organizations
  console.log('\n3. Checking organizations...');
  const { data: orgs, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug');

  if (orgError) {
    console.error('❌ Error fetching organizations:', orgError.message);
  } else {
    console.log(`✅ Found ${orgs?.length || 0} organizations:`);
    orgs?.forEach((org) => {
      console.log(`   - ${org.id.substring(0, 8)}... | ${org.name} (${org.slug})`);
    });
  }

  // Check users
  console.log('\n4. Checking users...');
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, email, organization_id')
    .limit(10);

  if (userError) {
    console.error('❌ Error fetching users:', userError.message);
  } else {
    console.log(`✅ Found ${users?.length || 0} users:`);
    users?.forEach((user) => {
      console.log(`   - ${user.email} | org: ${user.organization_id?.substring(0, 8) || 'none'}...`);
    });
  }

  // If incident exists, check organization match
  if (incident) {
    console.log('\n5. Organization matching check...');
    const incidentOrgId = incident.organization_id;
    const matchingOrgs = orgs?.filter(org => org.id === incidentOrgId) || [];
    
    if (matchingOrgs.length > 0) {
      console.log(`✅ Incident belongs to organization: ${matchingOrgs[0].name}`);
    } else {
      console.log(`⚠️  Incident's organization_id (${incidentOrgId}) doesn't match any organization!`);
    }

    const matchingUsers = users?.filter(user => user.organization_id === incidentOrgId) || [];
    console.log(`   Users in same organization: ${matchingUsers.length}`);
  }

  console.log('\n✅ Diagnosis complete!\n');
}

diagnose().catch(console.error);

