import { InventoryItem, Checklist } from '../types';
import { BADGES } from '../lib/badges';
import { Check, ChevronRight, Lock, Zap, Shield, Warehouse, Package, Flame } from 'lucide-react';

interface PrepRoadmapProps {
    items: InventoryItem[];
    checklists: Checklist[];
    isDesktopView?: boolean;
}

interface PhaseData {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    glowColor: string;
    borderColor: string;
    bgColor: string;
    progress: number;
    status: 'COMPLETE' | 'IN PROGRESS' | 'NOT STARTED';
    stats: { label: string; value: string }[];
    tips: string[];
}

function computePhases(items: InventoryItem[], checklists: Checklist[]): PhaseData[] {
    // Checklist helpers
    const getChecklistProgress = (id: string) => {
        const cl = checklists.find(c => c.id === id);
        if (!cl || cl.items.length === 0) return 0;
        return Math.round((cl.items.filter(i => i.completed).length / cl.items.length) * 100);
    };

    const getChecklistDone = (id: string) => {
        const cl = checklists.find(c => c.id === id);
        if (!cl) return { done: 0, total: 0 };
        return { done: cl.items.filter(i => i.completed).length, total: cl.items.length };
    };

    // Inventory helpers
    const totalCalories = items.reduce((sum, i) => sum + i.calories * i.quantity, 0);
    const daysOfFood = Math.floor(totalCalories / (4 * 2000)); // Assuming 4 people, 2000 cal/day
    const totalValue = items.reduce((sum, i) => sum + i.costPerUnit * i.quantity, 0);
    const earnedBadges = BADGES.filter(b => b.check(items)).length;

    // --- PHASE 1: The Basics (72-Hour Kit) ---
    const bugoutProgress = getChecklistProgress('bugout-bag-1');
    const bugoutStats = getChecklistDone('bugout-bag-1');

    const phase1Progress = bugoutProgress;
    const phase1Status: PhaseData['status'] =
        phase1Progress >= 100 ? 'COMPLETE' :
            phase1Progress > 0 ? 'IN PROGRESS' : 'NOT STARTED';

    // --- PHASE 2: Resiliency (30-Day Supply) ---
    const rollingProgress = getChecklistProgress('rolling-suitcase-1');
    const buginProgress = getChecklistProgress('bug-in-1');
    const evacProgress = getChecklistProgress('full-evac-1');
    const protectionProgress = getChecklistProgress('protection-defense-1');

    const rollingStats = getChecklistDone('rolling-suitcase-1');
    const buginStats = getChecklistDone('bug-in-1');

    const phase2Raw = Math.round((rollingProgress + buginProgress + evacProgress + protectionProgress) / 4);
    const phase2FoodBonus = Math.min(100, (daysOfFood / 14) * 100);
    const phase2Progress = Math.round((phase2Raw * 0.7) + (phase2FoodBonus * 0.3));
    const phase2Status: PhaseData['status'] =
        phase2Progress >= 100 ? 'COMPLETE' :
            phase2Progress > 0 ? 'IN PROGRESS' : 'NOT STARTED';

    // --- PHASE 3: Deep Storage (6-12 Months) ---
    const deepPantryProgress = getChecklistProgress('deep-pantry-1');
    const deepPantryStats = getChecklistDone('deep-pantry-1');

    const phase3FoodBonus = Math.min(100, (daysOfFood / 90) * 100);
    const phase3Progress = Math.round((deepPantryProgress * 0.6) + (phase3FoodBonus * 0.4));
    const phase3Status: PhaseData['status'] =
        phase3Progress >= 100 ? 'COMPLETE' :
            phase3Progress > 0 ? 'IN PROGRESS' : 'NOT STARTED';

    return [
        {
            id: 'phase-1',
            number: 1,
            title: 'The Basics',
            subtitle: '72-Hour Bugout Kit',
            description: 'Build your grab-and-go foundation — 72 hours of survival for every family member.',
            icon: <Package size={20} />,
            color: 'text-blue-400',
            glowColor: 'shadow-blue-500/20',
            borderColor: 'border-blue-500/40',
            bgColor: 'from-blue-600/10 to-blue-900/5',
            progress: phase1Progress,
            status: phase1Status,
            stats: [
                { label: 'Bugout Bag', value: `${bugoutStats.done}/${bugoutStats.total}` },
                { label: 'Badges Earned', value: `${earnedBadges}/${BADGES.length}` },
            ],
            tips: [
                'Focus on water first — 1 gallon per person per day',
                'Get a basic first aid kit before anything else',
                'Pack 2,000 calories per person per day minimum',
            ],
        },
        {
            id: 'phase-2',
            number: 2,
            title: 'Resiliency',
            subtitle: '14–30 Day Supply',
            description: 'Extend your supplies to comfortably ride out regional disasters and prolonged outages.',
            icon: <Shield size={20} />,
            color: 'text-primary',
            glowColor: 'shadow-orange-500/20',
            borderColor: 'border-primary/40',
            bgColor: 'from-orange-600/10 to-orange-900/5',
            progress: phase2Progress,
            status: phase2Status,
            stats: [
                { label: 'Rolling Suitcase', value: `${rollingStats.done}/${rollingStats.total}` },
                { label: 'Bug-In Readiness', value: `${buginStats.done}/${buginStats.total}` },
                { label: 'Days of Food', value: `${daysOfFood}d` },
            ],
            tips: [
                'Start your rolling suitcase kit for vehicle evacuations',
                'Harden your home with the Bug-In checklist',
                'Target 14+ days of food before moving to Phase 3',
            ],
        },
        {
            id: 'phase-3',
            number: 3,
            title: 'Deep Storage',
            subtitle: '6–12 Month Self-Sufficiency',
            description: 'True resilience — long-term food storage, off-grid capability, and community-level preparedness.',
            icon: <Warehouse size={20} />,
            color: 'text-emerald-400',
            glowColor: 'shadow-emerald-500/20',
            borderColor: 'border-emerald-500/40',
            bgColor: 'from-emerald-600/10 to-emerald-900/5',
            progress: phase3Progress,
            status: phase3Status,
            stats: [
                { label: 'Deep Pantry', value: `${deepPantryStats.done}/${deepPantryStats.total}` },
                { label: 'Total Invested', value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                { label: 'Food Reserve', value: `${daysOfFood}d` },
            ],
            tips: [
                'Buy in bulk when on sale — rice, beans, oats',
                'Use Mylar bags + oxygen absorbers for 25-year storage',
                'Start a seed vault for long-term food independence',
            ],
        },
    ];
}

function StatusBadge({ status }: { status: PhaseData['status'] }) {
    if (status === 'COMPLETE') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Check size={10} strokeWidth={3} /> Complete
            </span>
        );
    }
    if (status === 'IN PROGRESS') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                <Zap size={10} /> In Progress
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-slate-500 border border-white/10">
            <Lock size={10} /> Not Started
        </span>
    );
}

