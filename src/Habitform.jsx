import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "./firebase";
import "./Habitform.css";

function Habitform({setHabits}){
  const[name, setName]=useState("");
  const[cost ,setCost]= useState("");
  const[frequency, setFrequency]=useState("");
  const[frequencyType, setFrequencyType]=useState("daily");
  const[category, setCategory]=useState("Food");
  
  async function handleAdd(){
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

    try {
      const docRef = await addDoc(collection(db, "habits"), newHabit);
      setHabits(prev => [...prev, { id: docRef.id, ...newHabit }]);
      setName("");
      setCost("");
      setFrequency("");
      setFrequencyType("daily");
      setCategory("Food");
    } catch (error) {
      console.error(error);
      alert("Error saving habit");
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
          />
          <input 
            value={cost} 
            onChange={e => setCost(e.target.value)} 
            type="number" 
            placeholder="Cost per occurrence (₹)" 
          />
          <input 
            value={frequency} 
            onChange={e => setFrequency(e.target.value)} 
            type="number" 
            placeholder="Frequency" 
          />
          <select 
            value={frequencyType} 
            onChange={(e) => setFrequencyType(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit' }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
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
        <button className="add-btn" onClick={handleAdd}>Add Habit</button>
      </div>
      );

}
export default Habitform