import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

// Get user's dashboard stats
export const getDashboardStats = query({
    args: {
        examCode: v.optional(v.union(v.literal("AZ-900"), v.literal("AZ-104"), v.literal("AZ-305"))),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Get user profile
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) {
            return null;
        }

        const examCode = args.examCode || profile.selectedExam || "AZ-900";

        // Get user progress for selected exam
        const progress = await ctx.db
            .query("userProgress")
            .withIndex("by_user_exam", (q) =>
                q.eq("userId", userId).eq("examCode", examCode)
            )
            .unique();

        // Get today's activity
        const today = new Date().toISOString().split("T")[0];
        const todayActivity = await ctx.db
            .query("dailyActivity")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", today)
            )
            .unique();

        // Get recent sessions
        const recentSessions = await ctx.db
            .query("examSessions")
            .withIndex("by_user_exam", (q) =>
                q.eq("userId", userId).eq("examCode", examCode)
            )
            .filter((q) => q.eq(q.field("status"), "completed"))
            .order("desc")
            .take(5);

        // Calculate estimated readiness
        const readiness = progress
            ? Math.min(100, Math.round(
                (progress.totalCorrect / Math.max(progress.totalQuestionsAttempted, 1)) *
                Math.min(progress.totalQuestionsAttempted / 200, 1) * 100
            ))
            : 0;

        return {
            profile,
            examCode,
            streak: {
                current: profile.currentStreak,
                longest: profile.longestStreak,
            },
            todayProgress: {
                questions: todayActivity?.questionsAnswered || 0,
                goal: profile.dailyGoal || 20,
                accuracy: todayActivity
                    ? todayActivity.correctAnswers / Math.max(todayActivity.questionsAnswered, 1)
                    : 0,
            },
            overallProgress: {
                questionsAttempted: progress?.totalQuestionsAttempted || 0,
                correctRate: progress
                    ? progress.totalCorrect / Math.max(progress.totalQuestionsAttempted, 1)
                    : 0,
                estimatedReadiness: readiness,
            },
            domainBreakdown: progress?.domainStats || {},
            recentSessions,
        };
    },
});
