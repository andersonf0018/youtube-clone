import { describe, it, expect } from "vitest";
import { formatViewCount, formatDuration, formatTimeAgo } from "./formatters";

describe("formatViewCount", () => {
  it("should format view count less than 1000", () => {
    expect(formatViewCount("500")).toBe("500 views");
    expect(formatViewCount("999")).toBe("999 views");
  });

  it("should format view count in thousands", () => {
    expect(formatViewCount("1000")).toBe("1K views");
    expect(formatViewCount("5500")).toBe("6K views");
    expect(formatViewCount("999999")).toBe("1000K views");
  });

  it("should format view count in millions", () => {
    expect(formatViewCount("1000000")).toBe("1.0M views");
    expect(formatViewCount("1234567")).toBe("1.2M views");
    expect(formatViewCount("5678901")).toBe("5.7M views");
  });

  it("should handle undefined or empty values", () => {
    expect(formatViewCount(undefined)).toBe("0 views");
    expect(formatViewCount("")).toBe("0 views");
  });

  it("should handle invalid input", () => {
    expect(formatViewCount("not-a-number")).toBe("0 views");
  });
});

describe("formatDuration", () => {
  it("should format seconds only", () => {
    expect(formatDuration("PT30S")).toBe("0:30");
    expect(formatDuration("PT5S")).toBe("0:05");
  });

  it("should format minutes and seconds", () => {
    expect(formatDuration("PT5M30S")).toBe("5:30");
    expect(formatDuration("PT15M45S")).toBe("15:45");
  });

  it("should format hours, minutes, and seconds", () => {
    expect(formatDuration("PT1H5M30S")).toBe("1:05:30");
    expect(formatDuration("PT2H15M45S")).toBe("2:15:45");
  });

  it("should handle edge cases", () => {
    expect(formatDuration("PT1M")).toBe("1:00");
    expect(formatDuration("PT1H")).toBe("1:00:00");
    expect(formatDuration("PT1H30S")).toBe("1:00:30");
  });

  it("should handle undefined or invalid values", () => {
    expect(formatDuration(undefined)).toBe("0:00");
    expect(formatDuration("")).toBe("0:00");
    expect(formatDuration("invalid")).toBe("0:00");
  });
});

describe("formatTimeAgo", () => {
  it("should format as 'today' for same day", () => {
    const today = new Date();
    expect(formatTimeAgo(today.toISOString())).toBe("today");
  });

  it("should format days ago", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(twoDaysAgo.toISOString())).toBe("2 days ago");

    const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(oneDayAgo.toISOString())).toBe("1 day ago");
  });

  it("should format weeks ago", () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(twoWeeksAgo.toISOString())).toBe("2 weeks ago");

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(oneWeekAgo.toISOString())).toBe("1 week ago");
  });

  it("should format months ago", () => {
    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(twoMonthsAgo.toISOString())).toBe("2 months ago");

    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(oneMonthAgo.toISOString())).toBe("1 month ago");
  });

  it("should format years ago", () => {
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(twoYearsAgo.toISOString())).toBe("2 years ago");

    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(oneYearAgo.toISOString())).toBe("1 year ago");
  });

  it("should handle invalid dates", () => {
    expect(formatTimeAgo("invalid-date")).toBe("Unknown");
  });
});
