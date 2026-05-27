import { useState, useEffect } from 'react';
import { auth, provider } from '../lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { seedDemoInventory } from '../lib/demoData';

interface LandingPageProps {
    onEnterDemo: (level: 'beginner' | 'advanced') => void;
    onNavigate: (page: string) => void;
    initialAuthMode?: 'login' | 'signup' | 'forgot_password' | null;
    onAuthModeClear?: () => void;
}

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
    orange:      '#ff9800',
    dark:        '#080808',
    dark2:       '#0f0f0f',
    card:        '#111111',
    green:       '#2b3a27',
    greenBright: '#3d6b35',
    text:        '#f0ece4',
    text2:       '#a09888',
    text3:       '#585450',
    border:      'rgba(255,255,255,0.07)',
    goldDim:     'rgba(255,152,0,0.12)',
    goldBorder:  'rgba(255,152,0,0.28)',
};
const oswald: React.CSSProperties = { fontFamily: "'Oswald', sans-serif" };
const mono:   React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

// ── Data ───────────────────────────────────────────────────────────────────────
const STAGES = [
    {
        number: '01', who: 'Start Here',
        name: 'Survive — 72 Hours',
        tagline: 'The first 3 days are the most critical.',
        description: 'Most emergencies resolve within 72 hours. A go-bag, 3 days of water, and a plan puts you ahead of 90% of people.',
        goals: ['72-hour water supply (1 gal/person/day)', 'Emergency food — no cooking required', 'Bug-out bag packed and ready', 'Flashlights, first aid, hand-crank radio', 'Paper docs + cash'],
    },
    {
        number: '02', who: 'Build Resilience',
        name: 'Sustain — 2 Weeks',
        tagline: 'When the grid stays down longer than expected.',
        description: 'Real disruptions last 1–3 weeks. This stage is about being comfortable, not just alive.',
        goals: ['2-week food supply with meal variety', 'Water purification (filter + tablets)', 'Shelter-in-place plan', 'Communications plan & out-of-area contact', 'Fuel, generator basics, or alternative cooking'],
    },
    {
        number: '03', who: 'Deep Pantry',
        name: 'Thrive — Long Term',
        tagline: 'Built for resilience, not just survival.',
        description: "3–12 months of food, water, and essentials. You're not weathering a storm — you're building a self-sufficient household.",
        goals: ['Deep pantry: 3–12 months rotating storage', 'Water storage + rainwater collection', 'Medical supplies & prescription stockpile', 'Off-grid power: solar, battery backup', 'Garden, seed bank, food preservation skills'],
    },
];

const HERO_IMAGES = [
    '/images/main1.jpg',
    '/images/main2.jpg',
    '/images/main3.jpg',
    '/images/20260526_095726.jpg',
];

const FEATURES = [
    { icon: '✅', title: 'Smart Checklists',   desc: 'Pre-built for all 3 readiness levels. Track progress as you build each module.' },
    { icon: '📦', title: 'Inventory Tracker',  desc: 'Log supplies, costs, expiry dates. Know your coverage at a glance.' },
    { icon: '📷', title: 'AI Photo Scanner',   desc: 'Point your phone at your pantry — AI identifies and logs items automatically.' },
    { icon: '⚠️', title: 'Risk Scenarios',     desc: 'Hurricane, Grid Down, Pandemic — learn what to prep for and how.' },
];

// ── Eyebrow label ──────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-3" style={{ ...mono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.orange }}>
            <span style={{ width: 24, height: 1, background: C.orange, display: 'inline-block', flexShrink: 0 }} />
            {children}
        </div>
    );
}

