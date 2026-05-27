import { useState, useMemo } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { MASTER_INVENTORY_SEED } from '../lib/inventorySeed';
import { ShoppingCart, Plus, Check, TrendingUp, AlertTriangle, ShieldAlert, Lock } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { InfographicBanner } from '../components/InfographicBanner';
import { UserProfile } from '../types';
import { PremiumModal } from '../components/PremiumModal';

// We map out the goals by category based on the master seed
const CATEGORY_GOALS = {
    Water: MASTER_INVENTORY_SEED.filter(i => i.category === 'Water').reduce((acc, i) => acc + (i.recommendedQuantity * (i.calories || 1)), 0),
    Food: MASTER_INVENTORY_SEED.filter(i => i.category === 'Food').reduce((acc, i) => acc + (i.recommendedQuantity * i.calories), 0),
    Medical: MASTER_INVENTORY_SEED.filter(i => i.category === 'Medical').reduce((acc, i) => acc + i.recommendedQuantity, 0),
    Protection: MASTER_INVENTORY_SEED.filter(i => i.category === 'Protection').reduce((acc, i) => acc + i.recommendedQuantity, 0),
    Utility: MASTER_INVENTORY_SEED.filter(i => i.category === 'Utility').reduce((acc, i) => acc + i.recommendedQuantity, 0),
};

interface CustomPurchase {
    id: string;
    name: string;
    category: 'Food' | 'Water' | 'Medical' | 'Protection' | 'Utility';
    quantity: number;
    unit: string;
    costPerUnit: number;
}

interface PrepBuilderProps {
    userProfile?: UserProfile | null;
}

