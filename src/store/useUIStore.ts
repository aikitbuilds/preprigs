import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
    isDesktopView: boolean;
    setDesktopView: (isDesktop: boolean) => void;
    toggleDesktopView: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            isDesktopView: false,
            setDesktopView: (isDesktop) => set({ isDesktopView: isDesktop }),
            toggleDesktopView: () => set((state) => ({ isDesktopView: !state.isDesktopView })),
        }),
        {
            name: 'prepproto-ui-storage',
        }
    )
);
