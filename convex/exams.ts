import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get session details
export const getSession = query({
    args: { sessionId: v.id("examSessions") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const session = await ctx.db.get(args.sessionId);
        if (!session || session.userId !== userId) {
            return null;
        }

        return session;
    },
});

// Start new exam session
export const startSession = mutation({
    args: {
        examCode: v.union(v.literal("AZ-900"), v.literal("AZ-104"), v.literal("AZ-305")),
        mode: v.union(v.literal("learn"), v.literal("mock"), v.literal("timed")),
        questionCount: v.number(),
        timeLimitMinutes: v.optional(v.number()),
        domainFilter: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Get questions for this session
        const questions = await ctx.db
            .query("questions")
            .withIndex("by_exam", (q) => q.eq("examCode", args.examCode))
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();

        // Shuffle and select
        const shuffled = questions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, args.questionCount);
        const questionIds = selected.map(q => q._id);

        // Create session
        const sessionId = await ctx.db.insert("examSessions", {
            userId,
            examCode: args.examCode,
            mode: args.mode,
            questionCount: args.questionCount,
            timeLimitMinutes: args.timeLimitMinutes,
            domainFilter: args.domainFilter,
            status: "in-progress",
            currentQuestionIndex: 0,
            questionIds,
            startedAt: Date.now(),
            totalTimeSeconds: 0,
            timeRemainingSeconds: args.timeLimitMinutes
                ? args.timeLimitMinutes * 60
                : undefined,
        });

        return sessionId;
    },
});

// Submit answer for current question
export const submitAnswer = mutation({
    args: {
        sessionId: v.id("examSessions"),
        questionId: v.id("questions"),
        userAnswer: v.any(),
        timeSpentSeconds: v.number(),
        isFlagged: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Validate session belongs to user
        const session = await ctx.db.get(args.sessionId);
        if (!session || session.userId !== userId) {
            throw new Error("Session not found");
        }

        // Get question and check answer
        const question = await ctx.db.get(args.questionId);
        if (!question) throw new Error("Question not found");

        // Calculate if correct based on question type
        let isCorrect = false;
        let pointsEarned = 0;

        const content = question.content as any;

        switch (question.type) {
            case "single-choice":
                isCorrect = args.userAnswer === content.correctIndex;
                break;
            case "multiple-choice":
                const userAnswers = args.userAnswer as number[];
                const correctAnswers = content.correctIndices as number[];
                isCorrect =
                    userAnswers.length === correctAnswers.length &&
                    userAnswers.every(a => correctAnswers.includes(a));
                break;
            case "true-false":
                isCorrect = args.userAnswer === content.correctAnswer;
                break;
            // Add other question types...
        }

        pointsEarned = isCorrect ? 1 : 0;

        // Create response record
        await ctx.db.insert("questionResponses", {
            sessionId: args.sessionId,
            questionId: args.questionId,
            userId,
            userAnswer: args.userAnswer,
            isCorrect,
            pointsEarned,
            timeSpentSeconds: args.timeSpentSeconds,
            answeredAt: Date.now(),
            wasFlagged: args.isFlagged || false,
            wasSkipped: false,
        });

        // Update session progress
        await ctx.db.patch(args.sessionId, {
            currentQuestionIndex: session.currentQuestionIndex + 1,
            totalTimeSeconds: session.totalTimeSeconds + args.timeSpentSeconds,
        });

        // Return result (for learn mode, include explanation)
        return {
            isCorrect,
            pointsEarned,
            explanation: session.mode === "learn" ? question.explanation : undefined,
            correctAnswer: session.mode === "learn" ? content.correctIndex || content.correctIndices : undefined,
        };
    },
});

// Complete/submit exam
export const completeSession = mutation({
    args: {
        sessionId: v.id("examSessions"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const session = await ctx.db.get(args.sessionId);
        if (!session || session.userId !== userId) {
            throw new Error("Session not found");
        }

        // Get all responses for this session
        const responses = await ctx.db
            .query("questionResponses")
            .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
            .collect();

        const correctCount = responses.filter(r => r.isCorrect).length;
        const incorrectCount = responses.filter(r => !r.isCorrect && !r.wasSkipped).length;
        const skippedCount = session.questionCount - responses.length;

        // Calculate score (0-1000 scale like Microsoft)
        const score = Math.round((correctCount / session.questionCount) * 1000);

        // Update session
        await ctx.db.patch(args.sessionId, {
            status: "completed",
            completedAt: Date.now(),
            score,
            correctCount,
            incorrectCount,
            skippedCount,
        });

        // Update user profile stats
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .unique();

        if (profile) {
            const xpEarned = correctCount * 10 + (score >= 700 ? 50 : 0);
            const today = new Date().toISOString().split("T")[0];
            const isNewDay = profile.lastActiveDate !== today;
            const newStreak = isNewDay
                ? (wasYesterday(profile.lastActiveDate) ? profile.currentStreak + 1 : 1)
                : profile.currentStreak;

            await ctx.db.patch(profile._id, {
                totalXp: profile.totalXp + xpEarned,
                currentStreak: newStreak,
                longestStreak: Math.max(profile.longestStreak, newStreak),
                lastActiveDate: today,
            });
        }

        return {
            score,
            passed: score >= 700,
            correctCount,
            incorrectCount,
            skippedCount,
            totalQuestions: session.questionCount,
        };
    },
});

// Helper function
function wasYesterday(dateStr: string): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateStr === yesterday.toISOString().split("T")[0];
}
