import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get current authenticated user with profile
export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .unique();

        return { ...user, profile };
    },
});

// Create or update user profile (called after auth)
export const upsertProfile = mutation({
    args: {
        name: v.optional(v.string()),
        selectedExam: v.optional(v.union(
            v.literal("AZ-900"),
            v.literal("AZ-104"),
            v.literal("AZ-305")
        )),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("userProfiles")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...args,
            });
            return existing._id;
        }

        return await ctx.db.insert("userProfiles", {
            userId,
            name: args.name,
            selectedExam: args.selectedExam,
            totalXp: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: new Date().toISOString().split("T")[0],
            createdAt: Date.now(),
        });
    },
});

// Internal mutation to create profile on first sign-up
export const createProfileOnSignUp = internalMutation({
    args: { userId: v.id("users"), email: v.string(), name: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("userProfiles")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .unique();

        if (!existing) {
            await ctx.db.insert("userProfiles", {
                userId: args.userId,
                email: args.email,
                name: args.name,
                totalXp: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: new Date().toISOString().split("T")[0],
                createdAt: Date.now(),
            });
        }
    },
});
