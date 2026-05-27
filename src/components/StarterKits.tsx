import { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, MapPin, Tag, TrendingUp } from 'lucide-react';

interface StarterKitsProps {
    isDesktopView?: boolean;
}

interface KitItem {
    name: string;
    qty: string;
    deal: string;
    source: 'Costco' | 'Sams Club' | 'Amazon' | 'Walmart' | 'Home Depot' | 'Costco Business' | 'Local' | 'Dollar Store' | 'Harbor Freight';
    price: number;
    priceLabel: string;
    tip?: string;
}

interface Kit {
    id: string;
    tier: string;
    budget: string;
    totalEstimate: string;
    title: string;
    description: string;
    color: string;
    borderColor: string;
    bgColor: string;
    icon: string;
    items: KitItem[];
}

const SOURCE_COLORS: Record<string, string> = {
    'Costco': 'text-red-400 bg-red-500/10 border-red-500/20',
    'Costco Business': 'text-red-300 bg-red-500/10 border-red-500/20',
    'Sams Club': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Amazon': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'Walmart': 'text-blue-500 bg-blue-600/10 border-blue-600/20',
    'Home Depot': 'text-orange-500 bg-orange-600/10 border-orange-600/20',
    'Local': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    'Dollar Store': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Harbor Freight': 'text-red-500 bg-red-600/10 border-red-600/20',
};

