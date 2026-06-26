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

const CHART_COLORS = [
  "var(--app-accent)",
  "#4f7cac",
  "#d18f3f",
  "#6a9f58",
  "#b6617a",
  "#6f64b4",
  "#7a8794"
];

function HabitChart({ habits, history = [], currency = "\u20b9" }) {
  if (!habits || habits.length === 0) {
    return (
      <div className="chart-empty-state">
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

  const tooltipStyle = {
    background: "var(--app-surface-raised)",
    border: "1px solid var(--app-border)",
    borderRadius: 8,
    color: "var(--app-text)",
    boxShadow: "var(--app-shadow)"
  };

  const axisProps = {
    stroke: "var(--app-muted)",
    tick: { fill: "var(--app-muted)", fontSize: 12 }
  };

  return (
    <div className="chart-section">
      <div className="chart-grid">
        <div className="chart-card">
          <h4>Yearly Cost per Habit</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${currency}${value.toFixed(2)}`} />
              <Bar dataKey="yearly" fill="var(--app-accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {pieData.length > 0 && (
          <div className="chart-card">
            <h4>Spending by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${currency}${entry.value}`}
                  outerRadius={80}
                  fill="var(--app-accent)"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${currency}${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="chart-card">
          <h4>Monthly Trend</h4>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-chart-grid)" />
                <XAxis dataKey="date" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${currency}${Number(value).toFixed(2)}`} />
                <Line type="monotone" dataKey="monthly" stroke="var(--app-accent)" strokeWidth={3} dot={{ r: 4, fill: "var(--app-accent)" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty-trend">
              Your trend will appear after habit changes are saved on more than one day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HabitChart;
