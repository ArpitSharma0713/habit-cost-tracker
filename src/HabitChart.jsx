import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getMonthlyCost, getYearlyCost } from "./utils";

function HabitChart({ habits, selectedCategory, currency = '₹' }) {
  if (!habits || habits.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
        <p>Add habits to see charts</p>
      </div>
    );
  }

  const chartData = habits.map(h => ({
    name: h.name,
    yearly: getYearlyCost(h),
    monthly: getMonthlyCost(h)
  }));

  const categoryData = {};
  habits.forEach(h => {
    const category = h.category || "Other";
    categoryData[category] = (categoryData[category] || 0) + getYearlyCost(h);
  });

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#111111', '#222222'];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Bar Chart */}
        <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 1rem 0', textAlign: 'center', color: '#000' }}>Yearly Cost per Habit</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} style={{ fontSize: '12px' }} />
              <YAxis />
              <Tooltip formatter={(value) => `${currency}${value.toFixed(2)}`} />
              <Bar dataKey="yearly" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 1rem 0', textAlign: 'center', color: '#000' }}>Spending by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${currency}${entry.value}`}
                  outerRadius={80}
                  fill="#000"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${currency}${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitChart;
