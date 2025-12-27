# Quick Start Guide - Create Your First User

## Step-by-Step Instructions

### Step 1: Create Organization (in Supabase SQL Editor)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New query**
3. Copy and paste this SQL:

```sql
INSERT INTO organizations (name, slug)
VALUES ('My Company', 'my-company')
RETURNING id, name, slug;
```

4. Click **Run**
5. **IMPORTANT**: Copy the `id` (UUID) that's returned - you'll need it!

### Step 2: Create Auth User (in Supabase Dashboard)

1. Go to **Authentication** → **Users** (left sidebar)
2. Click **Add user** button (top right)
3. Fill in:
   - **Email**: your-email@example.com
   - **Password**: Choose a password
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create user**
5. **IMPORTANT**: Copy the **User UUID** (shown in the user list) - you'll need it!

### Step 3: Link User to Organization (in Supabase SQL Editor)

1. Go back to **SQL Editor** → **New query**
2. Copy and paste this SQL, replacing the placeholders:

```sql
INSERT INTO users (id, email, name, organization_id, role)
VALUES (
  'PASTE-AUTH-USER-UUID-HERE',  -- From Step 2
  'your-email@example.com',       -- Your email from Step 2
  'Your Name',                    -- Your name
  (SELECT id FROM organizations WHERE slug = 'my-company' LIMIT 1),
  'admin'::user_role
)
RETURNING id, email, name, organization_id, role;
```

3. Replace:
   - `PASTE-AUTH-USER-UUID-HERE` → The UUID from Step 2
   - `your-email@example.com` → Your email
   - `Your Name` → Your actual name
4. Click **Run**
5. You should see your user created!

### Step 4: Verify Setup

Run this SQL to verify:

```sql
SELECT 
  u.email,
  u.name,
  u.role,
  o.name as organization_name
FROM users u
JOIN organizations o ON u.organization_id = o.id;
```

You should see your user and organization!

## Next: Start the App

```bash
npm run dev
```

Then go to http://localhost:3000 and login with:
- Email: your-email@example.com
- Password: (the password you set in Step 2)

