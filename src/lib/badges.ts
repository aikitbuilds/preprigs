export interface Badge {
    id: string;
    name: string;
    points: number;
    icon: string;
    description: string;
    check: (items: any[]) => boolean;
}

// Total Points = 7+10+15+5+10+10+5+8+10+10+10 = 100
export const BADGES: Badge[] = [
    {
        id: 'fire', name: 'Firestarting', points: 7, icon: '🔥',
        description: 'Have 2+ fire starting tools (Matches, Lighters, Ferro Rods).',
        check: (items) => {
            const fireItems = items.filter(i =>
                i.category === 'Utility' &&
                /lighter|match|ferro|flint|fire/i.test(i.name)
            );
            return fireItems.reduce((sum, i) => sum + i.quantity, 0) >= 2;
        }
    },
    {
        id: 'water', name: 'Water Purification', points: 10, icon: '💧',
        description: 'Have at least one water filtration or purification method.',
        check: (items) => items.some(i =>
            i.category === 'Water' &&
            /filter|purification|tablet|lifestraw|sawyer/i.test(i.name)
        )
    },
    {
        id: 'first_aid', name: 'First Aid / CPR', points: 15, icon: '⚕️',
        description: 'Have at least one comprehensive First Aid Kit.',
        check: (items) => items.some(i =>
            i.category === 'Medical' &&
            /kit|first aid|trauma/i.test(i.name)
        )
    },
    {
        id: 'comms', name: 'Emergency Comms', points: 10, icon: '📻',
        description: 'Have a weather radio or emergency communication device.',
        check: (items) => items.some(i =>
            i.category === 'Utility' &&
            /radio|ham|walkie|comm/i.test(i.name)
        )
    },
    {
        id: 'food_pres', name: 'Food Storage', points: 10, icon: '🥫',
        description: 'Stored at least 10 days of food (20,000+ total calories).',
        check: (items) => {
            const totalCals = items.reduce((sum, i) => sum + (i.calories * i.quantity), 0);
            return totalCals >= 20000;
        }
    },
    {
        id: 'knots', name: 'Cordage Mastery', points: 5, icon: '🪢',
        description: 'Have at least 100ft of survival cordage (Paracord/Rope).',
        check: (items) => {
            const cordage = items.filter(i => /paracord|rope|cordage/i.test(i.name));
            return cordage.reduce((sum, i) => sum + i.quantity, 0) >= 1; // Assuming '1 bundle' or similar for now
        }
    },
    {
        id: 'nav', name: 'Navigation', points: 8, icon: '🧭',
        description: 'Have a compass and physical maps of your area.',
        check: (items) => items.some(i => /compass|map/i.test(i.name))
    },
    {
        id: 'defense', name: 'Security & Protection', points: 10, icon: '🛡️',
        description: 'Have vital protection gear (Pepper spray, Tasers, or specialized defense tools).',
        check: (items) => items.some(i => i.category === 'Protection')
    },
    {
        id: 'shelter', name: 'Shelter Building', points: 10, icon: '🏕️',
        description: 'Have emergency shelter (Tarp, Bivvy, or Tent).',
        check: (items) => items.some(i => /tarp|bivvy|tent|emergency blanket/i.test(i.name))
    },
    {
        id: 'garden', name: 'Sustainability', points: 10, icon: '🌱',
        description: 'Have 5+ varieties of heirloom seeds for long-term food.',
        check: (items) => items.some(i => /seed/i.test(i.name))
    },
];
