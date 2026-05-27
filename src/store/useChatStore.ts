import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

interface ChatState {
    messages: ChatMessage[];
    preferences: string[];
    addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    addPreference: (pref: string) => void;
    removePreference: (pref: string) => void;
    clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            messages: [],
            preferences: [],
            addMessage: (msg) => set((state) => ({
                messages: [...state.messages, {
                    ...msg,
                    id: Math.random().toString(36).substring(7),
                    timestamp: new Date().toISOString()
                }]
            })),
            addPreference: (pref) => set((state) => ({
                preferences: state.preferences.includes(pref) ? state.preferences : [...state.preferences, pref]
            })),
            removePreference: (pref) => set((state) => ({
                preferences: state.preferences.filter(p => p !== pref)
            })),
            clearChat: () => set({ messages: [] })
        }),
        {
            name: 'prepproto-chat-storage',
        }
    )
);
