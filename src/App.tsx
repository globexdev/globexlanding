import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { MainApp } from './components/MainApp';
import { Dashboard } from './components/Dashboard';
import { X } from 'lucide-react';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowAuthDialog(false);
        setShowDashboard(true); // Automatically show dashboard on successful auth
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowDashboard(false);
    setSession(null);
  };

  // If user is authenticated and wants to see dashboard
  if (session && showDashboard) {
    return (
      <Dashboard 
        session={session} 
        onSignOut={handleSignOut} 
        onBackToMain={() => setShowDashboard(false)} 
      />
    );
  }

  return (
    <>
      <MainApp 
        session={session} 
        onShowAuth={() => setShowAuthDialog(true)}
        onShowDashboard={() => setShowDashboard(true)}
      />

      {/* Auth Dialog */}
      {showAuthDialog && !session && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
            <button
              onClick={() => setShowAuthDialog(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <Auth />
          </div>
        </div>
      )}
    </>
  );
}

export default App;