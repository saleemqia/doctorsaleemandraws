import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "appointment_stats",
  title: "Appointment stats",
  description: "Summarize appointment requests by status, plus how many are upcoming from today onward.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("appointments").select("status, preferred_date");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const today = new Date().toISOString().slice(0, 10);
    const byStatus: Record<string, number> = {};
    let upcoming = 0;
    for (const row of data ?? []) {
      byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
      if (row.preferred_date >= today) upcoming += 1;
    }
    const summary = { total: data?.length ?? 0, by_status: byStatus, upcoming };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
