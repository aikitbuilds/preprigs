import { useState, useEffect } from 'react';
import { auth, provider } from '../lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { seedDemoInventory } from '../lib/demoData';
import { BlogSection } from '../components/BlogSection';

interface LandingPageProps {
    onEnterDemo: (level: 'beginner' | 'advanced') => void;
    onNavigate: (page: string) => void;
    initialAuthMode?: 'login' | 'signup' | 'forgot_password' | null;
    onAuthModeClear?: () => void;
}

const STAGES = [
    {
        number: '01',
        emoji: '🛟',
        name: 'Survive — 72 Hours',
        tagline: 'The first 3 days are the most critical.',
        color: 'from-blue-600/20 to-blue-900/5 border-blue-500/20',
        badgeColor: 'bg-blue-500/20 text-blue-300',
        who: 'Start Here',
        description: 'Most emergencies resolve within 72 hours. A go-bag, 3 days of water, and a plan puts you ahead of 90% of people.',
        goals: [
            '72-hour water supply (1 gallon/person/day)',
            'Emergency food — no cooking required',
            'Bug-out bag packed and ready',
            'Flashlights, first aid kit, hand-crank radio',
            'Paper docs + cash',
        ],
    },
    {
        number: '02',
        emoji: '🏕️',
        name: 'Sustain — 2 Weeks',
        tagline: 'When the grid stays down longer than expected.',
        color: 'from-orange-600/20 to-orange-900/5 border-orange-500/20',
        badgeColor: 'bg-orange-500/20 text-orange-300',
        who: 'Build Resilience',
        description: 'Real disruptions last 1–3 weeks. This stage is about being comfortable, not just alive.',
        goals: [
            '2-week food supply with meal variety',
            'Water purification (filter + tablets)',
            'Shelter-in-place plan',
            'Communications plan & out-of-area contact',
            'Fuel, generator basics, or alternative cooking',
        ],
    },
    {
        number: '03',
        emoji: '🌱',
        name: 'Thrive — Long Term',
        tagline: 'Built for resilience, not just survival.',
        color: 'from-green-600/20 to-green-900/5 border-green-500/20',
        badgeColor: 'bg-green-500/20 text-green-300',
        who: 'Deep Pantry',
        description: '3–12 months of food, water, and essentials. You\'re not weathering a storm — you\'re building a self-sufficient household.',
        goals: [
            'Deep pantry: 3–12 months of rotating food storage',
            'Water storage + rainwater collection',
            'Medical supplies & prescription stockpile',
            'Off-grid power: solar, battery backup',
            'Garden, seed bank, food preservation skills',
        ],
    },
];

const MODULES = [
    { icon: '✅', title: 'Smart Checklists', desc: 'Pre-built checklists for all 3 stages. Track progress as you build each module.' },
    { icon: '📦', title: 'Inventory Tracker', desc: 'Log what you have, costs, and expiration dates. Know your coverage at a glance.' },
    { icon: '📷', title: 'AI Photo Scanner', desc: 'Point your phone at your pantry — AI identifies and logs items automatically.' },
    { icon: '⚠️', title: 'Risk Scenarios', desc: 'Hurricane, Grid Down, Pandemic — learn what to prep for and how to respond.' },
];

// Product images already deployed to /images/
const HERO_IMAGES = [
    '/images/20260526_095709.jpg',
    '/images/20260526_095726.jpg',
    '/images/20260522_113541.jpg',
    '/images/20260526_095809.jpg',
];