// ── Component ──────────────────────────────────────────────────────────────────
export function LandingPage({ onEnterDemo, onNavigate, initialAuthMode, onAuthModeClear }: LandingPageProps) {
    const [loggingIn,   setLoggingIn]   = useState(false);
    const [activeStage, setActiveStage] = useState(0);
    const [heroImg,     setHeroImg]     = useState(0);
    const [authMode,    setAuthMode]    = useState<'login' | 'signup' | 'forgot_password' | null>(initialAuthMode || null);
    const [email,       setEmail]       = useState('');
    const [password,    setPassword]    = useState('');
    const [authError,   setAuthError]   = useState('');
    const [authMessage, setAuthMessage] = useState('');

    useEffect(() => { if (initialAuthMode) setAuthMode(initialAuthMode); }, [initialAuthMode]);
    useEffect(() => { const t = setInterval(() => setActiveStage(s => (s + 1) % 3), 5000); return () => clearInterval(t); }, []);
    useEffect(() => { const t = setInterval(() => setHeroImg(i => (i + 1) % HERO_IMAGES.length), 4000); return () => clearInterval(t); }, []);

    const handleGoogleLogin = async () => {
        setLoggingIn(true);
        try { await signInWithPopup(auth, provider); }
        catch (e: any) { setAuthError(e.message || 'Google Auth failed'); setLoggingIn(false); }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true); setAuthError(''); setAuthMessage('');
        try {
            if (authMode === 'signup')           await createUserWithEmailAndPassword(auth, email, password);
            else if (authMode === 'login')       await signInWithEmailAndPassword(auth, email, password);
            else if (authMode === 'forgot_password') {
                await sendPasswordResetEmail(auth, email);
                setAuthMessage('Password reset email sent! Check your inbox.');
            }
        } catch (e: any) { setAuthError(e.message || 'Authentication failed'); }
        finally { setLoggingIn(false); }
    };

    const handleDemo = (level: 'beginner' | 'advanced') => { seedDemoInventory(level); onEnterDemo(level); };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: C.dark, color: C.text }}>

            {/* ═══ ANNOUNCE BAR ═════════════════════════════════════════════ */}
            <div className="text-center py-2.5 px-4 text-[0.65rem] font-bold tracking-[0.15em] uppercase" style={{ ...mono, background: C.orange, color: C.dark }}>
                ⚡ Alpha Release Active &nbsp;·&nbsp; Code <strong>ALPHA-TEST-20</strong> = 20% Off &nbsp;·&nbsp;
                <a href="/jerkycrisp/" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>Shop Jerky Crisp →</a>
            </div>

            {/* ═══ NAV ══════════════════════════════════════════════════════ */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b" style={{ background: 'rgba(8,8,8,0.96)', borderColor: C.border, backdropFilter: 'blur(12px)' }}>
                <div>
                    <div style={{ ...oswald, fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.15em', color: C.text }}>PREP RIGS</div>
                    <div style={{ ...mono, fontSize: '0.5rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.orange }}>Modular Preparedness</div>
                </div>
                <div className="flex items-center gap-5">
                    <a href="/jerkycrisp/" className="hidden sm:block transition-colors" style={{ ...mono, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.text2 }}>
                        Nutrients
                    </a>
                    <button onClick={() => onNavigate('pricing')} className="hidden sm:block transition-colors" style={{ ...mono, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.text2 }}>
                        Pricing
                    </button>
                    <button onClick={() => setAuthMode('login')} className="px-5 py-2 border font-bold transition-all" style={{ ...oswald, color: C.text, borderColor: C.border, letterSpacing: '0.1em', fontSize: '0.85rem' }}>
                        Sign In
                    </button>
                </div>
            </nav>

            {/* ═══ HERO ═════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden flex items-center" style={{ minHeight: '100vh' }}>
                {/* Background */}
                <div className="absolute inset-0">
                    {HERO_IMAGES.map((src, i) => (
                        <img key={i} src={src} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" style={{ opacity: heroImg === i ? 1 : 0 }} />
                    ))}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.82) 55%, rgba(8,8,8,0.94) 100%)' }} />
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(255,152,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,152,0,0.025) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-36">
                    <Eyebrow>Modular Preparedness Platform</Eyebrow>

                    <h1 className="mb-6 leading-tight" style={{ ...oswald, fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700, letterSpacing: '0.03em' }}>
                        Build Your Rig.<br />
                        <span style={{ color: C.orange }}>Module by Module.</span>
                    </h1>

                    <p className="mb-10 max-w-2xl leading-relaxed" style={{ ...oswald, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 400, color: C.text2, letterSpacing: '0.04em' }}>
                        PrepRigs is the complete system for serious readiness — track your food, water, and gear.&nbsp;
                        <strong style={{ color: C.orange }}>Prep Nutrients</strong> is the field ration line built alongside it.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-10 mb-12">
                        {[
                            { val: '3',     lbl: 'Readiness Modules' },
                            { val: '180',   lbl: 'Cal / Ration Bar'  },
                            { val: '550mg', lbl: 'Sodium / Bar'      },
                            { val: '0',     lbl: 'Prep Required'     },
                        ].map((s, i) => (
                            <div key={i}>
                                <div style={{ ...oswald, fontSize: '2rem', fontWeight: 700, color: C.orange, lineHeight: 1 }}>{s.val}</div>
                                <div style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.text3, marginTop: 5 }}>{s.lbl}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <a href="/jerkycrisp/" className="inline-flex items-center gap-2 font-bold px-8 py-4 transition-all" style={{ ...oswald, background: C.orange, color: C.dark, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Shop Jerky Crisp →
                        </a>
                        <button onClick={() => setAuthMode('signup')} className="inline-flex items-center gap-2 font-bold px-8 py-4 border transition-all" style={{ ...oswald, background: 'transparent', color: C.orange, borderColor: C.orange, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Build My Rig — Free
                        </button>
                        <button onClick={() => handleDemo('beginner')} className="inline-flex items-center font-semibold px-2 py-4 transition-all" style={{ ...mono, background: 'transparent', color: C.text3, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            ▶ View Demo
                        </button>
                    </div>
                    <p style={{ ...mono, fontSize: '0.58rem', color: C.text3, marginTop: 12, letterSpacing: '0.1em' }}>NO CREDIT CARD · DEMO REQUIRES NO SIGNUP</p>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.2em', color: C.text3 }}>
                    SCROLL
                    <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.orange}, transparent)` }} />
                </div>
            </section>

            {/* ═══ JERKY CRISP FEATURE ══════════════════════════════════════ */}
            <section className="relative overflow-hidden" style={{ background: C.dark2 }}>
                <div className="max-w-5xl mx-auto px-6 py-20">
                    <Eyebrow>Featured Nutrient · Prep Nutrients</Eyebrow>
                    <h2 className="mb-12" style={{ ...oswald, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '0.04em' }}>
                        The Field Ration <span style={{ color: C.orange }}>Built For This.</span>
                    </h2>

                    <div className="flex flex-col md:flex-row border overflow-hidden" style={{ borderColor: C.goldBorder }}>
                        {/* Image col */}
                        <div className="relative overflow-hidden md:w-1/2" style={{ minHeight: 380 }}>
                            <img src="/images/main1.jpg" alt="Jerky Crisp" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(17,17,17,0.9))' }} />
                            <div className="absolute top-4 left-4 px-3 py-1.5 font-bold tracking-wider uppercase text-[0.62rem]" style={{ ...mono, background: C.orange, color: C.dark }}>
                                Alpha Release
                            </div>
                        </div>
                        {/* Content col */}
                        <div className="md:w-1/2 p-8 flex flex-col justify-between" style={{ background: C.card }}>
                            <div>
                                <div className="mb-1" style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text3 }}>
                                    Endurance Ration · Zero Prep
                                </div>
                                <h3 className="mb-4" style={{ ...oswald, fontSize: '2.6rem', fontWeight: 700, letterSpacing: '0.04em', color: C.text }}>
                                    JERKY CRISP
                                </h3>
                                <p className="mb-6 leading-relaxed" style={{ color: C.text2, fontSize: '0.92rem' }}>
                                    Dry-cured prosciutto + sweet potato chia matrix. A high-sodium endurance ration for 55-hour pushes and the deep pantry. No cooking. No refrigeration. No excuses.
                                </p>

                                {/* Macro grid */}
                                <div className="grid grid-cols-5 gap-1.5 mb-6">
                                    {[{ val: '180', lbl: 'Cal' }, { val: '10g', lbl: 'Protein' }, { val: '24g', lbl: 'Carbs' }, { val: '5g', lbl: 'Fat' }, { val: '0', lbl: 'Prep' }].map((m, i) => (
                                        <div key={i} className="text-center p-2" style={{ background: C.dark, border: `1px solid ${C.border}` }}>
                                            <div style={{ ...oswald, color: C.orange, fontSize: '0.95rem', fontWeight: 700 }}>{m.val}</div>
                                            <div style={{ ...mono, color: C.text3, fontSize: '0.52rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{m.lbl}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pb-6 mb-6 border-b" style={{ borderColor: C.border }}>
                                    <div style={{ ...oswald, color: C.orange, fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>From $26</div>
                                    <div style={{ ...mono, color: C.text3, fontSize: '0.62rem', letterSpacing: '0.08em', marginTop: 4 }}>6-pack · ~$4.33 / bar · Vacuum-sealed Mylar</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <a href="/jerkycrisp/" className="flex-1 text-center font-bold py-4 transition-all" style={{ ...oswald, background: C.orange, color: C.dark, letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: 140, fontSize: '0.9rem' }}>
                                    Secure Your Ration →
                                </a>
                                <a href="/jerkycrisp/#specs" className="px-5 py-4 border font-bold transition-all text-center" style={{ ...oswald, background: 'transparent', color: C.orange, borderColor: C.goldBorder, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                                    Field Data
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ 3 STAGES ═════════════════════════════════════════════════ */}
            <section style={{ background: C.dark }}>
                <div className="max-w-5xl mx-auto px-6 py-20">
                    <Eyebrow>The PrepRigs Framework</Eyebrow>
                    <h2 className="mb-4" style={{ ...oswald, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '0.04em' }}>
                        3 Modules of <span style={{ color: C.orange }}>Readiness.</span>
                    </h2>
                    <p className="mb-10 max-w-xl leading-relaxed" style={{ color: C.text2, fontSize: '0.95rem' }}>
                        Every rig starts somewhere. Stack your modules at your own pace — 72 hours, 2 weeks, or full-spectrum long-term.
                    </p>

                    {/* Tab row */}
                    <div className="flex gap-2 mb-0">
                        {STAGES.map((s, i) => (
                            <button key={i} onClick={() => setActiveStage(i)} className="flex-1 py-3 font-bold transition-all border" style={{ ...oswald, fontSize: '0.85rem', letterSpacing: '0.08em', background: activeStage === i ? C.orange : C.card, color: activeStage === i ? C.dark : C.text2, borderColor: activeStage === i ? C.orange : C.border }}>
                                {s.who}
                            </button>
                        ))}
                    </div>

                    {/* Stage panels */}
                    {STAGES.map((stage, i) => (
                        <div key={i} className={activeStage === i ? 'block' : 'hidden'}>
                            <div className="p-8 border border-t-0 grid grid-cols-1 md:grid-cols-2 gap-10" style={{ background: C.card, borderColor: C.goldBorder }}>
                                <div>
                                    <div className="mb-3" style={{ ...mono, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.orange }}>
                                        Module {stage.number}
                                    </div>
                                    <h3 className="mb-2" style={{ ...oswald, fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.04em' }}>{stage.name}</h3>
                                    <p className="mb-4" style={{ color: C.orange, fontSize: '0.85rem', fontStyle: 'italic' }}>{stage.tagline}</p>
                                    <p className="leading-relaxed" style={{ color: C.text2, fontSize: '0.92rem' }}>{stage.description}</p>
                                </div>
                                <div>
                                    <div className="mb-5 space-y-3">
                                        {stage.goals.map((g, j) => (
                                            <div key={j} className="flex items-start gap-3">
                                                <span style={{ color: C.orange, fontSize: '0.75rem', marginTop: 3, flexShrink: 0 }}>→</span>
                                                <span style={{ color: C.text2, fontSize: '0.88rem' }}>{g}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setAuthMode('signup')} className="w-full py-3 font-bold border transition-all" style={{ ...oswald, background: 'transparent', color: C.orange, borderColor: C.goldBorder, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.88rem' }}>
                                        Start Module {stage.number} — Free →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ IMAGE BREAK ══════════════════════════════════════════════ */}
            <section className="px-6 py-8" style={{ background: C.dark2 }}>
                <div className="max-w-5xl mx-auto overflow-hidden border" style={{ borderColor: C.border }}>
                    <img src="/images/field_tested.png" alt="Field Tested · Real Food · Real Gear" className="w-full object-cover" />
                </div>
            </section>

            {/* ═══ PLATFORM FEATURES ════════════════════════════════════════ */}
            <section style={{ background: C.dark2 }}>
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <Eyebrow>The Platform</Eyebrow>
                    <h2 className="mb-12" style={{ ...oswald, fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 700, letterSpacing: '0.04em' }}>
                        Your Rig. <span style={{ color: C.orange }}>Your Modules.</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="p-5 border transition-all" style={{ background: C.card, borderColor: C.border }}>
                                <div className="text-2xl mb-3">{f.icon}</div>
                                <div className="font-bold mb-2" style={{ ...oswald, color: C.text, letterSpacing: '0.05em', fontSize: '0.95rem' }}>{f.title}</div>
                                <div style={{ color: C.text3, fontSize: '0.82rem', lineHeight: 1.7 }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ DUAL CTA ═════════════════════════════════════════════════ */}
            <section style={{ background: C.dark }}>
                <div className="max-w-5xl mx-auto px-6 py-20">
                    <div className="flex flex-col md:flex-row border overflow-hidden" style={{ borderColor: C.goldBorder }}>
                        {/* Jerky Crisp side */}
                        <div className="flex-1 p-10 border-b md:border-b-0 md:border-r" style={{ background: 'linear-gradient(135deg, rgba(255,152,0,0.07), transparent)', borderColor: C.goldBorder }}>
                            <Eyebrow>Prep Nutrients</Eyebrow>
                            <h2 className="mb-4" style={{ ...oswald, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700 }}>
                                Fuel Like You<br /><span style={{ color: C.orange }}>Mean It.</span>
                            </h2>
                            <p className="mb-8 leading-relaxed" style={{ color: C.text2, fontSize: '0.9rem' }}>
                                Small-batch, artisan survival food crafted for those who push the limits. Zero prep. Shelf-stable. Field-ready.
                            </p>
                            <a href="/jerkycrisp/" className="inline-flex items-center gap-2 font-bold py-4 px-8 transition-all" style={{ ...oswald, background: C.orange, color: C.dark, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.95rem' }}>
                                Shop Jerky Crisp →
                            </a>
                        </div>
                        {/* Platform side */}
                        <div className="flex-1 p-10" style={{ background: 'linear-gradient(135deg, rgba(43,58,39,0.18), transparent)' }}>
                            <Eyebrow>PrepRigs Platform</Eyebrow>
                            <h2 className="mb-4" style={{ ...oswald, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700 }}>
                                Build Your<br /><span style={{ color: C.orange }}>Entire Rig.</span>
                            </h2>
                            <p className="mb-8 leading-relaxed" style={{ color: C.text2, fontSize: '0.9rem' }}>
                                Inventory, checklists, AI scanning — the complete platform for managing your preparedness stack. Free to start.
                            </p>
                            <div className="flex flex-wrap gap-3 items-center">
                                <button onClick={() => setAuthMode('signup')} className="font-bold py-4 px-8 border transition-all" style={{ ...oswald, background: 'transparent', color: C.orange, borderColor: C.goldBorder, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.95rem' }}>
                                    Start Free →
                                </button>
                                <button onClick={() => handleDemo('beginner')} className="font-bold py-4 px-4 transition-all" style={{ ...mono, background: 'transparent', color: C.text3, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    ▶ Try Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══════════════════════════════════════════════════ */}
            <footer className="border-t" style={{ background: C.dark, borderColor: C.border }}>
                <div className="max-w-5xl mx-auto px-6 py-12 flex flex-wrap justify-between gap-10">
                    <div>
                        <div style={{ ...oswald, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.15em', color: C.text }}>PREP RIGS</div>
                        <div style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text3, marginTop: 4, marginBottom: 16 }}>Modular Preparedness · Field Rations</div>
                        <div style={{ ...mono, color: C.text3, fontSize: '0.65rem' }}>© 2026 PrepRigs. All rights reserved.</div>
                    </div>
                    <div className="flex gap-12">
                        <div>
                            <div style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text3, marginBottom: 14 }}>Nutrients</div>
                            <a href="/jerkycrisp/" className="block mb-2 transition-colors" style={{ color: C.text2, fontSize: '0.85rem' }}>Jerky Crisp</a>
                            <a href="/jerkycrisp/#order" className="block mb-2 transition-colors" style={{ color: C.text2, fontSize: '0.85rem' }}>Order Now</a>
                            <a href="/jerkycrisp/#specs" className="block mb-2 transition-colors" style={{ color: C.text2, fontSize: '0.85rem' }}>Field Data</a>
                        </div>
                        <div>
                            <div style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text3, marginBottom: 14 }}>Platform</div>
                            <button onClick={() => setAuthMode('signup')} className="block mb-2 text-left w-full transition-colors" style={{ color: C.text2, fontSize: '0.85rem' }}>Sign Up Free</button>
                            <button onClick={() => handleDemo('beginner')} className="block mb-2 text-left w-full transition-colors" style={{ color: C.text2, fontSize: '0.85rem' }}>Try Demo</button>
                            <button onClick={() => onNavigate('pricing')} className="block mb-2 text-left w-full transition-colors" style={{ color: C.text2, fontSize: '0.85rem' }}>Pricing</button>
                            <button onClick={() => onNavigate('terms')} className="block mb-2 text-left w-full transition-colors" style={{ color: C.text2, fontSize: '0.85rem' }}>Terms</button>
                            <button onClick={() => onNavigate('privacy')} className="block mb-2 text-left w-full transition-colors" style={{ color: C.text2, fontSize: '0.85rem' }}>Privacy</button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ═══ AUTH MODAL ═══════════════════════════════════════════════ */}
            {authMode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-5" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}>
                    <div className="w-full max-w-sm relative border p-8" style={{ background: C.card, borderColor: C.goldBorder }}>
                        <button
                            onClick={() => { setAuthMode(null); setAuthError(''); setAuthMessage(''); if (onAuthModeClear) onAuthModeClear(); }}
                            className="absolute top-4 right-4 transition-colors"
                            style={{ color: C.text3, fontSize: '1.1rem' }}
                        >✕</button>

                        <div style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.orange, marginBottom: 6 }}>PrepRigs</div>
                        <h3 className="mb-8" style={{ ...oswald, fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                            {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
                        </h3>

                        {(authMode === 'login' || authMode === 'signup') && (
                            <>
                                <button onClick={handleGoogleLogin} disabled={loggingIn} className="w-full flex items-center justify-center gap-3 font-bold py-3.5 mb-6 transition-all" style={{ background: '#fff', color: '#000', fontSize: '0.9rem' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex-1 h-px" style={{ background: C.border }} />
                                    <div style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.12em', color: C.text3 }}>OR EMAIL</div>
                                    <div className="flex-1 h-px" style={{ background: C.border }} />
                                </div>
                            </>
                        )}

                        {authError   && <div className="text-xs mb-4 p-3 border leading-relaxed" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }}>{authError}</div>}
                        {authMessage && <div className="text-xs mb-4 p-3 border leading-relaxed" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)' }}>{authMessage}</div>}

                        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1.5" style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.text3 }}>Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                                    className="w-full px-4 py-3 text-sm outline-none transition-all"
                                    style={{ background: C.dark, border: `1px solid ${C.border}`, color: C.text }} />
                            </div>
                            {authMode !== 'forgot_password' && (
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.text3 }}>Password</label>
                                        {authMode === 'login' && (
                                            <button type="button" onClick={() => { setAuthMode('forgot_password'); setAuthError(''); setAuthMessage(''); }} style={{ ...mono, fontSize: '0.6rem', color: C.orange }}>Forgot?</button>
                                        )}
                                    </div>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                                        className="w-full px-4 py-3 text-sm outline-none transition-all"
                                        style={{ background: C.dark, border: `1px solid ${C.border}`, color: C.text }} />
                                </div>
                            )}
                            <button type="submit" disabled={loggingIn} className="w-full font-bold py-4 mt-1 transition-all" style={{ ...oswald, background: C.orange, color: C.dark, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.95rem' }}>
                                {loggingIn ? 'Processing…' : authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-xs" style={{ color: C.text3 }}>
                            {authMode === 'login' ? (
                                <>Don't have an account? <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} className="font-bold ml-1" style={{ color: C.orange }}>Sign up</button></>
                            ) : authMode === 'signup' ? (
                                <>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="font-bold ml-1" style={{ color: C.orange }}>Sign in</button></>
                            ) : (
                                <button onClick={() => { setAuthMode('login'); setAuthError(''); setAuthMessage(''); }} className="font-bold" style={{ color: C.text2 }}>← Back to sign in</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
