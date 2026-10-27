/** Weekly presentation choice, anchored to midnight in Duhok on 27 October 2026. */
const START_DAY = Date.UTC(2026, 9, 27);
const WEEK = 7 * 24 * 60 * 60 * 1000;

export type DesignChoice = "refined" | "approved";

export function designForDate(date: Date): DesignChoice {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Baghdad", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const day = Date.UTC(get("year"), get("month") - 1, get("day"));
  const week = Math.max(0, Math.floor((day - START_DAY) / WEEK));
  return week % 2 === 0 ? "refined" : "approved";
}
