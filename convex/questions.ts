import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

// Get questions for a study session
export const getQuestionsForSession = query({
    args: {
        examCode: v.union(v.literal("AZ-900"), v.literal("AZ-104"), v.literal("AZ-305")),
        mode: v.union(v.literal("learn"), v.literal("mock"), v.literal("timed")),
        count: v.number(),
        domainFilter: v.optional(v.array(v.string())),
        excludeIds: v.optional(v.array(v.id("questions"))),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Build query based on filters
        let questionsQuery = ctx.db
            .query("questions")
            .withIndex("by_exam", (q) => q.eq("examCode", args.examCode))
            .filter((q) => q.eq(q.field("isActive"), true));

        // Get all matching questions
        const allQuestions = await questionsQuery.collect();

        // Filter by domain if specified
        let filtered = allQuestions;
        if (args.domainFilter && args.domainFilter.length > 0) {
            filtered = allQuestions.filter(q =>
                args.domainFilter!.includes(q.domain)
            );
        }

        // Exclude already answered (for learn mode)
        if (args.excludeIds && args.excludeIds.length > 0) {
            filtered = filtered.filter(q =>
                !args.excludeIds!.includes(q._id)
            );
        }

        // Shuffle and limit
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, args.count);

        return selected.map(q => q._id);
    },
});

// Get single question with full content
export const getQuestion = query({
    args: { questionId: v.id("questions") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const question = await ctx.db.get(args.questionId);
        if (!question) throw new Error("Question not found");

        // If has images, get signed URLs
        if (question.imageIds && question.imageIds.length > 0) {
            const imageUrls = await Promise.all(
                question.imageIds.map(id => ctx.storage.getUrl(id))
            );
            return { ...question, imageUrls };
        }

        return question;
    },
});
