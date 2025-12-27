# Quick Fix: Create Organization

## The Problem
You're getting "No organization found" because there's no organization in your Supabase database.

## Quick Solution

### Step 1: Go to Supabase SQL Editor
1. Open your Supabase Dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **"New query"**

### Step 2: Run This SQL
Copy and paste this into the SQL Editor:

```sql
-- Create a default organization
INSERT INTO organizations (name, slug)
VALUES ('My Company', 'my-company')
ON CONFLICT (slug) DO NOTHING
RETURNING id, name, slug;
```

### Step 3: Click "Run"
You should see the organization created with an ID.

### Step 4: Try Creating Incident Again
Go back to your app and try creating the incident again. It should work now!

## Alternative: Auto-Create Organization

The code I just updated will try to auto-create an organization if none exists, but it's better to create it manually so you have control over the name and slug.

