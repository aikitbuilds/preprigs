import { ArrowLeft, Check, X, Zap, ShieldCheck } from 'lucide-react';

interface PricingProps {
    onBack: () => void;
    onSignUp: () => void;
}

export function Pricing({ onBack, onSignUp }: PricingProps) {
    return (
        <div className="min-h-screen bg-background text-white overflow-x-hidden">
            {/* Nav */}
            <nav className="flex items-center px-5 py-4 border-b border-white/5 bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-5 pt-12 pb-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4">
                        Simple Pricing.<br />
                        <span className="text-primary">Built for Survival.</span>
                    </h1>
                    <p className="text-slate-400 text-base max-w-lg mx-auto">
                        Start for free to build your foundation, or go Premium to unlock the advanced systems you need to thrive.
                    </p>
                </div>

                {/* Founder's Promo Banner */}
                <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-surface border border-primary/30 rounded-2xl p-6 mb-12 text-center relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                            Limited Time Offer
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Claim Your Founder's Club Status</h2>
                        <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed mb-6">
                            We are giving away <strong>Lifetime Premium</strong> to our first 1,000 users. Simply create a free account today and complete your first Rig to unlock Founder Status forever.
                        </p>
                        <button
                            onClick={onSignUp}
                            className="bg-primary text-black font-black px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-all text-sm uppercase tracking-wider"
                        >
                            Claim Lifetime Premium 🔥
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Free Card */}
                    <div className="bg-surface border border-white/5 rounded-3xl p-8 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2">Basic Protocol</h3>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-4xl font-black text-white">Free</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2 min-h-[40px]">
                            Everything you need to build a 72-hour survival kit and track basic supplies.
                        </p>
                        
                        <div className="space-y-4 mb-8 flex-1">
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-success mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Food & Water Rig Tracking</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-success mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Standard Checklists (All Stages)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-success mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Basic Manual Inventory Log</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-600">
                                <X size={18} className="shrink-0" />
                                <span className="text-sm">Medical, Protection & Utility Rigs</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-600">
                                <X size={18} className="shrink-0" />
                                <span className="text-sm">AI Photo Scanner</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-600">
                                <X size={18} className="shrink-0" />
                                <span className="text-sm">Data Offline Export (CSV backups)</span>
                            </div>
                        </div>

                        <button
                            onClick={onSignUp}
                            className="w-full bg-white/5 border border-white/10 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors shrink-0"
                        >
                            Get Started Free
                        </button>
                    </div>

                    {/* Premium Card */}
                    <div className="bg-gradient-to-b from-surface to-background border border-primary/50 border-t-primary rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-[0_10px_40px_rgba(249,115,22,0.1)]">
                        <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-widest uppercase">
                            Premium
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">Full Protocol <Zap size={16} className="text-primary fill-primary/20" /></h3>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-black text-white">$0</span>
                            <span className="text-slate-500 line-through text-lg">$9.99/mo</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed min-h-[40px]">
                            Complete access to advanced category tracking, AI scanning, and offline data redundancy.
                        </p>
                        
                        <div className="space-y-4 mb-8 flex-1">
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-200 font-medium">Everything in Basic Protocol, plus:</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Unlock Medical, Protection & Utility Rigs</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">AI Photo Scanner for Fast Logging</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Secure Offline CSV Data Exports</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300">Advanced Status & Value Analytics</span>
                            </div>
                        </div>

                        <button
                            onClick={onSignUp}
                            className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0"
                        >
                            Claim Free Premium NOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