const KITS: Kit[] = [
    {
        id: 'starter-50',
        tier: 'TIER 1',
        budget: '$50',
        totalEstimate: '~$48',
        title: 'The $50 Starter',
        description: 'Absolute minimum viable prep. Covers 72 hours for 1 person — better than nothing.',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgColor: 'from-emerald-600/10 to-emerald-900/5',
        icon: '🌱',
        items: [
            { name: 'Bottled Water (40-pack)', qty: '40 bottles', deal: 'Kirkland Purified Water 16.9oz × 40', source: 'Costco', price: 3.48, priceLabel: '$3.48' },
            { name: 'Canned Soup / Chili (12pk)', qty: '12 cans', deal: 'Wolf Brand Chili / Chunky Soup', source: 'Sams Club', price: 12.00, priceLabel: '$12.00', tip: 'Don\'t forget a manual can opener' },
            { name: 'Protein Bars (12pk)', qty: '12 bars', deal: 'Clif Bar Variety 12-Pack', source: 'Amazon', price: 10.49, priceLabel: '$10.49' },
            { name: 'LED Flashlight', qty: '1', deal: 'GearLight S1000 LED', source: 'Amazon', price: 8.99, priceLabel: '$8.99' },
            { name: 'AA Batteries (24pk)', qty: '24', deal: 'Energizer MAX 24-pack', source: 'Walmart', price: 5.97, priceLabel: '$5.97' },
            { name: 'First Aid Kit (64pc)', qty: '1 kit', deal: 'Band-Aid Build Your Own Kit', source: 'Dollar Store', price: 5.00, priceLabel: '$5.00' },
            { name: 'Emergency Whistle', qty: '1', deal: 'Safety whistle with lanyard', source: 'Dollar Store', price: 1.25, priceLabel: '$1.25' },
        ]
    },
    {
        id: 'starter-200',
        tier: 'TIER 2',
        budget: '$200',
        totalEstimate: '~$195',
        title: 'The $200 Foundation',
        description: 'A serious 72-hour kit for a family of 4. Water, food, light, medical, and communication.',
        color: 'text-primary',
        borderColor: 'border-primary/30',
        bgColor: 'from-orange-600/10 to-orange-900/5',
        icon: '🏗️',
        items: [
            { name: 'Water Jugs (5-gal × 2)', qty: '10 gallons', deal: 'Reliance Aqua-Pak 5-Gal Container', source: 'Walmart', price: 19.94, priceLabel: '$9.97×2' },
            { name: 'Water Filter Straw', qty: '1', deal: 'LifeStraw Personal Water Filter', source: 'Amazon', price: 12.99, priceLabel: '$12.99', tip: 'Good for 1,000 gallons' },
            { name: 'Rice (25 lb bag)', qty: '25 lbs', deal: 'Kokuho Rose Calrose Rice', source: 'Costco', price: 9.49, priceLabel: '$9.49', tip: '158,000+ calories for under $10' },
            { name: 'Dry Beans (50 lb bag)', qty: '50 lbs', deal: 'Pinto Beans 50lb bag', source: 'Costco Business', price: 18.00, priceLabel: '$18.00', tip: 'Costco Business — best bean deal anywhere' },
            { name: 'Peanut Butter (2-pack)', qty: '2 jars (48oz)', deal: 'Skippy Creamy 48oz × 2', source: 'Costco', price: 10.49, priceLabel: '$10.49' },
            { name: 'Canned Goods (24pk)', qty: '24 cans', deal: 'Variety — soup, chili, vegetables', source: 'Sams Club', price: 22.00, priceLabel: '$22.00' },
            { name: 'Granola Bars (36ct)', qty: '36 bars', deal: 'Nature Valley Variety 36-pack', source: 'Costco', price: 13.99, priceLabel: '$13.99' },
            { name: 'Flashlights (2-pack)', qty: '2', deal: 'GearLight S1000 LED 2-Pack', source: 'Amazon', price: 15.99, priceLabel: '$15.99' },
            { name: 'Headlamps (2-pack)', qty: '2', deal: 'Energizer LED Headlamp 2-pk', source: 'Costco', price: 14.99, priceLabel: '$14.99' },
            { name: 'Batteries AA + AAA (48pk)', qty: '48', deal: 'Kirkland AA 48-pack', source: 'Costco', price: 14.99, priceLabel: '$14.99' },
            { name: 'First Aid Kit (250pc)', qty: '1 kit', deal: 'Be Smart Get Prepared 250pc', source: 'Amazon', price: 16.49, priceLabel: '$16.49' },
            { name: 'Power Bank 10k mAh', qty: '1', deal: 'Anker 313 Power Bank', source: 'Amazon', price: 15.99, priceLabel: '$15.99' },
            { name: 'Emergency Radio', qty: '1', deal: 'FosPower Solar/Crank Radio', source: 'Amazon', price: 9.99, priceLabel: '$9.99', tip: 'Solar + hand crank + flashlight + phone charger' },
        ]
    },
    {
        id: 'starter-500',
        tier: 'TIER 3',
        budget: '$500',
        totalEstimate: '~$485',
        title: 'The $500 Full Kit',
        description: 'Complete Bugout Bag coverage for a family of 4 — ready for any 72-hour scenario plus some.',
        color: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        bgColor: 'from-blue-600/10 to-blue-900/5',
        icon: '🎒',
        items: [
            { name: 'Water Jugs (5-gal × 4)', qty: '20 gallons', deal: 'Reliance Aqua-Pak 5-Gal Container', source: 'Walmart', price: 39.88, priceLabel: '$9.97×4' },
            { name: 'LifeStraw Family Filter', qty: '1', deal: 'LifeStraw Mission 12L Gravity Filter', source: 'Amazon', price: 59.95, priceLabel: '$59.95', tip: 'Filters 18,000 liters — years of use' },
            { name: 'Water Purification Tabs', qty: '2 packs', deal: 'Potable Aqua 50ct × 2', source: 'Amazon', price: 17.00, priceLabel: '$8.50×2' },
            { name: 'Rice (25 lb bag × 2)', qty: '50 lbs', deal: 'Kokuho Rose 25lb', source: 'Costco', price: 18.98, priceLabel: '$9.49×2' },
            { name: 'Beans (50 lb bag)', qty: '50 lbs', deal: 'Pinto Beans bulk 50lb', source: 'Costco Business', price: 18.00, priceLabel: '$18.00' },
            { name: 'Oats (25 lb bag)', qty: '25 lbs', deal: 'Rolled Oats bulk', source: 'Costco Business', price: 12.00, priceLabel: '$12.00' },
            { name: 'Freeze-Dried Meals (12pk)', qty: '12 meals', deal: 'Mountain House Classic Bucket', source: 'Amazon', price: 52.99, priceLabel: '$52.99', tip: '30-year shelf life' },
            { name: 'Canned Goods Variety (48pk)', qty: '48 cans', deal: 'Soup, chili, veggies, fruit', source: 'Sams Club', price: 44.00, priceLabel: '$44.00' },
            { name: 'Peanut Butter + Trail Mix', qty: '2 jars + 4lb', deal: 'Kirkland PB + Trail Mix bag', source: 'Costco', price: 23.48, priceLabel: '$23.48' },
            { name: 'Flashlights + Headlamps', qty: '2+2', deal: 'GearLight 2pk + Energizer 2pk', source: 'Amazon', price: 30.98, priceLabel: '$30.98' },
            { name: 'Batteries (AA + AAA 96ct)', qty: '96', deal: 'Kirkland AA 48pk × 2', source: 'Costco', price: 29.98, priceLabel: '$29.98' },
            { name: 'Power Bank (20k mAh)', qty: '1', deal: 'Anker 325 Power Bank 20K', source: 'Amazon', price: 27.99, priceLabel: '$27.99' },
            { name: 'Solar Charger Panel', qty: '1', deal: 'BigBlue 28W Solar Charger', source: 'Amazon', price: 42.96, priceLabel: '$42.96', tip: 'Charges phones from sunlight' },
            { name: 'Trauma Kit (IFAK)', qty: '1', deal: 'EVERLIT 250pc Survival IFAK', source: 'Amazon', price: 29.99, priceLabel: '$29.99' },
            { name: 'N95 Masks (20pk)', qty: '20', deal: '3M Aura N95 20-pack', source: 'Home Depot', price: 19.97, priceLabel: '$19.97' },
            { name: 'Emergency Radio + Whistles', qty: '1+4', deal: 'FosPower Radio + HyperWhistle 4pk', source: 'Amazon', price: 39.94, priceLabel: '$39.94' },
            { name: 'Emergency Bivvy Bags (4pk)', qty: '4', deal: 'SOL Emergency Bivvy', source: 'Amazon', price: 11.95, priceLabel: '$11.95×1' },
            { name: 'Multi-Tool', qty: '1', deal: 'Gerber Suspension NXT 15-in-1', source: 'Amazon', price: 18.97, priceLabel: '$18.97' },
        ]
    }
];

