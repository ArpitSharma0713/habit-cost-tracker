import { useState } from "react";
import { signup, login, logout } from "./auth";
import "./Auth.css";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  async function handleSignup() {
    try {
      await signup(email, password);
      setUser({ email });
      setEmail("");
      setPassword("");
      alert("Signup successful");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleLogin() {
    try {
      await login(email, password);
      setUser({ email });
      setEmail("");
      setPassword("");
      alert("Login successful");
    } catch (err) {
      alert(err.message);
    }
  }

  function handleLogout() {
    logout();
    setUser(null);
    setEmail("");
    setPassword("");
  }

  if (user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome</h1>
          <p className="auth-welcome-message">Welcome {user.email}</p>
          <button className="auth-button auth-button-secondary" onClick={handleLogout} style={{ width: "100%", marginTop: "32px" }}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Hello.</h1>
        
        <div className="auth-input-group">
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="auth-input-group">
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="auth-button-group">
          <button className="auth-button auth-button-secondary" onClick={handleLogin}>
            Login
          </button>
          <button className="auth-button auth-button-primary" onClick={handleSignup}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;