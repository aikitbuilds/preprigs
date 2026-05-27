import { InventoryItem } from '../types';

export type MasterSeedItem = Omit<InventoryItem, 'id' | 'addedAt' | 'quantity' | 'expiryDate'> & {
    recommendedQuantity: number;
    description: string;
    phase: 'Beginner' | 'Intermediate' | 'Advanced';
};

export const MASTER_INVENTORY_SEED: MasterSeedItem[] = [
    // ── Water (Hydration & Sanitation) ──
    { name: 'Cases of Bottled Water (40-pack)', category: 'Water', unit: 'cases', calories: 0, costPerUnit: 5.50, recommendedQuantity: 2, description: '1-Week ready-to-drink supply', phase: 'Beginner' },
    { name: 'Water Purification Tablets', category: 'Water', unit: 'bottles', calories: 0, costPerUnit: 12.00, recommendedQuantity: 1, description: 'Emergency treatment for suspect water sources', phase: 'Beginner' },
    { name: '5-Gallon Water Jugs', category: 'Water', unit: 'jugs', calories: 0, costPerUnit: 15.00, recommendedQuantity: 6, description: '1-Month bulk reserve storage', phase: 'Intermediate' },
    { name: 'Gravity Water Filter System', category: 'Water', unit: 'units', calories: 0, costPerUnit: 75.00, recommendedQuantity: 1, description: 'Heavy-duty particulate and bacterial filtration', phase: 'Advanced' },

    // ── Food (Calories & Morale) ──
    { name: 'Ready-to-Eat Canned Soups / Meals', category: 'Food', unit: 'cans', calories: 350, costPerUnit: 2.50, recommendedQuantity: 21, description: '1-Week zero-prep hot meals', phase: 'Beginner' },
    { name: 'High-Calorie Protein Bars', category: 'Food', unit: 'boxes', calories: 2400, costPerUnit: 10.00, recommendedQuantity: 2, description: 'Quick dense calories for high-stress days', phase: 'Beginner' },
    { name: 'Canned Meats (Spam/Chicken/Tuna)', category: 'Food', unit: 'cans', calories: 800, costPerUnit: 3.50, recommendedQuantity: 30, description: '1-Month stable protein rotation', phase: 'Intermediate' },
    { name: 'Bulk White Rice (20lb)', category: 'Food', unit: 'bags', calories: 32000, costPerUnit: 15.00, recommendedQuantity: 2, description: '1-Month baseline carbohydrate', phase: 'Intermediate' },
    { name: 'Bulk Dried Beans (20lb)', category: 'Food', unit: 'bags', calories: 31000, costPerUnit: 18.00, recommendedQuantity: 1, description: 'Pairs with rice for complete amino acids', phase: 'Intermediate' },
    { name: 'Mylar Bags & O2 Absorbers', category: 'Utility', unit: 'kits', calories: 0, costPerUnit: 25.00, recommendedQuantity: 1, description: 'For sealing bulk grains for 20+ years', phase: 'Advanced' },

    // ── Medical (Trauma & Sickness) ──
    { name: 'Comprehensive First Aid Kit', category: 'Medical', unit: 'kits', calories: 0, costPerUnit: 35.00, recommendedQuantity: 1, description: 'Treats cuts, burns, and minor injuries', phase: 'Beginner' },
    { name: 'Over-the-Counter Meds (Ibuprofen, Allergy)', category: 'Medical', unit: 'packs', calories: 0, costPerUnit: 15.00, recommendedQuantity: 2, description: 'Fever reduction and allergic reactions', phase: 'Beginner' },
    { name: 'Trauma Kit (Tourniquet, QuikClot, Gauze)', category: 'Medical', unit: 'kits', calories: 0, costPerUnit: 85.00, recommendedQuantity: 1, description: 'Stop catastrophic bleeding fast', phase: 'Intermediate' },
    { name: 'N95 Respirator Masks', category: 'Medical', unit: 'boxes', calories: 0, costPerUnit: 20.00, recommendedQuantity: 2, description: 'Protection against particulate threats', phase: 'Intermediate' },

    // ── Security (Protection & Prevention) ──
    { name: 'High-Lumen Flashlight + Batteries', category: 'Security', unit: 'kits', calories: 0, costPerUnit: 25.00, recommendedQuantity: 2, description: 'Illumination and visual deterrence', phase: 'Beginner' },
    { name: 'Door Security Bar / Jammer', category: 'Security', unit: 'units', calories: 0, costPerUnit: 30.00, recommendedQuantity: 1, description: 'Harden primary entry points', phase: 'Beginner' },
    { name: 'Pepper Spray / Pepper Gel', category: 'Security', unit: 'cans', calories: 0, costPerUnit: 15.00, recommendedQuantity: 2, description: 'Non-lethal standoff defense', phase: 'Intermediate' },
    { name: 'Fire Extinguisher (ABC Rated)', category: 'Security', unit: 'units', calories: 0, costPerUnit: 45.00, recommendedQuantity: 2, description: 'Critical home safety item', phase: 'Intermediate' },
];