export function StarterKits({ isDesktopView }: StarterKitsProps) {
    const [expandedKit, setExpandedKit] = useState<string | null>(null);

    return (
        <div className={`${isDesktopView ? 'bg-surface rounded-2xl border border-white/5 p-6 shadow-sm' : 'border-b border-white/5 p-5'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <ShoppingCart size={18} className="text-emerald-400" />
                    Starter Kits by Budget
                </h2>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider">
                    <Tag size={10} /> Real prices
                </div>
            </div>
            <p className="text-xs text-slate-400 mb-5">Pre-built shopping lists with the best bulk deals. Pick your budget and go.</p>

            {/* Kit Cards */}
            <div className="space-y-3">
                {KITS.map(kit => {
                    const isExpanded = expandedKit === kit.id;
                    const totalCost = kit.items.reduce((sum, item) => sum + item.price, 0);

                    return (
                        <div
                            key={kit.id}
                            className={`rounded-xl border overflow-hidden transition-all ${isExpanded
                                ? `bg-gradient-to-br ${kit.bgColor} ${kit.borderColor} shadow-lg`
                                : 'bg-surface border-white/5 hover:border-white/10'
                                }`}
                        >
                            {/* Kit Header */}
                            <button
                                onClick={() => setExpandedKit(isExpanded ? null : kit.id)}
                                className="w-full p-4 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{kit.icon}</span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-white">{kit.title}</h3>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${kit.color}`}>{kit.tier}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">{kit.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                    <div className="text-right">
                                        <div className={`text-lg font-black ${kit.color}`}>{kit.budget}</div>
                                        <div className="text-[9px] text-slate-500">{kit.items.length} items</div>
                                    </div>
                                    {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                                </div>
                            </button>

                            {/* Expanded Shopping List */}
                            {isExpanded && (
                                <div className="px-4 pb-4 border-t border-white/5">
                                    {/* Source Legend */}
                                    <div className="flex flex-wrap gap-1.5 py-3">
                                        {Array.from(new Set(kit.items.map(i => i.source))).map(source => (
                                            <span key={source} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${SOURCE_COLORS[source] || ''}`}>
                                                <MapPin size={8} /> {source}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-1.5">
                                        {kit.items.map((item, i) => (
                                            <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-white">{item.name}</div>
                                                        <div className="text-[11px] text-slate-400 mt-0.5">{item.deal}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-slate-500">{item.qty}</span>
                                                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${SOURCE_COLORS[item.source] || ''}`}>
                                                                {item.source}
                                                            </span>
                                                        </div>
                                                        {item.tip && (
                                                            <div className="text-[10px] text-primary/80 mt-1 italic">💡 {item.tip}</div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-black text-emerald-400 flex-shrink-0">{item.priceLabel}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={14} className="text-emerald-400" />
                                            <span className="text-xs text-slate-400 font-semibold">Estimated Total</span>
                                        </div>
                                        <div className={`text-xl font-black ${kit.color}`}>
                                            ${totalCost.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="mt-3 bg-black/20 rounded-lg p-3 border border-white/5">
                                        <p className="text-[10px] text-slate-500 leading-relaxed">
                                            💡 <span className="text-slate-400 font-semibold">Pro tip:</span> Prices are approximate and may vary by location. Costco and Costco Business Center offer the best bulk deals on staples. Check Costco Business for 50lb bean bags and restaurant-sized supplies. Amazon is best for specialty gear and small items.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
