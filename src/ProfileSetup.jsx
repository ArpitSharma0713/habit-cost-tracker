import { useState } from "react";
import { saveGoogleUserProfile } from "./auth";
import "./ProfileSetup.css";

function ProfileSetup({ user, onComplete }) {
  const [currency, setCurrency] = useState("₹");
  const [userType, setUserType] = useState("working");
  const [income, setIncome] = useState("");
  const [incomeFrequency, setIncomeFrequency] = useState("monthly");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!income || income <= 0) {
      setError("Please enter a valid income amount");
      return;
    }

    if (income > 10000000) {
      setError("Income seems too high. Please check the value");
      return;
    }

    // Budget is optional - only validate if provided
    if (budget && budget <= 0) {
      setError("Budget must be greater than 0 if provided");
      return;
    }

    if (budget && budget > 10000000) {
      setError("Budget seems too high. Please check the value");
      return;
    }

    setLoading(true);
    try {
      await saveGoogleUserProfile(user, {
        currency,
        userType,
        income: Number(income),
        incomeFrequency,
        budget: budget ? Number(budget) : null
      });

      setSuccess("Profile saved successfully!");
      
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !loading) {
      handleSave();
    }
  }

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h2>Complete Your Profile</h2>
        <p className="profile-setup-subtitle">
          Welcome to Habit Tracker, Let's set up your profile.
        </p>

        {error && <div className="profile-setup-error">{error}</div>}
        {success && <div className="profile-setup-success">{success}</div>}

        <div className="profile-setup-form-group">
          <label className="profile-setup-label">Currency</label>
          <select
            className="profile-setup-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={loading}
          >
            <option value="₹">INR (₹)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
          </select>
        </div>

        <div className="profile-setup-form-group">
          <label className="profile-setup-label">User Type</label>
          <select
            className="profile-setup-select"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            disabled={loading}
          >
            <option value="student">Student</option>
            <option value="working">Working Professional</option>
          </select>
        </div>

        <div className="profile-setup-form-group">
          <label className="profile-setup-label">
            {userType === "student" ? "Monthly Pocket Money" : "Monthly Salary"}
          </label>
          <input
            className="profile-setup-input"
            type="number"
            placeholder="Enter amount"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            min="0"
          />
        </div>

        <div className="profile-setup-form-group">
          <label className="profile-setup-label">Income Frequency</label>
          <select
            className="profile-setup-select"
            value={incomeFrequency}
            onChange={(e) => setIncomeFrequency(e.target.value)}
            disabled={loading}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="profile-setup-form-group">
          <label className="profile-setup-label">Monthly Spending Budget <span style={{ color: '#999', fontSize: '12px' }}>(Optional)</span></label>
          <input
            className="profile-setup-input"
            type="number"
            placeholder="Enter your monthly budget (optional)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            min="0"
          />
        </div>

        <div className="profile-setup-hint">
          <strong>Note:</strong> You can always update these settings later from your profile. Budget is optional and helps us track spending limits.
        </div>

        <div className="profile-setup-button-group">
          <button
            className="profile-setup-button primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
