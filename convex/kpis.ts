import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const snapshot = await ctx.db
      .query("kpiSnapshots")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    return snapshot;
  },
});

export const getHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const snapshots = await ctx.db
      .query("kpiSnapshots")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 30);

    return snapshots.reverse(); // Return in chronological order
  },
});

export const getGoals = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("kpiGoals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const setGoal = mutation({
  args: {
    metricName: v.string(),
    targetValue: v.number(),
    period: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("kpiGoals")
      .withIndex("by_user_and_metric", (q) =>
        q.eq("userId", userId).eq("metricName", args.metricName)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        targetValue: args.targetValue,
        period: args.period,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("kpiGoals", {
        userId,
        metricName: args.metricName,
        targetValue: args.targetValue,
        period: args.period,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Create a demo snapshot for testing/demo purposes
export const createDemoSnapshot = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const connection = await ctx.db
      .query("ghlConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!connection) throw new Error("No GHL connection found");

    // Generate realistic demo data
    const baseLeads = 150 + Math.floor(Math.random() * 50);
    const conversionRate = 0.15 + Math.random() * 0.1;
    const avgDealValue = 2500 + Math.random() * 1500;

    return await ctx.db.insert("kpiSnapshots", {
      userId,
      connectionId: connection._id,
      timestamp: Date.now(),
      totalLeads: baseLeads * 12,
      newLeadsToday: Math.floor(5 + Math.random() * 10),
      newLeadsThisWeek: Math.floor(35 + Math.random() * 25),
      newLeadsThisMonth: baseLeads,
      pipelineValue: Math.floor(avgDealValue * baseLeads * 0.3),
      dealsWon: Math.floor(baseLeads * conversionRate),
      dealsClosed: Math.floor(baseLeads * conversionRate * 1.2),
      conversionRate: conversionRate * 100,
      appointmentsBooked: Math.floor(baseLeads * 0.6),
      appointmentsCompleted: Math.floor(baseLeads * 0.45),
      noShowRate: 15 + Math.random() * 10,
      totalRevenue: Math.floor(avgDealValue * baseLeads * conversionRate * 12),
      revenueThisMonth: Math.floor(avgDealValue * baseLeads * conversionRate),
      averageDealValue: Math.floor(avgDealValue),
      activeContacts: Math.floor(baseLeads * 8),
      contactsReachedOut: Math.floor(baseLeads * 4),
    });
  },
});

export const getSyncLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("syncLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 10);
  },
});
