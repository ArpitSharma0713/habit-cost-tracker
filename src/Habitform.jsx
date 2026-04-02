import { useState } from "react";


function Habitform({setHabits}){
  const[name, setName]=useState("");
  const[cost ,setCost]= useState("");
  const[frequency, setFrequency]=useState("");
  function handleadd(){
    const newhabit={
      name,
      cost: Number(cost),
      frequency: Number(frequency),
    };
    setHabits(prev=>[...prev,newhabit]);
    setName("");
    setCost("");
    setFrequency("");
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
            placeholder="Cost per occurrence ($)" 
          />
          <input 
            value={frequency} 
            onChange={e => setFrequency(e.target.value)} 
            type="number" 
            placeholder="Frequency per week" 
          />
        </div>
        <button className="add-btn" onClick={handleadd}>Add Habit</button>
      </div>
      );

}
export default Habitform