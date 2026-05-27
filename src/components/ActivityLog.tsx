import { useState } from 'react';
import { useActivityLogStore } from '../store/useActivityLogStore';
import { ClipboardList, ShoppingCart, ChefHat, Trash2, RotateCw, StickyNote, PackageMinus, Plus, X } from 'lucide-react';

const TYPE_CONFIG: Record<string, { icon: typeof ShoppingCart; color: string; label: string }> = {
    purchase: { icon: ShoppingCart, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'Purchase' },
    homemade: { icon: ChefHat, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Homemade' },
    consumed: { icon: PackageMinus, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', label: 'Used' },
    expired: { icon: Trash2, color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Expired' },
    rotated: { icon: RotateCw, color: 'text-green-400 bg-green-500/10 border-green-500/20', label: 'Rotated' },
    note: { icon: StickyNote, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'Note' },
};

export function ActivityLog() {
    const entries = useActivityLogStore(state => state.entries);
    const addEntry = useActivityLogStore(state => state.addEntry);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEntry, setNewEntry] = useState({ type: 'note' as string, title: '', description: '' });

    const handleAddManual = () => {
        if (!newEntry.title.trim()) return;
        addEntry({
            type: newEntry.type as any,
            title: newEntry.title,
            description: newEntry.description,
        });
        setNewEntry({ type: 'note', title: '', description: '' });
        setShowAddForm(false);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-white">Activity Log</h3>
                    <span className="text-[9px] text-slate-500 bg-black/30 px-1.5 py-0.5 rounded-full">{entries.length}</span>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
                >
                    {showAddForm ? <X size={10} /> : <Plus size={10} />}
                    {showAddForm ? 'Cancel' : 'Add Entry'}
                </button>
            </div>

            <p className="text-[10px] text-slate-500 mb-3">Track purchases, homemade batches, rotations, and notes about your inventory.</p>

            {showAddForm && (
                <div className="bg-black/30 rounded-xl border border-white/5 p-3 mb-3 space-y-2">
                    <select
                        className="w-full bg-black/50 border border-white/10 p-2 rounded-lg text-white text-xs outline-none"
                        value={newEntry.type}
                        onChange={e => setNewEntry({ ...newEntry, type: e.target.value })}
                    >
                        <option value="purchase">🛒 Purchase</option>
                        <option value="homemade">👨‍🍳 Homemade</option>
                        <option value="consumed">📦 Used/Consumed</option>
                        <option value="rotated">🔄 Rotated Stock</option>
                        <option value="expired">🗑️ Expired/Disposed</option>
                        <option value="note">📝 General Note</option>
                    </select>
                    <input
                        placeholder="Title: e.g. Made 25 mason jars of beef stew"
                        className="w-full bg-black/50 border border-white/10 p-2 rounded-lg text-white text-xs outline-none"
                        value={newEntry.title}
                        onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Details: contents, shelf location, batch notes..."
                        className="w-full bg-black/50 border border-white/10 p-2 rounded-lg text-white text-xs outline-none resize-none h-16"
                        value={newEntry.description}
                        onChange={e => setNewEntry({ ...newEntry, description: e.target.value })}
                    />
                    <button
                        onClick={handleAddManual}
                        className="w-full py-2 bg-primary text-black font-bold text-xs rounded-lg active:scale-95 transition-all"
                    >
                        Save Entry
                    </button>
                </div>
            )}

            {entries.length === 0 ? (
                <div className="text-center py-8 text-slate-600">
                    <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No activity yet. Add items to your inventory or log a manual entry.</p>
                </div>
            ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                    {entries.map(entry => {
                        const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.note;
                        const Icon = config.icon;
                        return (
                            <div key={entry.id} className={`flex gap-3 p-2.5 rounded-xl border ${config.color} transition-all`}>
                                <div className="flex-shrink-0 mt-0.5">
                                    <Icon size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-white truncate">{entry.title}</span>
                                        <span className="text-[9px] text-slate-500 flex-shrink-0">{formatDate(entry.timestamp)}</span>
                                    </div>
                                    {entry.description && (
                                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{entry.description}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
