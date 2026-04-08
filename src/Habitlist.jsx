import { db } from "./firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { useState } from "react";
import { getMonthlyCost, getYearlyCost, convertToMonthly } from "./utils";
import "./Habitlist.css";

function Habitlist({habits, profile, setHabits}){
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", cost: "", frequency: "", frequencyType: "daily", category: "" });
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    const categories = ["All", "Food", "Transport", "Subscriptions", "Entertainment", "Health", "Shopping", "Other"];
    const filteredHabits = selectedCategory === "All" ? habits : habits.filter(h => h.category === selectedCategory);
    
    // Calculate monthly and yearly using the new normalized function
    const totalMonthly = filteredHabits.reduce((sum, h) => sum + getMonthlyCost(h), 0);
    const totalYearly = filteredHabits.reduce((sum, h) => sum + getYearlyCost(h), 0);
    
    // Get user's monthly income
    const monthlyIncome = profile ? convertToMonthly(profile.income, profile.incomeFrequency) : 0;
    const dailyIncome = monthlyIncome / 30;
    
    // Calculate work-time impact (days of life spent on habits)
    const daysLostPerMonth = dailyIncome ? (totalMonthly / dailyIncome) : 0;
    
    // Find top habit by monthly cost
    const topHabit = filteredHabits.reduce((max, h) => {
      const maxCost = getMonthlyCost(max);
      const hCost = getMonthlyCost(h);
      return hCost > maxCost ? h : max;
    }, filteredHabits[0] || {});
    
    async function handleDelete(id) {
      try {
        await deleteDoc(doc(db, "habits", id));
        setHabits(prev => prev.filter(h => h.id !== id));
      } catch (error) {
        console.error(error);
        alert("Error deleting habit");
      }
    }

    async function handleEdit(id, updatedHabit) {
      try {
        const habitRef = doc(db, "habits", id);
        await updateDoc(habitRef, updatedHabit);
        setHabits(prev =>
          prev.map(h =>
            h.id === id ? { ...h, ...updatedHabit } : h
          )
        );
        setEditingId(null);
      } catch (error) {
        console.error(error);
        alert("Error updating habit");
      }
    }

    function startEdit(habit) {
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
      setEditingId(null);
      setEditForm({ name: "", cost: "", frequency: "", frequencyType: "daily", category: "" });
    }
    
    return(
        <div className="habit-list">
            <h2>Your Habits</h2>
            
            {habits.length > 0 && (
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>Filter by Category</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '8px 16px',
                        background: selectedCategory === cat ? '#000' : '#f5f5f5',
                        color: selectedCategory === cat ? '#fff' : '#000',
                        border: selectedCategory === cat ? 'none' : '1px solid #ddd',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {habits.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                  <div style={{ background: '#f5f5f5', padding: '16px 24px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Total Monthly</p>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#000' }}>{profile?.currency}{totalMonthly.toFixed(2)}</h3>
                  </div>
                  <div style={{ background: '#f5f5f5', padding: '16px 24px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Total Yearly</p>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#000' }}>{profile?.currency}{totalYearly.toFixed(2)}</h3>
                  </div>
                  
                  {monthlyIncome > 0 && (
                    <div style={{ background: '#f5f5f5', padding: '16px 24px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Percentage of Income</p>
                      <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#000' }}>
                        {((totalMonthly / monthlyIncome) * 100).toFixed(1)}%
                      </h3>
                    </div>
                  )}
                  
                  {daysLostPerMonth > 0 && (
                    <div style={{ background: '#000', color: '#fff', padding: '16px 24px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#ccc' }}>Days Lost Per Month</p>
                      <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{daysLostPerMonth.toFixed(1)} days</h3>
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#bbb' }}>of your time every month</p>
                    </div>
                  )}
                </div>
                
                {profile && monthlyIncome > 0 && (
                  <div style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: '16px', borderRadius: '8px', marginBottom: '2rem' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#856404' }}>
                      You are spending <strong>{daysLostPerMonth.toFixed(1)} days</strong> of your {profile.userType === "student" ? "pocket money" : "salary"} every month on these habits!
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {habits.length=== 0?(
              <div className="no-habits">No habits added yet. Start by adding a habit above!</div>
            ):filteredHabits.length === 0?(
              <div className="no-habits">No habits in this category.</div>
            ):(
              <div>
                <div className="habits-container">
                  {filteredHabits.map((habit,index)=>{
                    const monthly = getMonthlyCost(habit);
                    const yearly = getYearlyCost(habit);
                    const daysLost = dailyIncome ? (monthly / dailyIncome) : 0;
                    
                    if (editingId === habit.id) {
                      return (
                        <div className="habit-card" key={index}>
                          <h3>Edit Habit</h3>
                          <div className="auth-input-group" style={{ marginBottom: '16px' }}>
                            <input
                              className="auth-input"
                              type="text"
                              value={editForm.name}
                              placeholder="Habit name"
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              style={{ marginBottom: '12px' }}
                            />
                            <input
                              className="auth-input"
                              type="number"
                              value={editForm.cost}
                              placeholder="Cost per occurrence"
                              onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
                              style={{ marginBottom: '12px' }}
                            />
                            <input
                              className="auth-input"
                              type="number"
                              value={editForm.frequency}
                              placeholder="Frequency"
                              onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                              style={{ marginBottom: '12px' }}
                            />
                            <select
                              value={editForm.frequencyType}
                              onChange={(e) => setEditForm({ ...editForm, frequencyType: e.target.value })}
                              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit', marginBottom: '12px' }}
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit' }}
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
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              onClick={() => handleEdit(habit.id, {
                                name: editForm.name,
                                cost: Number(editForm.cost),
                                frequency: Number(editForm.frequency),
                                frequencyType: editForm.frequencyType,
                                category: editForm.category
                              })}
                              style={{ flex: 1, padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              style={{ flex: 1, padding: '8px 16px', background: '#fff', color: '#000', border: '2px solid #000', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return(
                      <div className="habit-card" key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <h3 style={{ margin: 0 }}>{habit.name}</h3>
                          <span style={{ background: '#f5f5f5', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
                            {habit.category || "Other"}
                          </span>
                        </div>
                        <div className="cost-info">
                          <p><strong>{profile?.currency}{habit.cost.toFixed(2)}</strong> × <strong>{habit.frequency}</strong> {habit.frequencyType || "weekly"}</p>
                        </div>
                        <p><strong>Monthly cost:</strong> {profile?.currency}{monthly.toFixed(2)}</p>
                        <p><strong>Yearly cost:</strong> {profile?.currency}{yearly.toFixed(2)}</p>
                        {daysLost > 0 && <div className="days-work">{daysLost.toFixed(1)} days of {profile?.userType === "student" ? "pocket money" : "salary"}/month</div>}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                          <button
                            onClick={() => startEdit(habit)}
                            style={{ flex: 1, padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(habit.id)}
                            style={{ flex: 1, padding: '8px 16px', background: '#fff', color: '#000', border: '2px solid #000', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
    );

}
export default Habitlist