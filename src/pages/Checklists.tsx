import { useState } from 'react';
import { useChecklistStore } from '../store/useChecklistStore';
import { ChecklistItem } from '../types';
import { ChevronDown, ChevronRight, Monitor, Smartphone, CheckCircle2, Target } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { InfographicBanner } from '../components/InfographicBanner';

export function Checklists() {
    const checklists = useChecklistStore((state) => state.checklists);
    const updateChecklist = useChecklistStore((state) => state.updateChecklist);

    const [activeChecklistId, setActiveChecklistId] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const isDesktopView = useUIStore(state => state.isDesktopView);
    const setDesktopView = useUIStore(state => state.setDesktopView);

    const activeChecklist = checklists.find(c => c.id === activeChecklistId) || checklists[0];

    const isCategoryExpanded = (category: string) => !!expandedCategories[category];

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({ ...prev, [category]: !isCategoryExpanded(category) }));
    };

    const toggleItem = (itemId: string) => {
        if (!activeChecklist) return;
        const updatedItems = activeChecklist.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        updateChecklist(activeChecklist.id, { items: updatedItems });
    };

    if (checklists.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                Loading Checklists...
            </div>
        );
    }

    // Group items by category
    const groupedItems: Record<string, ChecklistItem[]> = {};
    activeChecklist?.items.forEach(item => {
        const category = item.category || 'Uncategorized';
        if (!groupedItems[category]) groupedItems[category] = [];
        groupedItems[category].push(item);
    });

    return (
        <div className={`flex flex-col h-full bg-background transition-all duration-300 ${isDesktopView ? 'p-8 max-w-7xl mx-auto w-full' : ''}`}>

            {/* Top Navigation & View Toggle */}
            <div className={`bg-surface sticky top-0 z-20 border-b border-white/5 py-3 px-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDesktopView ? 'rounded-2xl mb-6 border border-white/10' : ''}`}>
                <div className="flex space-x-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                    {checklists.map(list => {
                        const isSelected = activeChecklistId === list.id || (!activeChecklistId && checklists[0]?.id === list.id);
                        return (
                            <button
                                key={list.id}
                                onClick={() => setActiveChecklistId(list.id)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isSelected
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {list.title}
                            </button>
                        );
                    })}
                </div>

                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 shrink-0 self-start md:self-auto">
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

            {/* Infographic Banner */}
            <div className="px-4 md:px-0">
                <InfographicBanner
                    title="Readiness Protocols"
                    description="Follow structured, expert-designed checklists to build a comprehensive foundation. Gamify your progress and turn anxiety into actionable steps."
                    features={[
                        { icon: <Monitor size={16} />, title: "Structured", text: "Logically grouped by survival category." },
                        { icon: <CheckCircle2 size={16} />, title: "Milestones", text: "Track your overall readiness score." },
                        { icon: <Target size={16} />, title: "Clear", text: "Step-by-step clear instructions." }
                    ]}
                />
            </div>

            {/* Checklist Content */}
            {activeChecklist && (
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-24">

                    {/* Header Info */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-white tracking-tight">{activeChecklist.title}</h2>
                        {activeChecklist.description && (
                            <p className="text-slate-400 mt-1 text-sm">{activeChecklist.description}</p>
                        )}
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-success transition-all"
                                    style={{ width: `${(activeChecklist.items.filter(i => i.completed).length / activeChecklist.items.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-slate-400 min-w-[3rem] text-right">
                                {Math.round((activeChecklist.items.filter(i => i.completed).length / activeChecklist.items.length) * 100)}%
                            </span>
                        </div>
                    </div>

                    {/* Categories as Cards */}
                    <div className={isDesktopView ? "columns-1 md:columns-2 xl:columns-3 gap-6 [&>div]:break-inside-avoid [&>div]:mb-6" : "space-y-6"}>
                        {Object.entries(groupedItems).map(([category, items]) => {
                            const completedCount = items.filter(i => i.completed).length;
                            const isAllDone = completedCount === items.length;

                            return (
                                <div key={category} className="bg-surface rounded-2xl border border-white/5 shadow-sm overflow-hidden break-inside-avoid">
                                    {/* Category Header */}
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleCategory(category);
                                        }}
                                        className={`px-4 py-4 flex justify-between items-center border-b border-white/5 cursor-pointer transition-all select-none hover:bg-white/10 active:bg-white/5 ${isCategoryExpanded(category) ? 'bg-white/5' : 'bg-surface'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5">
                                                {isCategoryExpanded(category) ? <ChevronDown size={16} className="text-primary" /> : <ChevronRight size={16} className="text-slate-500" />}
                                            </div>
                                            <h3 className="font-semibold text-white tracking-tight text-base">
                                                {category}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${isAllDone ? 'bg-success/20 text-success border-success/30' : 'bg-black/30 text-slate-500 border-white/5'
                                                }`}>
                                                {completedCount} / {items.length}
                                            </span>
                                            <span className="text-slate-600 text-[10px] uppercase font-bold hidden md:block">
                                                {isCategoryExpanded(category) ? 'Hide' : 'Show'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category Items */}
                                    {isCategoryExpanded(category) && (
                                        <div className="divide-y divide-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {items.map(item => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => toggleItem(item.id)}
                                                    className={`p-4 flex items-center gap-4 cursor-pointer transition-colors active:bg-white/5 ${item.completed ? 'bg-success/5' : 'hover:bg-white-[0.02]'
                                                        }`}
                                                >
                                                    {/* Large Touch Target Checkbox */}
                                                    <div className={`flex-shrink-0 w-7 h-7 rounded-[8px] border-2 flex items-center justify-center transition-all ${item.completed
                                                        ? 'bg-success border-success text-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                                        : 'border-slate-600 bg-black/20'
                                                        }`}>
                                                        {item.completed && (
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    {/* Item Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-[15px] font-medium leading-tight mb-1 transition-colors ${item.completed ? 'text-slate-400 line-through' : 'text-white'
                                                            }`}>
                                                            {item.text}
                                                        </div>
                                                        {(item.notes || item.quantity) && (
                                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                {item.quantity && (
                                                                    <span className="font-semibold px-1.5 py-0.5 rounded bg-white/5 text-primary-400">
                                                                        Qty: {item.quantity}
                                                                    </span>
                                                                )}
                                                                <span className="truncate">{item.notes}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
