import { query } from "./_generated/server";
import { auth } from "./auth";

// Get weekly activity for the current user
export const getWeeklyActivity = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        // Define last 7 days range
        const end = Date.now();
        const start = end - 7 * 24 * 60 * 60 * 1000;

        // Fetch responses in this range
        const responses = await ctx.db
            .query("questionResponses")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
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
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        // Fetch all user responses
        const responses = await ctx.db
            .query("questionResponses")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
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
