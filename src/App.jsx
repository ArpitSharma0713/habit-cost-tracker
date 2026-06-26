import './App.css'
import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { logout } from './auth';
import Auth from './Auth.jsx';
import ProfileSetup from './ProfileSetup.jsx';
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Habitform from './Habitform.jsx';
import Habitlist from './Habitlist.jsx';
import HabitChart from './HabitChart.jsx';
import SnowfallEffect from './SnowfallEffect.jsx';
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { convertToMonthly } from './utils';

const DEFAULT_PROFILE = {
  currency: "\u20b9",
  userType: "working",
  income: 0,
  incomeFrequency: "monthly",
  budget: null
};

function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [habitHistory, setHabitHistory] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    let unsubscribeHabits = null;
    let unsubscribeHistory = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      unsubscribeHabits?.();
      unsubscribeHistory?.();
      unsubscribeHabits = null;
      unsubscribeHistory = null;

      try {
        setUser(currentUser);

        if (!currentUser) {
          setHabits([]);
          setHabitHistory([]);
          setProfile(DEFAULT_PROFILE);
          setNeedsProfileSetup(false);
          setShowProfileSetup(false);
          setLoading(false);
          return;
        }

        const profileRef = doc(db, "users", currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile({ ...DEFAULT_PROFILE, ...profileSnap.data() });
          setNeedsProfileSetup(false);
        } else {
          setProfile(DEFAULT_PROFILE);
          setNeedsProfileSetup(true);
        }

        const habitsQuery = query(
          collection(db, "habits"),
          where("userId", "==", currentUser.uid)
        );

        unsubscribeHabits = onSnapshot(
          habitsQuery,
          (snapshot) => {
            const habitsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }));

            setHabits(habitsData);
            setLoading(false);
          },
          (err) => {
            console.error("Error loading habits:", err);
            setError("Failed to load habits. Check your connection and try again.");
            setLoading(false);
          }
        );

        const historyQuery = query(
          collection(db, "habitSnapshots"),
          where("userId", "==", currentUser.uid)
        );

        unsubscribeHistory = onSnapshot(
          historyQuery,
          (snapshot) => {
            const historyData = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .sort((a, b) => a.date.localeCompare(b.date));

            setHabitHistory(historyData);
          },
          (err) => {
            console.warn("Unable to load habit history:", err);
          }
        );
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeHabits?.();
      unsubscribeHistory?.();
    };
  }, []);

  useEffect(() => {
    function updateOnlineStatus() {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const themeClass = darkMode ? "theme-dark" : "theme-light";
  const currency = profile?.currency || "\u20b9";

  function showToast(message, type = "info") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }

  if (loading) {
    return (
      <div className="app-loading-shell">
        <div className="app-loading-card">
          <div className="app-loading-title" />
          <div className="app-loading-line" />
          <div className="app-skeleton-grid">
            <div className="app-skeleton-card" />
            <div className="app-skeleton-card" />
            <div className="app-skeleton-card" />
          </div>
          <div className="app-loading-copy">
            Loading your habits. First load can take a moment on slower networks.
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (showProfileSetup) {
    return (
      <div className={`app-shell ${themeClass}`}>
        <ProfileSetup
          user={user}
          onComplete={(savedProfile) => {
            if (savedProfile) {
              setProfile({ ...DEFAULT_PROFILE, ...savedProfile });
            }
            setNeedsProfileSetup(false);
            setShowProfileSetup(false);
          }}
        />
      </div>
    );
  }

  return(
    <SnowfallEffect config={{ snowflakeCount: 100, color: darkMode ? '#FFFFFF' : '#D7DDE5' }}>
      <div className={`app-shell ${themeClass}`}>
        <Header/>
        <main className="app-main">
          {error && (
            <div className="app-error-banner">
              {error}
            </div>
          )}

          {toast && (
            <div className={`app-toast ${toast.type}`} role="status">
              {toast.message}
            </div>
          )}

          {!isOnline && (
            <div className="app-offline-banner">
              You are offline. Existing data may stay visible, but changes need a connection to save.
            </div>
          )}

          {needsProfileSetup && (
            <div className="app-profile-prompt">
              <div>
                <strong>Add income later, track habits now.</strong>
                <p>Income and budget are optional. Add them when you want the app to calculate the cost in days of your time.</p>
              </div>
              <button className="app-button primary" onClick={() => setShowProfileSetup(true)}>Add Profile Details</button>
            </div>
          )}

          <div className="app-user-bar">
            <div>
              <p className="app-welcome">Welcome {user.email}</p>
              {profile && profile.income > 0 && (
                <div className="app-profile-meta">
                  <p>
                    {profile.userType === "student" ? "Pocket Money" : "Salary"}: {currency} {convertToMonthly(profile.income, profile.incomeFrequency).toFixed(2)}/month
                  </p>
                </div>
              )}
            </div>
            <div className="app-actions">
              <button
                className="app-button secondary"
                onClick={() => setDarkMode(!darkMode)}
                aria-pressed={darkMode}
              >
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button className="app-button primary" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <Habitform setHabits={setHabits} currency={currency} onNotify={showToast} />
          <HabitChart habits={habits} history={habitHistory} currency={currency} />
          <Habitlist habits={habits} profile={profile} setHabits={setHabits} onNotify={showToast}/>
        </main>
        <Footer/>
      </div>
    </SnowfallEffect>
  );
}

export default App
