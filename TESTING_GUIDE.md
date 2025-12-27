# Testing Guide - ReliOps AI

## Step 6: Start the Application

The development server should now be running. If not, run:
```bash
npm run dev
```

## Step 7: Test the Application

### 1. Access the Application
- Open your browser and go to: **http://localhost:3000**
- You should see the login page

### 2. Login
- Use the email and password you created in Step 5 (Part B)
- Click **Sign in**
- You should be redirected to the dashboard

### 3. Create Your First Incident
- Navigate to **Incidents** in the sidebar (or go to `/dashboard/incidents`)
- Click the **"New Incident"** button (top right)
- Fill out the form:
  - **Title**: `Database Connection Timeout`
  - **Service**: `checkout-db`
  - **Severity**: `P1 - Critical`
  - **Description**: `Users reporting checkout failures. Database connections timing out.`
- Click **"Create Incident"**
- You should be redirected to the incident detail page

### 4. Watch AI Investigation
- The incident will automatically start AI investigation (status: `ai-investigating`)
- Wait 10-30 seconds for the investigation to complete
- Refresh the page or check the **"AI Analysis"** tab
- You should see:
  - **Hypotheses** with confidence scores
  - **Evidence** supporting each hypothesis
  - **Suggested fixes**

### 5. View Timeline
- Go to the **"Timeline"** tab
- You should see events like:
  - Incident created
  - AI Agent started investigation
  - Investigation complete

## Troubleshooting

### Can't Login?
- Verify your user exists in Supabase Authentication → Users
- Check that the user ID in `users` table matches the Auth user ID
- Verify your organization_id is set correctly

### "User not associated with an organization" error?
- Run the verification SQL to check user-organization link:
```sql
SELECT u.email, u.organization_id, o.name 
FROM users u 
LEFT JOIN organizations o ON u.organization_id = o.id;
```

### AI Investigation not working?
- Check browser console for errors
- Verify OPENAI_API_KEY is set correctly in `.env.local`
- Check server logs for LLM API errors
- Make sure you have OpenAI API credits/quota

### No hypotheses appearing?
- Wait a bit longer (investigation runs asynchronously)
- Check the incident status (should change from `ai-investigating` to `human-intervention`)
- Refresh the page
- Check server logs for investigation errors

## Expected Behavior

✅ **Working correctly if:**
- You can login successfully
- You can create incidents
- Incidents appear in the incidents list
- AI investigation triggers automatically
- Hypotheses appear within 30 seconds
- Timeline shows investigation events

## Next Steps After Testing

Once everything works:
1. Try creating different types of incidents (different services, severities)
2. Test the "Trigger Investigation" button on existing incidents
3. Explore the dashboard metrics
4. Check AI activity feed

