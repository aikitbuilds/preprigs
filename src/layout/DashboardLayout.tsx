import { ReactNode } from 'react';
import { Sidebar as Navigation } from '../components/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
    demoMode?: boolean;
    onExitDemo?: () => void;
}

export function DashboardLayout({ children, activePage, onNavigate, demoMode, onExitDemo }: DashboardLayoutProps) {
    return (
        <div className="flex flex-col h-screen w-full bg-background text-white overflow-hidden font-sans">
            {/* Top Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-4 bg-surface border-b border-white/10 z-10">
                <div>
                    <h1 className="text-lg font-bold text-primary tracking-tight">PrepRigs</h1>
                    <div className="text-xs text-slate-400">Prep Rigs</div>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                    {demoMode ? (
                        <button
                            onClick={onExitDemo}
                            className="text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary border border-primary/30 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors"
                        >
                            Demo Mode — Exit
                        </button>
                    ) : (
                        <>
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Online</span>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0">
                {children}
            </main>

            {/* Bottom Navigation */}
            <Navigation activePage={activePage} onNavigate={onNavigate} />
        </div>
    );
}
