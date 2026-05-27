import { LayoutDashboard, Package, ListTodo, UserCircle, BrainCircuit, Hammer } from 'lucide-react';
import clsx from 'clsx';

interface NavProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: NavProps) {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'intelligence', label: 'Intelligence', icon: BrainCircuit },
        { id: 'checklists', label: 'Checklists', icon: ListTodo },
        { id: 'builder', label: 'Builder', icon: Hammer },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'profile', label: 'Profile', icon: UserCircle },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 z-50 safe-area-pb">
            <div className="flex">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            onClick={() => onNavigate(item.id)}
                            style={{ flex: 1 }}
                            className={clsx(
                                "flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-slate-500 hover:text-slate-200 active:text-slate-200"
                            )}
                        >
                            <Icon size={26} strokeWidth={isActive ? 2.5 : 1.75} />
                            <span className={clsx("text-[11px] font-semibold tracking-tight", isActive ? "text-primary" : "text-slate-500")}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
