import { useState } from 'react';
import { Droplets, UtensilsCrossed, Flashlight, HeartPulse, Radio, ChevronRight, Check, Star } from 'lucide-react';

interface QuickStartWizardProps {
    isDesktopView?: boolean;
}

interface EssentialStep {
    id: string;
    number: number;
    title: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    why: string;
    target: string;
    items: {
        name: string;
        qty: string;
        bestDeal: string;
        source: string;
        price: string;
    }[];
}

const ESSENTIALS: EssentialStep[] = [
    {
        id: 'water',
        number: 1,
        title: 'Water',
        icon: <Droplets size={22} />,
        color: 'text-blue-400',
        bgColor: 'from-blue-600/15 to-blue-900/5',
        borderColor: 'border-blue-500/30',
        why: 'You can survive 3 weeks without food, but only 3 days without water. This is priority #1.',
        target: '1 gallon per person per day × 3 days',
        items: [
            { name: 'Bottled Water (40-pack)', qty: '40 bottles', bestDeal: 'Kirkland Purified Water 16.9oz × 40', source: 'Costco', price: '$3.48' },
            { name: 'Water Jug (5-gallon)', qty: '2 jugs', bestDeal: 'Reliance Aqua-Pak 5-Gal Container', source: 'Walmart', price: '$9.97 each' },
            { name: 'Water Purification Tablets', qty: '1 pack (50ct)', bestDeal: 'Potable Aqua Germicidal Tablets', source: 'Amazon', price: '$8.50' },
        ]
    },
    {
        id: 'food',
        number: 2,
        title: 'Food (No-Cook)',
        icon: <UtensilsCrossed size={22} />,
        color: 'text-orange-400',
        bgColor: 'from-orange-600/15 to-orange-900/5',
        borderColor: 'border-orange-500/30',
        why: '72 hours of food that needs no refrigeration or cooking. Focus on calorie-dense, shelf-stable items you actually eat.',
        target: '2,000 calories per person per day × 3 days',
        items: [
            { name: 'Peanut Butter (2-pack)', qty: '2 jars', bestDeal: 'Skippy or Jif 48oz × 2', source: 'Costco', price: '$10.49' },
            { name: 'Granola / Protein Bars', qty: '1 box (36ct)', bestDeal: 'Nature Valley Variety 36-pack', source: 'Costco', price: '$13.99' },
            { name: 'Canned Soup / Chili', qty: '12 cans', bestDeal: 'Dinty Moore / Wolf Brand Chili', source: 'Sams Club', price: '$1.50/can' },
            { name: 'Trail Mix', qty: '2 lbs', bestDeal: 'Kirkland Trail Mix 4lb bag', source: 'Costco', price: '$12.99' },
            { name: 'Calrose Rice 25lb bag', qty: '25 lbs', bestDeal: 'Kokuho Rose Calrose Rice', source: 'Costco', price: '$9.49' },
        ]
    },
    {
        id: 'light',
        number: 3,
        title: 'Light & Power',
        icon: <Flashlight size={22} />,
        color: 'text-yellow-400',
        bgColor: 'from-yellow-600/15 to-yellow-900/5',
        borderColor: 'border-yellow-500/30',
        why: 'When the grid goes down, you need reliable light and a way to charge your phone. Darkness is disorienting and dangerous.',
        target: '2 light sources + 1 power source',
        items: [
            { name: 'LED Flashlight (2-pack)', qty: '2', bestDeal: 'GearLight S1000 LED Flashlight 2-Pack', source: 'Amazon', price: '$15.99' },
            { name: 'Headlamp', qty: '2', bestDeal: 'Energizer LED Headlamp 2-pack', source: 'Costco', price: '$14.99' },
            { name: 'AA/AAA Batteries (48pk)', qty: '48', bestDeal: 'Kirkland AA Batteries 48-pack', source: 'Costco', price: '$14.99' },
            { name: 'Power Bank (10,000mAh)', qty: '1', bestDeal: 'Anker 313 Power Bank', source: 'Amazon', price: '$15.99' },
        ]
    },
    {
        id: 'first-aid',
        number: 4,
        title: 'First Aid',
        icon: <HeartPulse size={22} />,
        color: 'text-red-400',
        bgColor: 'from-red-600/15 to-red-900/5',
        borderColor: 'border-red-500/30',
        why: 'In a disaster, ERs are overwhelmed. You need to handle cuts, burns, sprains, and basic illness yourself for the first few days.',
        target: '1 comprehensive kit + personal meds',
        items: [
            { name: 'First Aid Kit (200+ piece)', qty: '1', bestDeal: 'Be Smart Get Prepared 250-Piece Kit', source: 'Amazon', price: '$16.49' },
            { name: 'Ibuprofen & Acetaminophen', qty: '2 bottles', bestDeal: 'Kirkland Ibuprofen 500ct', source: 'Costco', price: '$8.99' },
            { name: 'Prescription Meds (7-day)', qty: '7 days', bestDeal: 'Ask your doctor for an extra 7-day supply', source: 'Pharmacy', price: 'Varies' },
            { name: 'N95 Masks (20-pack)', qty: '20', bestDeal: '3M Aura N95 Respirator 20-pack', source: 'Home Depot', price: '$19.97' },
        ]
    },
    {
        id: 'comms',
        number: 5,
        title: 'Communication',
        icon: <Radio size={22} />,
        color: 'text-purple-400',
        bgColor: 'from-purple-600/15 to-purple-900/5',
        borderColor: 'border-purple-500/30',
        why: 'Cell towers go down. Internet goes down. You need a backup way to get emergency info and contact family.',
        target: '1 emergency radio + printed contacts',
        items: [
            { name: 'Weather Radio (Hand-Crank)', qty: '1', bestDeal: 'FosPower Emergency Radio (Solar/Hand-Crank)', source: 'Amazon', price: '$29.99' },
            { name: 'Emergency Whistles (4pk)', qty: '4', bestDeal: 'HyperWhistle Emergency Whistle', source: 'Amazon', price: '$9.95' },
            { name: 'Printed Contact List', qty: '2 copies', bestDeal: 'Print at home — all family numbers, out-of-state contacts, and local emergency #s', source: 'Home', price: 'Free' },
            { name: 'Waterproof Document Bag', qty: '1', bestDeal: 'Arae Waterproof Pouch 2-Pack', source: 'Amazon', price: '$7.99' },
        ]
    }
];

