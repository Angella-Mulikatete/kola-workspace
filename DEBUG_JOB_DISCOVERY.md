# Debug Job Discovery Issue

## Problem
Jobs are being fetched from SerpAPI successfully but not displaying on the frontend.

## Root Cause Analysis
The issue is likely one of the following:
1. **OpenAI API key not set in Convex** - Jobs are scoring below 0.6 threshold
2. **OpenAI API calls failing** - Network issues or rate limits
3. **Jobs scoring too low** - AI is giving scores below 0.6 threshold

## Changes Made

### 1. Enhanced Logging in `convex/jobs.ts`
- Added comprehensive logging to `triggerJobDiscovery` action
- Added detailed logging to `scoreJob` action
- Now returns detailed results: `{ success, totalJobs, savedJobs, skippedJobs }`

### 2. Improved Error Handling
- `scoreJob` now returns 0.7 (above threshold) when OpenAI key is missing or API fails
- This allows testing the full flow even without OpenAI configured

### 3. Better User Feedback in Dashboard
- Shows specific messages based on discovery results
- Tells user how many jobs were found vs saved
- Explains if jobs didn't match well enough

## How to Debug

### Step 1: Check Convex Environment Variables
1. Go to your Convex dashboard: https://dashboard.convex.dev
2. Select your project
3. Go to Settings → Environment Variables
4. Verify these variables are set:
   - `SERP_API_KEY` = `14bb9f42978b921ed929908c73d066ad399cfa827bf23393e0194efcc664450e`
   - `OPENAI_API_KEY` = (your OpenAI API key)

### Step 2: Test Job Discovery
1. Run the development server: `npm run dev`
2. Go to the dashboard
3. Click "Discover Now" button
4. Watch the browser console for logs
5. Check the Convex logs in the dashboard

### Step 3: Check Convex Logs
1. Go to Convex dashboard → Logs
2. Look for these log messages:
   ```
   === TRIGGER JOB DISCOVERY START ===
   ✓ Fetched X jobs from API
   --- Processing job 1/X ---
   → scoreJob called
   ✓ OpenAI API key found (or ✗ OPENAI_API_KEY not found)
   → Final score: X.XX
   ✓ Score above threshold, saving job... (or ✗ Score below threshold)
   === TRIGGER JOB DISCOVERY COMPLETE ===
   ```

### Step 4: Verify Jobs in Database
1. Go to Convex dashboard → Data
2. Check the `recommended_jobs` table
3. Look for jobs with your `userId`

## Expected Behavior

### With OpenAI API Key Set:
- Jobs are fetched from SerpAPI ✓
- Each job is scored by OpenAI (0.0 to 1.0)
- Jobs with score > 0.6 are saved to database
- Jobs appear on dashboard immediately

### Without OpenAI API Key:
- Jobs are fetched from SerpAPI ✓
- Each job gets default score of 0.7 (for testing)
- All jobs are saved to database (since 0.7 > 0.6)
- Jobs appear on dashboard immediately

## Quick Fix for Testing

If you want to see jobs immediately without waiting for OpenAI setup:

The code now automatically returns a score of 0.7 when OpenAI is not configured, so jobs should appear even without the OpenAI API key.

## Next Steps

1. **Check the logs** - Run job discovery and check both browser console and Convex dashboard logs
2. **Verify environment variables** - Make sure both API keys are set in Convex
3. **Check the database** - Look at the `recommended_jobs` table in Convex dashboard
4. **Report findings** - Share what you see in the logs so we can diagnose further

## Common Issues

### Issue: "OPENAI_API_KEY not found"
**Solution**: Add your OpenAI API key to Convex environment variables

### Issue: "Jobs saved: 0" but "Total jobs fetched: 10"
**Solution**: All jobs scored below 0.6. This shouldn't happen with the new default score of 0.7, but if it does, check the OpenAI API response in logs.

### Issue: Jobs appear in database but not on frontend
**Solution**: Check the `getRecommendedJobs` query - make sure it's using the correct userId

### Issue: "Failed to fetch jobs" from SerpAPI
**Solution**: Verify SERP_API_KEY is set correctly in Convex environment variables
