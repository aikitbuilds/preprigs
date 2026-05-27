import { useState, useEffect } from 'react';
import { auth, provider, db } from '../lib/firebase';
import { signInWithPopup, signOut, User, deleteUser } from 'firebase/auth';
import { LogIn, LogOut, Award, Check, X, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';
import { BADGES } from '../lib/badges';
import { useInventoryStore } from '../store/useInventoryStore';
import { collection, query, where, getDocs, writeBatch, deleteDoc, doc } from 'firebase/firestore';

interface ProfileProps {
    demoMode?: boolean;
    onExitDemo?: () => void;
    userProfile?: UserProfile | null;
    onStartOnboarding?: () => void;
}

export function Profile({ demoMode, onExitDemo, userProfile, onStartOnboarding }: ProfileProps) {
    const [user, setUser] = useState<User | null>(null);
    const [expandedBadgeId, setExpandedBadgeId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = () => signOut(auth);

    const handleDeleteAccount = async () => {
        if (!user) return;
        setIsDeleting(true);
        setDeleteError(null);

        try {
            // 1. Delete all inventory items for this user
            const q = query(collection(db, 'inventory'), where('userId', '==', user.uid));
            const snap = await getDocs(q);
            const batch = writeBatch(db);
            snap.forEach(document => {
                batch.delete(document.ref);
            });
            await batch.commit();

            // 2. Delete the user profile document
            await deleteDoc(doc(db, 'users', user.uid));

            // 3. Delete the auth user
            await deleteUser(user);
            
            setShowDeleteModal(false);
            // On success, the auth listener will trigger and log the user out
        } catch (e: any) {
            console.error("Error deleting account:", e);
            if (e.code === 'auth/requires-recent-login') {
                setDeleteError("This operation is sensitive and requires recent authentication. Please log out and log back in, then try again.");
            } else {
                setDeleteError(e.message || "An error occurred while deleting your account.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const inventoryItems = useInventoryStore(state => state.items);

    // Determine demo level strictly from local storage just to mock the UI accurately
    const demoLevel = typeof window !== 'undefined' ? localStorage.getItem('demo_level') : 'advanced';

    // Use a mock profile for demo mode, or the real profile
    const displayProfile = demoMode
        ? (demoLevel === 'advanced'
            ? {
                uid: 'demo-user',
                householdSize: 4,
                locationType: 'Rural',
                experienceLevel: 'Advanced',
                onboardingCompleted: true,
                earnedBadges: ['fire', 'water', 'first_aid', 'foraging', 'food_pres', 'shelter', 'defense', 'nav', 'garden'],
                updatedAt: new Date().toISOString()
            } as UserProfile
            : {
                uid: 'demo-user-beginner',
                householdSize: 1,
                locationType: 'Urban',
                experienceLevel: 'Beginner',
                onboardingCompleted: true,
                earnedBadges: ['fire'], // Only one basic badge
                updatedAt: new Date().toISOString()
            } as UserProfile)
        : userProfile;

    const earnedBadges = demoMode
        ? (displayProfile?.earnedBadges || [])
        : BADGES.filter(b => b.check(inventoryItems)).map(b => b.id);

    const totalScore = earnedBadges.reduce((sum, id) => {
        const badge = BADGES.find(b => b.id === id);
        return sum + (badge ? badge.points : 0);
    }, 0);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 pb-24">
            {demoMode && (
                <div className="w-full max-w-sm bg-primary/20 border border-primary/30 rounded-2xl p-4 mb-6 text-center">
                    <h2 className="text-lg font-black text-primary mb-1">Demo Profile Active</h2>
                    <p className="text-xs text-primary/80 mb-4">You are viewing a simulated '{demoLevel === 'advanced' ? 'Advanced' : 'Beginner'}' Commander Profile.</p>
                    <div className="flex gap-2">
                        <button onClick={handleLogin} className="flex-1 bg-primary text-white font-bold py-2 rounded-xl text-sm active:scale-95 transition-all">Sign In</button>
                        <button onClick={onExitDemo} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl text-sm active:scale-95 transition-all">Exit Demo</button>
                    </div>
                </div>
            )}

            {(user || demoMode) ? (
                <div className="w-full max-w-sm space-y-5">
                    <div className="bg-surface border border-white/5 rounded-2xl p-5 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            {(user?.photoURL || demoMode) ? (
                                <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=demo`} className="w-16 h-16 rounded-full border-2 border-primary bg-background" alt="Avatar" />
                            ) : (
                                <div className="w-16 h-16 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                                    <Award className="text-primary" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <div className="font-bold text-white text-lg truncate">
                                    {demoMode ? 'Commander Demo' : (user?.displayName || 'Commander')}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{demoMode ? 'demo@prepproto.com' : user?.email}</div>
                                <div className="text-[10px] text-success font-semibold mt-1 uppercase tracking-wider">✓ Secure Uplink</div>
                            </div>
                        </div>

                        {displayProfile ? (
                            <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-y-3 gap-x-2">
                                <div>
                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Household</div>
                                    <div className="text-sm text-white font-medium">{displayProfile.householdSize} Personnel</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Location</div>
                                    <div className="text-sm text-white font-medium">{displayProfile.locationType}</div>
                                </div>
                                <div className="col-span-2 mt-1">
                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Experience</div>
                                    <div className="text-sm text-primary font-bold">{displayProfile.experienceLevel} Level</div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-t border-white/5 pt-4">
                                <p className="text-xs text-slate-400 mb-3 text-center">Your Commander Profile is incomplete.</p>
                                <button
                                    onClick={onStartOnboarding}
                                    className="w-full flex items-center justify-center gap-2 bg-primary/20 text-primary border border-primary/30 font-bold py-3 rounded-xl text-sm hover:bg-primary/30 active:scale-95 transition-all"
                                >
                                    Setup Commander Profile
                                </button>
                            </div>
                        )}
                    </div>

                    {displayProfile && (
                        <div className="bg-surface border border-white/5 rounded-2xl p-5 shadow-xl">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="font-black text-white text-lg flex items-center gap-2">
                                        <Award size={18} className="text-primary" />
                                        Survival Score
                                    </h3>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Earn badges to level up</p>
                                </div>
                                <div className="text-3xl font-black text-primary">{totalScore}<span className="text-sm text-slate-500">/100</span></div>
                            </div>

                            <div className="w-full h-3 bg-background rounded-full overflow-hidden mt-3 mb-6">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-600 to-primary transition-all duration-500 ease-out"
                                    style={{ width: `${Math.min(100, (totalScore / 100) * 100)}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {BADGES.map(badge => {
                                    const isEarned = earnedBadges.includes(badge.id);
                                    const isExpanded = expandedBadgeId === badge.id;
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`relative rounded-xl border transition-all overflow-hidden ${isEarned
                                                ? 'bg-primary/10 border-primary/30'
                                                : 'bg-background border-white/5 opacity-80'
                                                }`}
                                        >
                                            <div
                                                onClick={() => setExpandedBadgeId(isExpanded ? null : badge.id)}
                                                className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{badge.icon}</span>
                                                    <div>
                                                        <div className={`text-sm font-bold ${isEarned ? 'text-white' : 'text-slate-400'}`}>
                                                            {badge.name}
                                                        </div>
                                                        <div className={`text-[10px] font-black ${isEarned ? 'text-primary' : 'text-slate-500'}`}>+{badge.points} PTS</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isEarned ? (
                                                        <div className="bg-success/20 text-success p-1 rounded-full border border-success/30">
                                                            <Check size={14} strokeWidth={3} />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-black/40 text-slate-600 p-1 rounded-full border border-white/5">
                                                            <X size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="px-3 pb-3 pt-1 border-t border-white/5 text-xs text-slate-400 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    {badge.description}
                                                    <div className="mt-2 text-[10px] text-slate-500 italic">Tap badge again to collapse</div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!demoMode && (
                        <div className="space-y-6">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 bg-red-900/20 border border-red-900/30 text-red-400 font-semibold py-3.5 rounded-2xl text-sm hover:bg-red-900/30 active:scale-95 transition-all"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                            
                            <div className="border-t border-red-900/30 pt-6">
                                <h4 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    Danger Zone
                                </h4>
                                <p className="text-xs text-slate-400 mb-4">Permanently delete your account and wipe all stored data. This action cannot be undone.</p>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600/10 border border-red-600/30 text-red-500 font-bold py-3.5 rounded-2xl text-sm hover:bg-red-600/20 active:scale-95 transition-all"
                                >
                                    Delete Account & Data
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center max-w-xs">
                    <div className="text-4xl mb-4">🔐</div>
                    <h2 className="text-xl font-black text-white mb-2">Sign In to Save</h2>
                    <p className="text-slate-400 text-sm mb-6">Create a free account to sync your inventory and checklists across devices.</p>
                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 rounded-2xl text-sm active:scale-95 transition-all"
                    >
                        <LogIn size={18} />
                        Sign In with Google
                    </button>
                </div>
            )}

            {/* Danger Zone Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-surface border border-red-900/50 rounded-2xl p-6 shadow-2xl relative">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                                <AlertTriangle className="text-red-500 w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-black text-white mb-2">Delete Account?</h2>
                            <p className="text-sm text-slate-400">
                                This will permanently delete your PrepRigs account, wipe all stored inventory, and erase your commander profile from our servers.
                            </p>
                            <p className="text-xs text-red-400 font-bold mt-3">This action cannot be undone.</p>
                        </div>
                        
                        {deleteError && (
                            <div className="mb-6 p-3 bg-red-900/20 border border-red-900/50 rounded-xl text-xs text-red-400 text-center">
                                {deleteError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-slate-300 font-bold hover:bg-white/5 disabled:opacity-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl active:scale-95 disabled:opacity-50 transition-all flex justify-center items-center"
                            >
                                {isDeleting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