export function PrepRoadmap({ items, checklists, isDesktopView }: PrepRoadmapProps) {
    const phases = computePhases(items, checklists);

    // Find the current active phase (first incomplete one)
    const activePhaseIndex = phases.findIndex(p => p.status !== 'COMPLETE');
    const currentPhaseIndex = activePhaseIndex === -1 ? phases.length - 1 : activePhaseIndex;

    return (
        <div className={`${isDesktopView ? 'bg-surface rounded-2xl border border-white/5 p-6 shadow-sm' : 'border-b border-white/5 p-5'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Flame size={18} className="text-primary" />
                        Your Prep Roadmap
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                        Phase {currentPhaseIndex + 1} of {phases.length} Active
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    {phases.map((phase, i) => (
                        <div
                            key={phase.id}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${phase.status === 'COMPLETE' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' :
                                    i === currentPhaseIndex ? 'bg-primary shadow-[0_0_6px_rgba(234,88,12,0.5)]' :
                                        'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
                {phases.map((phase, index) => {
                    const isActive = index === currentPhaseIndex;
                    const isComplete = phase.status === 'COMPLETE';
                    const isLast = index === phases.length - 1;

                    return (
                        <div key={phase.id} className="relative flex gap-4">
                            {/* Timeline Line & Node */}
                            <div className="flex flex-col items-center flex-shrink-0 w-10">
                                {/* Node */}
                                <div className={`
                                    relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all
                                    ${isComplete
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                                        : isActive
                                            ? `bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(234,88,12,0.2)]`
                                            : 'bg-white/5 border-white/10 text-slate-600'
                                    }
                                `}>
                                    {isComplete ? <Check size={18} strokeWidth={3} /> : phase.icon}
                                </div>
                                {/* Connector Line */}
                                {!isLast && (
                                    <div className={`w-0.5 flex-1 min-h-[20px] transition-all ${isComplete ? 'bg-emerald-500/40' : 'bg-white/10'
                                        }`} />
                                )}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                                <div className={`
                                    rounded-xl border p-4 transition-all
                                    ${isActive
                                        ? `bg-gradient-to-br ${phase.bgColor} ${phase.borderColor} shadow-lg ${phase.glowColor}`
                                        : isComplete
                                            ? 'bg-emerald-500/5 border-emerald-500/20'
                                            : 'bg-white/[0.02] border-white/5'
                                    }
                                `}>
                                    {/* Phase Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isComplete ? 'text-emerald-500' : isActive ? phase.color : 'text-slate-600'
                                                }`}>
                                                Phase {phase.number} — {phase.subtitle}
                                            </div>
                                            <h3 className={`text-lg font-bold ${isComplete || isActive ? 'text-white' : 'text-slate-500'
                                                }`}>
                                                {phase.title}
                                            </h3>
                                        </div>
                                        <StatusBadge status={phase.status} />
                                    </div>

                                    <p className={`text-xs leading-relaxed mb-4 ${isActive ? 'text-slate-300' : 'text-slate-500'
                                        }`}>
                                        {phase.description}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Progress</span>
                                            <span className={`text-xs font-black ${isComplete ? 'text-emerald-400' : isActive ? phase.color : 'text-slate-600'
                                                }`}>{phase.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ease-out ${isComplete ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                                                        isActive ? 'bg-gradient-to-r from-orange-600 to-primary' :
                                                            'bg-slate-700'
                                                    }`}
                                                style={{ width: `${phase.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex flex-wrap gap-3 mb-3">
                                        {phase.stats.map(stat => (
                                            <div key={stat.label} className="bg-black/30 rounded-lg px-3 py-1.5 border border-white/5">
                                                <div className={`text-sm font-bold ${isComplete ? 'text-emerald-400' : isActive ? 'text-white' : 'text-slate-500'}`}>
                                                    {stat.value}
                                                </div>
                                                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tips (only for active phase) */}
                                    {isActive && (
                                        <div className="mt-3 pt-3 border-t border-white/5">
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Next Steps</div>
                                            <div className="space-y-1.5">
                                                {phase.tips.map((tip, i) => (
                                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                                        <ChevronRight size={12} className={`flex-shrink-0 mt-0.5 ${phase.color}`} />
                                                        <span>{tip}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
