import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const SEED_DATA = {
    "inventory": [
        {
            "category": "Food",
            "item_name": "Kirkland Signature Canned Chicken Breast",
            "unit_size": "12.5 oz",
            "total_units": 6,
            "price_per_pack": 12.59,
            "total_cost": 12.59,
            "cost_per_unit": 2.1,
            "total_calories": 2475,
            "shelf_life_years": "3-5",
            "purchased_date": "2026-02-15"
        },
        {
            "category": "Food",
            "item_name": "Chicken of the Sea Chunk Light Tuna",
            "unit_size": "5 oz",
            "total_units": 24,
            "price_per_pack": 24.0,
            "total_cost": 24.0,
            "cost_per_unit": 1.0,
            "total_calories": 3000,
            "shelf_life_years": "3-5",
            "purchased_date": "2026-02"
        },
        {
            "category": "Food",
            "item_name": "Chicken of the Sea Jack Mackerel",
            "unit_size": "15 oz",
            "total_units": 12,
            "price_per_pack": 23.84,
            "total_cost": 23.84,
            "cost_per_unit": 1.99,
            "total_calories": 5400,
            "shelf_life_years": "3-5",
            "purchased_date": "2026-02"
        },
        {
            "category": "Food",
            "item_name": "SPAM Classic Canned Meat",
            "unit_size": "12 oz",
            "total_units": 12,
            "price_per_pack": 33.39,
            "total_cost": 33.39,
            "cost_per_unit": 2.78,
            "total_calories": 11952,
            "shelf_life_years": "3-5",
            "purchased_date": "2026-02"
        },
        {
            "category": "Food",
            "item_name": "Long Grain White Rice",
            "unit_size": "25 lb",
            "total_units": 4,
            "price_per_pack": 8.65,
            "total_cost": 34.6,
            "cost_per_unit": 8.65,
            "total_calories": 158400,
            "shelf_life_years": "10-30",
            "purchased_date": "2026-02"
        },
        {
            "category": "Food",
            "item_name": "Calrose Rice",
            "unit_size": "50 lb",
            "total_units": 1,
            "price_per_pack": 15.49,
            "total_cost": 15.49,
            "cost_per_unit": 15.49,
            "total_calories": 79200,
            "shelf_life_years": "10-30",
            "purchased_date": "2026-02-15"
        },
        {
            "category": "Food",
            "item_name": "Pinto Beans (Dry)",
            "unit_size": "25 lb",
            "total_units": 1,
            "price_per_pack": 18.75,
            "total_cost": 18.75,
            "cost_per_unit": 18.75,
            "total_calories": 39200,
            "shelf_life_years": "20-25",
            "purchased_date": "2026-02"
        },
        {
            "category": "Food",
            "item_name": "Kirkland Signature Black Beans",
            "unit_size": "116 oz",
            "total_units": 1,
            "price_per_pack": 4.49,
            "total_cost": 4.49,
            "cost_per_unit": 4.49,
            "total_calories": 3480,
            "shelf_life_years": "3-5",
            "purchased_date": "2026-02-15"
        },
        {
            "category": "Food",
            "item_name": "Kroger Fruit Cocktail",
            "unit_size": "104 oz",
            "total_units": 4,
            "price_per_pack": 6.59,
            "total_cost": 26.36,
            "cost_per_unit": 6.59,
            "total_calories": 7488,
            "shelf_life_years": "2-3",
            "purchased_date": "2026-02-15"
        },
        {
            "category": "Food",
            "item_name": "Kirkland Signature Olive Oil",
            "unit_size": "3 L",
            "total_units": 1,
            "price_per_pack": 24.99,
            "total_cost": 24.99,
            "cost_per_unit": 24.99,
            "total_calories": 24336,
            "shelf_life_years": "2",
            "purchased_date": "2026-02-15"
        },
        {
            "category": "Food",
            "item_name": "White Sugar",
            "unit_size": "10 lb",
            "total_units": 1,
            "price_per_pack": 7.29,
            "total_cost": 7.29,
            "cost_per_unit": 7.29,
            "total_calories": 17440,
            "shelf_life_years": "indefinite",
            "purchased_date": "2026-02-15"
        },
        {
            "category": "Food",
            "item_name": "99 Ranch Spicy Seafood Jjamppong",
            "unit_size": "~5 oz",
            "total_units": 12,
            "price_per_pack": 1.99,
            "total_cost": 23.88,
            "cost_per_unit": 1.99,
            "total_calories": 4500,
            "shelf_life_years": "1-2",
            "purchased_date": "2026-02-15"
        },
        {
            "category": "Food",
            "item_name": "99 Ranch Spicy Kimchi Ramen",
            "unit_size": "~5 oz",
            "total_units": 4,
            "price_per_pack": 1.99,
            "total_cost": 7.96,
            "cost_per_unit": 1.99,
            "total_calories": 1500,
            "shelf_life_years": "1-2",
            "purchased_date": "2026-02-15"
        }
    ]
};

export async function seedDatabase(userId: string) {
    const collectionRef = collection(db, 'inventory');

    console.log(`Seeding for user: ${userId}`);

    for (const item of SEED_DATA.inventory) {
        // Calculate Expiry
        // Handle "3-5" -> 3, "indefinite" -> 99
        let years = 3;
        if (item.shelf_life_years === 'indefinite') {
            years = 99;
        } else if (item.shelf_life_years.includes('-')) {
            years = parseInt(item.shelf_life_years.split('-')[0]);
        } else {
            years = parseInt(item.shelf_life_years);
        }

        // Simple date parse for "2026-02" -> "2026-02-01"
        const purchaseDateStr = item.purchased_date.length === 7 ? `${item.purchased_date}-01` : item.purchased_date;
        const purchaseDate = new Date(purchaseDateStr);
        const expiryDate = new Date(purchaseDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + years);

        // Map to InventoryItem Schema
        // Note: total_calories in JSON is TOTAL for all units. 
        // Schema asks for 'calories' which usually implies per unit? 
        // Actually our previous usages implied per unit.
        // JSON: item_name -> name
        // JSON: unit_size -> unit
        // JSON: total_units -> quantity
        // JSON: cost_per_unit -> costPerUnit

        // JSON 'total_calories' seems to be total for the row (quantity * per_unit).
        // Let's assume schema wants calories PER UNIT.
        // So cal = total_calories / total_units
        const calPerUnit = Math.round(item.total_calories / item.total_units);

        const docData = {
            userId,
            name: item.item_name,
            category: 'Food', // Hardcoded as all example data is food
            quantity: item.total_units,
            unit: item.unit_size,
            calories: calPerUnit,
            costPerUnit: item.cost_per_unit,
            purchaseDate: purchaseDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            addedAt: new Date().toISOString()
        };

        try {
            await addDoc(collectionRef, docData);
            console.log(`Seeded: ${item.item_name}`);
        } catch (e) {
            console.error(`Failed to seed ${item.item_name}`, e);
        }
    }
}
