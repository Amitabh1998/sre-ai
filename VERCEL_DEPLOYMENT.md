# Deploying ReliOps AI to Vercel

This guide will walk you through deploying your ReliOps AI application to Vercel.

## Prerequisites

1. **GitHub/GitLab/Bitbucket Account** - Your code needs to be in a Git repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **Supabase Project** - Your Supabase project should be set up and running
4. **Environment Variables** - All required environment variables ready

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Push to GitHub/GitLab

```bash
# Create a new repository on GitHub/GitLab, then:
git remote add origin https://github.com/yourusername/reliops-ai.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in or create an account

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Import your Git repository (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add all the variables listed below.

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

4. **Add Environment Variables**
   ```bash
   vercel env add VARIABLE_NAME
   ```
   
   Or add them via the Vercel Dashboard (easier).

## Step 3: Environment Variables

Add these environment variables in Vercel Dashboard → Your Project → Settings → Environment Variables:

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32

# OAuth Providers (Optional - if using OAuth)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LLM API Keys (Required for AI features)
OPENAI_API_KEY=your-openai-api-key
# OR
ANTHROPIC_API_KEY=your-anthropic-api-key

# Optional: Custom OpenAI Base URL (for OpenAI-compatible APIs)
OPENAI_BASE_URL=https://api.openai.com/v1

# App URL (for API routes)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Environment Variable Setup Tips

1. **Set for all environments** (Production, Preview, Development)
2. **Update NEXTAUTH_URL** after first deployment with your actual Vercel URL
3. **Keep secrets secure** - Never commit `.env` files to Git

## Step 4: Configure Vercel Settings

### 4.1 Build Settings

Vercel auto-detects Next.js, but verify:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18.x or 20.x (recommended)

### 4.2 Domain Configuration

1. **Automatic Domain**
   - Vercel provides: `your-project.vercel.app`
   - Update `NEXTAUTH_URL` to match

2. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Step 5: Post-Deployment Checklist

### 5.1 Update Environment Variables

After first deployment, update:
- `NEXTAUTH_URL` to your Vercel URL
- `NEXT_PUBLIC_APP_URL` to your Vercel URL

### 5.2 Configure Supabase

1. **Update Supabase Auth URLs**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to "Site URL"
   - Add `https://your-app.vercel.app/api/auth/callback/*` to "Redirect URLs"

2. **Update RLS Policies** (if needed)
   - Ensure RLS policies work with your production setup

### 5.3 Test Your Deployment

1. **Visit your Vercel URL**
2. **Test authentication**
3. **Test AI investigation features**
4. **Check API routes**

## Step 6: Continuous Deployment

Vercel automatically deploys on:
- **Push to main branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Requests** → Preview deployment

### Manual Deployment

```bash
vercel --prod
```

## Troubleshooting

### Build Fails

1. **Check build logs** in Vercel Dashboard
2. **Verify Node version** (use 18.x or 20.x)
3. **Check environment variables** are set correctly
4. **Review TypeScript errors** locally first

### Runtime Errors

1. **Check Function Logs** in Vercel Dashboard
2. **Verify environment variables** are set
3. **Check Supabase connection**
4. **Review API route errors**

### Authentication Issues

1. **Verify NEXTAUTH_URL** matches your Vercel domain
2. **Check Supabase redirect URLs**
3. **Verify NEXTAUTH_SECRET** is set
4. **Check OAuth provider settings**

### Database Connection Issues

1. **Verify Supabase URL and keys**
2. **Check RLS policies**
3. **Verify service role key** is set correctly
4. **Check network access** in Supabase

## Environment Variables Reference

### Production vs Development

Some variables differ between environments:

| Variable | Development | Production |
|----------|------------|------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |

### Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use different secrets for production
3. ✅ Rotate secrets regularly
4. ✅ Use Vercel's environment variable encryption
5. ✅ Limit service role key access

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Documentation](https://supabase.com/docs)

## Quick Deploy Command

```bash
# One-time setup
vercel login
vercel link

# Deploy to production
vercel --prod
```

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review function logs
3. Check Supabase logs
4. Review Next.js error pages

---

**Note**: After deployment, remember to update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your actual Vercel domain!

