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

export function checkBudgetStatus(totalMonthly, budget) {
  if (!budget || budget === 0) {
    return { status: "none", percentage: 0 };
  }

  const percentage = (totalMonthly / budget) * 100;

  if (percentage > 100) {
    return { status: "exceeded", percentage };
  } else if (percentage > 80) {
    return { status: "warning", percentage };
  } else if (percentage > 50) {
    return { status: "moderate", percentage };
  }

  return { status: "safe", percentage };
}

export function exportHabitsToJSON(habits, profile = null) {
  const exportData = {
    exportDate: new Date().toISOString(),
    profile: profile
      ? {
          currency: profile.currency,
          userType: profile.userType,
          income: profile.income,
          incomeFrequency: profile.incomeFrequency,
          budget: profile.budget
        }
      : null,
    totalHabits: habits.length,
    habits: habits.map((habit) => ({
      name: habit.name,
      cost: habit.cost,
      frequency: habit.frequency,
      frequencyType: habit.frequencyType || "weekly",
      category: habit.category,
      monthlyCost: getMonthlyCost(habit),
      yearlyCost: getYearlyCost(habit)
    }))
  };

  return JSON.stringify(exportData, null, 2);
}

export function downloadJSON(jsonString, filename = "habits-export.json") {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(jsonString)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
