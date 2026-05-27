import React from 'react';
import { Info } from 'lucide-react';

interface FeatureFeature {
    icon: React.ReactNode;
    title: string;
    text: string;
}

interface InfographicBannerProps {
    title: string;
    description: string;
    features: FeatureFeature[];
}

export function InfographicBanner({ title, description, features }: InfographicBannerProps) {
    return (
        <div className="mb-6 relative overflow-hidden bg-gradient-to-br from-surface to-black border border-white/10 rounded-2xl p-6 shadow-2xl group transition-all duration-300 hover:border-primary/30">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all duration-700" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                            <Info size={16} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                        {description}
                    </p>
                </div>

                <div className="w-full md:w-auto h-px md:h-16 md:w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:flex gap-4 w-full md:w-auto shrink-0">
                    {features.map((feature, idx) => (
                        <div 
                            key={idx} 
                            className="flex items-start gap-3 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-primary">
                                {feature.icon}
                            </div>
                            <div className="mt-0.5">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">{feature.title}</h4>
                                <p className="text-[10px] text-slate-400 max-w-[120px] leading-tight text-balance">{feature.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
