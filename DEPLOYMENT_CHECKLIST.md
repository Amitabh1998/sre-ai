# Vercel Deployment Checklist

## Quick Start

### 1. Push to GitHub/GitLab
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your repository
4. Configure environment variables (see below)
5. Deploy!

## Required Environment Variables

Copy these into Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (Required)
NEXTAUTH_URL=https://your-app.vercel.app  # Update after first deploy!
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# LLM API (Required for AI features)
OPENAI_API_KEY=your-openai-key
# OR
ANTHROPIC_API_KEY=your-anthropic-key

# App URL (Required)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app  # Update after first deploy!

# OAuth (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Post-Deployment Steps

1. ✅ Update `NEXTAUTH_URL` with your Vercel domain
2. ✅ Update `NEXT_PUBLIC_APP_URL` with your Vercel domain
3. ✅ Update Supabase Auth redirect URLs:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/api/auth/callback/*`
4. ✅ Test authentication
5. ✅ Test AI investigation features

## Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

## Troubleshooting

- **Build fails?** Check build logs in Vercel Dashboard
- **Auth not working?** Verify NEXTAUTH_URL matches your domain
- **Database errors?** Check Supabase credentials and RLS policies
- **AI not working?** Verify LLM API keys are set

For detailed instructions, see `VERCEL_DEPLOYMENT.md`

