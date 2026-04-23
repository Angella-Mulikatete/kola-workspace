# 🧪 Kola Workspace - Testing Guide

## Prerequisites

✅ Environment variables set in Convex:
- `RAPID_API` - Set ✓
- `OPENAI_API_KEY` - Set ✓

✅ Convex functions deployed

✅ Dev server running on http://localhost:3001

## Testing Day 1 & 2: Auth, Onboarding, Dashboard, AI

### 1. Test Authentication
1. Go to http://localhost:3001
2. Click "Get Started with Google"
3. Sign in with your Google account
4. ✅ Should redirect to onboarding modal

### 2. Test Onboarding
1. Enter your hourly rate (e.g., 50)
2. Click "Continue"
3. Enter your primary skill (e.g., "Full-Stack Developer")
4. Enter your location (e.g., "United States")
5. Click "Complete Setup"
6. ✅ Should redirect to dashboard

### 3. Test Magic Input
1. On dashboard, paste any URL in the input field
2. Click "Generate Pitch" or press Enter
3. ✅ Should see AI streaming response
4. ✅ Should see tool invocations (analyzeJob, createWorkspace)

## Testing Day 3: Job Discovery

### 1. Manual Job Discovery
1. Go to http://localhost:3001/dashboard
2. Scroll down to "Recommended Gigs" section
3. Click the "Discover Now" button
4. ✅ Should see toast: "Job discovery started!"
5. Wait 10-30 seconds
6. ✅ Jobs should appear in the grid

### 2. Verify Job Cards
Each job card should show:
- ✅ Job title
- ✅ Match score with color coding:
  - 🟢 Green = Excellent Match (≥80%)
  - 🟡 Yellow = Good Match (≥60%)
  - 🟠 Orange = Fair Match (<60%)
- ✅ Job description preview
- ✅ Source badge (e.g., "jsearch")
- ✅ External link icon (opens job in new tab)
- ✅ "Generate Pitch" button

### 3. Test Job Card Interactions
1. Hover over a job card
   - ✅ Should lift up slightly
   - ✅ Border should brighten
2. Click the external link icon
   - ✅ Should open job posting in new tab
3. Click "Generate Pitch"
   - ✅ Should trigger AI workspace generation
   - ✅ Should see AI response streaming

### 4. Test Empty State
If no jobs appear:
1. Check that your profile is complete:
   - Hourly rate > 0
   - Primary skill is set
   - Location is set
2. Try clicking "Discover Now" again
3. Check browser console for errors
4. Check Convex dashboard logs

### 5. Verify Cron Job (Optional)
1. Go to https://dashboard.convex.dev
2. Select your project
3. Go to "Logs"
4. Look for cron job executions
5. ✅ Should run every 6 hours automatically

## Expected Behavior

### Job Discovery Flow
```
1. User clicks "Discover Now"
   ↓
2. Fetches jobs from RapidAPI (JSearch)
   - Query: "{skill} {location}"
   - Returns up to 10 jobs
   ↓
3. AI scores each job (0.0 - 1.0)
   - Compares job to user profile
   - Uses GPT-4o-mini
   ↓
4. Saves jobs with score > 0.6
   ↓
5. Jobs appear on dashboard
```

### Match Score Calculation
- **0.8 - 1.0**: Excellent Match (Green)
  - Job closely matches user's skill
  - Location is compatible
  - High relevance
- **0.6 - 0.79**: Good Match (Yellow)
  - Job somewhat matches user's skill
  - Decent relevance
- **< 0.6**: Not saved (filtered out)

## Troubleshooting

### No Jobs Appearing

**Check 1: Profile Complete?**
```
Go to dashboard header
Verify: "{skill} • ${rate}/hr" is displayed
```

**Check 2: Environment Variables Set?**
```bash
npx convex env list
```
Should show:
- RAPID_API
- OPENAI_API_KEY

**Check 3: Convex Logs**
```
1. Go to https://dashboard.convex.dev
2. Select project
3. Go to "Logs"
4. Look for errors in job discovery
```

**Check 4: Browser Console**
```
Open DevTools (F12)
Check Console tab for errors
```

### API Rate Limits

If you see rate limit errors:
- RapidAPI has usage limits
- Wait a few minutes and try again
- Check your RapidAPI dashboard for quota

### Jobs Not Matching

If jobs seem irrelevant:
- AI scoring might need adjustment
- Try different skill keywords
- Update your location to be more specific

## Performance Expectations

- **Job Fetch**: 2-5 seconds
- **AI Scoring**: 1-2 seconds per job
- **Total Discovery**: 10-30 seconds for 10 jobs
- **Cron Job**: Runs every 6 hours automatically

## Success Criteria

✅ Authentication works
✅ Onboarding saves profile
✅ Dashboard displays correctly
✅ Magic Input generates AI responses
✅ "Discover Now" fetches jobs
✅ Jobs display with correct match scores
✅ Job cards are interactive
✅ "Generate Pitch" works from job cards

---

**All tests passing?** You're ready for Day 4! 🚀
