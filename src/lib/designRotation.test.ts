import { describe, expect, it } from "vitest";
import { designForDate } from "./designRotation";

describe("weekly Duhok design rotation", () => {
  it("starts with refined and switches at Duhok midnight on 3 November", () => {
    expect(designForDate(new Date("2026-10-26T21:00:00Z"))).toBe("refined");
    expect(designForDate(new Date("2026-11-02T20:59:59Z"))).toBe("refined");
    expect(designForDate(new Date("2026-11-02T21:00:00Z"))).toBe("approved");
    expect(designForDate(new Date("2026-11-09T21:00:00Z"))).toBe("refined");
  });
});
