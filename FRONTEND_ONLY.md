# Frontend-Only Development Guide

This application is configured to work **completely independently** without a backend. All authentication and data are handled client-side using localStorage and mock data.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔐 Authentication Flow (Mock)

The app uses **client-side authentication** with Zustand state management:

- **Sign Up**: Any email/password combination works (min 8 chars)
- **Social Login**: GitHub/Google buttons work (mock - redirects immediately)
- **Login**: Uses localStorage to persist session
- **Logout**: Clears session and redirects to login

### How It Works

- Auth state is stored in `lib/store/auth.ts` using Zustand
- Session persists in `localStorage` (key: `auth-storage`)
- No API calls required - all authentication is simulated

## 📱 Available Pages

### Public Pages
- `/` - Redirects to login or dashboard based on auth state
- `/login` - Login page with GitHub/Google OAuth + email
- `/signup` - Signup page with promotional content
- `/forgot-password` - Password reset page

### Protected Pages (Require Auth)
- `/dashboard` - Main dashboard with metrics and incidents
- `/dashboard/incidents` - Incidents list with filters
- `/dashboard/incidents/[id]` - Incident detail view
- `/dashboard/integrations` - Integration management
- `/dashboard/settings` - Team and notification settings
- `/onboarding` - 3-step onboarding wizard

## 🎨 Features

### ✅ Fully Functional (No Backend Required)

1. **Authentication**
   - Sign up / Login / Logout
   - Session persistence
   - Protected routes

2. **Dashboard**
   - View metrics
   - Browse incidents
   - View AI activity feed

3. **Incidents**
   - List all incidents
   - Filter by severity, status, service
   - View incident details
   - See AI analysis and timeline

4. **Integrations**
   - View integration cards
   - Connect/disconnect (mock)
   - Filter by category

5. **Settings**
   - View team members
   - Manage notifications
   - Update organization settings

6. **Onboarding**
   - 3-step wizard
   - Connect Slack (mock)
   - Connect alerting provider
   - Install agent

### 🔧 Mock Data

All data is **hardcoded** in the components:
- Incidents: `app/dashboard/incidents/page.tsx`
- Metrics: `app/dashboard/page.tsx`
- Integrations: `app/dashboard/integrations/page.tsx`
- Team members: `app/dashboard/settings/page.tsx`

## 🎯 Navigation Flow

```
/ → /login (if not authenticated)
  → /dashboard (if authenticated)

/login → /dashboard (after login)
/signup → /onboarding → /dashboard

/dashboard → All dashboard pages accessible
```

## 🛠️ Development Tips

1. **Clear Auth State**: 
   - Open browser DevTools → Application → Local Storage
   - Delete `auth-storage` key to logout

2. **Test Different Users**:
   - Sign up with different emails to see different user names
   - User name is extracted from email (before @)

3. **View All Screens**:
   - Complete onboarding to see all steps
   - Navigate through sidebar to see all pages
   - Click on incidents to see detail views

4. **No Backend Calls**:
   - All API routes (`/api/*`) return mock data
   - No network requests needed
   - Perfect for frontend-only development

## 📦 State Management

- **Zustand** for auth state (`lib/store/auth.ts`)
- **React Hook Form** for form handling
- **Zod** for validation
- **localStorage** for persistence

## 🎨 Design System

- **Colors**: Defined in `tailwind.config.ts`
- **Components**: Reusable UI components in `components/ui/`
- **Icons**: Material Symbols Outlined
- **Fonts**: Inter (UI), JetBrains Mono (code)

## 🚦 Next Steps (When Backend is Ready)

1. Replace mock auth with real API calls
2. Connect to real incident data
3. Implement real integration connections
4. Add real-time updates (WebSockets)
5. Connect to actual monitoring tools

## 📝 Notes

- All forms submit successfully (no validation errors)
- All buttons work (navigation only)
- All modals open/close properly
- Search modal opens with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
- User info displays in sidebar and top bar

Enjoy building! 🎉

