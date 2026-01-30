import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

// Get dashboard stats for the current user
export const getDashboardStats = query({
    args: {
        examCode: v.optional(v.union(
            v.literal("AZ-900"),
            v.literal("AZ-104"),
            v.literal("AZ-305"),
        )),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) return null;

        const examCode = args.examCode || profile.selectedExam || "AZ-900";

        const progress = await ctx.db
            .query("userProgress")
            .withIndex("by_user_exam", (q) =>
                q.eq("userId", userId).eq("examCode", examCode as "AZ-900" | "AZ-104" | "AZ-305")
            )
            .unique();

        const today = new Date().toISOString().split("T")[0];
        const todayActivity = await ctx.db
            .query("dailyActivity")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", today)
            )
            .unique();

        const recentSessions = await ctx.db
            .query("examSessions")
            .withIndex("by_user_exam", (q) =>
                q.eq("userId", userId).eq("examCode", examCode as "AZ-900" | "AZ-104" | "AZ-305")
            )
            .order("desc")
            .take(20);

        const completedSessions = recentSessions
            .filter((s) => s.status === "completed")
            .slice(0, 5);

        const totalAttempted = progress?.totalQuestionsAttempted || 0;
        const totalCorrect = progress?.totalCorrect || 0;
        const correctRate = totalAttempted > 0 ? totalCorrect / totalAttempted : 0;
        const coverage = Math.min(totalAttempted / 200, 1);
        const readiness = Math.min(100, Math.round(correctRate * coverage * 100));

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
                questionsAttempted: totalAttempted,
                correctRate,
                estimatedReadiness: readiness,
            },
            domainBreakdown: progress?.domainStats || {},
            recentSessions: completedSessions,
        };
    },
});

// Get weekly activity for the current user
export const getWeeklyActivity = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        // Define last 7 days range
        const end = Date.now();
        const start = end - 7 * 24 * 60 * 60 * 1000;

        // Fetch responses in this range
        const responses = await ctx.db
            .query("questionResponses")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.gte(q.field("answeredAt"), start))
            .collect();

        // Aggregate by day
        const activityMap = new Map<string, number>();

        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            activityMap.set(date, 0);
        }

        responses.forEach(r => {
            const date = new Date(r.answeredAt).toISOString().split('T')[0];
            if (activityMap.has(date)) {
                activityMap.set(date, (activityMap.get(date) || 0) + 1);
            }
        });

        // Convert to array
        return Array.from(activityMap.entries()).map(([day, count]) => ({
            day: day.slice(5), // MM-DD
            count,
            fullDate: day
        }));
    },
});

export const getWeakAreas = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        // Fetch all user responses
        const responses = await ctx.db
            .query("questionResponses")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .take(500); // Limit analysis for perf

        if (responses.length === 0) return [];

        // We need question details to know the domain
        // This is tricky without a join. 
        // We can fetch unique questions involved.
        const questionIds = [...new Set(responses.map(r => r.questionId))];
        const questions = await Promise.all(questionIds.map(id => ctx.db.get(id)));
        const questionMap = new Map(questions.map(q => [q?._id, q]));

        const statsByDomain: Record<string, { correct: number, total: number }> = {};

        responses.forEach(r => {
            const q = questionMap.get(r.questionId);
            if (q) {
                if (!statsByDomain[q.domain]) {
                    statsByDomain[q.domain] = { correct: 0, total: 0 };
                }
                statsByDomain[q.domain].total++;
                if (r.isCorrect) statsByDomain[q.domain].correct++;
            }
        });

        return Object.entries(statsByDomain)
            .map(([domain, stats]) => ({
                domain,
                accuracy: (stats.correct / stats.total) * 100,
                total: stats.total
            }))
            .filter(s => s.total >= 3) // formatting threshold
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 3);
    }
});
