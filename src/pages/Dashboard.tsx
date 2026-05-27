import { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useChecklistStore } from '../store/useChecklistStore';
import { Checklist } from '../types';
import { Check, ChevronDown, ChevronRight, Monitor, Smartphone, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { BlogSection } from '../components/BlogSection';
import { PrepRoadmap } from '../components/PrepRoadmap';
import { QuickStartWizard } from '../components/QuickStartWizard';
import { StarterKits } from '../components/StarterKits';

// Threat scenario data
const THREATS = [
    {
        id: 'hurricane',
        name: 'Hurricane / Flood',
        icon: '🌀',
        color: 'from-blue-600/20 to-blue-900/10 border-blue-500/30',
        level: 'HIGH',
        levelColor: 'text-blue-400',
        checklistReq: 'full-evac-1',
        tips: ['Evacuate early — traffic stalls fast', 'Fill bathtubs with water before landfall', 'Move critical docs to waterproof bag', 'Charge all devices 48 hrs before'],
    },
    {
        id: 'grid-down',
        name: 'Grid Down / Blackout',
        icon: '⚡',
        color: 'from-yellow-600/20 to-yellow-900/10 border-yellow-500/30',
        level: 'MEDIUM',
        levelColor: 'text-yellow-400',
        checklistReq: 'bug-in-1',
        tips: ['Keep generator fuel rotated (Sta-Bil)', 'Manual can opener in every kit', 'Freeze water jugs as backup refrigerant', 'Cash on hand — ATMs go offline too'],
    },
    {
        id: 'pandemic',
        name: 'Pandemic / Bio Threat',
        icon: '🦠',
        color: 'from-green-600/20 to-green-900/10 border-green-500/30',
        level: 'MEDIUM',
        levelColor: 'text-green-400',
        checklistReq: 'bug-in-1',
        tips: ['N95 masks for all family members', 'Stock 90-day prescription supply', 'Avoid crowded places in early outbreak', 'Pulse oximeter + thermometer in kit'],
    },
    {
        id: 'civil-unrest',
        name: 'Civil Unrest',
        icon: '🔥',
        color: 'from-orange-600/20 to-orange-900/10 border-orange-500/30',
        level: 'LOW',
        levelColor: 'text-orange-400',
        checklistReq: 'bug-in-1',
        tips: ['Know 2+ exit routes from your city', 'Avoid broadcasting on social media', 'Keep fuel tank above half at all times', 'Plan meeting point if separated'],
    },
    {
        id: 'ww3',
        name: 'WW3 / Major Conflict',
        icon: '🌐',
        color: 'from-red-600/20 to-red-900/10 border-red-500/30',
        level: 'LOW',
        levelColor: 'text-red-400',
        checklistReq: 'bug-in-1',
        tips: ['Deep pantry (6–12 months of food)', 'Off-grid water source planning', 'Faraday bag for critical electronics', 'Shortwave radio for news when internet is down'],
    },
    {
        id: 'zombie',
        name: 'SHTF / Zombie Apocalypse',
        icon: '🧟',
        color: 'from-purple-600/20 to-purple-900/10 border-purple-500/30',
        level: 'PLAN FOR IT',
        levelColor: 'text-purple-400',
        checklistReq: 'full-evac-1',
        tips: ['A well-prepped family handles any scenario', 'Community is your greatest survival asset', 'Learn to grow food & preserve it', 'Skills > stuff. Practice using your gear.'],
    },
];

const LEVEL_ORDER: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1, 'PLAN FOR IT': 0 };

const CATEGORY_COLORS: Record<string, string> = {
    Food: '#f97316',
    Water: '#3b82f6',
    Medical: '#ef4444',
    Protection: '#a855f7',
    Utility: '#64748b',
};

interface ThreatCardProps {
    threat: typeof THREATS[0];
    checklist?: Checklist;
    onToggleItem: (checklistId: string, itemId: string, completed: boolean) => void;
}

