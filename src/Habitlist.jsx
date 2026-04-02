function Habitlist({habits, salary, setSalary}){
    const total = habits.reduce((sum, habit) => {return sum + habit.cost * habit.frequency * 52;}, 0);
    return(
        <div className="habit-list">
            <h2>Your Habits</h2>
            
            <div className="salary-section">
              <input 
                placeholder="Enter your monthly salary ($)" 
                value={salary} 
                onChange={(e) => setSalary(e.target.value)} 
              />
            </div>
            
            {habits.length=== 0?(
              <div className="no-habits">No habits added yet. Start by adding a habit above!</div>
            ):(
              <div>
                <div className="habits-container">
                  {habits.map((habit,index)=>{
                    const yearly = habit.cost * habit.frequency * 52;
                    const dailyIncome = salary ? salary / 30 : 0;
                    const days = dailyIncome ? (yearly / dailyIncome) : 0;
                    return(
                      <div className="habit-card" key={index}>
                        <h3>{habit.name}</h3>
                        <div className="cost-info">
                          <p><strong>${habit.cost.toFixed(2)}</strong> × <strong>{habit.frequency}</strong> times/week</p>
                        </div>
                        <p><strong>Yearly cost:</strong> ${yearly.toFixed(2)}</p>
                        {salary && <p><strong>Total yearly spending:</strong> ${total.toFixed(2)}</p>}
                        {salary && <div className="days-work">~ {days.toFixed(1)} days of work</div>}
                      </div>
                    );
                  })}
                </div>
                {salary && <div style={{textAlign: 'center', marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '12px', color: '#000000', fontWeight: '600', fontSize: '1.1rem'}}>Total yearly: ${total.toFixed(2)} ({(total / salary * 12).toFixed(1)} months of salary)</div>}
              </div>
            )}
        </div>
    );

}
export default Habitlist