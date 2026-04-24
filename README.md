# 🚀 Kola Workspace

> **Your AI-Powered Freelance Command Center**

Automate gig discovery, project scoping, proposals, and earnings forecasting with the power of AI.

![Kola Workspace](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Convex](https://img.shields.io/badge/Convex-Database-orange?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-Auth-yellow?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

---

## ✨ Features

### 🎯 Smart Job Discovery
- **AI-Powered Matching**: Automatically discovers and scores jobs based on your skills
- **Personalized Recommendations**: Get curated gigs updated every 6 hours
- **Custom Search**: Search for specific skills and locations
- **Match Scoring**: See how well each job matches your profile (0-100%)

### ✨ Magic Input
- **Instant Workspace Generation**: Paste any job URL and get a complete project workspace
- **AI Analysis**: Automatically extracts job details and requirements
- **Auto-Generated Milestones**: Creates project breakdown with estimated hours and costs
- **Smart Proposals**: Generates professional proposals from milestones

### 📊 Interactive Kanban Board
- **Drag & Drop**: Organize milestones across To Do, In Progress, and Done
- **Real-Time Updates**: Changes sync instantly across all views
- **Inline Editing**: Edit milestone details directly on the board
- **Celebration Effects**: Confetti animations when milestones are completed 🎉

### 📈 Earnings Visualization
- **Three Chart Views**:
  - **Cumulative**: Track progressive earnings growth
  - **Breakdown**: Compare individual milestone costs
  - **Timeline**: Forecast earnings over time
- **Progress Tracking**: See earned vs. total project value
- **Interactive Charts**: Hover for detailed information

### 📄 Proposal Generation
- **Live Updates**: Proposals regenerate automatically when milestones change
- **Markdown Editing**: Edit proposals with full markdown support
- **PDF Export**: Export proposals via browser print dialog
- **Professional Format**: Clean, client-ready proposal layout

### 🎨 Delightful UX
- **Confetti Celebrations**: Celebrate achievements with animations
- **Onboarding Tour**: Interactive 4-step tour for new users
- **Keyboard Shortcuts**: Power user features (Ctrl + /)
- **Floating Action Button**: Quick access to common actions
- **Smooth Animations**: 60fps GPU-accelerated micro-interactions

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + Shadcn UI |
| **Authentication** | Firebase Authentication (Google OAuth) |
| **Database** | Convex (Real-time, reactive) |
| **AI** | Vercel AI SDK + OpenAI GPT-4 |
| **Animations** | Framer Motion + Canvas Confetti |
| **Charts** | Recharts |
| **Job Discovery** | SerpAPI (Google Jobs) |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Firebase project (for authentication)
- Convex account (for database)
- OpenAI API key (for AI features)
- SerpAPI key (for job discovery)

### Installation

```bash
# Clone the repository
git clone https://github.com/Angella-Mulikatete/kola-workspace.git
cd kola-workspace

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Push Convex schema
npx convex dev --once

# Start development server
npm run dev
# or
bun run dev
```

### Environment Variables

Create a `.env.local` file:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key

# SerpAPI (for job discovery)
SERP_API_KEY=your_serpapi_key
```

### Convex Environment Variables

Set these in your Convex dashboard (Settings → Environment Variables):

```env
OPENAI_API_KEY=your_openai_api_key
SERP_API_KEY=your_serpapi_key
```

---

## 📖 Usage

### First Time Setup

1. **Sign In**: Click "Get Started with Google"
2. **Onboarding**: Complete the 2-step setup
   - Enter your hourly rate (e.g., $50)
   - Enter your primary skill (e.g., "React Developer")
   - Enter your location (e.g., "New York, NY")
3. **Dashboard**: You're ready to go! 🎉

### Creating a Workspace

**Method 1: Magic Input**
1. Paste a job URL from Upwork, Fiverr, or any platform
2. Click "Generate Pitch"
3. AI creates a complete workspace with milestones and proposal

**Method 2: Job Discovery**
1. Click "Discover Now" on the dashboard
2. Browse AI-recommended jobs
3. Click "Generate Pitch" on any job card

### Managing Projects

1. **Kanban Board**: Drag milestones between columns
2. **Edit Milestones**: Click edit icon to modify details
3. **Track Progress**: Watch earnings chart update in real-time
4. **Edit Proposal**: Click "Edit" to customize the proposal
5. **Export PDF**: Click "Export PDF" to save or print

### Keyboard Shortcuts

- `Ctrl + /` - Show keyboard shortcuts
- `Ctrl + K` - Open command palette
- `Ctrl + N` - Create new workspace
- `Ctrl + D` - Discover jobs
- `Esc` - Close dialogs

---

## 📁 Project Structure

```
kola-workspace/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── chat/               # AI chat endpoint
│   │   └── generate-workspace/ # Workspace generation
│   ├── dashboard/              # Dashboard page
│   ├── workspace/[id]/         # Workspace detail page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── ui/                     # Shadcn UI components
│   ├── earnings-chart.tsx      # Chart visualizations
│   ├── job-card.tsx            # Job recommendation card
│   ├── kanban-board.tsx        # Drag & drop board
│   ├── milestone-card.tsx      # Milestone component
│   ├── proposal-view.tsx       # Proposal editor
│   ├── onboarding-modal.tsx    # User onboarding
│   ├── onboarding-tour.tsx     # Interactive tour
│   ├── keyboard-shortcuts.tsx  # Shortcuts panel
│   └── floating-action-button.tsx # FAB
├── convex/                      # Convex backend
│   ├── schema.ts               # Database schema
│   ├── users.ts                # User functions
│   ├── jobs.ts                 # Job discovery
│   ├── workspaces.ts           # Workspace management
│   └── crons.ts                # Scheduled jobs
├── lib/                         # Utilities
│   ├── firebase.ts             # Firebase config
│   ├── confetti.ts             # Celebration effects
│   └── utils.ts                # Helper functions
├── providers/                   # React context
│   ├── auth-provider.tsx       # Authentication
│   └── convex-provider.tsx     # Convex client
└── public/                      # Static assets
```

---

## 🗄️ Database Schema

### Tables

**users**
- `firebaseId`: User's Firebase UID
- `email`: User email
- `displayName`: User's name
- `photoURL`: Profile picture
- `hourlyRate`: Hourly rate in USD
- `primarySkill`: Main skill/expertise
- `location`: City, State/Country
- `onboardingComplete`: Boolean flag

**workspaces**
- `userId`: Reference to users table
- `jobUrl`: Original job posting URL
- `jobTitle`: Project title
- `jobDescription`: Project description
- `generatedProposal`: AI-generated proposal
- `status`: "active" | "archived"

**milestones**
- `workspaceId`: Reference to workspaces table
- `title`: Milestone name
- `description`: Milestone details
- `status`: "todo" | "in-progress" | "done"
- `estimatedHours`: Time estimate
- `cost`: Calculated cost (hours × rate)
- `order`: Display order

**recommended_jobs**
- `userId`: Reference to users table
- `source`: Job source (e.g., "serpapi")
- `jobUrl`: Link to job posting
- `title`: Job title
- `description`: Job description
- `matchScore`: AI match score (0-1)

**proposals**
- `workspaceId`: Reference to workspaces table
- `content`: Proposal markdown content
- `version`: Version number

---

## 🔄 Cron Jobs

### Job Discovery (Every 6 hours)
```typescript
crons.interval("discover jobs", { hours: 6 }, internal.jobs.discoverJobsForAllUsers);
```

Automatically discovers and scores new jobs for all users with complete profiles.

---

## 🎨 Design System

### Colors
- **Primary**: Purple (`#a855f7`)
- **Secondary**: Pink (`#ec4899`)
- **Accent**: Blue (`#3b82f6`)
- **Success**: Green (`#10b981`)
- **Background**: Black (`#000000`)
- **Surface**: Zinc-900 (`#18181b`)

### Typography
- **Font**: Geist Sans & Geist Mono
- **Headings**: Bold, 2xl-5xl
- **Body**: Regular, sm-base
- **Code**: Mono, xs-sm

### Animations
- **Duration**: 200-400ms
- **Easing**: ease-in-out, spring
- **FPS**: 60fps (GPU-accelerated)

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git push origin master
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables
- Deploy!

3. **Configure Convex**
```bash
npx convex deploy
```

4. **Update Environment Variables**
- Add production Convex URL to Vercel
- Verify all API keys are set

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🧪 Testing

### Run Development Server
```bash
npm run dev
```

### Test Features
1. **Authentication**: Sign in with Google
2. **Onboarding**: Complete profile setup
3. **Job Discovery**: Click "Discover Now"
4. **Workspace Creation**: Paste a job URL
5. **Kanban Board**: Drag milestones
6. **Proposal**: Edit and export PDF
7. **Charts**: Switch between views
8. **Confetti**: Complete a milestone
9. **Shortcuts**: Press Ctrl + /

---

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with Turbopack
- **Animations**: 60fps GPU-accelerated

---

## 🐛 Troubleshooting

### Convex Connection Issues
```bash
npx convex dev --once
```

### Firebase Auth Issues
- Verify Firebase config in `lib/firebase.ts`
- Check authorized domains in Firebase Console
- Ensure Google OAuth is enabled

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Job Discovery Not Working
- Verify `SERP_API_KEY` is set in Convex dashboard
- Check API usage limits on SerpAPI dashboard
- Review logs in Convex dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** - The React framework
- **Convex** - Real-time database
- **Firebase** - Authentication
- **OpenAI** - AI capabilities
- **SerpAPI** - Job discovery
- **Vercel** - Deployment platform
- **Shadcn UI** - Component library
- **Framer Motion** - Animation library

---

## 📧 Contact

**Angella Mulikatete**
- GitHub: [@Angella-Mulikatete](https://github.com/Angella-Mulikatete)
- Project: [Kola Workspace](https://github.com/Angella-Mulikatete/kola-workspace)

---

## 🗺️ Roadmap

### Completed ✅
- [x] Authentication & Onboarding
- [x] AI Integration & Magic Input
- [x] Smart Job Discovery Engine
- [x] Generative Kanban Board
- [x] Proposal Generation & Charts
- [x] Polish & "Wow" Factor

### Coming Soon 🚧
- [ ] Team collaboration features
- [ ] Invoice generation
- [ ] Time tracking
- [ ] Client portal
- [ ] Mobile app
- [ ] Integrations (Slack, Notion, etc.)

---

**Built with ❤️ by freelancers, for freelancers**

