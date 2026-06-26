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

function escapeCSVValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export function exportHabitsToCSV(habits, profile = null) {
  const headers = [
    "Export Date",
    "Name",
    "Category",
    "Cost",
    "Frequency",
    "Frequency Type",
    "Monthly Cost",
    "Yearly Cost",
    "Currency",
    "Income",
    "Income Frequency",
    "Budget"
  ];

  const rows = habits.map((habit) => [
    new Date().toISOString(),
    habit.name,
    habit.category || "Other",
    habit.cost,
    habit.frequency,
    habit.frequencyType || "weekly",
    getMonthlyCost(habit).toFixed(2),
    getYearlyCost(habit).toFixed(2),
    profile?.currency || "",
    profile?.income || "",
    profile?.incomeFrequency || "",
    profile?.budget || ""
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCSVValue).join(","))
    .join("\n");
}

function downloadText(content, filename, mimeType) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:${mimeType};charset=utf-8,` + encodeURIComponent(content)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function downloadJSON(jsonString, filename = "habits-export.json") {
  downloadText(jsonString, filename, "application/json");
}

export function downloadCSV(csvString, filename = "habits-export.csv") {
  downloadText(csvString, filename, "text/csv");
}
