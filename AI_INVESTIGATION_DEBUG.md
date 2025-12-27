# AI Investigation Debug Guide

## Issue: AI Analysis Output Not Appearing

## What I've Fixed

1. **Added comprehensive logging** throughout the investigation flow:
   - Investigation start/completion
   - Data gathering progress
   - Hypothesis generation progress
   - Database storage progress
   - Error details with stack traces

2. **Fixed organization ID lookup** in investigate endpoint:
   - Changed from `getCurrentUserOrganizationId()` to `user.organization_id` from `withAuth`
   - This ensures it works in mock auth mode

## How to Diagnose

### Step 1: Check Server Logs
When you trigger an investigation, check your terminal where `npm run dev` is running. You should see logs like:

```
[investigateIncident] Starting investigation for incident <id>
[investigateIncident] Found incident: <title>, org: <org-id>
[investigateIncident] Gathering investigation data...
[investigateIncident] Gathered data: X logs, Y metrics
[investigateIncident] Generating hypotheses...
[generateHypotheses] Starting hypothesis generation...
[generateHypotheses] LLM client created successfully
[generateHypotheses] Calling LLM API...
[generateHypotheses] LLM response received...
[generateHypotheses] Successfully parsed X hypotheses
[investigateIncident] Storing X hypotheses in database...
[investigateIncident] Successfully stored X hypotheses
[POST /api/incidents/[id]/investigate] Investigation completed successfully
```

### Step 2: Check for Errors
Look for error messages in the logs:
- `Failed to create LLM client` - API key issue
- `LLM API error` - OpenAI API error (check API key validity)
- `Failed to parse LLM response` - LLM returned invalid JSON
- `Failed to store hypothesis` - Database error

### Step 3: Verify API Key
The investigation requires either:
- `OPENAI_API_KEY` in `.env.local` (✅ Found)
- `ANTHROPIC_API_KEY` in `.env.local`

### Step 4: Check Investigation Status
1. Go to an incident detail page
2. Click "Trigger Investigation"
3. Check the incident status - it should change to "ai-investigating" then "human-intervention"
4. Check the Timeline tab - should show "AI Agent started investigation"
5. Check the AI Analysis tab - should show hypotheses after investigation completes

## Common Issues

### Issue 1: Investigation Never Starts
**Symptoms:** No logs appear after clicking "Trigger Investigation"
**Check:**
- Browser console for errors
- Network tab for failed API requests
- Server logs for authentication errors

### Issue 2: LLM API Error
**Symptoms:** Logs show "LLM API error" or "Failed to create LLM client"
**Fix:**
- Verify `OPENAI_API_KEY` is correct in `.env.local`
- Restart dev server after changing `.env.local`
- Check if API key has sufficient credits/quota

### Issue 3: Hypotheses Not Stored
**Symptoms:** Logs show "Generated X hypotheses" but none appear in UI
**Check:**
- Database connection
- RLS policies on `hypotheses` table
- Check if hypotheses are actually in database (use debug endpoint)

### Issue 4: Frontend Not Refreshing
**Symptoms:** Hypotheses exist in database but UI shows "No hypotheses"
**Fix:**
- Refresh the page after investigation completes
- Check if `execute()` is being called to refresh data

## Next Steps

1. **Trigger an investigation** and watch the server logs
2. **Share the logs** so I can identify the exact issue
3. **Check the browser console** for any frontend errors
4. **Verify hypotheses in database** using the debug endpoint: `/api/debug/incident/<id>`

## Quick Test

1. Create a new incident with status "ai-investigating" OR
2. Go to an existing incident and click "Trigger Investigation"
3. Watch the server terminal for logs
4. Wait 10-30 seconds for investigation to complete
5. Refresh the incident detail page
6. Check the "AI Analysis" tab for hypotheses

