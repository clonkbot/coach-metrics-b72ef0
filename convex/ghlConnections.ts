import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const connection = await ctx.db
      .query("ghlConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!connection) return null;

    // Don't expose the full API key
    return {
      _id: connection._id,
      locationId: connection.locationId,
      agencyName: connection.agencyName,
      connectedAt: connection.connectedAt,
      lastSyncAt: connection.lastSyncAt,
      hasApiKey: !!connection.apiKey,
    };
  },
});

export const connect = mutation({
  args: {
    locationId: v.string(),
    apiKey: v.string(),
    agencyName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Remove existing connection if any
    const existing = await ctx.db
      .query("ghlConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    const connectionId = await ctx.db.insert("ghlConnections", {
      userId,
      locationId: args.locationId,
      apiKey: args.apiKey,
      agencyName: args.agencyName,
      connectedAt: Date.now(),
    });

    return connectionId;
  },
});

export const disconnect = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const connection = await ctx.db
      .query("ghlConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (connection) {
      // Also delete related snapshots and logs
      const snapshots = await ctx.db
        .query("kpiSnapshots")
        .withIndex("by_connection", (q) => q.eq("connectionId", connection._id))
        .collect();

      for (const snapshot of snapshots) {
        await ctx.db.delete(snapshot._id);
      }

      const logs = await ctx.db
        .query("syncLogs")
        .withIndex("by_connection", (q) => q.eq("connectionId", connection._id))
        .collect();

      for (const log of logs) {
        await ctx.db.delete(log._id);
      }

      await ctx.db.delete(connection._id);
    }
  },
});
