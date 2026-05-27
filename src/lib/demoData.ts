import { InventoryItem } from '../types';
import { useChecklistStore } from '../store/useChecklistStore';

export const BEGINNER_DEMO_INVENTORY: Omit<InventoryItem, 'id' | 'addedAt'>[] = [
    { name: 'Bottled Water (1L)', category: 'Water', quantity: 12, unit: 'bottles', calories: 0, costPerUnit: 1.00, expiryDate: '2028-01-01' },
    { name: 'Canned Soup', category: 'Food', quantity: 10, unit: 'cans', calories: 250, costPerUnit: 1.50, expiryDate: '2026-06-01' },
    { name: 'Protein Bars', category: 'Food', quantity: 12, unit: 'bars', calories: 200, costPerUnit: 2.00, expiryDate: '2025-12-01' },
    { name: 'Basic First Aid Kit', category: 'Medical', quantity: 1, unit: 'kit', calories: 0, costPerUnit: 25.00, expiryDate: '2028-01-01' },
    { name: 'LED Flashlight', category: 'Utility', quantity: 2, unit: 'units', calories: 0, costPerUnit: 12.99, expiryDate: '' },
    { name: 'AA Batteries', category: 'Utility', quantity: 24, unit: 'units', calories: 0, costPerUnit: 0.50, expiryDate: '2034-01-01' },
    { name: 'N95 Masks', category: 'Medical', quantity: 10, unit: 'units', calories: 0, costPerUnit: 2.00, expiryDate: '2029-01-01' },
    { name: 'Pocket Knife', category: 'Utility', quantity: 1, unit: 'unit', calories: 0, costPerUnit: 25.00, expiryDate: '' },
];

export const ADVANCED_DEMO_INVENTORY: Omit<InventoryItem, 'id' | 'addedAt'>[] = [
    { name: 'Calrose Rice (Mylar)', category: 'Food', quantity: 250, unit: 'lbs', calories: 158400, costPerUnit: 0.89, expiryDate: '2050-01-01' },
    { name: 'Pinto Beans (Dry bucket)', category: 'Food', quantity: 150, unit: 'lbs', calories: 235500, costPerUnit: 1.20, expiryDate: '2050-01-01' },
    { name: 'Freeze-Dried Chicken', category: 'Food', quantity: 24, unit: 'cans', calories: 2880, costPerUnit: 24.99, expiryDate: '2050-01-01' },
    { name: 'Rolled Oats', category: 'Food', quantity: 50, unit: 'lbs', calories: 85000, costPerUnit: 0.75, expiryDate: '2050-01-01' },
    { name: 'Water (55 gal drum)', category: 'Water', quantity: 4, unit: 'drums', calories: 0, costPerUnit: 60.00, expiryDate: '2028-01-01' },
    { name: 'LifeStraw Family', category: 'Water', quantity: 2, unit: 'units', calories: 0, costPerUnit: 75.00, expiryDate: '2035-01-01' },
    { name: 'Trauma Kit (IFAK)', category: 'Medical', quantity: 4, unit: 'kits', calories: 0, costPerUnit: 120.00, expiryDate: '2028-06-01' },
    { name: 'Antibiotics Course', category: 'Medical', quantity: 5, unit: 'bottles', calories: 0, costPerUnit: 45.00, expiryDate: '2026-01-01' },
    { name: 'Solar Generator 2000W', category: 'Utility', quantity: 1, unit: 'unit', calories: 0, costPerUnit: 1500.00, expiryDate: '' },
    { name: 'Baofeng UV-5R Radio', category: 'Utility', quantity: 6, unit: 'units', calories: 0, costPerUnit: 25.00, expiryDate: '' },
    { name: 'Heirloom Seed Vault', category: 'Food', quantity: 2, unit: 'kits', calories: 0, costPerUnit: 49.00, expiryDate: '2030-01-01' },
    { name: '9mm JHP', category: 'Protection', quantity: 1000, unit: 'rounds', calories: 0, costPerUnit: 45, expiryDate: '' },
    { name: '5.56 NATO M855', category: 'Protection', quantity: 2000, unit: 'rounds', calories: 0, costPerUnit: 60, expiryDate: '' },
    { name: 'Level IV Body Armor', category: 'Utility', quantity: 2, unit: 'sets', calories: 0, costPerUnit: 450.00, expiryDate: '2030-01-01' },
    { name: 'NVD (PVS-14)', category: 'Utility', quantity: 1, unit: 'unit', calories: 0, costPerUnit: 3500.00, expiryDate: '' }
];

export const DEMO_STORAGE_KEY = 'protocol_inventory_demo';
export type DemoLevel = 'beginner' | 'advanced';

export function seedDemoInventory(level: DemoLevel) {
    const data = level === 'advanced' ? ADVANCED_DEMO_INVENTORY : BEGINNER_DEMO_INVENTORY;

    // 1. Seed Inventory
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(
        data.map((item, i) => ({
            ...item,
            id: `demo-${level}-${i}`,
            addedAt: new Date().toISOString(),
        }))
    ));

    // 2. Seed Checklists (simulate progress)
    // We update the state directly by getting the store, 
    // simulating checkmarks on the Bugout Backpack for beginners, and all for advanced.
    const checklistStore = useChecklistStore.getState();
    const checklists = checklistStore.checklists;

    if (checklists.length > 0) {
        checklists.forEach(cl => {
            cl.items.forEach(item => {
                if (level === 'advanced') {
                    // Advanced: ~80% checked off randomly
                    item.completed = Math.random() > 0.2;
                } else {
                    // Beginner: only Bugout backpack gets a few checks
                    if (cl.title.includes('Bugout')) {
                        item.completed = Math.random() > 0.5;
                    } else {
                        item.completed = false;
                    }
                }
            });
        });
        localStorage.setItem('protocol_checklists_v2', JSON.stringify(checklists));
    }
}

export function clearDemoInventory() {
    localStorage.removeItem(DEMO_STORAGE_KEY);

    // Reset checklists
    const checklistStore = useChecklistStore.getState();
    const checklists = checklistStore.checklists;
    checklists.forEach(cl => cl.items.forEach(item => item.completed = false));
    localStorage.setItem('protocol_checklists_v2', JSON.stringify(checklists));
}
