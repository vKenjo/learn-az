import { v } from "convex/values";
import { query } from "./_generated/server";

export const getCaseStudy = query({
    args: { caseStudyId: v.id("caseStudies") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.caseStudyId);
    },
});
