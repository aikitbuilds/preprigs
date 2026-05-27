export interface UserProfile {
    uid: string;
    householdSize: number;
    locationType: 'Urban' | 'Suburban' | 'Rural';
    experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    onboardingCompleted: boolean;
    earnedBadges: string[];
    accountTier?: 'free' | 'founder' | 'premium';
    zipCode?: string;
    updatedAt: string;
}

export interface InventoryItem {
    id: string;
    userId?: string; // Owner ID
    name: string;
    category: 'Food' | 'Water' | 'Medical' | 'Protection' | 'Utility' | 'Security';
    quantity: number;
    unit: string;
    calories: number;
    costPerUnit: number;
    source?: 'Costco/Sams' | 'Amazon/Online' | 'Local Groceries' | 'Specialty Preppers' | 'Homemade' | '';
    storageLocation?: 'Pantry' | 'Deep Freezer' | 'Refrigerator' | 'Garage' | 'Go-Bag' | 'Other' | '';
    notes?: string;
    purchaseDate?: string; // ISO Date String
    expiryDate?: string;   // ISO Date String
    addedAt: string;       // ISO Date String
}

export interface ActivityLogEntry {
    id: string;
    timestamp: string;
    type: 'purchase' | 'homemade' | 'consumed' | 'expired' | 'rotated' | 'note';
    title: string;
    description: string;
    relatedItemId?: string;
    category?: string;
}

export type SortField = 'name' | 'category' | 'quantity' | 'expiryDate';
export type SortOrder = 'asc' | 'desc';

export interface Requirement {
    name: string;
    category: 'Food' | 'Water' | 'Medical' | 'Protection' | 'Utility' | 'Security';
    quantity: number;
    unit: string;
}

export interface Scenario {
    id: string;
    name: string;
    description: string;
    durationDays: number;
    people: number;
    requirements: Requirement[];
}

export interface GapAnalysis {
    scenarioId: string;
    readinessScore: number; // 0-100
    missingItems: {
        name: string;
        required: number;
        current: number;
        missing: number;
        unit: string;
    }[];
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
    category?: string;
    notes?: string;
    quantity?: string | number;
}

export interface Checklist {
    id: string;
    title: string;
    description?: string;
    items: ChecklistItem[];
    createdAt: string;
    updatedAt: string;
}
