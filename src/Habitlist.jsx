import { db } from "./firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { useState } from "react";

function Habitlist({habits, salary, setSalary, setHabits}){
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", cost: "", frequency: "", category: "" });
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    const categories = ["All", "Food", "Transport", "Subscriptions", "Entertainment", "Health", "Shopping", "Other"];
    const filteredHabits = selectedCategory === "All" ? habits : habits.filter(h => h.category === selectedCategory);
    
    const totalMonthly = filteredHabits.reduce((sum, h) => sum + h.cost * h.frequency * 4, 0);
    const totalYearly = filteredHabits.reduce((sum, h) => sum + h.cost * h.frequency * 52, 0);
    
    const topHabit = filteredHabits.reduce((max, h) =>
      h.cost * h.frequency > (max.cost || 0) * (max.frequency || 0) ? h : max,
      filteredHabits[0] || {}
    );
    
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
      setEditForm({ name: habit.name, cost: habit.cost, frequency: habit.frequency, category: habit.category || "Food" });
    }

    function cancelEdit() {
      setEditingId(null);
      setEditForm({ name: "", cost: "", frequency: "", category: "" });
    }
    return(
        <div className="habit-list">
            <h2>Your Habits</h2>
            
            <div className="salary-section">
              <input 
                placeholder="Enter your monthly salary (₹)" 
                value={salary} 
                onChange={(e) => setSalary(e.target.value)} 
              />
            </div>
            
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
              <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ background: '#f5f5f5', padding: '12px 24px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Total Monthly</p>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#000' }}>₹{totalMonthly.toFixed(2)}</h3>
                </div>
                <div style={{ background: '#f5f5f5', padding: '12px 24px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Total Yearly</p>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#000' }}>₹{totalYearly.toFixed(2)}</h3>
                </div>
                {topHabit.name && (
                  <div style={{ background: '#000', color: '#fff', padding: '12px 24px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#ccc' }}>Biggest Expense 📍</p>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{topHabit.name}</h3>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#bbb' }}>₹{(topHabit.cost * topHabit.frequency * 52).toFixed(2)}/year</p>
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
                    const weekly = habit.cost * habit.frequency;
                    const monthly = habit.cost * habit.frequency * 4;
                    const yearly = habit.cost * habit.frequency * 52;
                    const dailyIncome = salary ? salary / 30 : 0;
                    const days = dailyIncome ? (yearly / dailyIncome) : 0;
                    
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
                              placeholder="Frequency per week"
                              onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                              style={{ marginBottom: '12px' }}
                            />
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit' }}
                            >
                              <option value="Food">🍔 Food</option>
                              <option value="Transport">🚗 Transport</option>
                              <option value="Subscriptions">📱 Subscriptions</option>
                              <option value="Entertainment">🎬 Entertainment</option>
                              <option value="Health">💪 Health & Fitness</option>
                              <option value="Shopping">🛍️ Shopping</option>
                              <option value="Other">📌 Other</option>
                            </select>
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              onClick={() => handleEdit(habit.id, {
                                name: editForm.name,
                                cost: Number(editForm.cost),
                                frequency: Number(editForm.frequency),
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
                          <p><strong>₹{habit.cost.toFixed(2)}</strong> × <strong>{habit.frequency}</strong> times/week</p>
                        </div>
                        <p><strong>Weekly cost:</strong> ₹{weekly.toFixed(2)}</p>
                        <p><strong>Monthly cost:</strong> ₹{monthly.toFixed(2)}</p>
                        <p><strong>Yearly cost:</strong> ₹{yearly.toFixed(2)}</p>
                        {salary && <div className="days-work">~ {days.toFixed(1)} days of work</div>}
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
                {salary && <div style={{textAlign: 'center', marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '12px', color: '#000000', fontWeight: '600', fontSize: '1.1rem'}}>Total yearly: ₹{totalYearly.toFixed(2)} ({(totalYearly / salary * 12).toFixed(1)} months of salary)</div>}
              </div>
            )}
        </div>
    );

}
export default Habitlist