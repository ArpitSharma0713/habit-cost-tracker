import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getMonthlyCost, getYearlyCost } from "./utils";

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function saveDailyHabitSnapshot(userId, habits) {
  if (!userId) {
    return;
  }

  const date = getLocalDateKey();
  const totalMonthly = habits.reduce((sum, habit) => sum + getMonthlyCost(habit), 0);
  const totalYearly = habits.reduce((sum, habit) => sum + getYearlyCost(habit), 0);

  await setDoc(
    doc(db, "habitSnapshots", `${userId}_${date}`),
    {
      userId,
      date,
      totalMonthly,
      totalYearly,
      habitCount: habits.length,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