export function PrepBuilder({ userProfile }: PrepBuilderProps) {
    const items = useInventoryStore(state => state.items);
    const addItem = useInventoryStore(state => state.addItem);
    const [isProcessing, setIsProcessing] = useState(false);

    const isDesktopView = useUIStore(state => state.isDesktopView);

    const [budget, setBudget] = useState<number>(50);
    const [manualItems, setManualItems] = useState<CustomPurchase[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState<'Food' | 'Water' | 'Medical' | 'Protection' | 'Utility'>('Food');
    const [newItemCost, setNewItemCost] = useState(5.00);

    const [premiumModalOpen, setPremiumModalOpen] = useState(false);
    const [premiumFeature, setPremiumFeature] = useState({ title: '', desc: '' });

    const isPremiumUnlocked = userProfile?.accountTier === 'founder' || userProfile?.accountTier === 'premium';
    const isAdvancedCategory = (cat: string) => ['Medical', 'Protection', 'Utility'].includes(cat);

    const checkPremiumAccess = (category: string) => {
        if (!isPremiumUnlocked && isAdvancedCategory(category)) {
            setPremiumFeature({
                title: `${category} Rig Locked`,
                desc: `The ${category} Rig capabilities are reserved for Premium members and Founders.`
            });
            setPremiumModalOpen(true);
            return false;
        }
        return true;
    };

    // Calculate Current Status by Category
    const categoryStatus = useMemo(() => {
        const status = {
            Food: { currentCal: 0, goalCal: CATEGORY_GOALS.Food, items: 0 },
            Water: { currentQty: 0, goalQty: CATEGORY_GOALS.Water, items: 0 },
            Medical: { currentQty: 0, goalQty: CATEGORY_GOALS.Medical, items: 0 },
            Protection: { currentQty: 0, goalQty: CATEGORY_GOALS.Protection, items: 0 },
            Utility: { currentQty: 0, goalQty: CATEGORY_GOALS.Utility, items: 0 },
        };

        items.forEach(item => {
            if (item.category === 'Food') {
                status.Food.currentCal += (item.calories * item.quantity);
                status.Food.items += 1;
            } else if (item.category === 'Water') {
                status.Water.currentQty += item.quantity;
                status.Water.items += 1;
            } else if (item.category === 'Medical') {
                status.Medical.currentQty += item.quantity;
                status.Medical.items += 1;
            } else if (item.category === 'Protection') {
                status.Protection.currentQty += item.quantity;
                status.Protection.items += 1;
            } else if (item.category === 'Utility') {
                status.Utility.currentQty += item.quantity;
                status.Utility.items += 1;
            }
        });

        return status;
    }, [items]);

    // Generate Smart Suggestions based on shortfalls
    const smartSuggestions = useMemo(() => {
        const suggestions: Array<{ name: string, category: string, cost: number, reason: string }> = [];
        const { Food, Water, Medical, Protection, Utility } = categoryStatus;

        if (Water.currentQty < Water.goalQty * 0.5) {
            suggestions.push({ name: 'Bulk Water (Jugs/Cases)', category: 'Water', cost: 15.00, reason: 'Critical Water Shortfall' });
        }
        if (Food.currentCal < Food.goalCal * 0.5) {
            suggestions.push({ name: 'Bulk Rice & Beans', category: 'Food', cost: 25.00, reason: 'Low Calorie Reserves' });
        }
        if (Medical.currentQty < Medical.goalQty * 0.5) {
            suggestions.push({ name: 'First Aid / Trauma Kit', category: 'Medical', cost: 35.00, reason: 'Insufficient Medical Supplies' });
        }
        if (Protection.currentQty < Protection.goalQty * 0.5) {
            suggestions.push({ name: 'Perimeter Defense / Safety', category: 'Protection', cost: 40.00, reason: 'Protection Gap' });
        }
        if (Utility.currentQty < Utility.goalQty * 0.5) {
            suggestions.push({ name: 'Batteries / Flashlights', category: 'Utility', cost: 20.00, reason: 'Utility Gap' });
        }

        return suggestions;
    }, [categoryStatus]);

    const handleAddManualItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        if (!checkPremiumAccess(newItemCategory)) return;

        setManualItems([...manualItems, {
            id: Date.now().toString(),
            name: newItemName.trim(),
            category: newItemCategory,
            quantity: 1,
            unit: 'units',
            costPerUnit: newItemCost
        }]);
        setNewItemName('');
    };

    const removeManualItem = (id: string) => {
        setManualItems(manualItems.filter(i => i.id !== id));
    };

    const purchaseManualItem = async (item: CustomPurchase) => {
        setIsProcessing(true);
        try {
            await addItem({
                name: item.name,
                category: item.category,
                quantity: item.quantity,
                unit: item.unit,
                calories: 0,
                costPerUnit: item.costPerUnit,
            });
            removeManualItem(item.id);
        } finally {
            setIsProcessing(false);
        }
    };

    const purchaseSmartItem = async (suggestion: any) => {
        if (!checkPremiumAccess(suggestion.category)) return;

        setIsProcessing(true);
        try {
            await addItem({
                name: suggestion.name,
                category: suggestion.category,
                quantity: 1,
                unit: 'units',
                calories: suggestion.category === 'Food' ? 5000 : 0,
                costPerUnit: suggestion.cost,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={`flex flex-col bg-background min-h-full pb-24 transition-all duration-300 ${isDesktopView ? 'p-8 max-w-7xl mx-auto w-full' : ''}`}>
            <div className={`bg-surface border-b border-white/5 py-3 px-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 ${isDesktopView ? 'rounded-2xl mb-6 border border-white/10' : ''}`}>
                <div>
                    <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary" /> Systematic Builder
                    </h2>
                    <p className="text-[10px] text-slate-500 mt-1">Analyze category gaps and build a smart shopping list.</p>
                </div>
            </div>

            <div className="px-4 md:px-0 mt-4 md:mt-2">
                <InfographicBanner
                    title="Systematic Procurement"
                    description="Stop guessing what to buy. The Builder analyzes your specific household gaps against target goals to generate a smart shopping list within your budget."
                    features={[
                        { icon: <TrendingUp size={16} />, title: "Gap Analysis", text: "Visualizes precisely what you are missing." },
                        { icon: <ShieldAlert size={16} />, title: "Smart Logic", text: "Recommends highest ROI items to buy." },
                        { icon: <ShoppingCart size={16} />, title: "Budgeted", text: "Paces your purchases over time." }
                    ]}
                />
            </div>

            <div className="p-4 grid md:grid-cols-12 gap-6">

                {/* Left Column: Analysis */}
                <div className="md:col-span-5 space-y-6">
                    <div className="bg-surface border border-white/5 rounded-2xl p-4">
                        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-amber-500" /> Category Health
                        </h3>

                        <div className="space-y-4">
                            {/* Food */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300">Food Reserves</span>
                                    <span className="text-slate-500">{Math.round((categoryStatus.Food.currentCal / categoryStatus.Food.goalCal) * 100)}%</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (categoryStatus.Food.currentCal / Math.max(1, categoryStatus.Food.goalCal)) * 100)}%` }} />
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1 text-right">{categoryStatus.Food.currentCal.toLocaleString()} / {categoryStatus.Food.goalCal.toLocaleString()} kcal</div>
                            </div>

                            {/* Water */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300">Water Supply</span>
                                    <span className="text-slate-500">{Math.round((categoryStatus.Water.currentQty / categoryStatus.Water.goalQty) * 100)}%</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (categoryStatus.Water.currentQty / Math.max(1, categoryStatus.Water.goalQty)) * 100)}%` }} />
                                </div>
                            </div>

                            {/* Medical */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300">Medical Readiness</span>
                                    <span className="text-slate-500">{Math.round((categoryStatus.Medical.currentQty / categoryStatus.Medical.goalQty) * 100)}%</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (categoryStatus.Medical.currentQty / Math.max(1, categoryStatus.Medical.goalQty)) * 100)}%` }} />
                                </div>
                            </div>

                            {/* Protection */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300">Protection</span>
                                    <span className="text-slate-500">{Math.round((categoryStatus.Protection.currentQty / categoryStatus.Protection.goalQty) * 100)}%</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (categoryStatus.Protection.currentQty / Math.max(1, categoryStatus.Protection.goalQty)) * 100)}%` }} />
                                </div>
                            </div>

                            {/* Utility */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300">Utility / Power</span>
                                    <span className="text-slate-500">{Math.round((categoryStatus.Utility.currentQty / categoryStatus.Utility.goalQty) * 100)}%</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-2">
                                    <div className="bg-slate-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (categoryStatus.Utility.currentQty / Math.max(1, categoryStatus.Utility.goalQty)) * 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Weekly Procurement Budget</label>
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-slate-400">$</span>
                            <input
                                type="number"
                                min="10"
                                step="10"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value) || 0)}
                                className="bg-transparent text-white text-2xl font-black w-32 outline-none border-b border-primary/30 focus:border-primary px-1 pb-1 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Shopping List */}
                <div className="md:col-span-7 space-y-6">

                    {/* Smart Suggestions */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-4">
                        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-primary" /> Smart Suggestions
                        </h3>
                        {smartSuggestions.length === 0 ? (
                            <div className="text-center py-6 text-slate-500 text-sm">
                                <Check className="mx-auto text-success mb-2" size={24} />
                                Your inventory looks highly resilient! No critical category gaps detected.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {smartSuggestions.map((sug, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-white text-sm flex items-center gap-2">
                                                {sug.name}
                                                {!isPremiumUnlocked && isAdvancedCategory(sug.category) && <Lock size={12} className="text-primary" />}
                                            </div>
                                            <div className="text-xs text-slate-400">{sug.reason} • Est. ${sug.cost}</div>
                                        </div>
                                        <button
                                            onClick={() => purchaseSmartItem(sug)}
                                            disabled={isProcessing}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                !isPremiumUnlocked && isAdvancedCategory(sug.category)
                                                    ? 'bg-black/40 text-slate-500 border border-white/5'
                                                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                                            }`}
                                        >
                                            Buy & Log
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Manual List */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-4">
                        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <ShoppingCart size={16} className="text-white" /> Manual Shopping List
                        </h3>

                        <form onSubmit={handleAddManualItem} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Item name..."
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                            />
                            <select
                                value={newItemCategory}
                                onChange={e => setNewItemCategory(e.target.value as any)}
                                className="bg-black/30 border border-white/10 rounded-lg px-2 text-sm text-white"
                            >
                                <option value="Food">Food {categoryStatus.Food.goalCal > 0 ? '' : ''}</option>
                                <option value="Water">Water</option>
                                <option value="Medical">Medical {!isPremiumUnlocked ? '(Premium)' : ''}</option>
                                <option value="Protection">Protection {!isPremiumUnlocked ? '(Premium)' : ''}</option>
                                <option value="Utility">Utility {!isPremiumUnlocked ? '(Premium)' : ''}</option>
                            </select>
                            <input
                                type="number"
                                placeholder="$ Cost"
                                value={newItemCost}
                                onChange={e => setNewItemCost(Number(e.target.value))}
                                className="w-20 bg-black/30 border border-white/10 rounded-lg px-2 text-sm text-white"
                            />
                            <button type="submit" className="bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20">
                                <Plus size={16} />
                            </button>
                        </form>

                        <div className="space-y-2">
                            {manualItems.map(item => (
                                <div key={item.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white text-sm">{item.name} <span className="text-xs text-slate-500 font-normal">({item.category})</span></div>
                                        <div className="text-success text-xs font-bold">${item.costPerUnit.toFixed(2)}</div>
                                    </div>
                                    <button
                                        onClick={() => removeManualItem(item.id)}
                                        className="p-1.5 text-slate-500 hover:text-alert"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => purchaseManualItem(item)}
                                        disabled={isProcessing}
                                        className="px-3 py-1.5 bg-primary text-black rounded-lg text-xs font-bold hover:bg-primary/90"
                                    >
                                        Log Item
                                    </button>
                                </div>
                            ))}
                            {manualItems.length === 0 && (
                                <div className="text-center py-4 text-xs text-slate-500">
                                    Nothing on your manual list. Add custom items above.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <PremiumModal 
                isOpen={premiumModalOpen} 
                onClose={() => setPremiumModalOpen(false)} 
                title={premiumFeature.title} 
                description={premiumFeature.desc} 
            />
        </div>
    );
}
