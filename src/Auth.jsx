import { useState } from "react";
import { signup, login, logout, loginWithGoogle, getErrorMessage, createGoogleUserProfile } from "./auth";
import "./Auth.css";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [currency, setCurrency] = useState("₹");
  const [userType, setUserType] = useState("student");
  const [income, setIncome] = useState("");
  const [incomeFrequency, setIncomeFrequency] = useState("monthly");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!income || income <= 0) {
      setError("Please enter a valid income");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, {
        currency,
        userType,
        income: Number(income),
        incomeFrequency
      });
      setUser({ email });
      setEmail("");
      setPassword("");
      setIncome("");
      setCurrency("₹");
      setUserType("student");
      setIncomeFrequency("monthly");
      setIsSignupMode(false);
      setSuccess("Signup successful! Redirecting...");
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setUser({ email });
      setEmail("");
      setPassword("");
      setSuccess("Login successful!");
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      const googleUser = result.user;

      // Create user profile in Firestore
      await createGoogleUserProfile(googleUser);

      setUser({ email: googleUser.email });
      setSuccess("Google login successful!");
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setUser(null);
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  }

  if (user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-welcome-message">Logged in as {user.email}</p>
          <button 
            className="auth-button auth-button-primary" 
            onClick={handleLogout}
            style={{ width: "100%", marginTop: "32px" }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {isSignupMode ? "Create Account" : "Login"}
        </h1>
        
        {error && <div className="auth-error-message">{error}</div>}
        {success && <div className="auth-success-message">{success}</div>}
        
        <div className="auth-input-group">
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="auth-input-group">
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {isSignupMode && (
          <>
            <div className="auth-input-group">
              <select 
                className="auth-input"
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                disabled={loading}
              >
                <option value="₹">Currency - INR (₹)</option>
                <option value="$">Currency - USD ($)</option>
                <option value="€">Currency - EUR (€)</option>
              </select>
            </div>

            <div className="auth-input-group">
              <select 
                className="auth-input"
                value={userType} 
                onChange={(e) => setUserType(e.target.value)}
                disabled={loading}
              >
                <option value="student">Student</option>
                <option value="working">Working Professional</option>
              </select>
            </div>

            <div className="auth-input-group">
              <input
                className="auth-input"
                type="number"
                placeholder={userType === "student" ? "Pocket Money (monthly)" : "Monthly Salary"}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="auth-input-group">
              <select 
                className="auth-input"
                value={incomeFrequency} 
                onChange={(e) => setIncomeFrequency(e.target.value)}
                disabled={loading}
              >
                <option value="monthly">Monthly Income</option>
                <option value="yearly">Yearly Income</option>
              </select>
            </div>
          </>
        )}

        <div className="auth-button-group">
          {isSignupMode ? (
            <>
              <button 
                className="auth-button auth-button-secondary" 
                onClick={() => {
                  setIsSignupMode(false);
                  setError("");
                  setSuccess("");
                }}
                disabled={loading}
              >
                Back
              </button>
              <button 
                className="auth-button auth-button-primary" 
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </>
          ) : (
            <>
              <button 
                className="auth-button auth-button-secondary" 
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button 
                className="auth-button auth-button-primary" 
                onClick={() => {
                  setIsSignupMode(true);
                  setError("");
                  setSuccess("");
                }}
                disabled={loading}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <div className="auth-divider">OR</div>

        <button 
          className="auth-google-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <span>Continue with Google</span>
        </button>

        {!isSignupMode && (
          <div className="auth-mode-toggle">
            New user?
            <button 
              onClick={() => {
                setIsSignupMode(true);
                setError("");
                setSuccess("");
              }}
              disabled={loading}
            >
              Sign up here
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;