import { describe, expect, it } from "vitest";
import { checkBudgetStatus, convertToMonthly, getHabitHistorySummary, getMonthlyCost } from "./utils";

describe("getMonthlyCost", () => {
  it("calculates daily habits on a 30-day month", () => {
    expect(getMonthlyCost({ cost: 100, frequency: 2, frequencyType: "daily" })).toBe(6000);
  });

  it("calculates weekly habits on a 4-week month", () => {
    expect(getMonthlyCost({ cost: 250, frequency: 3, frequencyType: "weekly" })).toBe(3000);
  });

  it("calculates monthly habits directly", () => {
    expect(getMonthlyCost({ cost: 499, frequency: 1, frequencyType: "monthly" })).toBe(499);
  });

  it("falls back to weekly for old habits without frequencyType", () => {
    expect(getMonthlyCost({ cost: 50, frequency: 2 })).toBe(400);
  });

  it("returns 0 for unknown frequency types", () => {
    expect(getMonthlyCost({ cost: 50, frequency: 2, frequencyType: "yearly" })).toBe(0);
  });
});

describe("convertToMonthly", () => {
  it("returns monthly income unchanged", () => {
    expect(convertToMonthly(60000, "monthly")).toBe(60000);
  });

  it("converts yearly income to monthly income", () => {
    expect(convertToMonthly(1200000, "yearly")).toBe(100000);
  });
});

describe("checkBudgetStatus", () => {
  it("returns none when no budget is set", () => {
    expect(checkBudgetStatus(5000, 0)).toEqual({ status: "none", percentage: 0 });
  });

  it("returns safe at 50% or less", () => {
    expect(checkBudgetStatus(5000, 10000)).toEqual({ status: "safe", percentage: 50 });
  });

  it("returns moderate above 50%", () => {
    expect(checkBudgetStatus(6000, 10000)).toEqual({ status: "moderate", percentage: 60 });
  });

  it("returns warning above 80%", () => {
    expect(checkBudgetStatus(9000, 10000)).toEqual({ status: "warning", percentage: 90 });
  });

  it("returns exceeded above 100%", () => {
    const result = checkBudgetStatus(11000, 10000);

    expect(result.status).toBe("exceeded");
    expect(result.percentage).toBeCloseTo(110);
  });
});

describe("getHabitHistorySummary", () => {
  it("summarizes latest monthly change and non-increase streak", () => {
    const summary = getHabitHistorySummary([
      { date: "2026-06-24", totalMonthly: 5000 },
      { date: "2026-06-25", totalMonthly: 4500 },
      { date: "2026-06-26", totalMonthly: 4500 }
    ]);

    expect(summary.monthlyChange).toBe(0);
    expect(summary.monthlyChangePercent).toBe(0);
    expect(summary.nonIncreaseStreak).toBe(2);
  });

  it("stops the streak when spending increases", () => {
    const summary = getHabitHistorySummary([
      { date: "2026-06-24", totalMonthly: 5000 },
      { date: "2026-06-25", totalMonthly: 4500 },
      { date: "2026-06-26", totalMonthly: 4700 }
    ]);

    expect(summary.monthlyChange).toBe(200);
    expect(summary.nonIncreaseStreak).toBe(0);
  });
});
