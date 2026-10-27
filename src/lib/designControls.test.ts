import { describe, expect, it, vi } from "vitest";
import { needsPin } from "../../lib/clinic";
import { onRequestPost } from "../../functions/clinic/api/design";

describe("design controls", () => {
  it("requires the owner's PIN for reading and saving settings", () => {
    const url = new URL("https://www.doctorsaleem.com/clinic/api/design");
    expect(needsPin(url, "GET")).toBe(true);
    expect(needsPin(url, "POST")).toBe(true);
  });
  it("rejects cross-site requests and unrecognized designs", async () => {
    const run = vi.fn();
    const env = { DB: { prepare: () => ({ bind: () => ({ run }) }) } };
    const request = (origin: string, mode: string) => new Request("https://www.doctorsaleem.com/clinic/api/design", {
      method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify({ mode }),
    });
    expect((await onRequestPost({ request: request("https://elsewhere.example", "refined"), env } as never)).status).toBe(403);
    expect((await onRequestPost({ request: request("https://www.doctorsaleem.com", "unknown"), env } as never)).status).toBe(400);
    expect(run).not.toHaveBeenCalled();
    expect((await onRequestPost({ request: request("https://www.doctorsaleem.com", "refined"), env } as never)).status).toBe(200);
    expect(run).toHaveBeenCalledOnce();
  });
});
