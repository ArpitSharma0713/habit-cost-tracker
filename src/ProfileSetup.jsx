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

  function buildProfileData({ skipped = false } = {}) {
    return {
      currency,
      userType,
      income: skipped || !income ? 0 : Number(income),
      incomeFrequency,
      budget: skipped || !budget ? null : Number(budget)
    };
  }

  function validateProfile() {
    if (income && Number(income) <= 0) {
      setError("Income must be greater than 0 if provided");
      return false;
    }

    if (income && Number(income) > 10000000) {
      setError("Income seems too high. Please check the value");
      return false;
    }

    if (budget && Number(budget) <= 0) {
      setError("Budget must be greater than 0 if provided");
      return false;
    }

    if (budget && Number(budget) > 10000000) {
      setError("Budget seems too high. Please check the value");
      return false;
    }

    return true;
  }

  async function saveProfile(profileData, message) {
    setLoading(true);
    try {
      await saveGoogleUserProfile(user, profileData);
      setSuccess(message);

      setTimeout(() => {
        onComplete(profileData);
      }, 700);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!validateProfile()) {
      return;
    }

    await saveProfile(buildProfileData(), "Profile saved successfully!");
  }

  async function handleSkip() {
    setError("");
    setSuccess("");
    await saveProfile(buildProfileData({ skipped: true }), "You can add income and budget later.");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !loading) {
      handleSave();
    }
  }

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h2>Set Up Your Profile</h2>
        <p className="profile-setup-subtitle">
          Add income now for time-cost insights, or skip and start tracking habits first.
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
            {userType === "student" ? "Monthly Pocket Money" : "Monthly Salary"} <span>(Optional)</span>
          </label>
          <input
            className="profile-setup-input"
            type="number"
            placeholder="Enter amount when ready"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            onKeyDown={handleKeyDown}
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
          <label className="profile-setup-label">Monthly Spending Budget <span>(Optional)</span></label>
          <input
            className="profile-setup-input"
            type="number"
            placeholder="Enter your monthly budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            min="0"
          />
        </div>

        <div className="profile-setup-hint">
          Income powers the days-of-income insight. Budget helps show warnings, but neither is required to start adding habits.
        </div>

        <div className="profile-setup-button-group">
          <button
            className="profile-setup-button primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
          <button
            className="profile-setup-button secondary"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
