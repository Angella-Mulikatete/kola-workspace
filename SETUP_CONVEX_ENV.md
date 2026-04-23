# Setting Up Convex Environment Variables

Convex functions run on Convex servers, so they need their own environment variables set in the Convex dashboard.

## Required Environment Variables for Convex

You need to set these in your Convex dashboard:

1. **RAPID_API** - For job discovery
2. **OPENAI_API_KEY** - For AI job scoring

## How to Set Them

### Option 1: Using Convex Dashboard (Recommended)

1. Go to https://dashboard.convex.dev
2. Select your project: `kola-workspace`
3. Click on "Settings" in the left sidebar
4. Click on "Environment Variables"
5. Add the following variables:

```
RAPID_API=your_rapidapi_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

6. Click "Save"

### Option 2: Using Convex CLI

Run these commands in your terminal:

```bash
npx convex env set RAPID_API your_rapidapi_key_here
npx convex env set OPENAI_API_KEY your_openai_api_key_here
```

## Verify Setup

After setting the environment variables:

1. Go to your dashboard at http://localhost:3001/dashboard
2. Click the "Discover Now" button
3. Check the browser console and Convex logs for any errors
4. Jobs should appear within 10-30 seconds

## Troubleshooting

If jobs don't appear:

1. Check Convex dashboard logs for errors
2. Verify environment variables are set correctly
3. Check that your user profile is complete (skill, location, hourly rate)
4. Try the manual trigger button again

## Testing the Cron Job

The cron job runs automatically every 6 hours. To test it immediately:

1. Use the "Discover Now" button on the dashboard
2. Or run manually in Convex dashboard:
   - Go to Functions
   - Find `jobs:triggerJobDiscovery`
   - Click "Run" and provide your userId

---

**Note:** After setting environment variables in Convex, you may need to redeploy your functions:

```bash
npx convex dev --once
```
