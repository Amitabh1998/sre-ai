# ReliOps AI - Frontend

AI-powered SRE agent frontend built with Next.js 14, TypeScript, and TailwindCSS.

## Features

- 🔐 Authentication (GitHub, Google OAuth + Email/Password)
- 📊 Dashboard with incident metrics and AI activity feed
- 🚨 Incident management with AI-powered root cause analysis
- 🔌 Integration management (Slack, PagerDuty, Datadog, etc.)
- ⚙️ Team settings and notification preferences
- 🎨 Dark mode UI with modern design system

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /api              # API route handlers
  /dashboard        # Dashboard pages
  /login            # Auth pages
  /onboarding       # Onboarding wizard
/components
  /ui               # Base UI components
  /layout           # Layout components
  /features         # Feature-specific components
/lib                # Utility functions
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Icons:** Material Symbols Outlined
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Auth:** NextAuth.js

## Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Development

- Run linting: `npm run lint`
- Build for production: `npm run build`
- Start production server: `npm start`

## License

MIT

