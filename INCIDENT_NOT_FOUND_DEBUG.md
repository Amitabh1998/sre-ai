# Incident Not Found - Debugging Guide

## Problem
When trying to view an incident detail page, you get "Incident not found (ID: c2770722-b1f2-42b3-a033-5858fc97513b)".

## Root Cause Analysis

The error occurs when:
1. The API endpoint `/api/incidents/[id]` returns a 404 status
2. This means `getIncidentById()` returned `null`
3. Possible reasons:
   - Incident doesn't exist in database
   - Database query error (check server logs)
   - Organization mismatch (would be 403, not 404)
   - UUID format issue

## Diagnostic Steps

### Step 1: Check Debug Endpoint
Visit this URL in your browser (replace with your incident ID):
```
http://localhost:3000/api/debug/incident/c2770722-b1f2-42b3-a033-5858fc97513b
```

This will show:
- Whether the incident exists in the database
- All incidents in the database
- All organizations
- Any database errors

### Step 2: Check Server Logs
When you try to access an incident, check your terminal where `npm run dev` is running. You should see:

```
[GET /api/incidents/[id]] Handler called { incidentId: '...', userId: '...', userOrgId: '...' }
[getIncidentById] Fetching incident by ID { incidentId: '...' }
[getIncidentById] Incident fetch result { foundIncident: true/false, ... }
[GET /api/incidents/[id]] Incident fetched { found: true/false, ... }
```

### Step 3: Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to access the incident
4. Look for the request to `/api/incidents/[id]`
5. Check:
   - Status code (404 = not found, 403 = unauthorized)
   - Response body (should show error details)

### Step 4: Verify Incident Creation
Check if the incident was actually created:
1. Go to `/dashboard/incidents` 
2. Check if the incident appears in the list
3. If it appears, click it and note the ID in the URL
4. Compare with the ID you're trying to access

## Common Issues & Fixes

### Issue 1: Incident Doesn't Exist
**Symptoms:** Debug endpoint shows `incident: null`, no error
**Fix:** The incident was never created or was deleted. Create a new incident.

### Issue 2: Organization Mismatch
**Symptoms:** Debug endpoint shows incident exists, but API returns 403
**Fix:** The incident belongs to a different organization. Check:
- User's organization_id matches incident's organization_id
- Both are in the same organization in database

### Issue 3: Database Query Error
**Symptoms:** Server logs show error in `getIncidentById`
**Fix:** Check:
- Supabase connection is working
- Environment variables are set correctly
- Database schema is correct

### Issue 4: UUID Format Issue
**Symptoms:** Error mentions invalid UUID format
**Fix:** Ensure the incident ID is a valid UUID format

## Code Changes Made

1. **Enhanced Error Logging** (`lib/db/queries/incidents.ts`):
   - Better error messages for database queries
   - Distinguishes between "not found" (PGRST116) and other errors

2. **Debug Endpoint** (`app/api/debug/incident/[id]/route.ts`):
   - New endpoint to check incident status
   - Shows all incidents and organizations
   - Helps diagnose issues quickly

3. **Improved API Error Messages** (`app/api/incidents/[id]/route.ts`):
   - More detailed error responses
   - Includes incident ID in error message

4. **Incident Creation Verification** (`app/api/incidents/route.ts`):
   - Verifies incident can be fetched immediately after creation
   - Logs warning if verification fails

## Next Steps

1. **Run the debug endpoint** to see what's in the database
2. **Check server logs** when accessing the incident
3. **Verify the incident ID** matches what's in the database
4. **Check organization matching** if incident exists but returns 403

## Quick Test

To test if the system is working:
1. Create a new incident via the UI
2. Note the incident ID from the URL after creation
3. Try to access that incident
4. Check server logs for any errors
5. If it fails, use the debug endpoint to investigate