function ThreatCard({ threat, checklist, onToggleItem }: ThreatCardProps) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className={`rounded-2xl border bg-gradient-to-br ${threat.color} overflow-hidden cursor-pointer flex flex-col group transition-all hover:shadow-lg`} onClick={() => setExpanded(e => !e)}>
            <div className="flex items-center gap-3 p-4">
                <span className="text-3xl group-hover:scale-110 transition-transform">{threat.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm">{threat.name}</div>
                    <div className={`text-[10px] font-black mt-0.5 uppercase tracking-wider ${threat.levelColor}`}>
                        {threat.level} RISK
                    </div>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    {expanded ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-slate-500" />}
                </div>
            </div>
            {expanded && (
                <div
                    className="px-4 pb-4 border-t border-white/5 cursor-default bg-black/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3 mt-4">
                        Action Protocol: {checklist ? checklist.title.split(':')[0] : 'Prep Actions'}
                    </div>

                    {checklist ? (
                        <div className="space-y-1 bg-surface/80 rounded-xl p-2 max-h-64 overflow-y-auto">
                            {checklist.items.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => onToggleItem(checklist.id, item.id, !item.completed)}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                                >
                                    <button
                                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${item.completed
                                            ? 'bg-success border-success text-slate-900'
                                            : 'border-slate-500 text-transparent hover:border-slate-400'
                                            }`}
                                    >
                                        <Check size={12} strokeWidth={3} />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-medium transition-colors ${item.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                                            {item.text}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">{item.notes}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {threat.tips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <span className="text-slate-500 mt-0.5 flex-shrink-0">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

import { useUIStore } from '../store/useUIStore';

interface DashboardProps {
    userProfile?: UserProfile | null;
}

export function Dashboard({ userProfile }: DashboardProps) {
    const items = useInventoryStore(state => state.items);
    const checklists = useChecklistStore(state => state.checklists);
    const updateChecklist = useChecklistStore(state => state.updateChecklist);

    const [isClaiming, setIsClaiming] = useState(false);

    const handleClaimFounder = async () => {
        if (!userProfile?.uid) return;
        setIsClaiming(true);
        try {
            await updateDoc(doc(db, 'users', userProfile.uid), { accountTier: 'founder' });
        } catch (e) {
            console.error("Error claiming founder status:", e);
        } finally {
            setIsClaiming(false);
        }
    };

    // Toggle for desktop/mobile views
    const isDesktopView = useUIStore(state => state.isDesktopView);
    const setDesktopView = useUIStore(state => state.setDesktopView);

    const handleToggleItem = (checklistId: string, itemId: string, completed: boolean) => {
        const checklist = checklists.find(c => c.id === checklistId);
        if (!checklist) return;

        const newItems = checklist.items.map(item =>
            item.id === itemId ? { ...item, completed } : item
        );
        updateChecklist(checklistId, { items: newItems });
    };

    const totalValue = items.reduce((sum, i) => sum + i.costPerUnit * i.quantity, 0);
    const totalCalories = items.reduce((sum, i) => sum + i.calories * i.quantity, 0);
    const daysOfFood = Math.floor(totalCalories / (4 * 2000));

    const checklistProgress = checklists.map(c => {
        const done = c.items.filter(i => i.completed).length;
        const total = c.items.length;
        return { title: c.title, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
    });

    const overallReadiness = checklistProgress.length > 0
        ? Math.round(checklistProgress.reduce((s, c) => s + c.pct, 0) / checklistProgress.length)
        : 0;

    // Chart Data Preparation
    const categoryDataMap: Record<string, { name: string, value: number, calories: number, count: number }> = {};
    items.forEach(item => {
        const cat = item.category || 'Utility';
        if (!categoryDataMap[cat]) categoryDataMap[cat] = { name: cat, value: 0, calories: 0, count: 0 };
        categoryDataMap[cat].value += (item.costPerUnit * item.quantity);
        categoryDataMap[cat].calories += (item.calories * item.quantity);
        categoryDataMap[cat].count += item.quantity;
    });

    const chartData = Object.values(categoryDataMap).sort((a, b) => b.value - a.value);

    return (
        <div className={`flex flex-col pb-24 bg-background min-h-full transition-all duration-300 ${isDesktopView ? 'p-8 max-w-7xl mx-auto w-full' : ''}`}>

            {/* View Toggle Bar */}
            <div className={`flex items-center justify-between border-b border-white/5 bg-surface/50 backdrop-blur-sm sticky top-0 z-10 ${isDesktopView ? 'rounded-2xl mb-6 p-4 border border-white/10' : 'p-4'}`}>
                <div>
                    <h1 className="text-xl font-bold text-white">Commander Dashboard</h1>
                    <p className="text-xs text-slate-400">Overview & Analytics</p>
                </div>

                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setDesktopView(false)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!isDesktopView ? 'bg-primary text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Smartphone size={14} /> Mobile
                    </button>
                    <button
                        onClick={() => setDesktopView(true)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDesktopView ? 'bg-primary text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Monitor size={14} /> Desktop Analytics
                    </button>
                </div>
            </div>

            <div className={isDesktopView ? 'grid grid-cols-12 gap-6' : 'flex flex-col'}>
                {/* Left Column in Desktop / Top in Mobile */}
                <div className={isDesktopView ? 'col-span-8 space-y-6' : ''}>

                    {/* Claim Founder Banner */}
                    {userProfile && (!userProfile.accountTier || userProfile.accountTier === 'free') && (
                        <div className={`mt-4 ${isDesktopView ? '' : 'mx-4'} bg-gradient-to-r from-primary/20 via-primary/5 to-surface border border-primary/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(249,115,22,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group`}>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                                    <ShieldCheck size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">Claim Your Founder's Badge & Lifetime Premium</h3>
                                    <p className="text-sm text-slate-300">As one of our first 1,000 active members, complete your first Rig to unlock all advanced medical, protection, and security modules for life. Or unlock them now via this demo switch.</p>
                                </div>
                            </div>
                            <div className="relative z-10 shrink-0 self-start md:self-center">
                                <button
                                    onClick={handleClaimFounder}
                                    disabled={isClaiming}
                                    className="bg-primary text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-50"
                                >
                                    {isClaiming ? 'Claiming...' : 'Unlock Founder Tier'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Readiness Banner */}
                    <div className={`mt-4 bg-gradient-to-br from-primary/10 to-surface border-white/5 ${isDesktopView ? 'rounded-2xl border p-6' : 'border-b p-5'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Readiness</div>
                                <div className="text-4xl font-black text-white mt-1">
                                    {overallReadiness}<span className="text-xl text-slate-400">%</span>
                                </div>
                            </div>
                            {/* SVG Readiness Ring */}
                            <div className="relative w-24 h-24">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                    <circle
                                        cx="18" cy="18" r="15.9" fill="none"
                                        stroke={overallReadiness > 66 ? '#10b981' : overallReadiness > 33 ? '#3b82f6' : '#ef4444'}
                                        strokeWidth="3" strokeLinecap="round"
                                        strokeDasharray={`${overallReadiness} 100`}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">{overallReadiness}%</span>
                            </div>
                        </div>
                        {/* Checklist Progress Pills */}
                        <div className="flex flex-wrap gap-2">
                            {checklistProgress.map(c => (
                                <div key={c.title} className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1 border border-white/5">
                                    <div className="text-xs text-slate-400 truncate max-w-[8rem]">{c.title}</div>
                                    <div className={`text-xs font-bold ${c.pct === 100 ? 'text-success' : 'text-primary'}`}>{c.pct}%</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Prep Roadmap */}
                    <PrepRoadmap items={items} checklists={checklists} isDesktopView={isDesktopView} />

                    {/* Quick Start Wizard — First 72 Hours */}
                    <QuickStartWizard isDesktopView={isDesktopView} />

                    {/* Budget Starter Kits */}
                    <StarterKits isDesktopView={isDesktopView} />

                    {/* Quick Stats Bar */}
                    <div className={isDesktopView ? 'grid grid-cols-3 gap-4' : 'grid grid-cols-3 border-b border-white/5'}>
                        {[
                            { label: 'Invested', value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'text-success' },
                            { label: 'Days of Food', value: daysOfFood > 0 ? `${daysOfFood}d` : '—', color: 'text-primary' },
                            { label: 'Total Items', value: String(items.length), color: 'text-slate-200' },
                        ].map(s => (
                            <div key={s.label} className={`flex flex-col items-center justify-center ${isDesktopView ? 'bg-surface border border-white/5 rounded-2xl p-6 shadow-sm' : 'py-5 border-r border-white/5 last:border-0'}`}>
                                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Prep Academy Blog ── */}
                    <div className={isDesktopView ? '' : 'p-4'}>
                        <div className="bg-surface rounded-2xl border border-white/5 p-4 shadow-sm">
                            <BlogSection />
                        </div>
                    </div>

                    {/* DESKTOP ONLY: Data Visualization */}
                    {isDesktopView && (
                        <div className="grid grid-cols-2 gap-6">
                            {/* Asset Allocation Pie Chart */}
                            <div className="bg-surface rounded-2xl border border-white/5 p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-white mb-4">Asset Value Allocation</h3>
                                <div className="h-64">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: any) => [`$${Number(value || 0).toFixed(2)}`, 'Value']}
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-sm text-slate-500">No inventory data</div>
                                    )}
                                </div>
                                {/* Legend */}
                                <div className="flex flex-wrap gap-3 justify-center mt-2">
                                    {chartData.map(entry => (
                                        <div key={entry.name} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.name] || '#64748b' }} />
                                            {entry.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Calorie Distribution Bar Chart */}
                            <div className="bg-surface rounded-2xl border border-white/5 p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-white mb-4">Calorie Distribution</h3>
                                <div className="h-64">
                                    {chartData.some(d => d.calories > 0) ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                                                <Tooltip
                                                    cursor={{ fill: '#1e293b' }}
                                                    formatter={(value: any) => [`${Number(value || 0).toLocaleString()} cal`, 'Calories']}
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                                />
                                                <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-sm text-slate-500">No calorie data</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>



                {/* Right Column in Desktop / Bottom in Mobile */}
                <div className={isDesktopView ? 'col-span-4' : 'p-4'}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white">Risk Scenarios</h2>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Tap to expand</span>
                    </div>
                    <div className="space-y-3">
                        {[...THREATS].sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]).map(threat => {
                            const targetChecklist = checklists.find(c => c.id === threat.checklistReq);
                            return (
                                <ThreatCard
                                    key={threat.id}
                                    threat={threat}
                                    checklist={targetChecklist}
                                    onToggleItem={handleToggleItem}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
