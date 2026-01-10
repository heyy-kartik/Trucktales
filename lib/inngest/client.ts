import { Inngest } from "inngest";

export const inngest = new Inngest({ 
  id: "xys-highway-monitor",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
