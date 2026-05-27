import { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useChecklistStore } from '../store/useChecklistStore';
import { Download } from 'lucide-react';

export function KnowledgeBase() {
    const inventory = useInventoryStore(state => state.items);
    const checklists = useChecklistStore(state => state.checklists);

    const [downloading, setDownloading] = useState(false);

    const handleDownload = () => {
        setDownloading(true);
        setTimeout(() => {
            const data = {
                exportedAt: new Date().toISOString(),
                inventory,
                checklists
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `protocol-knowledge-base-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setDownloading(false);
        }, 1000);
    };

    return (
        <div className="p-8 pb-32">
            <h2 className="text-2xl font-mono font-bold text-white mb-2">OFFLINE KNOWLEDGE BASE</h2>
            <p className="text-stone-500 font-mono text-sm mb-8">
                SECURE AND DOWNLOAD YOUR DATA TO YOUR LOCAL DEVICE FOR OFFLINE ACCESS DURING CRISIS SCENARIOS.
            </p>

            <div className="bg-surface border border-white/10 rounded-lg p-8 max-w-2xl mt-8">
                <h3 className="text-xl font-mono font-bold text-white mb-4">LOCAL DATABASE EXPORT</h3>
                <div className="space-y-4 text-sm font-mono text-stone-400 mb-8 p-4 bg-black/50 border border-white/5 rounded">
                    <div className="flex justify-between">
                        <span>ASSETS LOGGED:</span>
                        <span className="text-white font-bold">{inventory.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>CHECKLISTS DEPLOYED:</span>
                        <span className="text-white font-bold">{checklists.length}</span>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-4 text-sm font-mono text-stone-400">
                    <p>When communication infrastructure is compromised, cloud synchronization will fail. This utility packages all your logistical manifests, tactical checklists, and scenario blueprints into a single offline-ready JSON artifact.</p>
                    <p className="text-primary mt-2">RECOMMENDATION: Download to a secure, encrypted flash drive monthly.</p>
                </div>

                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="mt-8 px-6 py-4 bg-primary/10 text-primary border border-primary hover:bg-primary hover:text-black font-bold font-mono rounded w-full flex items-center justify-center gap-3 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    <Download size={20} />
                    {downloading ? "GENERATING ARTIFACT..." : "DOWNLOAD SECURE KNOWLEDGE BASE"}
                </button>
            </div>
        </div>
    );
}
