import { useState, useRef } from 'react';
import { X, Camera, Upload, Loader2, Check, Trash2, ScanLine, ImagePlus } from 'lucide-react';
import { parseInventoryImage } from '../lib/gemini';
import { useInventoryStore } from '../store/useInventoryStore';
import { InventoryItem } from '../types';
import clsx from 'clsx';

type ScannedItem = Omit<InventoryItem, 'id' | 'addedAt'>;

interface ImageScanModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'upload' | 'scanning' | 'review';

const CATEGORY_COLORS: Record<string, string> = {
    Food: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Water: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Medical: 'bg-red-500/20 text-red-400 border-red-500/30',
    Protection: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Utility: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export function ImageScanModal({ isOpen, onClose }: ImageScanModalProps) {
    const addItem = useInventoryStore(state => state.addItem);

    const [step, setStep] = useState<Step>('upload');
    const [preview, setPreview] = useState<string | null>(null);
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [photosScanned, setPhotosScanned] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const addMoreFileRef = useRef<HTMLInputElement>(null);
    const addMoreCameraRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setStep('upload');
        setPreview(null);
        setScannedItems([]);
        setSelectedIds(new Set());
        setError(null);
        setPhotosScanned(0);
    };

    const handleClose = () => { reset(); onClose(); };




    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        processMultipleFiles(Array.from(files).slice(0, 5));
        e.target.value = '';
    };

    const handleAddMoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        processMultipleFiles(Array.from(files).slice(0, 5), true);
        e.target.value = '';
    };

    const processMultipleFiles = async (files: File[], append = false) => {
        // Show preview of last image
        const lastFile = files[files.length - 1];
        const reader = new FileReader();
        reader.onload = e => setPreview(e.target?.result as string);
        reader.readAsDataURL(lastFile);

        setStep('scanning');
        setError(null);

        try {
            // Process all images in parallel
            const results = await Promise.all(files.map(f => parseInventoryImage(f)));
            const allNewItems = results.flat();

            if (append) {
                setScannedItems(prev => {
                    const combined = [...prev, ...allNewItems];
                    setSelectedIds(new Set(combined.map((_, i) => i)));
                    return combined;
                });
            } else {
                setScannedItems(allNewItems);
                setSelectedIds(new Set(allNewItems.map((_, i) => i)));
            }
            setPhotosScanned(prev => prev + files.length);
            setStep('review');
        } catch (e) {
            setError('AI scan failed on one or more images. Try clearer photos.');
            setStep(append ? 'review' : 'upload');
        }
    };

    const updateItem = (index: number, updates: Partial<ScannedItem>) => {
        setScannedItems(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
    };

    const toggleSelect = (index: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const removeItem = (index: number) => {
        setScannedItems(prev => prev.filter((_, i) => i !== index));
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(index);
            return next;
        });
    };

    const handleConfirm = async () => {
        const toAdd = scannedItems.filter((_, i) => selectedIds.has(i));
        for (const item of toAdd) {
            await addItem(item);
        }
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col z-[60] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 bg-surface border-b border-white/10">
                <div className="flex items-center gap-2">
                    <ScanLine size={20} className="text-primary" />
                    <h3 className="font-bold text-white">AI Inventory Scanner</h3>
                    {photosScanned > 0 && (
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                            {photosScanned} photo{photosScanned > 1 ? 's' : ''} scanned
                        </span>
                    )}
                </div>
                <button onClick={handleClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">

                {/* ── STEP: UPLOAD ── */}
                {step === 'upload' && (
                    <div className="flex flex-col items-center justify-center min-h-full p-6 gap-6">
                        {/* Preview or placeholder */}
                        <div className="w-full max-w-xs aspect-square rounded-2xl border-2 border-dashed border-white/20 overflow-hidden flex items-center justify-center bg-surface">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <div className="text-center text-slate-500 p-8">
                                    <ScanLine size={48} className="mx-auto mb-3 opacity-30" />
                                    <div className="text-sm font-semibold">Take or upload photos of your supplies</div>
                                    <div className="text-xs mt-1 opacity-60">Select up to 5 images at once</div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="w-full max-w-xs bg-alert/10 border border-alert/30 text-alert text-sm rounded-xl p-3">{error}</div>
                        )}

                        {/* Action Buttons */}
                        <div className="w-full max-w-xs flex flex-col gap-3">
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-3 bg-primary text-black font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform"
                            >
                                <Camera size={22} />
                                Take a Photo
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-3 bg-surface border border-white/10 text-white font-semibold py-4 rounded-2xl text-base active:scale-95 transition-transform"
                            >
                                <Upload size={20} />
                                Upload from Gallery
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 text-center max-w-xs">
                            Your image is sent to <strong className="text-slate-400">Google Gemini AI</strong> for analysis. It identifies items, quantities, categories, and estimated calories.
                        </p>

                        {/* Hidden file inputs */}
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                    </div>
                )}

                {/* ── STEP: SCANNING ── */}
                {step === 'scanning' && (
                    <div className="flex flex-col items-center justify-center min-h-full p-8 gap-6">
                        {preview && (
                            <div className="w-48 h-48 rounded-2xl overflow-hidden relative">
                                <img src={preview} className="w-full h-full object-cover" alt="Scanning..." />
                                <div className="absolute inset-0 bg-primary/10" />
                                <div className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_8px_2px_rgba(59,130,246,0.8)] animate-bounce top-1/2" />
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-primary">
                            <Loader2 size={24} className="animate-spin" />
                            <span className="font-semibold">AI is analyzing your image…</span>
                        </div>
                        <p className="text-xs text-slate-500 text-center">
                            {photosScanned > 0 ? `Adding to your ${scannedItems.length} existing items...` : 'Identifying items, estimating quantities and calories'}
                        </p>
                    </div>
                )}

                {/* ── STEP: REVIEW ── */}
                {step === 'review' && (
                    <div className="flex flex-col pb-4">
                        {/* Thumbnail + summary */}
                        <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-surface">
                            {preview && <img src={preview} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" alt="Scanned" />}
                            <div>
                                <div className="font-bold text-white text-sm">{scannedItems.length} items detected from {photosScanned} photo{photosScanned > 1 ? 's' : ''}</div>
                                <div className="text-xs text-slate-400">Tap to deselect, edit quantities/costs before saving</div>
                            </div>
                        </div>

                        {scannedItems.length === 0 ? (
                            <div className="text-center py-16 text-slate-500">
                                <p className="text-sm">No items were detected.</p>
                                <button onClick={reset} className="text-primary text-sm mt-2 underline">Try another photo</button>
                            </div>
                        ) : (
                            <div className="p-4 space-y-3">
                                {scannedItems.map((item, index) => {
                                    const isSelected = selectedIds.has(index);
                                    return (
                                        <div key={index} className={clsx(
                                            'rounded-xl border transition-all',
                                            isSelected ? 'border-primary/40 bg-primary/5' : 'border-white/5 bg-surface opacity-50'
                                        )}>
                                            {/* Item Header */}
                                            <div className="flex items-center gap-3 p-3">
                                                {/* Select Toggle */}
                                                <button
                                                    onClick={() => toggleSelect(index)}
                                                    className={clsx(
                                                        'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                                                        isSelected ? 'bg-primary border-primary' : 'border-slate-600 bg-transparent'
                                                    )}
                                                >
                                                    {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        className="w-full bg-transparent font-semibold text-white text-sm outline-none border-b border-transparent focus:border-primary/50 transition-colors"
                                                        value={item.name}
                                                        onChange={e => updateItem(index, { name: e.target.value })}
                                                    />
                                                    <span className={clsx('mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block', CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Utility)}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <button onClick={() => removeItem(index)} className="text-slate-600 hover:text-alert p-1 flex-shrink-0">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            {/* Editable stats */}
                                            {isSelected && (
                                                <div className="grid grid-cols-3 gap-2 px-3 pb-3">
                                                    {[
                                                        { label: 'Quantity', field: 'quantity', value: item.quantity, type: 'number', step: 1, suffix: ` ${item.unit}` },
                                                        { label: `Cost / ${item.unit}`, field: 'costPerUnit', value: item.costPerUnit, type: 'number', step: 0.01, prefix: '$' },
                                                        { label: 'Calories', field: 'calories', value: item.calories, type: 'number', step: 10, suffix: '' },
                                                    ].map(({ label, field, value, type, step: stepSize, prefix = '', suffix = '' }) => (
                                                        <div key={field} className="bg-black/20 rounded-lg p-2">
                                                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 truncate">{label}</div>
                                                            <div className="flex items-center gap-0.5">
                                                                {prefix && <span className="text-xs text-slate-400">{prefix}</span>}
                                                                <input
                                                                    type={type}
                                                                    step={stepSize}
                                                                    min={0}
                                                                    className="w-full bg-transparent text-white font-bold text-sm outline-none"
                                                                    value={value as number}
                                                                    onChange={e => updateItem(index, { [field]: Number(e.target.value) } as Partial<ScannedItem>)}
                                                                />
                                                                {suffix && <span className="text-[10px] text-slate-500 truncate">{suffix}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Action Bar — inside flex flow, NOT fixed */}
            {step === 'review' && (
                <div className="flex-shrink-0 p-4 pb-6 bg-surface border-t border-white/10 flex flex-col gap-3">
                    {/* Confirm Row — FIRST so it's always visible */}
                    <button
                        onClick={handleConfirm}
                        disabled={selectedIds.size === 0}
                        className="w-full py-4 rounded-2xl bg-success text-slate-900 font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    >
                        <Check size={20} strokeWidth={2.5} />
                        Add {selectedIds.size} Item{selectedIds.size !== 1 ? 's' : ''} to Inventory
                    </button>
                    {/* Scan More Photos Row */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => addMoreCameraRef.current?.click()}
                            className="flex-1 py-3 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <Camera size={16} />
                            Scan More
                        </button>
                        <button
                            onClick={() => addMoreFileRef.current?.click()}
                            className="flex-1 py-3 rounded-xl border border-white/10 bg-black/20 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <ImagePlus size={16} />
                            Upload More
                        </button>
                    </div>
                    {/* Hidden inputs for "add more" */}
                    <input ref={addMoreFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAddMoreFile} />
                    <input ref={addMoreCameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleAddMoreFile} />
                </div>
            )}
        </div>
    );
}
