import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { DashboardLayout } from './layout/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { PrepBuilder } from './pages/PrepBuilder';
import { Profile } from './pages/Profile';
import { Checklists } from './pages/Checklists';
import { Onboarding } from './pages/Onboarding';
import { AIAssistant } from './pages/AIAssistant';
import { useInventoryStore } from './store/useInventoryStore';
import { useChecklistStore } from './store/useChecklistStore';
import { UserProfile } from './types';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Pricing } from './pages/Pricing';

const DEMO_KEY = 'prepproto_demo_mode';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [demoMode, setDemoMode] = useState(() => localStorage.getItem(DEMO_KEY) === 'true');
    const [authLoading, setAuthLoading] = useState(true);
    const [onboardingLoading, setOnboardingLoading] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [activePage, setActivePage] = useState('checklists');
    const [publicPage, setPublicPage] = useState<string | null>(null);
    const [landingAuthMode, setLandingAuthMode] = useState<'login' | 'signup' | 'forgot_password' | null>(null);

    const subscribeInventory = useInventoryStore(state => state.subscribe);
    const initChecklists = useChecklistStore(state => state.init);

    // Firebase auth & profile listener
    useEffect(() => {
        let unsubscribeProfile: (() => void) | undefined;

        const unsubscribeAuth = auth.onAuthStateChanged((u) => {
            setUser(u);
            if (u) {
                setOnboardingLoading(true);
                unsubscribeProfile = onSnapshot(doc(db, 'users', u.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data() as UserProfile);
                    } else {
                        setUserProfile(null);
                    }
                    setOnboardingLoading(false);
                }, (error) => {
                    console.error("Failed to load user profile", error);
                    setOnboardingLoading(false);
                });
            } else {
                if (unsubscribeProfile) {
                    unsubscribeProfile();
                }
                setUserProfile(null);
                setOnboardingLoading(false);
            }
            setAuthLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) {
                unsubscribeProfile();
            }
        };
    }, []);

    // Initialize data stores when authenticated or in demo mode
    useEffect(() => {
        if (user) {
            const unsubscribeInventory = subscribeInventory(user.uid);
            initChecklists();
            return () => unsubscribeInventory();
        } else if (demoMode) {
            initChecklists();
        }
    }, [user, demoMode, subscribeInventory, initChecklists]);

    const handleEnterDemo = (level: 'beginner' | 'advanced') => {
        // level was passed to seedDemoInventory directly in LandingPage, so we just set the flags here
        localStorage.setItem(DEMO_KEY, 'true');
        localStorage.setItem('demo_level', level);
        setDemoMode(true);
    };

    const handleExitDemo = () => {
        localStorage.removeItem(DEMO_KEY);
        setDemoMode(false);
    };

    // Show nothing while Firebase checks auth state or fetches profile
    if (authLoading || onboardingLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-primary font-bold animate-pulse">PrepRigs</div>
            </div>
        );
    }

    // Handle global public pages over anything else mapping (like ToS/Privacy)
    if (publicPage === 'terms') return <TermsOfService onBack={() => setPublicPage(null)} />;
    if (publicPage === 'privacy') return <PrivacyPolicy onBack={() => setPublicPage(null)} />;
    if (publicPage === 'pricing') return (
        <Pricing 
            onBack={() => setPublicPage(null)} 
            onSignUp={() => { setPublicPage(null); setLandingAuthMode('signup'); }} 
        />
    );

    // Show landing page if not logged in and not in demo mode
    if (!user && !demoMode) {
        return (
            <LandingPage 
                onEnterDemo={handleEnterDemo} 
                onNavigate={setPublicPage} 
                initialAuthMode={landingAuthMode}
                onAuthModeClear={() => setLandingAuthMode(null)}
            />
        );
    }

    // Show onboarding for new users (no profile) or if explicitly requested
    if (user && (showOnboarding || (!onboardingLoading && !userProfile?.onboardingCompleted))) {
        return (
            <Onboarding
                user={user}
                onComplete={(profile: UserProfile) => {
                    setUserProfile(profile);
                    setShowOnboarding(false);
                }}
                onCancel={userProfile ? () => setShowOnboarding(false) : undefined}
            />
        );
    }

    return (
        <DashboardLayout activePage={activePage} onNavigate={setActivePage} demoMode={demoMode} onExitDemo={handleExitDemo}>
            {activePage === 'dashboard' && <Dashboard userProfile={userProfile} />}
            {activePage === 'intelligence' && <AIAssistant userProfile={userProfile} />}
            {activePage === 'checklists' && <Checklists />}
            {activePage === 'builder' && <PrepBuilder userProfile={userProfile} />}
            {activePage === 'inventory' && <Inventory userProfile={userProfile} />}
            {activePage === 'profile' && (
                <Profile
                    demoMode={demoMode}
                    onExitDemo={handleExitDemo}
                    userProfile={userProfile}
                    onStartOnboarding={() => setShowOnboarding(true)}
                />
            )}
        </DashboardLayout>
    );
}

export default App;
