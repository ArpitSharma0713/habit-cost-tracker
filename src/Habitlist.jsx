import { useState } from "react";
import { db, auth } from "./firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { saveDailyHabitSnapshot } from "./history";
import {
  getMonthlyCost,
  getYearlyCost,
  convertToMonthly,
  checkBudgetStatus,
  exportHabitsToCSV,
  exportHabitsToJSON,
  downloadCSV,
  downloadJSON
} from "./utils";
import "./Habitlist.css";

function Habitlist({ habits, profile, setHabits, onNotify }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", cost: "", frequency: "", frequencyType: "daily", category: "" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [busyHabit, setBusyHabit] = useState({ id: null, action: null });

  const categories = ["All", "Food", "Transport", "Subscriptions", "Entertainment", "Health", "Shopping", "Other"];
  const filteredHabits = selectedCategory === "All" ? habits : habits.filter(h => h.category === selectedCategory);
  const currency = profile?.currency || "\u20b9";
  const incomeLabel = profile?.userType === "student" ? "pocket money" : "salary";

  const totalMonthly = filteredHabits.reduce((sum, h) => sum + getMonthlyCost(h), 0);
  const totalYearly = filteredHabits.reduce((sum, h) => sum + getYearlyCost(h), 0);

  const monthlyIncome = profile?.income ? convertToMonthly(profile.income, profile.incomeFrequency) : 0;
  const dailyIncome = monthlyIncome / 30;
  const daysLostPerMonth = dailyIncome ? (totalMonthly / dailyIncome) : 0;
  const budgetStatus = profile?.budget ? checkBudgetStatus(totalMonthly, profile.budget) : null;

  async function handleDelete(id) {
    const habitToDelete = habits.find(habit => habit.id === id);

    if (!habitToDelete || habitToDelete.pending || busyHabit.id) {
      return;
    }

    setBusyHabit({ id, action: "delete" });

    try {
      await deleteDoc(doc(db, "habits", id));
      setHabits(prev => {
        const nextHabits = prev.filter(h => h.id !== id);
        saveDailyHabitSnapshot(auth.currentUser?.uid, nextHabits).catch(console.warn);
        return nextHabits;
      });
      onNotify?.("Habit deleted.", "success");
    } catch (error) {
      console.error(error);
      onNotify?.("Could not delete habit. Check your connection and try again.", "error");
    } finally {
      setBusyHabit({ id: null, action: null });
    }
  }

  async function handleEdit(id, updatedHabit) {
    if (!updatedHabit.name || updatedHabit.cost <= 0 || updatedHabit.frequency <= 0) {
      onNotify?.("Habit name, cost, and frequency must be valid.", "error");
      return;
    }

    setBusyHabit({ id, action: "edit" });

    try {
      const habitRef = doc(db, "habits", id);
      await updateDoc(habitRef, updatedHabit);
      setHabits(prev => {
        const nextHabits = prev.map(h =>
          h.id === id ? { ...h, ...updatedHabit } : h
        );
        saveDailyHabitSnapshot(auth.currentUser?.uid, nextHabits).catch(console.warn);
        return nextHabits;
      });
      setEditingId(null);
      onNotify?.("Habit updated.", "success");
    } catch (error) {
      console.error(error);
      onNotify?.("Could not update habit. Check your connection and try again.", "error");
    } finally {
      setBusyHabit({ id: null, action: null });
    }
  }

  function startEdit(habit) {
    if (busyHabit.action) {
      return;
    }

    setEditingId(habit.id);
    setEditForm({
      name: habit.name,
      cost: habit.cost,
      frequency: habit.frequency,
      frequencyType: habit.frequencyType || "daily",
      category: habit.category || "Food"
    });
  }

  function cancelEdit() {
    if (busyHabit.action) {
      return;
    }

    setEditingId(null);
    setEditForm({ name: "", cost: "", frequency: "", frequencyType: "daily", category: "" });
  }

  function handleExportJSON() {
    try {
      const jsonData = exportHabitsToJSON(habits, profile);
      const filename = `habits-export-${new Date().toISOString().split("T")[0]}.json`;
      downloadJSON(jsonData, filename);
      onNotify?.("JSON export downloaded.", "success");
    } catch (error) {
      console.error("Export failed:", error);
      onNotify?.("Failed to export JSON. Please try again.", "error");
    }
  }

  function handleExportCSV() {
    try {
      const csvData = exportHabitsToCSV(habits, profile);
      const filename = `habits-export-${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(csvData, filename);
      onNotify?.("CSV export downloaded.", "success");
    } catch (error) {
      console.error("Export failed:", error);
      onNotify?.("Failed to export CSV. Please try again.", "error");
    }
  }

  return(
    <div className="habit-list">
      <h2>Your Habits</h2>

      {habits.length > 0 && (
        <div className="habit-filter-container">
          <p className="habit-filter-title">Filter by Category</p>
          <div className="habit-filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`habit-filter-button ${selectedCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {habits.length > 0 && (
        <div className="habit-insights">
          {daysLostPerMonth > 0 && (
            <div className="habit-time-hero">
              <p>Cost in days of income</p>
              <strong>{daysLostPerMonth.toFixed(1)} days/month</strong>
              <span>These habits consume this much of your {incomeLabel} every month.</span>
            </div>
          )}

          <div className="habit-summary-grid">
            <div className="habit-summary-card">
              <p>Total Monthly</p>
              <h3>{currency}{totalMonthly.toFixed(2)}</h3>
            </div>
            <div className="habit-summary-card">
              <p>Total Yearly</p>
              <h3>{currency}{totalYearly.toFixed(2)}</h3>
            </div>

            {monthlyIncome > 0 && (
              <div className="habit-summary-card">
                <p>Percentage of Income</p>
                <h3>{((totalMonthly / monthlyIncome) * 100).toFixed(1)}%</h3>
              </div>
            )}

            {budgetStatus && (
              <div className={`habit-summary-card budget-${budgetStatus.status}`}>
                <p>Budget Status</p>
                <h3>{budgetStatus.percentage.toFixed(1)}%</h3>
                <span>of {currency}{profile.budget} budget</span>
              </div>
            )}
          </div>

          {!monthlyIncome && (
            <div className="habit-warning-box">
              <p>Add income in your profile to unlock the cost-in-days insight for every habit.</p>
            </div>
          )}

          {budgetStatus && budgetStatus.status === "exceeded" && (
            <div className="habit-danger-box">
              <p>Your spending has exceeded your monthly budget of {currency}{profile.budget}. Consider reducing some habits or increasing your budget.</p>
            </div>
          )}

          <div className="habit-export-actions">
            <button className="habit-export-button" onClick={handleExportCSV}>
              Export CSV
            </button>
            <button className="habit-export-button secondary" onClick={handleExportJSON}>
              Export JSON
            </button>
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="no-habits">No habits added yet. Start by adding a habit above!</div>
      ) : filteredHabits.length === 0 ? (
        <div className="no-habits">No habits in this category.</div>
      ) : (
        <div className="habits-container">
          {filteredHabits.map((habit, index) => {
            const monthly = getMonthlyCost(habit);
            const yearly = getYearlyCost(habit);
            const daysLost = dailyIncome ? (monthly / dailyIncome) : 0;
            const isEditingBusy = busyHabit.id === habit.id && busyHabit.action === "edit";
            const isDeletingBusy = busyHabit.id === habit.id && busyHabit.action === "delete";

            if (editingId === habit.id) {
              return (
                <div className="habit-card" key={habit.id || index}>
                  <h3>Edit Habit</h3>
                  <div className="habit-edit-form">
                    <input
                      className="habit-edit-input"
                      type="text"
                      value={editForm.name}
                      placeholder="Habit name"
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={isEditingBusy}
                    />
                    <input
                      className="habit-edit-input"
                      type="number"
                      value={editForm.cost}
                      placeholder="Cost per occurrence"
                      onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
                      disabled={isEditingBusy}
                    />
                    <input
                      className="habit-edit-input"
                      type="number"
                      value={editForm.frequency}
                      placeholder="Frequency"
                      onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                      disabled={isEditingBusy}
                    />
                    <select
                      className="habit-edit-select"
                      value={editForm.frequencyType}
                      onChange={(e) => setEditForm({ ...editForm, frequencyType: e.target.value })}
                      disabled={isEditingBusy}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <select
                      className="habit-edit-select"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      disabled={isEditingBusy}
                    >
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Health">Health & Fitness</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="habit-card-actions">
                    <button
                      className="habit-card-button primary"
                      onClick={() => handleEdit(habit.id, {
                        name: editForm.name.trim(),
                        cost: Number(editForm.cost),
                        frequency: Number(editForm.frequency),
                        frequencyType: editForm.frequencyType,
                        category: editForm.category
                      })}
                      disabled={isEditingBusy}
                    >
                      {isEditingBusy ? "Saving..." : "Save"}
                    </button>
                    <button className="habit-card-button secondary" onClick={cancelEdit} disabled={isEditingBusy}>
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return(
              <div className={`habit-card ${habit.pending ? "pending" : ""}`} key={habit.id || index}>
                <div className="habit-card-header">
                  <h3>{habit.name}</h3>
                  <span className="habit-category-badge">
                    {habit.pending ? "Saving" : habit.category || "Other"}
                  </span>
                </div>
                <div className="habit-cost-info">
                  <p><strong>{currency}{Number(habit.cost).toFixed(2)}</strong> x <strong>{habit.frequency}</strong> {habit.frequencyType || "weekly"}</p>
                </div>
                {daysLost > 0 ? (
                  <div className="time-cost-callout">
                    <span>Time cost</span>
                    <strong>{daysLost.toFixed(1)} days/month</strong>
                    <small>of your {incomeLabel}</small>
                  </div>
                ) : (
                  <div className="time-cost-empty">
                    Add income to reveal this habit's time cost.
                  </div>
                )}
                <p><strong>Monthly cost:</strong> {currency}{monthly.toFixed(2)}</p>
                <p><strong>Yearly cost:</strong> {currency}{yearly.toFixed(2)}</p>
                <div className="habit-card-actions">
                  <button
                    className="habit-card-button primary"
                    onClick={() => startEdit(habit)}
                    disabled={habit.pending || Boolean(busyHabit.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="habit-card-button secondary"
                    onClick={() => handleDelete(habit.id)}
                    disabled={habit.pending || Boolean(busyHabit.id)}
                  >
                    {isDeletingBusy ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Habitlist
