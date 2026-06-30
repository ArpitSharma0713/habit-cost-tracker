import heroImage from "./assets/hero.png";
import "./LandingPage.css";

const featureCards = [
  {
    title: "Turn small habits into monthly truth",
    copy: "Normalize daily, weekly, and monthly spending into one clear cost picture."
  },
  {
    title: "See the cost in days of income",
    copy: "Connect income when ready and translate recurring expenses into time."
  },
  {
    title: "Track change without spreadsheets",
    copy: "Daily snapshots, trends, streaks, category charts, and exports stay ready."
  }
];

const previewHabits = [
  { name: "Coffee", category: "Food", amount: "₹3,600/mo" },
  { name: "Ride shares", category: "Transport", amount: "₹4,800/mo" },
  { name: "Streaming", category: "Subscriptions", amount: "₹899/mo" }
];

function LandingPage({ onLogin, onSignup }) {
  return (
    <div className="landing-shell">
      <nav className="landing-nav" aria-label="Public navigation">
        <a className="landing-brand" href="#top" aria-label="Habit home">
          Habit
        </a>
        <div className="landing-nav-actions">
          <a href="#features">Features</a>
          <a href="#flow">Flow</a>
          <button type="button" className="landing-nav-button secondary" onClick={onLogin}>
            Login
          </button>
          <button type="button" className="landing-nav-button primary" onClick={onSignup}>
            Sign Up
          </button>
        </div>
      </nav>

      <main id="top">
        <section className="landing-hero" style={{ "--landing-hero-image": `url(${heroImage})` }}>
          <div className="landing-hero-overlay" />
          <div className="landing-hero-content">
            <p className="landing-kicker">Personal habit finance</p>
            <h1>Habit</h1>
            <p className="landing-hero-copy">
              Track the real cost of your habits in money, trends, budgets, and days of your life.
            </p>
            <div className="landing-hero-actions">
              <button type="button" className="landing-button primary" onClick={onSignup}>
                Start Tracking
              </button>
              <button type="button" className="landing-button secondary" onClick={onLogin}>
                Login
              </button>
            </div>
          </div>
          <div className="landing-hero-panel" aria-label="Dashboard preview">
            <div className="landing-preview-header">
              <span>Monthly impact</span>
              <strong>₹9,299</strong>
            </div>
            <div className="landing-preview-bars" aria-hidden="true">
              <span className="bar-one" />
              <span className="bar-two" />
              <span className="bar-three" />
              <span className="bar-four" />
            </div>
            <div className="landing-preview-row">
              <span>Cost in days</span>
              <strong>4.6 days/month</strong>
            </div>
          </div>
        </section>

        <section className="landing-section landing-intro" aria-label="Product summary">
          <div className="landing-intro-copy">
            <p className="landing-section-label">What it does</p>
            <h2>Built for the recurring expenses that quietly shape your month.</h2>
          </div>
          <div className="landing-metrics" aria-label="Key app capabilities">
            <div>
              <strong>3</strong>
              <span>frequency types</span>
            </div>
            <div>
              <strong>CSV</strong>
              <span>sheet export</span>
            </div>
            <div>
              <strong>Daily</strong>
              <span>snapshots</span>
            </div>
          </div>
        </section>

        <section className="landing-section landing-features" id="features">
          {featureCards.map((feature) => (
            <article className="landing-feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </section>

        <section className="landing-section landing-dashboard-band" aria-label="Dashboard detail preview">
          <div className="landing-dashboard-copy">
            <p className="landing-section-label">Protected dashboard</p>
            <h2>Your private workspace after login.</h2>
            <p>
              Add habits, edit categories, review yearly impact, compare category spending, watch monthly trends, and export your data.
            </p>
          </div>
          <div className="landing-dashboard-preview">
            <div className="landing-tool-header">
              <span>Your Habits</span>
              <strong>Budget 74%</strong>
            </div>
            <div className="landing-tool-grid">
              <div className="landing-tool-stat">
                <span>Total monthly</span>
                <strong>₹9,299</strong>
              </div>
              <div className="landing-tool-stat">
                <span>Total yearly</span>
                <strong>₹111,588</strong>
              </div>
              <div className="landing-tool-stat">
                <span>No-increase streak</span>
                <strong>3</strong>
              </div>
            </div>
            <div className="landing-tool-list">
              {previewHabits.map((habit) => (
                <div className="landing-tool-item" key={habit.name}>
                  <div>
                    <strong>{habit.name}</strong>
                    <span>{habit.category}</span>
                  </div>
                  <p>{habit.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-flow" id="flow">
          <div>
            <p className="landing-section-label">Site structure</p>
            <h2>Public landing page, auth pages, protected dashboard.</h2>
          </div>
          <div className="landing-flow-steps">
            <article>
              <span>01</span>
              <h3>Explore</h3>
              <p>Understand the product before creating an account.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Authenticate</h3>
              <p>Use email/password or Google sign-in to enter securely.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Track</h3>
              <p>Manage habits, budgets, charts, snapshots, and exports.</p>
            </article>
          </div>
        </section>

        <section className="landing-section landing-final-cta">
          <h2>Make recurring spending visible.</h2>
          <p>Start with one habit today and let the dashboard show what it costs over time.</p>
          <button type="button" className="landing-button primary" onClick={onSignup}>
            Create Account
          </button>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
