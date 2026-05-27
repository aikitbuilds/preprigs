import { Lock, ShieldCheck, X } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export function PremiumModal({ isOpen, onClose, title, description }: PremiumModalProps) {
    const isDesktopView = useUIStore(state => state.isDesktopView);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-surface border border-white/10 rounded-2xl w-full flex flex-col overflow-hidden shadow-2xl ${isDesktopView ? 'max-w-md' : 'max-w-full'}`}>
                <div className="bg-gradient-to-r from-primary/20 to-surface border-b border-white/10 p-4 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Lock className="text-primary" size={20} />
                        <h2 className="text-lg font-bold text-white tracking-tight">Premium Capability</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full bg-black/20 text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {description}
                    </p>
                    
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4 mt-4 text-left space-y-2">
                        <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider mb-2">To unlock this feature:</p>
                        <div className="flex items-center gap-2 text-sm text-slate-400"><span className="text-primary">1.</span> Complete your first Rig</div>
                        <div className="flex items-center gap-2 text-sm text-slate-400"><span className="text-primary">2.</span> Claim Founder Status on the Dashboard</div>
                        <div className="flex items-center gap-2 text-sm text-slate-400"><span className="text-primary">3.</span> Get Lifetime Premium access for free</div>
                    </div>
                </div>
                
                <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    );
}
