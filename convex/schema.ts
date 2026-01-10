import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  incidents: defineTable({
    highway: v.string(),
    kilometer: v.number(),
    issue: v.string(),
    eta: v.optional(v.string()),
    severity: v.string(), // "low", "medium", "high"
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    audioTranscript: v.optional(v.string()),
    reportedAt: v.number(),
    status: v.string(), // "open", "in-progress", "resolved"
  }).index("by_severity", ["severity"])
    .index("by_status", ["status"])
    .index("by_highway", ["highway"]),

  trucks: defineTable({
    truckId: v.string(),
    driverName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    currentHighway: v.optional(v.string()),
    currentKilometer: v.optional(v.number()),
    latitude: v.number(),
    longitude: v.number(),
    status: v.string(), // "active", "idle", "offline"
    lastUpdated: v.number(),
  }).index("by_highway", ["currentHighway"])
    .index("by_status", ["status"]),

  notifications: defineTable({
    incidentId: v.id("incidents"),
    truckId: v.id("trucks"),
    message: v.string(),
    sentAt: v.number(),
    type: v.string(), // "sms", "push"
    status: v.string(), // "sent", "failed"
  }).index("by_incident", ["incidentId"])
    .index("by_truck", ["truckId"]),
});
