// Normalize all habit calculations to monthly base

export function getMonthlyCost(habit) {
  if (!habit.frequencyType) {
    // Fallback for old habits that only have frequency (assume weekly)
    return habit.cost * habit.frequency * 4;
  }

  if (habit.frequencyType === "daily") {
    return habit.cost * habit.frequency * 30;
  }
  if (habit.frequencyType === "weekly") {
    return habit.cost * habit.frequency * 4;
  }
  if (habit.frequencyType === "monthly") {
    return habit.cost * habit.frequency;
  }
  return 0;
}

export function getYearlyCost(habit) {
  return getMonthlyCost(habit) * 12;
}

export function convertToMonthly(income, incomeFrequency) {
  if (incomeFrequency === "yearly") {
    return income / 12;
  }
  return income;
}
