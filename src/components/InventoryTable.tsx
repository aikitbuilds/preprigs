import { useState, useMemo } from 'react';
import { InventoryItem } from '../types';
import { Package, Trash2, AlertTriangle, Pencil, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import clsx from 'clsx';

interface InventoryTableProps {
    items: InventoryItem[];
}

function EditableTextCell({ value, onSave }: {
    value: string;
    onSave: (v: string) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    if (editing) {
        return (
            <span className="flex items-center gap-1 w-full max-w-[200px]">
                <input
                    type="text"
                    autoFocus
                    className="flex-1 min-w-0 bg-background border border-primary rounded px-2 py-0.5 text-white text-sm outline-none"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && draft.trim()) { onSave(draft.trim()); setEditing(false); }
                        if (e.key === 'Escape') setEditing(false);
                    }}
                />
                <button onClick={() => { if (draft.trim()) onSave(draft.trim()); setEditing(false); }} className="text-success hover:text-green-300 flex-shrink-0"><Check size={14} /></button>
                <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-white flex-shrink-0"><X size={14} /></button>
            </span>
        );
    }

    return (
        <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="group flex items-center gap-1.5 hover:text-white transition-colors max-w-full text-left"
        >
            <span className="font-semibold text-white text-sm truncate">{value}</span>
            <Pencil size={11} className="opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
        </button>
    );
}

// Inline editable cell for numeric fields
function EditableCell({ value, onSave, prefix = '', suffix = '', step = 1 }: {
    value: number;
    onSave: (v: number) => void;
    prefix?: string;
    suffix?: string;
    step?: number;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(String(value));

    if (editing) {
        return (
            <span className="flex items-center justify-end gap-1">
                <input
                    type="number"
                    step={step}
                    min={0}
                    autoFocus
                    className="w-20 bg-background border border-primary rounded px-2 py-0.5 text-white text-right text-sm outline-none"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') { onSave(Number(draft)); setEditing(false); }
                        if (e.key === 'Escape') setEditing(false);
                    }}
                />
                <button onClick={() => { onSave(Number(draft)); setEditing(false); }} className="text-success hover:text-green-300"><Check size={14} /></button>
                <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-white"><X size={14} /></button>
            </span>
        );
    }

    return (
        <button
            onClick={() => { setDraft(String(value)); setEditing(true); }}
            className="group flex items-center justify-end gap-1 hover:text-white transition-colors"
        >
            <span>{prefix}{typeof value === 'number' && step < 1 ? value.toFixed(2) : value}{suffix}</span>
            <Pencil size={11} className="opacity-0 group-hover:opacity-50 transition-opacity" />
        </button>
    );
}

const CATEGORY_COLORS: Record<string, string> = {
    Food: 'bg-orange-500/10 text-orange-400',
    Water: 'bg-blue-500/10 text-blue-400',
    Medical: 'bg-red-500/10 text-red-400',
    Protection: 'bg-purple-500/10 text-purple-400',
    Utility: 'bg-slate-500/10 text-slate-400',
};

const CATEGORY_PRIORITY: Record<string, number> = { 'Water': 1, 'Food': 2, 'Medical': 3, 'Protection': 4, 'Utility': 5 };

export function InventoryTable({ items }: InventoryTableProps) {
    const removeItem = useInventoryStore((state) => state.removeItem);
    const updateItem = useInventoryStore((state) => state.updateItem);

    const [sortField, setSortField] = useState<'name' | 'quantity' | 'costPerUnit' | 'calories' | 'addedAt'>('addedAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const groupedItems = useMemo(() => {
        // First sort items overall
        const sorted = [...items].sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (valA === undefined) valA = '';
            if (valB === undefined) valB = '';

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // Then group them
        const groups: Record<string, InventoryItem[]> = {};
        sorted.forEach(item => {
            const cat = item.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });

        // Now sort the categories
        return Object.entries(groups).sort(([catA], [catB]) => {
            const priA = CATEGORY_PRIORITY[catA] || 99;
            const priB = CATEGORY_PRIORITY[catB] || 99;
            if (priA !== priB) return priA - priB;
            return catA.localeCompare(catB);
        });
    }, [items, sortField, sortDirection]);

    if (items.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500 border-2 border-dashed border-white/10 rounded-2xl">
                <Package className="mx-auto mb-4 opacity-20" size={48} />
                <div className="text-sm font-semibold">No items logged yet</div>
                <div className="text-xs mt-1 opacity-60">Tap "Log Item" to get started</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Sorting Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-surface border border-white/5 p-3 rounded-xl gap-3">
                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider shrink-0 pl-1">Sort Items By:</span>
                <div className="flex gap-2 text-xs overflow-x-auto hide-scrollbar pb-1 md:pb-0">
                    {(['addedAt', 'name', 'quantity', 'costPerUnit', 'calories'] as const).map(field => (
                        <button
                            key={field}
                            onClick={() => {
                                if (sortField === field) {
                                    setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
                                } else {
                                    setSortField(field);
                                    setSortDirection('desc');
                                }
                            }}
                            className={clsx(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap border transition-all active:scale-95",
                                sortField === field ? "bg-primary text-black font-bold border-primary shadow-[0_0_10px_rgba(249,115,22,0.2)]" : "bg-black/20 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {field === 'costPerUnit' ? 'Cost' : field === 'addedAt' ? 'Date Added' : field.charAt(0).toUpperCase() + field.slice(1)}
                            {sortField === field && (sortDirection === 'asc' ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Render Groups */}
            {groupedItems.map(([category, catItems]) => (
                <div key={category} className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300 px-1 border-b border-white/10 pb-2 flex items-center gap-2">
                        <span className={clsx("w-2.5 h-2.5 rounded-full", CATEGORY_COLORS[category]?.split(' ')[0] || 'bg-slate-500')} />
                        {category} ({catItems.length})
                    </h3>

                    {catItems.map((item) => {
                        const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
                        return (
                            <div key={item.id} className={clsx(
                                "bg-surface rounded-xl border p-4 transition-colors",
                                isExpired ? 'border-alert/40 bg-red-900/10' : 'border-white/5 hover:border-white/10'
                            )}>
                                {/* Row 1: Category + Name + Delete */}
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <EditableTextCell
                                            value={item.name}
                                            onSave={v => updateItem(item.id, { name: v })}
                                        />
                                        {isExpired && <AlertTriangle size={14} className="text-alert inline shrink-0" />}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="flex-shrink-0 p-1 text-slate-600 hover:text-alert transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Row 2: Editable Stats */}
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="bg-black/20 rounded-lg p-2.5">
                                        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Quantity</div>
                                        <div className="text-white font-bold text-right">
                                            <EditableCell
                                                value={item.quantity}
                                                onSave={v => updateItem(item.id, { quantity: v })}
                                                suffix={` ${item.unit}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-2.5">
                                        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Cost / {item.unit}</div>
                                        <div className="text-slate-300 font-bold text-right">
                                            <EditableCell
                                                value={item.costPerUnit}
                                                onSave={v => updateItem(item.id, { costPerUnit: v })}
                                                prefix="$"
                                                step={0.01}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-2.5">
                                        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Calories</div>
                                        <div className="text-slate-400 font-bold text-right">
                                            <EditableCell
                                                value={item.calories}
                                                onSave={v => updateItem(item.id, { calories: v })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
