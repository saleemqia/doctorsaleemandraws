import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

export default defineTool({
  name: "update_appointment_status",
  title: "Update appointment status",
  description:
    "Update the status of one appointment request (pending, confirmed, cancelled, completed). Requires clinic admin access.",
  inputSchema: {
    id: z.string().describe("Appointment id (uuid)."),
    status: z.enum(STATUSES).describe("New status for the appointment."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select("id, name, service, preferred_date, preferred_time, status");

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data || data.length === 0) {
      return {
        content: [{ type: "text", text: "No appointment updated. Check the id and that you have admin access." }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data[0], null, 2) }],
      structuredContent: { appointment: data[0] },
    };
  },
});
