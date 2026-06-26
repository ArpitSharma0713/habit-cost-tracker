import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { saveDailyHabitSnapshot } from "./history";
import "./Habitform.css";

function Habitform({ setHabits, currency = "₹" }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [frequency, setFrequency] = useState("");
  const [frequencyType, setFrequencyType] = useState("daily");
  const [category, setCategory] = useState("Food");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!name || !cost || !frequency) {
      alert("Please fill all fields");
      return;
    }

    const newHabit = {
      name,
      cost: Number(cost),
      frequency: Number(frequency),
      frequencyType,
      category,
      userId: user.uid
    };

    const tempId = `temp-${Date.now()}`;
    const optimisticHabit = { id: tempId, ...newHabit, pending: true };

    setSaving(true);
    setHabits(prev => [...prev, optimisticHabit]);

    try {
      const docRef = await addDoc(collection(db, "habits"), newHabit);
      setHabits(prev => {
        const nextHabits = prev.map(habit =>
          habit.id === tempId ? { id: docRef.id, ...newHabit } : habit
        );
        saveDailyHabitSnapshot(user.uid, nextHabits).catch(console.warn);
        return nextHabits;
      });
      setName("");
      setCost("");
      setFrequency("");
      setFrequencyType("daily");
      setCategory("Food");
    } catch (error) {
      console.error(error);
      setHabits(prev => prev.filter(habit => habit.id !== tempId));
      alert("Error saving habit");
    } finally {
      setSaving(false);
    }
  }

  return(
    <div className="habit-form">
      <h2>Add New Habit</h2>
      <div className="form-group">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Habit name (e.g., Coffee, Gym, Subscription)"
          disabled={saving}
        />
        <input
          value={cost}
          onChange={e => setCost(e.target.value)}
          type="number"
          placeholder={`Cost per occurrence (${currency})`}
          disabled={saving}
        />
        <input
          value={frequency}
          onChange={e => setFrequency(e.target.value)}
          type="number"
          placeholder="Frequency"
          disabled={saving}
        />
        <select
          value={frequencyType}
          onChange={(e) => setFrequencyType(e.target.value)}
          disabled={saving}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={saving}
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
      <button className="add-btn" onClick={handleAdd} disabled={saving}>
        {saving ? "Saving..." : "Add Habit"}
      </button>
    </div>
  );
}

export default Habitform
