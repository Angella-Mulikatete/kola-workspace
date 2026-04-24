# 🚀 Deployment Guide

Complete guide to deploying Kola Workspace to production.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] All API keys are set
- [ ] Firebase config is correct
- [ ] Convex deployment URL is updated
- [ ] OpenAI API key is valid
- [ ] SerpAPI key is valid

### 2. Code Quality
- [ ] All tests pass
- [ ] No console errors
- [ ] Build completes successfully
- [ ] TypeScript has no errors
- [ ] ESLint passes

### 3. Security
- [ ] API keys are not in code
- [ ] `.env.local` is in `.gitignore`
- [ ] Firebase security rules are set
- [ ] Convex functions have proper auth

### 4. Performance
- [ ] Images are optimized
- [ ] Bundle size is reasonable
- [ ] Lighthouse score > 90
- [ ] No memory leaks

---

## 🔧 Convex Deployment

### Step 1: Deploy Convex Backend

```bash
# Login to Convex
npx convex login

# Deploy to production
npx convex deploy

# Note the production URL
# Example: https://your-project.convex.cloud
```

### Step 2: Set Environment Variables

Go to [Convex Dashboard](https://dashboard.convex.dev) → Your Project → Settings → Environment Variables

Add these variables:

```env
OPENAI_API_KEY=sk-...
SERP_API_KEY=14bb9f42978b921ed929908c73d066ad399cfa827bf23393e0194efcc664450e
```

### Step 3: Verify Deployment

```bash
# Check deployment status
npx convex dashboard

# View logs
# Go to Logs tab in dashboard
```

---

## 🔥 Firebase Configuration

### Step 1: Production Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Authentication → Sign-in method
4. Enable Google OAuth
5. Add authorized domains:
   - `localhost` (for development)
   - `your-domain.vercel.app` (for production)
   - Your custom domain (if any)

### Step 2: Get Production Config

1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Click on your web app
4. Copy the Firebase config object

### Step 3: Update Environment Variables

Add to your deployment platform (Vercel):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## ▲ Vercel Deployment

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `kola-workspace`

### Step 2: Configure Project

**Framework Preset**: Next.js

**Build Command**: 
```bash
npm run build
```

**Output Directory**: 
```
.next
```

**Install Command**: 
```bash
npm install
```

### Step 3: Add Environment Variables

Add all environment variables from `.env.local`:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

**Note**: Don't add `OPENAI_API_KEY` or `SERP_API_KEY` to Vercel - these are set in Convex.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Visit your deployment URL
4. Test all features

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)
5. Update Firebase authorized domains

---

## 🔒 Security Configuration

### Firebase Security Rules

```javascript
// Firestore Rules (if using Firestore)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Convex Auth Configuration

File: `convex/auth.config.ts`

```typescript
export default {
  providers: [
    {
      domain: process.env.FIREBASE_AUTH_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

---

## 🧪 Post-Deployment Testing

### 1. Authentication Flow
- [ ] Sign in with Google works
- [ ] User profile is created
- [ ] Onboarding modal appears
- [ ] Profile data is saved

### 2. Core Features
- [ ] Job discovery works
- [ ] Workspace creation works
- [ ] Kanban board is functional
- [ ] Proposal generation works
- [ ] Charts display correctly
- [ ] PDF export works

### 3. Real-Time Features
- [ ] Milestone updates sync
- [ ] Proposal updates sync
- [ ] Job recommendations update

### 4. Performance
- [ ] Page load < 3s
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Mobile responsive

### 5. Cron Jobs
- [ ] Job discovery runs every 6 hours
- [ ] Check Convex logs for cron execution

---

## 📊 Monitoring

### Vercel Analytics

1. Go to your project on Vercel
2. Click "Analytics" tab
3. Monitor:
   - Page views
   - Unique visitors
   - Performance metrics
   - Error rates

### Convex Logs

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Click "Logs" tab
4. Monitor:
   - Function calls
   - Errors
   - Performance
   - Cron job execution

### Firebase Analytics (Optional)

1. Enable Analytics in Firebase Console
2. Add Firebase Analytics SDK
3. Track custom events

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error**: `Module not found`
```bash
# Solution: Clear cache and redeploy
vercel --force
```

**Error**: `TypeScript errors`
```bash
# Solution: Fix TypeScript errors locally first
npm run build
```

### Authentication Not Working

**Issue**: "Unauthorized domain"
- Add your Vercel domain to Firebase authorized domains
- Wait 5 minutes for changes to propagate

**Issue**: "Firebase config not found"
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set in Vercel
- Redeploy after adding variables

### Convex Connection Issues

**Issue**: "Failed to connect to Convex"
- Verify `NEXT_PUBLIC_CONVEX_URL` is correct
- Check Convex deployment status
- Ensure Convex functions are deployed

**Issue**: "Environment variable not found"
- Add `OPENAI_API_KEY` and `SERP_API_KEY` to Convex dashboard
- Redeploy Convex functions

### Job Discovery Not Working

**Issue**: No jobs appearing
- Check SerpAPI key is valid
- Verify API usage limits
- Check Convex logs for errors
- Manually trigger: `npx convex run jobs:triggerJobDiscovery --userId "..."`

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin master

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Runs tests
# 4. Deploys to production
```

### Preview Deployments

Every pull request gets a preview deployment:

1. Create a branch
2. Make changes
3. Push to GitHub
4. Open pull request
5. Vercel creates preview URL
6. Test changes
7. Merge when ready

---

## 📈 Scaling

### Database Scaling

Convex automatically scales:
- No configuration needed
- Handles millions of documents
- Real-time updates at scale

### API Rate Limits

**OpenAI**:
- Monitor usage in OpenAI dashboard
- Upgrade plan if needed
- Implement caching for common requests

**SerpAPI**:
- Free tier: 100 searches/month
- Paid plans available
- Consider caching job results

### Vercel Scaling

- Hobby plan: Good for demos
- Pro plan: Recommended for production
- Enterprise: For high traffic

---

## 💰 Cost Estimation

### Monthly Costs (Estimated)

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| **Vercel** | Hobby (free) | Pro ($20/mo) |
| **Convex** | Free (1M reads) | Starter ($25/mo) |
| **Firebase** | Free (50K reads) | Blaze (pay-as-you-go) |
| **OpenAI** | $5 credit | ~$10-50/mo |
| **SerpAPI** | 100 searches | $50/mo (5K searches) |
| **Total** | ~$0-5/mo | ~$105-145/mo |

### Cost Optimization

1. **Cache API responses**
2. **Limit job discovery frequency**
3. **Use OpenAI efficiently** (shorter prompts)
4. **Monitor usage** regularly
5. **Set up billing alerts**

---

## 🎯 Production Checklist

Before going live:

- [ ] All features tested
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SEO optimized
- [ ] Analytics set up
- [ ] Error tracking enabled
- [ ] Backup strategy in place
- [ ] Documentation complete
- [ ] Support email configured
- [ ] Terms of service added
- [ ] Privacy policy added
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] Security audit passed

---

## 📞 Support

If you encounter issues:

1. Check [Convex Docs](https://docs.convex.dev)
2. Check [Next.js Docs](https://nextjs.org/docs)
3. Check [Vercel Docs](https://vercel.com/docs)
4. Open an issue on GitHub
5. Contact support

---

**Happy Deploying! 🚀**

