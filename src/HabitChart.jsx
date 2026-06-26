import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { getMonthlyCost, getYearlyCost } from "./utils";

function HabitChart({ habits, history = [], currency = "₹" }) {
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

  const trendData = history.map((snapshot) => ({
    date: snapshot.date?.slice(5) || "",
    monthly: Number(snapshot.totalMonthly || 0),
    habits: Number(snapshot.habitCount || 0)
  }));

  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#111111', '#222222'];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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

        {pieData.length > 0 && (
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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

        <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 1rem 0', textAlign: 'center', color: '#000' }}>Monthly Trend</h4>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${currency}${Number(value).toFixed(2)}`} />
                <Line type="monotone" dataKey="monthly" stroke="#000" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#777', fontWeight: 600, padding: '0 1rem' }}>
              Your trend will appear after habit changes are saved on more than one day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HabitChart;
