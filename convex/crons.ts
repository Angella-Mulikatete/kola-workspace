import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run job discovery every 6 hours
crons.interval(
  "discover-jobs",
  { hours: 6 }, // Run every 6 hours
  internal.jobs.discoverJobsForAllUsers
);

// You can also use cron syntax for more specific scheduling
// crons.cron(
//   "discover-jobs-daily",
//   "0 9 * * *", // Run at 9 AM every day
//   internal.jobs.discoverJobsForAllUsers
// );

export default crons;
