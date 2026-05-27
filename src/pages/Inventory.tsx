import { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { InventoryTable } from '../components/InventoryTable';
import { AddInventoryModal } from '../components/AddInventoryModal';
import { ImageScanModal } from '../components/ImageScanModal';
import { Plus, ScanLine, ListChecks, Monitor, Smartphone, Download } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { ActivityLog } from '../components/ActivityLog';
import { InfographicBanner } from '../components/InfographicBanner';
import { UserProfile } from '../types';
import { PremiumModal } from '../components/PremiumModal';

interface InventoryProps {
    userProfile?: UserProfile | null;
}

export function Inventory({ userProfile }: InventoryProps) {
    const items = useInventoryStore((state) => state.items);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScanOpen, setIsScanOpen] = useState(false);

    const isDesktopView = useUIStore(state => state.isDesktopView);
    const setDesktopView = useUIStore(state => state.setDesktopView);

    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.costPerUnit * item.quantity), 0);

    const [premiumModalOpen, setPremiumModalOpen] = useState(false);
    const [premiumFeature, setPremiumFeature] = useState({ title: '', desc: '' });
    const isPremiumUnlocked = userProfile?.accountTier === 'founder' || userProfile?.accountTier === 'premium';

    const exportToCSV = () => {
        if (!isPremiumUnlocked) {
            setPremiumFeature({
                title: 'Data Export Locked',
                desc: 'Exporting your inventory cache to CSV for secure offline backup is reserved for Premium members and Founders.'
            });
            setPremiumModalOpen(true);
            return;
        }

        if (items.length === 0) return;
        const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Calories', 'Cost Per Unit', 'Total Cost', 'Added At'];
        const csvRows = [headers.join(',')];
        
        items.forEach(item => {
            const date = item.addedAt ? new Date(item.addedAt).toLocaleDateString() : 'N/A';
            const total = (item.costPerUnit * item.quantity).toFixed(2);
            const name = `"${(item.name || '').replace(/"/g, '""')}"`;
            const category = `"${(item.category || '').replace(/"/g, '""')}"`;
            
            csvRows.push([name, category, item.quantity, item.unit, item.calories, item.costPerUnit, total, date].join(','));
        });
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'inventory_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`flex flex-col bg-background min-h-full pb-24 transition-all duration-300 ${isDesktopView ? 'p-8 max-w-7xl mx-auto w-full' : ''}`}>
            {/* Header */}
            <div className={`bg-surface border-b border-white/5 py-3 px-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 ${isDesktopView ? 'rounded-2xl mb-6 border border-white/10' : ''}`}>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-bold text-white tracking-tight">Inventory</h2>
                        <div className="flex gap-2 md:hidden">
                            {/* Mobile short buttons */}
                            <button
                                onClick={exportToCSV}
                                className="flex items-center justify-center bg-surface border border-white/10 text-white w-8 h-8 rounded-xl active:scale-95 transition-all"
                                title="Export to CSV"
                            >
                                <Download size={14} />
                            </button>
                            <button
                                onClick={() => setIsScanOpen(true)}
                                className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-xl font-semibold text-xs active:scale-95 transition-all"
                            >
                                <ScanLine size={14} /> Scan
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-1.5 bg-surface border border-white/10 text-white px-3 py-1.5 rounded-xl font-semibold text-xs active:scale-95 transition-all"
                            >
                                <Plus size={14} /> Log
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-500">
                        <span>Total: <strong className="text-white">{totalItems} items</strong></span>
                        <span>Value: <strong className="text-success">${totalValue.toFixed(2)}</strong></span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Track everything you have, from pantry shelves to your deep freezer. Use AI Scan to photograph shelves or add items manually.</p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-1.5 bg-surface border border-white/10 text-white px-3 py-1.5 rounded-xl font-semibold text-xs hover:bg-white/5 transition-all"
                        >
                            <Download size={14} /> Export
                        </button>
                        <button
                            onClick={() => setIsScanOpen(true)}
                            className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-xl font-semibold text-xs hover:bg-primary/20 transition-all"
                        >
                            <ScanLine size={14} /> AI Scan
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 bg-surface border border-white/10 text-white px-3 py-1.5 rounded-xl font-semibold text-xs hover:bg-white/5 transition-all"
                        >
                            <Plus size={14} /> Log Item
                        </button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 shrink-0">
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
            </div>

            {/* Infographic */}
            <div className={`px-4 md:px-0 mt-4 ${isDesktopView ? '' : 'mb-2'}`}>
                <InfographicBanner
                    title="Stockpile Management"
                    description="Maintain total visibility over your supplies. Log items manually or use AI to snap photos of your shelves to instantly digitize your inventory."
                    features={[
                        { icon: <ScanLine size={16} />, title: "AI Vision", text: "Scan receipts or pantries in seconds." },
                        { icon: <ListChecks size={16} />, title: "Categorized", text: "Auto-sorts into Food, Water, Meds, etc." },
                        { icon: <Download size={16} />, title: "Exportable", text: "Keep a backup CSV offline just in case." }
                    ]}
                />
            </div>

            {/* Content Area */}
            {isDesktopView ? (
                <div className="flex flex-col gap-6 mt-4">
                    <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="sticky top-0 bg-background/80 backdrop-blur-md pb-2 pt-1 mb-2 z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2"><ListChecks size={16} className="text-primary" /> Current Inventory</h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">Everything you currently have in stock, sorted and tracked</p>
                            </div>
                        </div>
                        <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden shadow-sm">
                            <InventoryTable items={items} />
                        </div>
                    </div>
                    {/* Desktop: Activity Log */}
                    <div className="bg-surface rounded-2xl border border-white/5 p-4 shadow-sm">
                        <ActivityLog />
                    </div>
                </div>
            ) : (
                // Mobile Layout
                <div className="p-4 space-y-4">
                    <InventoryTable items={items} />
                    {/* Mobile: Activity Log at bottom */}
                    <div className="bg-surface rounded-2xl border border-white/5 p-4 shadow-sm">
                        <ActivityLog />
                    </div>
                </div>
            )}

            <AddInventoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <ImageScanModal isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
            
            <PremiumModal 
                isOpen={premiumModalOpen} 
                onClose={() => setPremiumModalOpen(false)} 
                title={premiumFeature.title} 
                description={premiumFeature.desc} 
            />
        </div>
    );
}
