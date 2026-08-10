import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_appointments",
  title: "List appointments",
  description:
    "List clinic appointment requests, newest first. Optionally filter by status (pending, confirmed, cancelled, completed) or by preferred date range.",
  inputSchema: {
    status: z.string().optional().describe("Filter by appointment status."),
    from_date: z.string().optional().describe("Earliest preferred date, YYYY-MM-DD."),
    to_date: z.string().optional().describe("Latest preferred date, YYYY-MM-DD."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, from_date, to_date, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("appointments")
      .select("id, name, phone, service, preferred_date, preferred_time, status, notes, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);

    if (status) query = query.eq("status", status);
    if (from_date) query = query.gte("preferred_date", from_date);
    if (to_date) query = query.lte("preferred_date", to_date);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { appointments: data ?? [] },
    };
  },
});
