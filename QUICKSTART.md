# 🚀 Kola Workspace - Quick Start Guide

## Prerequisites
- Node.js 18+ or Bun installed
- Firebase project configured (already done ✅)
- Convex account and deployment (already done ✅)

## Installation

```bash
# Install dependencies
bun install

# Push Convex schema (if not already done)
npx convex dev --once
```

## Development

```bash
# Start the development server
bun run dev

# In a separate terminal, run Convex in dev mode (optional, for live updates)
npx convex dev
```

## Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Time Setup

1. Click "Get Started with Google"
2. Sign in with your Google account
3. Complete the 2-step onboarding:
   - Enter your hourly rate
   - Enter your primary skill and location
4. You're ready to go! 🎉

## Project Structure

```
kola-workspace/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── onboarding-modal.tsx
├── convex/               # Convex backend
│   ├── schema.ts        # Database schema
│   └── users.ts         # User functions
├── lib/                 # Utilities
│   ├── firebase.ts     # Firebase config
│   └── utils.ts        # Helper functions
└── providers/          # React context providers
    ├── auth-provider.tsx
    └── convex-provider.tsx
```

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=https://insightful-mammoth-200.convex.cloud
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Auth:** Firebase Authentication
- **Database:** Convex (Real-time, reactive)
- **AI:** Vercel AI SDK
- **Animations:** Framer Motion
- **Charts:** Recharts

## Development Roadmap

- ✅ **Day 1:** Scaffolding, Auth & Onboarding
- 🔄 **Day 2:** AI Integration & Magic Input
- ⏳ **Day 3:** Smart Job Discovery Engine
- ⏳ **Day 4:** Generative Kanban Board
- ⏳ **Day 5:** Generative Proposal & Chart
- ⏳ **Day 6:** Polish & "Wow" Factor
- ⏳ **Day 7:** Demo Prep

## Troubleshooting

### Convex Connection Issues
```bash
npx convex dev --once
```

### Firebase Auth Issues
- Check that Firebase project is configured correctly
- Verify API keys in `lib/firebase.ts`

### Build Errors
```bash
bun run build
```

## Support

For issues or questions, check:
- [Convex Docs](https://docs.convex.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Happy Building! 🚀**
