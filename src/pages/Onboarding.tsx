import { useState } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { MapPin, Users, Target, ShieldCheck, X } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

interface OnboardingProps {
    user: User;
    onComplete: (profile: UserProfile) => void;
    onCancel?: () => void;
}

export function Onboarding({ user, onComplete, onCancel }: OnboardingProps) {
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);

    const [householdSize, setHouseholdSize] = useState(1);
    const [locationType, setLocationType] = useState<UserProfile['locationType']>('Suburban');
    const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>('Beginner');
    const [zipCode, setZipCode] = useState('');
    const seedInventory = useInventoryStore(state => state.seedInventory);

    const handleSave = async () => {
        setSaving(true);
        const profile: UserProfile = {
            uid: user.uid,
            householdSize,
            locationType,
            experienceLevel,
            zipCode,
            onboardingCompleted: true,
            earnedBadges: [],
            updatedAt: new Date().toISOString()
        };

        try {
            await setDoc(doc(db, 'users', user.uid), profile);
            // Seed inventory based on profile
            await seedInventory(profile);
            onComplete(profile);
        } catch (e: any) {
            console.error("Error saving profile", e);
            if (e.code === 'permission-denied') {
                alert("Failed to save profile.\n\nPlease ensure your Firebase Firestore Database is created and its Security Rules are set to 'Test Mode' (allow read, write).");
            } else {
                alert(`Failed to save profile: ${e.message}`);
            }
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-5 relative">
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2 rounded-full bg-surface border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all z-10"
                >
                    <X size={20} />
                </button>
            )}

            <div className="w-full max-w-sm bg-surface rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="text-center mb-8 mt-2">
                    <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h1 className="text-xl font-black">Commander Profile</h1>
                    <p className="text-slate-400 text-sm mt-1">Let's tailor PrepRigs to your needs.</p>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                <Users size={16} className="text-primary" />
                                Household Size
                            </label>
                            <p className="text-xs text-slate-400 mb-4">How many people are you prepping for?</p>

                            <div className="flex items-center justify-center gap-6 bg-background rounded-2xl p-4 border border-white/5">
                                <button
                                    onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                                    className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xl hover:bg-white/5 active:scale-95"
                                >
                                    -
                                </button>
                                <div className="text-3xl font-black w-12 text-center">{householdSize}</div>
                                <button
                                    onClick={() => setHouseholdSize(householdSize + 1)}
                                    className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xl hover:bg-white/5 active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="px-6 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold active:scale-95 hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl active:scale-95 transition-all"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                <MapPin size={16} className="text-primary" />
                                Location Type
                            </label>
                            <p className="text-xs text-slate-400 mb-4">Different locations face different risks.</p>

                            <div className="space-y-3">
                                {['Urban', 'Suburban', 'Rural'].map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => setLocationType(loc as UserProfile['locationType'])}
                                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${locationType === loc
                                            ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(234,88,12,0.15)]'
                                            : 'bg-background border-white/5 text-slate-400 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="font-bold font-sans">{loc}</span>
                                        {locationType === loc && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                <MapPin size={16} className="text-primary" />
                                Zip Code / City
                            </label>
                            <input
                                type="text"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                placeholder="e.g. 77002 or Houston"
                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none transition-all font-sans"
                            />
                            <p className="text-[10px] text-slate-500 mt-2 px-1 italic">Used to identify regional threats (Flood, Fire, Cold).</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold active:scale-95"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl active:scale-95 transition-all"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                <Target size={16} className="text-primary" />
                                Your Prepping Journey
                            </label>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                                Prepping is built in phases. Don't get overwhelmed—start with the basics and grow from there. Where are you currently?
                            </p>

                            <div className="space-y-3">
                                {[
                                    {
                                        id: 'Beginner',
                                        title: 'Phase 1: The Basics (1 Week)',
                                        desc: 'Focus on 1 week of food/water and a 72-hour bugout kit.'
                                    },
                                    {
                                        id: 'Intermediate',
                                        title: 'Phase 2: Resiliency (1 Month)',
                                        desc: 'Got the basics, moving towards 1 month supply and rotation.'
                                    },
                                    {
                                        id: 'Advanced',
                                        title: 'Phase 3: Deep Storage (6-12 Months)',
                                        desc: 'Deep pantry, off-grid power, and long-term self-sufficiency.'
                                    }
                                ].map((exp) => (
                                    <button
                                        key={exp.id}
                                        onClick={() => setExperienceLevel(exp.id as UserProfile['experienceLevel'])}
                                        className={`w-full p-4 rounded-xl border text-left transition-all ${experienceLevel === exp.id
                                            ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(234,88,12,0.15)]'
                                            : 'bg-background border-white/5 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`font-bold font-sans ${experienceLevel === exp.id ? 'text-white' : 'text-slate-300'}`}>{exp.title}</span>
                                            {experienceLevel === exp.id && <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />}
                                        </div>
                                        <div className={`text-xs ${experienceLevel === exp.id ? 'text-primary' : 'text-slate-500'}`}>{exp.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold active:scale-95"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl active:scale-95 transition-all flex justify-center items-center"
                            >
                                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Setup'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
