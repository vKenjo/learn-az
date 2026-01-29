import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Toggle bookmark for a question
export const toggleBookmark = mutation({
    args: { questionId: v.id("questions") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("bookmarks")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("questionId"), args.questionId))
            .unique();

        if (existing) {
            await ctx.db.delete(existing._id);
            return false; // Not bookmarked anymore
        } else {
            await ctx.db.insert("bookmarks", {
                userId,
                questionId: args.questionId,
                createdAt: Date.now(),
            });
            return true; // Bookmarked
        }
    },
});

// Get all bookmarks for user
export const getBookmarks = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const bookmarks = await ctx.db
            .query("bookmarks")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        // Fetch question details for each bookmark
        const questions = await Promise.all(
            bookmarks.map(async (b) => {
                const q = await ctx.db.get(b.questionId);
                return {
                    ...b,
                    question: q,
                };
            })
        );

        return questions.filter(b => b.question !== null);
    },
});

// Check if a specific question is bookmarked
export const isBookmarked = query({
    args: { questionId: v.id("questions") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return false;

        const existing = await ctx.db
            .query("bookmarks")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("questionId"), args.questionId))
            .unique();

        return !!existing;
    },
});
