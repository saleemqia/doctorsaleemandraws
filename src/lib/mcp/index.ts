import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listAppointmentsTool from "./tools/list-appointments";
import updateAppointmentStatusTool from "./tools/update-appointment-status";
import appointmentStatsTool from "./tools/appointment-stats";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "project-lovable",
  title: "Project Lovable",
  version: "0.1.0",
  instructions:
    "Tools for the dental clinic app. Use `list_appointments` to read appointment requests, `appointment_stats` for a summary, and `update_appointment_status` to confirm, cancel, or complete a request. All tools act as the signed-in clinic user; appointment data is visible only to clinic admins.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listAppointmentsTool, appointmentStatsTool, updateAppointmentStatusTool],
});