export function LandingPage({ onEnterDemo, onNavigate, initialAuthMode, onAuthModeClear }: LandingPageProps) {
    const [loggingIn, setLoggingIn] = useState(false);
    const [activeStage, setActiveStage] = useState(0);
    const [heroImg, setHeroImg] = useState(0);
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password' | null>(initialAuthMode || null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authMessage, setAuthMessage] = useState('');

    useEffect(() => {
        if (initialAuthMode) setAuthMode(initialAuthMode);
    }, [initialAuthMode]);

    useEffect(() => {
        const t = setInterval(() => setActiveStage(s => (s + 1) % 3), 4000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setHeroImg(i => (i + 1) % HERO_IMAGES.length), 3500);
        return () => clearInterval(t);
    }, []);

    const handleGoogleLogin = async () => {
        setLoggingIn(true);
        try {
            await signInWithPopup(auth, provider);
        } catch (e: any) {
            setAuthError(e.message || 'Google Auth failed');
            setLoggingIn(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true);
        setAuthError('');
        setAuthMessage('');
        try {
            if (authMode === 'signup') {
                await createUserWithEmailAndPassword(auth, email, password);
            } else if (authMode === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
            } else if (authMode === 'forgot_password') {
                await sendPasswordResetEmail(auth, email);
                setAuthMessage('Password reset email sent! Check your inbox.');
            }
        } catch (e: any) {
            setAuthError(e.message || 'Authentication failed');
        } finally {
            setLoggingIn(false);
        }
    };

    const handleDemo = (level: 'beginner' | 'advanced') => {
        seedDemoInventory(level);
        onEnterDemo(level);
    };

    return (
        <div className="min-h-screen bg-background text-white overflow-x-hidden">

            {/* ─── NAV ──────────────────────────────────────────────── */}
            <nav className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-primary tracking-tight">PrepRigs</span>
                    <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest hidden sm:inline border border-white/5 px-2 py-0.5 rounded-full">Modular Prep</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('pricing')} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                        Pricing
                    </button>
                    <button onClick={() => setAuthMode('login')} className="text-sm font-semibold text-white border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 active:scale-95 transition-all">
                        Sign In
                    </button>
                </div>
            </nav>

            {/* ─── HERO ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Background image strip */}
                <div className="absolute inset-0">
                    {HERO_IMAGES.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                            style={{ opacity: heroImg === i ? 0.18 : 0 }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
                </div>

                <div className="relative z-10 px-5 pt-16 pb-14 text-center max-w-lg mx-auto">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                        🛡️&nbsp; A Modular Approach to Preparedness
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
                        Build Your Rig.<br />
                        <span className="text-primary">Module by Module.</span>
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
                        PrepRigs breaks emergency readiness into stackable modules — food, water, shelter, comms, power. Start with one. Build them all.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => setAuthMode('signup')}
                            className="flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-6 py-4 rounded-2xl text-base hover:bg-slate-100 active:scale-95 transition-all shadow-lg"
                        >
                            🛡️ Build My Rig — Free
                        </button>
                        <button
                            onClick={() => handleDemo('beginner')}
                            className="flex items-center justify-center bg-primary/10 border border-primary/30 text-primary font-bold px-4 py-3 rounded-2xl text-sm hover:bg-primary/20 active:scale-95 transition-all"
                        >
                            ▶ Demo: Beginner
                        </button>
                        <button
                            onClick={() => handleDemo('advanced')}
                            className="flex items-center justify-center bg-primary/10 border border-primary/30 text-primary font-bold px-4 py-3 rounded-2xl text-sm hover:bg-primary/20 active:scale-95 transition-all"
                        >
                            ▶ Demo: Advanced
                        </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-3">No credit card. No signup required for demo.</p>
                </div>
            </section>

            {/* ─── FEATURED NUTRIENT ────────────────────────────────── */}
            <section className="px-5 py-6 max-w-lg mx-auto">
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                    <span className="w-6 h-px bg-amber-500/50 inline-block" />
                    Featured Nutrient
                    <span className="w-6 h-px bg-amber-500/50 inline-block" />
                </div>

                <a href="/jerkycrisp/" className="block group">
                    <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-[#0c0c0a] hover:border-amber-500/50 transition-all duration-300 shadow-xl">
                        {/* Product image */}
                        <div className="relative h-52 overflow-hidden">
                            <img
                                src="/images/20260526_095709.jpg"
                                alt="Jerky Crisp by Prep Nutrients"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                style={{ objectPosition: 'center 40%' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0a] via-[#0c0c0a]/30 to-transparent" />

                            {/* Badge */}
                            <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase">
                                New Drop
                            </div>
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                                Prep Nutrients
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-5 pb-5">
                            <div className="flex items-end justify-between mb-3">
                                <div>
                                    <div className="text-amber-400 text-[10px] font-mono uppercase tracking-widest mb-1">Endurance Ration · Alpha</div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Jerky Crisp</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-amber-400 font-black text-lg">$26</div>
                                    <div className="text-slate-500 text-[10px]">6-pack / The Weekender</div>
                                </div>
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Dry-cured prosciutto + sweet potato. Real food engineered for extreme endurance — zero prep, shelf-stable, field-ready.
                            </p>

                            {/* Macro strip */}
                            <div className="grid grid-cols-5 gap-1.5 mb-4">
                                {[
                                    { val: '180', unit: 'Cal' },
                                    { val: '10g', unit: 'Protein' },
                                    { val: '24g', unit: 'Carb' },
                                    { val: '5g', unit: 'Fat' },
                                    { val: '0', unit: 'Prep' },
                                ].map((m, i) => (
                                    <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-2 text-center">
                                        <div className="text-amber-400 font-black text-sm leading-none">{m.val}</div>
                                        <div className="text-slate-600 text-[9px] mt-0.5 font-mono uppercase">{m.unit}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Image row */}
                            <div className="flex gap-1.5 mb-4">
                                {[
                                    '/images/20260526_095726.jpg',
                                    '/images/20260526_095809.jpg',
                                    '/images/20260522_114008.jpg',
                                    '/images/20260522_113541.jpg',
                                ].map((src, i) => (
                                    <div key={i} className="flex-1 h-14 rounded-lg overflow-hidden">
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-green-400 text-xs font-mono">Alpha — Limited Qty</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-amber-400 text-sm font-bold group-hover:gap-2.5 transition-all">
                                    Secure Your Ration
                                    <span>→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </section>

            {/* ─── 3 STAGES ─────────────────────────────────────────── */}
            <section className="px-5 py-10 max-w-lg mx-auto">
                <div className="text-center mb-8">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">The Framework</div>
                    <h2 className="text-2xl font-black text-white">3 Modules of Readiness</h2>
                    <p className="text-slate-400 text-sm mt-2">Every rig starts somewhere. Stack your modules at your own pace.</p>
                </div>

                <div className="flex gap-2 mb-5">
                    {STAGES.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveStage(i)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeStage === i ? 'bg-primary text-white' : 'bg-surface border border-white/5 text-slate-500 hover:text-slate-300'}`}
                        >
                            {s.emoji} {s.who}
                        </button>
                    ))}
                </div>

                {STAGES.map((stage, i) => (
                    <div
                        key={i}
                        className={`rounded-2xl border bg-gradient-to-br ${stage.color} p-5 transition-all duration-500 ${activeStage === i ? 'opacity-100' : 'hidden'}`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl">{stage.emoji}</span>
                            <div>
                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${stage.badgeColor}`}>Module {stage.number}</div>
                                <div className="font-black text-white text-lg leading-tight">{stage.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{stage.tagline}</div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{stage.description}</p>
                        <div className="space-y-2">
                            {stage.goals.map((g, j) => (
                                <div key={j} className="flex items-start gap-2 text-sm text-slate-200">
                                    <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                                    {g}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* ─── IMAGE BREAK ──────────────────────────────────────── */}
            <section className="px-5 max-w-lg mx-auto mb-10">
                <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden h-36">
                    <div className="col-span-2 overflow-hidden rounded-xl">
                        <img src="/images/20260526_093128.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex-1 overflow-hidden rounded-xl">
                            <img src="/images/20260526_082429.jpg" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 overflow-hidden rounded-xl">
                            <img src="/images/20260522_113401.jpg" alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-600 mt-2 font-mono uppercase tracking-widest">Field-tested. Real food. Real gear.</p>
            </section>

            {/* ─── MODULES / FEATURES ───────────────────────────────── */}
            <section className="px-5 py-8 max-w-lg mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-white">Your Rig. Your Modules.</h2>
                    <p className="text-slate-400 text-sm mt-1">One platform for your entire preparedness stack.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {MODULES.map((f, i) => (
                        <div key={i} className="bg-surface border border-white/5 rounded-2xl p-4 hover:border-primary/20 transition-colors">
                            <div className="text-2xl mb-2">{f.icon}</div>
                            <div className="font-bold text-white text-sm mb-1">{f.title}</div>
                            <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── PRINCIPLES ───────────────────────────────────────── */}
            <section className="px-5 py-8 max-w-lg mx-auto">
                <div className="bg-gradient-to-br from-primary/10 to-surface border border-primary/20 rounded-2xl p-5">
                    <h2 className="text-lg font-black text-white mb-4">The PrepRigs Rules</h2>
                    <div className="space-y-3">
                        {[
                            { rule: 'Two is one. One is none.', desc: 'Every module needs a backup. Redundancy is a feature, not overkill.' },
                            { rule: 'Rotate your stock.', desc: 'Use oldest items first. FIFO keeps your rig fresh and waste-free.' },
                            { rule: 'Store what you eat.', desc: 'Prep foods your family already likes. Emergencies aren\'t the time to experiment.' },
                            { rule: 'Skills beat stuff.', desc: 'A compass is useless if you can\'t navigate. Practice using your gear.' },
                            { rule: 'Build modular, think total.', desc: 'Each module is standalone, but your whole rig is the sum of its parts.' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                <div>
                                    <div className="text-sm font-bold text-white">{item.rule}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── BLOG ─────────────────────────────────────────────── */}
            <section className="px-5 py-8 max-w-lg mx-auto">
                <div className="bg-surface rounded-2xl border border-white/5 p-4 shadow-sm">
                    <BlogSection />
                </div>
            </section>

            {/* ─── BOTTOM CTA ───────────────────────────────────────── */}
            <section className="px-5 py-10 text-center max-w-lg mx-auto">
                <h2 className="text-2xl font-black text-white mb-2">Start Building Your Rig</h2>
                <p className="text-slate-400 text-sm mb-6">Module by module. No overwhelm. Just progress.</p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setAuthMode('signup')}
                        className="w-full flex items-center justify-center gap-3 bg-primary text-white font-bold px-6 py-4 rounded-2xl text-base active:scale-95 transition-all shadow-lg hover:bg-primary/90"
                    >
                        🛡️  Build My Rig — Free
                    </button>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => handleDemo('beginner')} className="flex-1 text-slate-400 text-sm underline underline-offset-4 py-2 hover:text-white">
                            ▶ Demo: Beginner
                        </button>
                        <button onClick={() => handleDemo('advanced')} className="flex-1 text-slate-400 text-sm underline underline-offset-4 py-2 hover:text-white">
                            ▶ Demo: Advanced
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ───────────────────────────────────────────── */}
            <footer className="border-t border-white/5 text-center py-6 px-5 mt-auto">
                <div className="text-primary font-black text-sm tracking-tight">PrepRigs</div>
                <div className="text-xs text-slate-600 mt-1 mb-3">© 2026 PrepRigs. A modular approach to preparedness.</div>
                <div className="flex justify-center gap-6 text-xs text-slate-500">
                    <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button>
                    <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                </div>
            </footer>

            {/* ─── AUTH MODAL ───────────────────────────────────────── */}
            {authMode && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl">
                        <button
                            onClick={() => { setAuthMode(null); setAuthError(''); setAuthMessage(''); if (onAuthModeClear) onAuthModeClear(); }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-black text-white mb-6">
                            {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
                        </h3>

                        {(authMode === 'login' || authMode === 'signup') && (
                            <>
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loggingIn}
                                    className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold px-4 py-3.5 rounded-xl text-sm hover:bg-slate-100 mb-6 transition-all active:scale-95 disabled:opacity-70"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <div className="text-[10px] text-slate-500 font-bold tracking-wider">OR EMAIL</div>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>
                            </>
                        )}

                        {authError && <div className="text-red-400 text-xs mb-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20 leading-relaxed">{authError}</div>}
                        {authMessage && <div className="text-green-400 text-xs mb-4 bg-green-400/10 p-3 rounded-lg border border-green-400/20 leading-relaxed">{authMessage}</div>}

                        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder-slate-700"
                                />
                            </div>

                            {authMode !== 'forgot_password' && (
                                <div>
                                    <div className="flex justify-between items-center mb-1.5 ml-1">
                                        <label className="block text-xs font-semibold text-slate-400">Password</label>
                                        {authMode === 'login' && (
                                            <button
                                                type="button"
                                                onClick={() => { setAuthMode('forgot_password'); setAuthError(''); setAuthMessage(''); }}
                                                className="text-[11px] text-primary hover:text-primary/80 font-semibold"
                                            >
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder-slate-700"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loggingIn}
                                className="w-full bg-primary/20 text-primary border border-primary/30 font-bold py-3.5 rounded-xl mt-2 hover:bg-primary hover:text-white active:scale-95 transition-all text-sm disabled:opacity-70"
                            >
                                {loggingIn ? 'Processing…' : authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-xs text-slate-400 font-medium">
                            {authMode === 'login' ? (
                                <>Don't have an account? <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} className="text-white hover:underline font-bold ml-1">Sign up</button></>
                            ) : authMode === 'signup' ? (
                                <>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-white hover:underline font-bold ml-1">Sign in</button></>
                            ) : (
                                <button onClick={() => { setAuthMode('login'); setAuthError(''); setAuthMessage(''); }} className="text-slate-300 hover:text-white hover:underline font-bold">← Back to sign in</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
