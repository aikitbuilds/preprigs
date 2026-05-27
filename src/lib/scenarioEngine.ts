import { InventoryItem, Scenario, GapAnalysis } from '../types';

export const SCENARIOS: Scenario[] = [
    {
        id: 'houston-hurricane',
        name: 'HOUSTON HURRICANE',
        description: 'Cat 4 Hurricane. Power grid down. Flooding. 14 Days isolation.',
        durationDays: 14,
        people: 4,
        requirements: [
            { name: 'Water', category: 'Water', quantity: 56, unit: 'gallons' }, // 1 gal/person/day
            { name: 'Canned Food', category: 'Food', quantity: 168, unit: 'cans' }, // 3 cans/person/day
            { name: 'First Aid Kit', category: 'Medical', quantity: 1, unit: 'kit' },
            { name: 'Flashlight', category: 'Utility', quantity: 4, unit: 'units' },
            { name: 'Batteries AA', category: 'Utility', quantity: 24, unit: 'units' },
        ]
    },
    {
        id: 'texas-grid-fail',
        name: 'TEXAS GRID FAILURE',
        description: 'Deep freeze. No power/water/gas for 3 weeks. Temperature drops.',
        durationDays: 21,
        people: 4,
        requirements: [
            { name: 'Water', category: 'Water', quantity: 84, unit: 'gallons' },
            { name: 'Propane Tank', category: 'Utility', quantity: 4, unit: 'tanks' },
            { name: 'Warm Blankets', category: 'Utility', quantity: 8, unit: 'units' },
            { name: 'Rice', category: 'Food', quantity: 20, unit: 'lbs' },
            { name: 'Beans', category: 'Food', quantity: 10, unit: 'lbs' },
        ]
    },
    {
        id: 'civil-unrest',
        name: 'CIVIL UNREST / WW3',
        description: 'Supply chain collapse. High security threat. 90 Days isolation.',
        durationDays: 90,
        people: 4,
        requirements: [
            { name: 'Water', category: 'Water', quantity: 360, unit: 'gallons' }, // Rationed
            { name: 'MRE / Freeze Dried', category: 'Food', quantity: 1080, unit: 'meals' }, // 3 meals/day
            { name: 'Antibiotics', category: 'Medical', quantity: 4, unit: 'courses' },
            { name: 'Ammo 9mm', category: 'Protection', quantity: 1000, unit: 'rounds' },
            { name: 'Ammo 5.56', category: 'Protection', quantity: 2000, unit: 'rounds' },
        ]
    }
];

export function analyzeGap(scenario: Scenario, inventory: InventoryItem[]): GapAnalysis {
    let totalRequiredWeight = 0;
    let totalFulfilledWeight = 0;
    const missingItems = [];

    for (const req of scenario.requirements) {
        // Simple matching by name or category for now
        // In a real app, strict matching or tagging is better.
        // Here we match items that include the requirement name string (case-insensitive) OR match category if generic

        const matchingItems = inventory.filter(i =>
            i.name.toLowerCase().includes(req.name.toLowerCase()) ||
            (req.name === req.category && i.category === req.category) // e.g. Req "Water" matches Category "Water"
        );

        const currentQty = matchingItems.reduce((sum, item) => sum + item.quantity, 0);
        const missing = Math.max(0, req.quantity - currentQty);

        totalRequiredWeight += 1; // Equal weighting for simplicity
        if (currentQty >= req.quantity) {
            totalFulfilledWeight += 1;
        } else {
            totalFulfilledWeight += (currentQty / req.quantity);
            missingItems.push({
                name: req.name,
                required: req.quantity,
                current: currentQty,
                missing: missing,
                unit: req.unit
            });
        }
    }

    const score = Math.round((totalFulfilledWeight / totalRequiredWeight) * 100) || 0;

    return {
        scenarioId: scenario.id,
        readinessScore: score,
        missingItems
    };
}
