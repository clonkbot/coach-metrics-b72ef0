import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // GoHighLevel API configuration per user
  ghlConnections: defineTable({
    userId: v.id("users"),
    locationId: v.string(),
    apiKey: v.string(),
    agencyName: v.optional(v.string()),
    connectedAt: v.number(),
    lastSyncAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Cached KPI data from GoHighLevel
  kpiSnapshots: defineTable({
    userId: v.id("users"),
    connectionId: v.id("ghlConnections"),
    timestamp: v.number(),
    // Lead metrics
    totalLeads: v.number(),
    newLeadsToday: v.number(),
    newLeadsThisWeek: v.number(),
    newLeadsThisMonth: v.number(),
    // Pipeline metrics
    pipelineValue: v.number(),
    dealsWon: v.number(),
    dealsClosed: v.number(),
    conversionRate: v.number(),
    // Engagement metrics
    appointmentsBooked: v.number(),
    appointmentsCompleted: v.number(),
    noShowRate: v.number(),
    // Revenue metrics
    totalRevenue: v.number(),
    revenueThisMonth: v.number(),
    averageDealValue: v.number(),
    // Contact metrics
    activeContacts: v.number(),
    contactsReachedOut: v.number(),
  }).index("by_user", ["userId"])
    .index("by_connection", ["connectionId"])
    .index("by_timestamp", ["timestamp"]),

  // Goals and targets
  kpiGoals: defineTable({
    userId: v.id("users"),
    metricName: v.string(),
    targetValue: v.number(),
    period: v.string(), // "daily", "weekly", "monthly"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_metric", ["userId", "metricName"]),

  // Activity log for tracking sync history
  syncLogs: defineTable({
    userId: v.id("users"),
    connectionId: v.id("ghlConnections"),
    status: v.string(), // "success", "error", "in_progress"
    message: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_user", ["userId"])
    .index("by_connection", ["connectionId"]),
});
