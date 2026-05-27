import { create } from 'zustand';
import { InventoryItem } from '../types';
import { db } from '../lib/firebase';
import {
    collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc,
    query, where, getDocs
} from 'firebase/firestore';
import { MASTER_INVENTORY_SEED } from '../lib/inventorySeed';

interface InventoryState {
    items: InventoryItem[];
    loading: boolean;
    error: string | null;
    userId: string | null;
    subscribe: (userId: string) => () => void; // Returns unsubscribe function
    addItem: (item: Omit<InventoryItem, 'id' | 'addedAt'>) => Promise<void>;
    updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    seedInventory: (profile: any) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
    items: [],
    loading: true,
    error: null,
    userId: null,

    subscribe: (userId: string) => {
        set({ loading: true, userId });
        const q = query(collection(db, 'inventory'), where('userId', '==', userId));
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const items = snapshot.docs.map(d => ({
                    id: d.id,
                    ...d.data()
                })) as InventoryItem[];
                set({ items, loading: false });
            },
            (error) => {
                console.error("Firestore Error:", error);
                set({ error: error.message, loading: false });
            }
        );
        return unsubscribe;
    },

    addItem: async (item) => {
        const { userId } = get();
        try {
            await addDoc(collection(db, 'inventory'), {
                ...item,
                userId,
                addedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Add Item Error:", error);
        }
    },

    updateItem: async (id, updates) => {
        try {
            await updateDoc(doc(db, 'inventory', id), updates);
        } catch (error) {
            console.error("Update Item Error:", error);
        }
    },

    removeItem: async (id) => {
        try {
            await deleteDoc(doc(db, 'inventory', id));
        } catch (error) {
            console.error("Remove Item Error:", error);
        }
    },

    seedInventory: async (profile) => {
        const { householdSize, zipCode, uid } = profile;

        // Check if user already has inventory — skip re-seeding to prevent duplicates
        const existing = await getDocs(
            query(collection(db, 'inventory'), where('userId', '==', uid))
        );
        if (!existing.empty) {
            console.log('Inventory already seeded for user, skipping.');
            return;
        }

        const isGulf = /houston|texas|florida|louisiana|gulf/i.test(zipCode || '')
            || zipCode?.startsWith('77') || zipCode?.startsWith('70');
        const isCold = /canada|alaska|maine|dakota|montana|winter/i.test(zipCode || '');

        // Build seed list from master catalog, filtering by user's experience phase and adjusting quantities
        const itemsToSeed: Omit<InventoryItem, 'id' | 'addedAt'>[] = MASTER_INVENTORY_SEED
            .filter(seed => {
                if (profile.experienceLevel === 'Beginner') return seed.phase === 'Beginner';
                if (profile.experienceLevel === 'Intermediate') return seed.phase === 'Beginner' || seed.phase === 'Intermediate';
                return true; // Advanced gets all phases
            })
            .map(seed => ({
                name: seed.name,
                category: seed.category,
                unit: seed.unit,
                calories: seed.calories,
                costPerUnit: seed.costPerUnit,
                quantity: Math.ceil(seed.recommendedQuantity * Math.max(1, householdSize / 2)),
            }));

        // Add location-specific extras
        if (isCold) {
            itemsToSeed.push(
                { name: 'Emergency Bivvy / Space Blanket', category: 'Utility', quantity: householdSize, unit: 'pcs', calories: 0, costPerUnit: 12.00 },
                { name: 'Hand Warmers (10 pack)', category: 'Utility', quantity: 2, unit: 'packs', calories: 0, costPerUnit: 8.50 },
                { name: 'High-Calorie Survival Bricks', category: 'Food', quantity: householdSize, unit: 'bricks', calories: 3600, costPerUnit: 10.00 }
            );
        }
        if (isGulf) {
            itemsToSeed.push(
                { name: 'Waterproof Dry Bag (20L)', category: 'Utility', quantity: 2, unit: 'pcs', calories: 0, costPerUnit: 20.00 },
                { name: 'Electrolyte Packets (30 count)', category: 'Water', quantity: 1, unit: 'box', calories: 15, costPerUnit: 24.00 }
            );
        }

        const now = new Date().toISOString();
        for (const item of itemsToSeed) {
            try {
                await addDoc(collection(db, 'inventory'), {
                    ...item,
                    userId: uid,
                    addedAt: now,
                });
            } catch (e) {
                console.error(`Failed to seed: ${item.name}`, e);
            }
        }
        console.log(`Seeded ${itemsToSeed.length} items for user ${uid}`);
    },
}));
