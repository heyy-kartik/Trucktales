import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query all incidents
export const getIncidents = query({
  args: {
    status: v.optional(v.string()),
    severity: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let incidents = await ctx.db.query("incidents").collect();
    
    if (args.status) {
      incidents = incidents.filter(i => i.status === args.status);
    }
    
    if (args.severity) {
      incidents = incidents.filter(i => i.severity === args.severity);
    }
    
    return incidents.sort((a, b) => b.reportedAt - a.reportedAt);
  },
});

// Query all trucks
export const getTrucks = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let trucks = await ctx.db.query("trucks").collect();
    
    if (args.status) {
      trucks = trucks.filter(t => t.status === args.status);
    }
    
    return trucks;
  },
});

// Create new incident
export const createIncident = mutation({
  args: {
    highway: v.string(),
    kilometer: v.number(),
    issue: v.string(),
    eta: v.optional(v.string()),
    severity: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    audioTranscript: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const incidentId = await ctx.db.insert("incidents", {
      ...args,
      reportedAt: Date.now(),
      status: "open",
    });
    return incidentId;
  },
});

// Update truck location
export const updateTruckLocation = mutation({
  args: {
    truckId: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    currentHighway: v.optional(v.string()),
    currentKilometer: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingTruck = await ctx.db
      .query("trucks")
      .filter((q) => q.eq(q.field("truckId"), args.truckId))
      .first();

    if (existingTruck) {
      await ctx.db.patch(existingTruck._id, {
        latitude: args.latitude,
        longitude: args.longitude,
        currentHighway: args.currentHighway,
        currentKilometer: args.currentKilometer,
        status: args.status || existingTruck.status,
        lastUpdated: Date.now(),
      });
      return existingTruck._id;
    } else {
      const truckId = await ctx.db.insert("trucks", {
        truckId: args.truckId,
        latitude: args.latitude,
        longitude: args.longitude,
        currentHighway: args.currentHighway,
        currentKilometer: args.currentKilometer,
        status: args.status || "active",
        lastUpdated: Date.now(),
      });
      return truckId;
    }
  },
});

// Get nearby trucks for a given location
export const getNearbyTrucks = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    radiusKm: v.number(),
  },
  handler: async (ctx, args) => {
    const trucks = await ctx.db.query("trucks").collect();
    
    // Simple distance calculation (Haversine formula)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };
    
    return trucks.filter(truck => {
      const distance = calculateDistance(
        args.latitude,
        args.longitude,
        truck.latitude,
        truck.longitude
      );
      return distance <= args.radiusKm;
    });
  },
});
