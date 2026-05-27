import { useInventoryStore } from '../store/useInventoryStore';
import { SCENARIOS, analyzeGap } from '../lib/scenarioEngine';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export function Scenarios() {
    const inventory = useInventoryStore(state => state.items);

    return (
        <div className="p-8 pb-32">
            <h2 className="text-2xl font-mono font-bold text-white mb-8">THREAT SIMULATION & GAP ANALYSIS</h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {SCENARIOS.map(scenario => {
                    const analysis = analyzeGap(scenario, inventory);
                    const isReady = analysis.readinessScore === 100;

                    return (
                        <div key={scenario.id} className="bg-surface border border-white/10 rounded-lg overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 bg-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-mono font-bold text-white uppercase">{scenario.name}</h3>
                                    <div className={clsx("flex items-center gap-2 px-3 py-1 rounded font-bold font-mono text-sm",
                                        isReady ? "bg-success/10 text-success" : "bg-alert/10 text-alert"
                                    )}>
                                        {isReady ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                        {analysis.readinessScore}% READY
                                    </div>
                                </div>
                                <p className="text-sm text-stone-400 mb-4">{scenario.description}</p>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                                    <div
                                        className={clsx("h-full transition-all duration-500",
                                            analysis.readinessScore > 80 ? "bg-success" :
                                                analysis.readinessScore > 40 ? "bg-primary" : "bg-alert"
                                        )}
                                        style={{ width: `${analysis.readinessScore}%` }}
                                    />
                                </div>
                            </div>

                            {/* Requirements List */}
                            <div className="p-6 flex-1 overflow-auto">
                                <h4 className="font-mono text-xs text-stone-500 mb-4 uppercase tracking-wider">CRITICAL REQUIREMENTS</h4>

                                {analysis.missingItems.length === 0 ? (
                                    <div className="text-success font-mono text-sm flex items-center gap-2">
                                        <Shield size={16} />
                                        ALL SYSTEMS GO. FULLY PREPARED.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {analysis.missingItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                                <span className="text-stone-300">{item.name}</span>
                                                <div className="text-right">
                                                    <div className="text-alert font-bold">-{item.missing} {item.unit}</div>
                                                    <div className="text-xs text-stone-600">Have {item.current} / Need {item.required}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
