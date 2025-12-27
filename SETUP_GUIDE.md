# ReliOps AI - Setup Guide

Follow these steps sequentially to get your application running.

## Step 1: Set Up Supabase Database

### Option A: Using Supabase Dashboard (Recommended)

1. **Create a Supabase Account**
   - Go to https://app.supabase.com
   - Sign up or log in

2. **Create a New Project**
   - Click "New Project"
   - Choose an organization (or create one)
   - Fill in:
     - **Name**: `reliops-ai` (or your preferred name)
     - **Database Password**: Choose a strong password (save this!)
     - **Region**: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for project to initialize

3. **Run the Database Migration**
   - In your Supabase dashboard, go to **SQL Editor** (left sidebar)
   - Click "New query"
   - Open the file `supabase/migrations/001_initial_schema.sql` from this project
   - Copy the entire contents and paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

4. **Get Your Supabase Credentials**
   - Go to **Settings** → **API** (left sidebar)
   - You'll need these values:
     - **Project URL** (under "Project URL")
     - **anon/public key** (under "Project API keys" → "anon public")
     - **service_role key** (under "Project API keys" → "service_role" - keep this secret!)

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 2: Create Initial Organization and User

After running the migration, you need to create an initial organization and user for testing.

### Using Supabase Dashboard SQL Editor:

1. Go to **SQL Editor** → **New query**
2. Run this SQL (replace with your values):

```sql
-- Create an organization
INSERT INTO organizations (name, slug)
VALUES ('My Company', 'my-company')
RETURNING id;

-- Note the organization_id from above, then create a user
-- Replace 'your-org-id-here' with the UUID from above
-- Replace 'your-email@example.com' with your email
INSERT INTO users (email, name, organization_id, role)
VALUES ('your-email@example.com', 'Your Name', 'your-org-id-here', 'admin')
RETURNING id;
```

3. **Important**: You'll also need to create a Supabase Auth user:
   - Go to **Authentication** → **Users** → **Add user**
   - Enter the same email
   - Set a password
   - **Copy the User UUID** - this must match the `id` in the `users` table

4. **Update the user record** to match the auth user ID:

```sql
-- Replace 'auth-user-uuid' with the UUID from Supabase Auth
-- Replace 'your-email@example.com' with your email
UPDATE users 
SET id = 'auth-user-uuid'
WHERE email = 'your-email@example.com';
```

## Step 3: Configure Environment Variables

1. **Create `.env.local` file** in the project root:

```bash
# Copy from .env.local.example if it exists, or create new file
touch .env.local
```

2. **Add your Supabase credentials**:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth Configuration
# Generate a random secret: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# LLM Provider (Choose one)
# Option 1: OpenAI
OPENAI_API_KEY=your-openai-api-key-here
# Option 2: Anthropic (comment out OpenAI if using this)
# ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

3. **Generate NextAuth Secret**:

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET`.

4. **Get LLM API Key**:
   - **OpenAI**: Go to https://platform.openai.com/api-keys
   - **Anthropic**: Go to https://console.anthropic.com/settings/keys

## Step 4: Install Dependencies and Run

```bash
# Install dependencies (if not already done)
npm install

# Run the development server
npm run dev
```

## Step 5: Test the Application

1. **Start the dev server**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Login**: Use the email/password you created in Step 2
4. **Create an incident**:
   - Navigate to `/dashboard/incidents`
   - Click "New Incident"
   - Fill out the form and submit
5. **View investigation**:
   - Click on the created incident
   - Wait a few seconds for AI investigation to complete
   - Check the "AI Analysis" tab for hypotheses

## Troubleshooting

### "Unauthorized" errors
- Check that your user is properly linked to an organization
- Verify the user ID in `users` table matches the Supabase Auth user ID

### "User not associated with an organization"
- Make sure you created an organization and linked your user to it
- Check the `organization_id` field in the `users` table

### Database connection errors
- Verify your Supabase URL and keys are correct
- Check that the migration ran successfully
- Ensure your Supabase project is active (not paused)

### LLM errors
- Verify your API key is correct
- Check that you have credits/quota available
- Ensure only one LLM provider is configured (not both OpenAI and Anthropic)

## Next Steps After Setup

Once everything is working:
1. Set up OAuth providers (GitHub/Google) for easier login
2. Connect real observability tools (Datadog, Grafana, etc.)
3. Configure webhook endpoints for alerting tools
4. Set up cron jobs for automated investigations

