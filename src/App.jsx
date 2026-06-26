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
  currency: "₹",
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
    );
  }

  return(
    <SnowfallEffect config={{ snowflakeCount: 100, color: '#FFFFFF' }}>
      <div style={{ background: darkMode ? '#1a1a1a' : '#fff', color: darkMode ? '#fff' : '#000', minHeight: '100vh' }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          ${darkMode ? `
            body { background: #1a1a1a; color: #fff; }
            input, select { background: #2a2a2a; color: #fff; border: 1px solid #444; }
            input::placeholder { color: #999; }
            .habit-card { background: #2a2a2a; color: #fff; }
            .habit-form { background: #2a2a2a; }
            button { background: #fff; color: #000; }
            @media (max-width: 768px) {
              .habit-list { padding: 10px; }
              .habits-container { grid-template-columns: 1fr; }
            }
          ` : `
            @media (max-width: 768px) {
              .habit-list { padding: 10px; }
              .habits-container { grid-template-columns: 1fr; }
              main { padding: 0 10px; }
            }
          `}
        `}</style>

      <Header/>
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {error && (
          <div style={{ background: '#fee', border: '1px solid #fcc', color: '#c00', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>
             {error}
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
            <button onClick={() => setShowProfileSetup(true)}>Add Profile Details</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`, background: darkMode ? '#0a0a0a' : '#f9f9f9', borderRadius: '8px', marginBottom: '20px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>Welcome {user.email}</p>
            {profile && profile.income > 0 && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: darkMode ? '#ccc' : '#666' }}>
                <p style={{ margin: '4px 0' }}>
                  {profile.userType === "student" ? "Pocket Money" : "Salary"}: {profile.currency} {convertToMonthly(profile.income, profile.incomeFrequency).toFixed(2)}/month
                </p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ padding: '8px 16px', background: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              {darkMode ? ' Light' : ' Dark'}
            </button>
            <button onClick={logout} style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
              Logout
            </button>
          </div>
        </div>

        <Habitform setHabits={setHabits} currency={profile?.currency || '₹'} />
        <HabitChart habits={habits} history={habitHistory} currency={profile?.currency || '₹'} />
        <Habitlist habits={habits} profile={profile} setHabits={setHabits}/>
      </main>
      <Footer/>
      </div>
    </SnowfallEffect>
  );
}

export default App
