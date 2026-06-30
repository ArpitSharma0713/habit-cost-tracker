import { useEffect, useState } from "react";
import "./Auth.css";

function Auth({ initialMode = "login", onBackToLanding, onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isSignupMode, setIsSignupMode] = useState(initialMode === "signup");
  const [currency, setCurrency] = useState("\u20b9");
  const [userType, setUserType] = useState("student");
  const [income, setIncome] = useState("");
  const [incomeFrequency, setIncomeFrequency] = useState("monthly");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSignupMode(initialMode === "signup");
    setError("");
    setSuccess("");
  }, [initialMode]);

  async function loadAuthApi() {
    try {
      return await import("./auth");
    } catch (err) {
      console.error("Unable to load Firebase auth:", err);
      throw new Error("Firebase is not configured. Add your .env values and restart the dev server.");
    }
  }

  function getFriendlyError(err, authApi) {
    if (err.code && authApi?.getErrorMessage) {
      return authApi.getErrorMessage(err.code);
    }

    return err.message || "An error occurred. Please try again";
  }

  async function handleSignup() {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in email and password");
      return;
    }

    if (income && Number(income) <= 0) {
      setError("Income must be greater than 0 if provided");
      return;
    }

    if (budget && Number(budget) <= 0) {
      setError("Budget must be greater than 0 if provided");
      return;
    }

    setLoading(true);
    let authApi = null;
    try {
      authApi = await loadAuthApi();
      const result = await authApi.signup(email, password, {
        currency,
        userType,
        income: income ? Number(income) : 0,
        incomeFrequency,
        budget: budget ? Number(budget) : null
      });
      setUser({ email });
      setEmail("");
      setPassword("");
      setIncome("");
      setBudget("");
      setCurrency("\u20b9");
      setUserType("student");
      setIncomeFrequency("monthly");
      setIsSignupMode(false);
      setSuccess("Signup successful! Redirecting...");
      onAuthSuccess?.(result.user);
    } catch (err) {
      setError(getFriendlyError(err, authApi));
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
    let authApi = null;
    try {
      authApi = await loadAuthApi();
      const result = await authApi.login(email, password);
      setUser({ email });
      setEmail("");
      setPassword("");
      setSuccess("Login successful!");
      onAuthSuccess?.(result.user);
    } catch (err) {
      setError(getFriendlyError(err, authApi));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setSuccess("");
    setLoading(true);

    let authApi = null;
    try {
      authApi = await loadAuthApi();
      const result = await authApi.loginWithGoogle();
      const googleUser = result.user;
      setUser({ email: googleUser.email });
      setSuccess("Google login successful!");
      onAuthSuccess?.(googleUser);
    } catch (err) {
      setError(getFriendlyError(err, authApi));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const authApi = await loadAuthApi();
      await authApi.logout();
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  }

  if (user) {
    return (
      <div className="auth-container">
        {onBackToLanding && (
          <button type="button" className="auth-back-button" onClick={onBackToLanding}>
            Back to public page
          </button>
        )}
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-welcome-message">Logged in as {user.email}</p>
          <button
            className="auth-button auth-button-primary auth-full-width"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {onBackToLanding && (
        <button type="button" className="auth-back-button" onClick={onBackToLanding}>
          Back to public page
        </button>
      )}
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
                <option value="\u20b9">Currency - INR ({"\u20b9"})</option>
                <option value="$">Currency - USD ($)</option>
                <option value="\u20ac">Currency - EUR ({"\u20ac"})</option>
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
                placeholder={userType === "student" ? "Pocket Money (optional)" : "Monthly Salary (optional)"}
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

            <div className="auth-input-group">
              <input
                className="auth-input"
                type="number"
                placeholder="Monthly Spending Budget (optional)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={loading}
                min="0"
              />
              <small className="auth-field-hint">Income and budget are optional. You can add them later for deeper insights.</small>
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
