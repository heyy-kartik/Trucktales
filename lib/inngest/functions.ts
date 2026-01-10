import { inngest } from "./client";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

interface IncidentEventData {
  incidentId: string;
  highway: string;
  kilometer: number;
  issue: string;
  severity: string;
  latitude?: number;
  longitude?: number;
}

interface TruckData {
  truckId: string;
  phoneNumber?: string;
  latitude: number;
  longitude: number;
}

export const handleHighSeverityIncident = inngest.createFunction(
  { id: "handle-high-severity-incident" },
  { event: "incident.high-severity" },
  async ({ event, step }) => {
    const incident = event.data as IncidentEventData;

    // Step 1: Find nearby trucks
    const nearbyTrucks = await step.run("find-nearby-trucks", async () => {
      if (!incident.latitude || !incident.longitude) {
        return [] as TruckData[];
      }

      // Call Convex to get nearby trucks
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (!convexUrl) {
        console.error("Convex URL not configured");
        return [] as TruckData[];
      }

      try {
        // In a real implementation, you'd call the Convex function
        // For now, we'll return a placeholder
        return [] as TruckData[];
      } catch (error) {
        console.error("Failed to fetch nearby trucks:", error);
        return [] as TruckData[];
      }
    });

    // Step 2: Send SMS notifications to nearby truck drivers
    const notifications = await step.run("send-sms-notifications", async () => {
      if (!nearbyTrucks || nearbyTrucks.length === 0) {
        return { sent: 0, failed: 0 };
      }

      let sent = 0;
      let failed = 0;

      for (const truck of nearbyTrucks) {
        if (!truck || !truck.phoneNumber) continue;

        try {
          const message = `HIGHWAY ALERT: ${incident.issue} on ${incident.highway} at KM ${incident.kilometer}. Please reroute if possible. Severity: ${incident.severity.toUpperCase()}`;

          await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: truck.phoneNumber,
          });

          sent++;
        } catch (error) {
          console.error(`Failed to send SMS to truck ${truck.truckId}:`, error);
          failed++;
        }
      }

      return { sent, failed };
    });

    return {
      incidentId: incident.incidentId,
      trucksNotified: notifications.sent,
      notificationsFailed: notifications.failed,
    };
  }
);

export const handleIncidentResolution = inngest.createFunction(
  { id: "handle-incident-resolution" },
  { event: "incident.resolved" },
  async ({ event, step }) => {
    const incident = event.data as IncidentEventData;

    await step.run("log-resolution", async () => {
      console.log(`Incident ${incident.incidentId} resolved: ${incident.issue}`);
      return true;
    });

    return { success: true };
  }
);
