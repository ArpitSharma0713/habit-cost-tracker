import './App.css'
import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { logout } from './auth';
import Auth from './Auth.jsx';
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Habitform from './Habitform.jsx';
import Habitlist from './Habitlist.jsx';
import HabitChart from './HabitChart.jsx';
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { convertToMonthly } from './utils';

function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [profile, setProfile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        setUser(user);
        
        if (!user) {
          setHabits([]);
          setProfile(null);
          setLoading(false);
          return;
        }

        // Fetch user profile
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          // Fallback profile if not found
          setProfile({
            currency: "₹",
            userType: "student",
            income: 0,
            incomeFrequency: "monthly"
          });
        }

        // Fetch habits
        const q = query(
          collection(db, "habits"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setHabits(habitsData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Loading your habits...</h2>
          <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #000', borderRadius: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  return(
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
            ⚠️ {error}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`, background: darkMode ? '#0a0a0a' : '#f9f9f9', borderRadius: '8px', marginBottom: '20px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>Welcome {user.email}</p>
            {profile && (
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
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={logout} style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
              Logout
            </button>
          </div>
        </div>
        
        <Habitform setHabits={setHabits} />
        <HabitChart habits={habits} />
        <Habitlist habits={habits} profile={profile} setHabits={setHabits}/>
      </main>
      <Footer/>
    </div>
  );
}

export default App
