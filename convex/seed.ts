import { internalMutation } from "./_generated/server";

export const seedQuestions = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Check if we already have questions
        const existing = await ctx.db.query("questions").take(1);
        if (existing.length > 0) return "Already seeded";

        const questions = [
            {
                examCode: "AZ-900",
                type: "single-choice",
                domain: "Cloud Concepts",
                difficulty: "easy",
                content: {
                    question: "Which cloud computing model provides the MOST control over hardware to the customer?",
                    options: [
                        "Software as a Service (SaaS)",
                        "Platform as a Service (PaaS)",
                        "Infrastructure as a Service (IaaS)",
                        "Function as a Service (FaaS)"
                    ],
                    correctIndex: 2
                },
                explanation: "IaaS provides the most control.",
                isActive: true,
                timesAnswered: 0,
                timesCorrect: 0,
                averageTimeSeconds: 0,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                examCode: "AZ-900",
                type: "single-choice",
                domain: "Cloud Concepts",
                difficulty: "easy",
                content: {
                    question: "What is the main benefit of using a public cloud?",
                    options: [
                        "Total control over hardware",
                        "Lower capital expenditure (CapEx)",
                        "Highest security",
                        "Dedicated hardware"
                    ],
                    correctIndex: 1
                },
                explanation: "Public cloud shifts costs from CapEx to OpEx.",
                isActive: true,
                timesAnswered: 0,
                timesCorrect: 0,
                averageTimeSeconds: 0,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            // Add more questions as needed
        ];

        for (const q of questions) {
            await ctx.db.insert("questions", q as any);
        }

        return "Seeded " + questions.length + " questions";
    },
});