export function QuickStartWizard({ isDesktopView }: QuickStartWizardProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleComplete = (index: number) => {
        setCompletedSteps(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const allComplete = completedSteps.size === ESSENTIALS.length;
    const current = ESSENTIALS[activeStep];

    if (isCollapsed) {
        return (
            <div
                className={`cursor-pointer transition-all ${isDesktopView ? 'bg-surface rounded-2xl border border-white/5 p-4 shadow-sm' : 'border-b border-white/5 p-4'}`}
                onClick={() => setIsCollapsed(false)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <Star size={16} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">First 72 Hours — Quick Start</h3>
                            <p className="text-[10px] text-slate-500">{completedSteps.size}/{ESSENTIALS.length} essentials covered • tap to expand</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {ESSENTIALS.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${completedSteps.has(i) ? 'bg-emerald-400' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${isDesktopView ? 'bg-surface rounded-2xl border border-white/5 shadow-sm overflow-hidden' : 'border-b border-white/5'}`}>
            {/* Header */}
            <div className="p-5 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Star size={18} className="text-primary" />
                        First 72 Hours — Quick Start
                    </h2>
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-wider"
                    >
                        Collapse
                    </button>
                </div>
                <p className="text-xs text-slate-400 mb-4">5 essentials every prepper needs. Start here.</p>

                {/* Step Indicators */}
                <div className="flex gap-1.5 mb-5">
                    {ESSENTIALS.map((step, i) => (
                        <button
                            key={step.id}
                            onClick={() => setActiveStep(i)}
                            className={`flex-1 h-1.5 rounded-full transition-all ${completedSteps.has(i) ? 'bg-emerald-400' :
                                    i === activeStep ? 'bg-primary' :
                                        'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Active Step Content */}
            {!allComplete ? (
                <div className={`mx-5 mb-5 rounded-xl border bg-gradient-to-br p-4 ${current.bgColor} ${current.borderColor}`}>
                    {/* Step Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/30 border border-white/10 ${current.color}`}>
                                {current.icon}
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                    Step {current.number} of 5
                                </div>
                                <h3 className="text-lg font-bold text-white">{current.title}</h3>
                            </div>
                        </div>
                        {completedSteps.has(activeStep) && (
                            <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-full border border-emerald-500/30">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        )}
                    </div>

                    {/* Why This Matters */}
                    <div className="bg-black/20 rounded-lg p-3 mb-4 border border-white/5">
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Why This Matters</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{current.why}</p>
                    </div>

                    {/* Target */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`text-[10px] font-black uppercase tracking-wider ${current.color}`}>Target:</div>
                        <div className="text-xs text-white font-medium">{current.target}</div>
                    </div>

                    {/* Shopping List */}
                    <div className="space-y-2">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Best Deals</div>
                        {current.items.map((item, i) => (
                            <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white">{item.name}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{item.bestDeal}</div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-black text-emerald-400">{item.price}</div>
                                        <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${item.source === 'Costco' ? 'text-red-400' :
                                                item.source === 'Sams Club' ? 'text-blue-400' :
                                                    item.source === 'Amazon' ? 'text-orange-400' :
                                                        item.source === 'Walmart' ? 'text-blue-500' :
                                                            item.source === 'Home Depot' ? 'text-orange-500' :
                                                                'text-slate-500'
                                            }`}>{item.source}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => toggleComplete(activeStep)}
                            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm transition-all active:scale-95 ${completedSteps.has(activeStep)
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-primary text-black'
                                }`}
                        >
                            <Check size={14} strokeWidth={3} />
                            {completedSteps.has(activeStep) ? 'Completed ✓' : 'Mark Complete'}
                        </button>
                        {activeStep < ESSENTIALS.length - 1 && (
                            <button
                                onClick={() => setActiveStep(s => Math.min(s + 1, ESSENTIALS.length - 1))}
                                className="flex items-center justify-center gap-1 bg-white/10 text-white font-bold py-3 px-4 rounded-xl text-sm hover:bg-white/15 transition-all active:scale-95"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mx-5 mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <h3 className="text-lg font-bold text-white mb-1">First 72 Hours — Covered!</h3>
                    <p className="text-xs text-slate-400">You've planned for all 5 essentials. Move to Phase 2 to extend your preparedness to 30 days.</p>
                </div>
            )}
        </div>
    );
}
