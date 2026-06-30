import './App.css'
import { lazy, Suspense, useEffect, useState } from 'react';
import LandingPage from './LandingPage.jsx';

const Auth = lazy(() => import('./Auth.jsx'));
const Dashboard = lazy(() => import('./Dashboard.jsx'));

const firebaseConfigValues = [
  import.meta.env.VITE_FIREBASE_API_KEY,
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  import.meta.env.VITE_FIREBASE_APP_ID
];

const hasFirebaseConfig = firebaseConfigValues.every((value) =>
  Boolean(value) && !String(value).startsWith("your_")
);

function AppLoading() {
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

function AuthConfigNotice({ onBackToLanding }) {
  return (
    <div className="app-auth-notice-shell">
      <button type="button" className="app-auth-notice-back" onClick={onBackToLanding}>
        Back to public page
      </button>
      <div className="app-auth-notice-card">
        <h1>Firebase setup needed</h1>
        <p>
          Replace the placeholder Firebase values in your local .env file before using login, signup, Google auth, or the protected dashboard.
        </p>
        <code>.env</code>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(hasFirebaseConfig);
  const [publicView, setPublicView] = useState("landing");
  const [authInitialMode, setAuthInitialMode] = useState("login");

  useEffect(() => {
    if (!hasFirebaseConfig) {
      return undefined;
    }

    let unsubscribeAuth = null;
    let isCurrent = true;

    async function listenForAuth() {
      try {
        const { auth } = await import('./firebase');

        if (!isCurrent) {
          return;
        }

        unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
          setUser(currentUser);
          setCheckingAuth(false);
        });
      } catch (err) {
        console.error("Unable to initialize Firebase auth:", err);
        setCheckingAuth(false);
      }
    }

    listenForAuth();

    return () => {
      isCurrent = false;
      unsubscribeAuth?.();
    };
  }, []);

  function openAuth(mode) {
    setAuthInitialMode(mode);
    setPublicView("auth");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function returnToLanding() {
    setPublicView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (checkingAuth) {
    return <AppLoading />;
  }

  if (user) {
    return (
      <Suspense fallback={<AppLoading />}>
        <Dashboard
          user={user}
          onSignedOut={() => {
            setUser(null);
            setPublicView("landing");
          }}
        />
      </Suspense>
    );
  }

  if (publicView === "auth") {
    if (!hasFirebaseConfig) {
      return <AuthConfigNotice onBackToLanding={returnToLanding} />;
    }

    return (
      <Suspense fallback={<AppLoading />}>
        <Auth
          initialMode={authInitialMode}
          onBackToLanding={returnToLanding}
          onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)}
        />
      </Suspense>
    );
  }

  return (
    <LandingPage
      onLogin={() => openAuth("login")}
      onSignup={() => openAuth("signup")}
    />
  );
}

export default App
