import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Fetch jobs from SerpAPI (Google Jobs API)
export const fetchJobsFromAPI = internalAction({
  args: {
    skill: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const serpApiKey = process.env.SERP_API_KEY;
    
    if (!serpApiKey) {
      console.error("SERP_API_KEY not found");
      return [];
    }

    try {
      // Using Google Jobs API from SerpAPI
      const query = `${args.skill} freelance remote`;
      const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(args.location)}&api_key=${serpApiKey}`;

      console.log("Fetching jobs with query:", query);

      const response = await fetch(url, {
        method: "GET",
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch jobs:", response.status, errorText);
        
        // Return mock data for testing if API fails
        return getMockJobs(args.skill, args.location);
      }

      const data = await response.json();
      console.log("API Response data:", data);
      
      // Extract relevant job data from SerpAPI response
      const jobs = data.jobs_results?.slice(0, 10).map((job: any) => ({
        title: job.title || "Untitled Job",
        description: job.description || "",
        url: job.share_link || job.apply_options?.[0]?.link || "",
        source: "serpapi",
        employer: job.company_name || "Unknown",
        location: job.location || args.location,
        postedAt: job.detected_extensions?.posted_at || new Date().toISOString(),
      })) || [];

      console.log(`Successfully fetched ${jobs.length} jobs`);
      return jobs;
    } catch (error) {
      console.error("Error fetching jobs from API:", error);
      // Return mock data for testing
      return getMockJobs(args.skill, args.location);
    }
  },
});

// Mock jobs for testing when API fails
function getMockJobs(skill: string, location: string) {
  console.log("Using mock jobs for testing");
  return [
    {
      title: `Senior ${skill} Developer - Remote`,
      description: `We are looking for an experienced ${skill} developer to join our team. This is a remote position with flexible hours. You will work on exciting projects and collaborate with a talented team.`,
      url: "https://example.com/job1",
      source: "mock",
      employer: "Tech Company Inc",
      location: location,
      postedAt: new Date().toISOString(),
    },
    {
      title: `${skill} Freelance Project`,
      description: `Seeking a skilled ${skill} professional for a 3-month project. Must have strong communication skills and ability to work independently.`,
      url: "https://example.com/job2",
      source: "mock",
      employer: "Startup XYZ",
      location: "Remote",
      postedAt: new Date().toISOString(),
    },
    {
      title: `Lead ${skill} Engineer`,
      description: `Join our growing team as a lead engineer. You'll be responsible for architecture decisions and mentoring junior developers.`,
      url: "https://example.com/job3",
      source: "mock",
      employer: "Enterprise Corp",
      location: location,
      postedAt: new Date().toISOString(),
    },
    {
      title: `${skill} Consultant - Contract`,
      description: `We need a consultant to help with our digital transformation. 6-month contract with possibility of extension.`,
      url: "https://example.com/job4",
      source: "mock",
      employer: "Consulting Firm",
      location: "Hybrid",
      postedAt: new Date().toISOString(),
    },
    {
      title: `Junior ${skill} Developer`,
      description: `Great opportunity for someone starting their career in ${skill}. We provide mentorship and training.`,
      url: "https://example.com/job5",
      source: "mock",
      employer: "Growing Startup",
      location: location,
      postedAt: new Date().toISOString(),
    },
  ];
}

// Score a job based on user profile using AI
export const scoreJob = internalAction({
  args: {
    jobTitle: v.string(),
    jobDescription: v.string(),
    userSkill: v.string(),
    userLocation: v.string(),
  },
  handler: async (ctx, args) => {
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      console.error("OPENAI_API_KEY not found");
      return 0.5; // Default score
    }

    try {
      const prompt = `You are a job matching expert. Score this job from 0.0 to 1.0 based on how well it matches the user's profile.

User Profile:
- Primary Skill: ${args.userSkill}
- Location: ${args.userLocation}

Job:
- Title: ${args.jobTitle}
- Description: ${args.jobDescription.substring(0, 500)}

Return ONLY a number between 0.0 and 1.0 representing the match score. Higher is better.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a job matching expert. Return only a number between 0.0 and 1.0.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        console.error("Failed to score job:", response.statusText);
        return 0.5;
      }

      const data = await response.json();
      const scoreText = data.choices[0]?.message?.content?.trim() || "0.5";
      const score = parseFloat(scoreText);

      return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
    } catch (error) {
      console.error("Error scoring job:", error);
      return 0.5;
    }
  },
});

// Save recommended job to database
export const saveRecommendedJob = internalMutation({
  args: {
    userId: v.id("users"),
    source: v.string(),
    jobUrl: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    matchScore: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if job already exists for this user
    const existing = await ctx.db
      .query("recommended_jobs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("jobUrl"), args.jobUrl))
      .first();

    if (existing) {
      // Update the match score if it changed
      await ctx.db.patch(existing._id, {
        matchScore: args.matchScore,
      });
      return existing._id;
    }

    // Create new recommended job
    return await ctx.db.insert("recommended_jobs", {
      userId: args.userId,
      source: args.source,
      jobUrl: args.jobUrl,
      title: args.title,
      description: args.description,
      matchScore: args.matchScore,
      createdAt: Date.now(),
    });
  },
});

// Discover and score jobs for a user
export const discoverJobsForUser = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get user profile
    const user = await ctx.runQuery(internal.jobs.getUserProfile, {
      userId: args.userId,
    });

    if (!user || !user.primarySkill || !user.location) {
      console.log("User profile incomplete, skipping job discovery");
      return;
    }

    // Fetch jobs from API
    const jobs = await ctx.runAction(internal.jobs.fetchJobsFromAPI, {
      skill: user.primarySkill,
      location: user.location,
    });

    console.log(`Found ${jobs.length} jobs for user ${args.userId}`);

    // Score and save each job
    for (const job of jobs) {
      try {
        const score = await ctx.runAction(internal.jobs.scoreJob, {
          jobTitle: job.title,
          jobDescription: job.description,
          userSkill: user.primarySkill,
          userLocation: user.location,
        });

        // Only save jobs with score > 0.6
        if (score > 0.6) {
          await ctx.runMutation(internal.jobs.saveRecommendedJob, {
            userId: args.userId,
            source: job.source,
            jobUrl: job.url,
            title: job.title,
            description: job.description,
            matchScore: score,
          });
        }
      } catch (error) {
        console.error("Error processing job:", error);
      }
    }
  },
});

// Get user profile (internal query)
export const getUserProfile = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get recommended jobs for a user
export const getRecommendedJobs = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    return await ctx.db
      .query("recommended_jobs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

// Manual trigger for job discovery (for testing)
export const triggerJobDiscovery = action({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.runAction(internal.jobs.discoverJobsForUser, {
      userId: args.userId,
    });
    return { success: true };
  },
});

// Discover jobs for all users (called by cron)
export const discoverJobsForAllUsers = internalAction({
  args: {},
  handler: async (ctx) => {
    // Get all users with complete profiles
    const users = await ctx.runQuery(internal.jobs.getAllUsersWithProfiles);

    console.log(`Discovering jobs for ${users.length} users`);

    for (const user of users) {
      try {
        await ctx.runAction(internal.jobs.discoverJobsForUser, {
          userId: user._id,
        });
      } catch (error) {
        console.error(`Error discovering jobs for user ${user._id}:`, error);
      }
    }
  },
});

// Get all users with complete profiles
export const getAllUsersWithProfiles = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    // Filter users with complete profiles
    return users.filter(
      (user) => user.primarySkill && user.location && user.hourlyRate > 0
    );
  },
});
