import { useState } from 'react';
import { X } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useActivityLogStore } from '../store/useActivityLogStore';

interface AddInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SOURCES = ['', 'Costco/Sams', 'Amazon/Online', 'Local Groceries', 'Specialty Preppers', 'Homemade'] as const;
const STORAGE_LOCATIONS = ['', 'Pantry', 'Deep Freezer', 'Refrigerator', 'Garage', 'Go-Bag', 'Other'] as const;

export function AddInventoryModal({ isOpen, onClose }: AddInventoryModalProps) {
    const addItem = useInventoryStore((state) => state.addItem);
    const addEntry = useActivityLogStore((state) => state.addEntry);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Food',
        quantity: 1,
        unit: 'units',
        calories: 0,
        costPerUnit: 0,
        source: '' as string,
        storageLocation: '' as string,
        notes: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addItem({
            ...formData,
            category: formData.category as any,
            source: formData.source as any,
            storageLocation: formData.storageLocation as any,
        });

        // Log it to the Activity Log
        addEntry({
            type: formData.source === 'Homemade' ? 'homemade' : 'purchase',
            title: `Added: ${formData.name}`,
            description: `${formData.quantity} ${formData.unit} of ${formData.name}${formData.source ? ` from ${formData.source}` : ''}${formData.storageLocation ? ` → stored in ${formData.storageLocation}` : ''}${formData.notes ? ` | Note: ${formData.notes}` : ''}`,
            category: formData.category,
        });

        onClose();
        setFormData({ name: '', category: 'Food', quantity: 1, unit: 'units', calories: 0, costPerUnit: 0, source: '', storageLocation: '', notes: '' });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-surface border border-white/10 w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-white/10 sticky top-0 bg-surface z-10">
                    <h3 className="font-bold text-white text-base">Add New Item</h3>
                    <button onClick={onClose} className="text-stone-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
                    <div>
                        <label className="block text-slate-400 mb-1 text-xs font-semibold">ITEM NAME</label>
                        <input
                            required
                            placeholder="e.g. Bush's Pinto Beans, 25 Mason Jars..."
                            className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 mb-1 text-xs font-semibold">CATEGORY</label>
                            <select
                                className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {['Food', 'Water', 'Medical', 'Protection', 'Utility'].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1 text-xs font-semibold">UNIT TYPE</label>
                            <input
                                placeholder="cans, lbs, boxes..."
                                className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white outline-none"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 mb-1 text-xs font-semibold">QUANTITY</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white outline-none"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1 text-xs font-semibold">COST PER UNIT ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white outline-none"
                                value={formData.costPerUnit}
                                onChange={e => setFormData({ ...formData, costPerUnit: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-1 text-xs font-semibold">CALORIES (TOTAL)</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white outline-none"
                            value={formData.calories}
                            onChange={e => setFormData({ ...formData, calories: Number(e.target.value) })}
                        />
                    </div>

                    {/* ── NEW: Source & Storage ── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 mb-1 text-xs font-semibold">SOURCE</label>
                            <select
                                className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white outline-none"
                                value={formData.source}
                                onChange={e => setFormData({ ...formData, source: e.target.value })}
                            >
                                <option value="">Select Source</option>
                                {SOURCES.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1 text-xs font-semibold">STORAGE</label>
                            <select
                                className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white outline-none"
                                value={formData.storageLocation}
                                onChange={e => setFormData({ ...formData, storageLocation: e.target.value })}
                            >
                                <option value="">Select Location</option>
                                {STORAGE_LOCATIONS.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ── Notes ── */}
                    <div>
                        <label className="block text-slate-400 mb-1 text-xs font-semibold">NOTES (OPTIONAL)</label>
                        <textarea
                            placeholder="e.g. Made 25 mason jars with beef stew, stored on shelf 3..."
                            className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-white outline-none resize-none h-20"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-black font-bold py-3.5 rounded-2xl text-base hover:brightness-110 active:scale-95 transition-all mt-2"
                    >
                        Add to Inventory
                    </button>
                </form>
            </div>
        </div>
    );
}
