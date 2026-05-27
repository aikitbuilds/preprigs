import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActivityLogEntry } from '../types';

interface ActivityLogState {
    entries: ActivityLogEntry[];
    addEntry: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
    clearLog: () => void;
}

export const useActivityLogStore = create<ActivityLogState>()(
    persist(
        (set) => ({
            entries: [],
            addEntry: (entry) => set((state) => ({
                entries: [{
                    ...entry,
                    id: Math.random().toString(36).substring(7),
                    timestamp: new Date().toISOString()
                }, ...state.entries]
            })),
            clearLog: () => set({ entries: [] })
        }),
        {
            name: 'prepproto-activity-log',
        }
    )
);
