import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // ========== USER PROFILE ==========
    // Note: Convex Auth creates a "users" table automatically
    // We extend it with our custom fields via "userProfiles"

    userProfiles: defineTable({
        userId: v.id("users"),  // References Convex Auth users table
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),

        // Preferences
        selectedExam: v.optional(v.union(
            v.literal("AZ-900"),
            v.literal("AZ-104"),
            v.literal("AZ-305")
        )),
        dailyGoal: v.optional(v.number()),  // Questions per day
        reminderTime: v.optional(v.string()),

        // Gamification
        totalXp: v.number(),
        currentStreak: v.number(),
        longestStreak: v.number(),
        lastActiveDate: v.string(),  // YYYY-MM-DD

        createdAt: v.number(),
    })
        .index("by_user_id", ["userId"]),

    // ========== QUESTIONS ==========
    questions: defineTable({
        examCode: v.union(
            v.literal("AZ-900"),
            v.literal("AZ-104"),
            v.literal("AZ-305")
        ),
        type: v.union(
            v.literal("single-choice"),
            v.literal("multiple-choice"),
            v.literal("drag-drop"),
            v.literal("fill-blank"),
            v.literal("case-study"),
            v.literal("true-false")
        ),
        domain: v.string(),
        subdomain: v.optional(v.string()),
        difficulty: v.union(
            v.literal("easy"),
            v.literal("medium"),
            v.literal("hard")
        ),

        // Question content (JSON structure varies by type)
        content: v.any(),

        // Metadata
        explanation: v.string(),
        references: v.optional(v.array(v.string())),
        imageIds: v.optional(v.array(v.id("_storage"))),

        // Quality tracking
        timesAnswered: v.number(),
        timesCorrect: v.number(),
        averageTimeSeconds: v.number(),

        // Admin
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_exam", ["examCode"])
        .index("by_exam_domain", ["examCode", "domain"])
        .index("by_exam_type", ["examCode", "type"])
        .index("by_difficulty", ["difficulty"]),

    // ========== CASE STUDIES ==========
    caseStudies: defineTable({
        examCode: v.union(v.literal("AZ-104"), v.literal("AZ-305")),
        title: v.string(),
        scenario: v.object({
            background: v.string(),
            currentEnvironment: v.string(),
            requirements: v.array(v.string()),
            constraints: v.optional(v.array(v.string())),
        }),
        diagramIds: v.optional(v.array(v.id("_storage"))),
        questionIds: v.array(v.id("questions")),
        isActive: v.boolean(),
    })
        .index("by_exam", ["examCode"]),

    // ========== EXAM SESSIONS ==========
    examSessions: defineTable({
        userId: v.id("users"),  // Convex Auth user ID
        examCode: v.union(
            v.literal("AZ-900"),
            v.literal("AZ-104"),
            v.literal("AZ-305")
        ),
        mode: v.union(
            v.literal("learn"),
            v.literal("mock"),
            v.literal("timed")
        ),

        // Configuration
        questionCount: v.number(),
        timeLimitMinutes: v.optional(v.number()),
        domainFilter: v.optional(v.array(v.string())),

        // Progress
        status: v.union(
            v.literal("in-progress"),
            v.literal("completed"),
            v.literal("abandoned")
        ),
        currentQuestionIndex: v.number(),
        questionIds: v.array(v.id("questions")),

        // Timing
        startedAt: v.number(),
        completedAt: v.optional(v.number()),
        totalTimeSeconds: v.number(),
        timeRemainingSeconds: v.optional(v.number()),

        // Results (populated on completion)
        score: v.optional(v.number()),  // 0-1000 scale
        correctCount: v.optional(v.number()),
        incorrectCount: v.optional(v.number()),
        skippedCount: v.optional(v.number()),
    })
        .index("by_user", ["userId"])
        .index("by_user_exam", ["userId", "examCode"])
        .index("by_user_status", ["userId", "status"]),

    // ========== QUESTION RESPONSES ==========
    questionResponses: defineTable({
        sessionId: v.id("examSessions"),
        questionId: v.id("questions"),
        userId: v.id("users"),

        // User's answer (structure varies by question type)
        userAnswer: v.any(),

        isCorrect: v.boolean(),
        isPartialCredit: v.optional(v.boolean()),
        pointsEarned: v.number(),  // Usually 0 or 1, or partial

        // Timing
        timeSpentSeconds: v.number(),
        answeredAt: v.number(),

        // Flags
        wasFlagged: v.boolean(),
        wasSkipped: v.boolean(),
    })
        .index("by_session", ["sessionId"])
        .index("by_user_question", ["userId", "questionId"]),

    // ========== PROGRESS TRACKING ==========
    userProgress: defineTable({
        userId: v.id("users"),
        examCode: v.union(
            v.literal("AZ-900"),
            v.literal("AZ-104"),
            v.literal("AZ-305")
        ),

        // Overall stats
        totalQuestionsAttempted: v.number(),
        totalCorrect: v.number(),
        totalTimeMinutes: v.number(),

        // Domain breakdown: { "Cloud Concepts": { attempted: 50, correct: 40 } }
        domainStats: v.any(),

        // Question type breakdown
        typeStats: v.any(),

        // Difficulty breakdown
        difficultyStats: v.any(),

        // Mock/Timed exam history
        examAttempts: v.number(),
        highestScore: v.number(),
        averageScore: v.number(),
        passCount: v.number(),

        lastUpdated: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_exam", ["userId", "examCode"]),

    // ========== DAILY ACTIVITY ==========
    dailyActivity: defineTable({
        userId: v.id("users"),
        date: v.string(),  // YYYY-MM-DD

        questionsAnswered: v.number(),
        correctAnswers: v.number(),
        timeSpentMinutes: v.number(),
        xpEarned: v.number(),

        // Per-exam breakdown
        examActivity: v.any(),  // { "AZ-900": { questions: 20, correct: 15 } }
    })
        .index("by_user_date", ["userId", "date"]),

    // ========== BOOKMARKS / WEAK AREAS ==========
    bookmarks: defineTable({
        userId: v.id("users"),
        questionId: v.id("questions"),
        note: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"]),

    weakQuestions: defineTable({
        userId: v.id("users"),
        questionId: v.id("questions"),
        incorrectCount: v.number(),
        lastAttemptAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_count", ["userId", "incorrectCount"]),
});
