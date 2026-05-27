import { create } from 'zustand';
import { Checklist } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'protocol_checklists_v1';

// ─── Default Checklist Item Helper ───────────────────────────────────────────

const makeItem = (text: string, category: string, quantity: string | number, notes: string) => ({
    id: uuidv4(), text, category, quantity, notes, completed: false
});

// ─── Bugout Backpack ──────────────────────────────────────────────────────────

const BUGOUT_BAG_DEFAULT: Checklist = {
    id: 'bugout-bag-1',
    title: 'Bugout Backpack',
    description: '72-hour baseline — fast grab. Stored near an exit.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
        makeItem('1L durable water bottles (filled)', 'Water & Purification', 4, 'One per person'),
        makeItem('Collapsible water bladder (2–3L)', 'Water & Purification', 2, 'Extra capacity when moving'),
        makeItem('Filter straws or mini filters', 'Water & Purification', 4, 'One per person'),
        makeItem('Purification tablets', 'Water & Purification', '40+', 'Enough to treat 10 gallons'),
        makeItem('Metal bottle or small pot', 'Water & Purification', 1, 'For boiling water'),
        makeItem('High-calorie energy bars', 'Food', '48+', 'Aim for ~2,000 cal/person/day'),
        makeItem('Trail mix / nuts', 'Food', '4 lbs', 'Pack in quart Ziplocks'),
        makeItem('Jerky or meat sticks', 'Food', '2–3 lbs', 'Long shelf life, high protein'),
        makeItem('Freeze-dried meals', 'Food', 12, '1 meal/person/day — hot water only'),
        makeItem('Electrolyte packets', 'Food', 24, 'Add to water for heat or illness'),
        makeItem('Compact emergency bivvy or sleeping bag', 'Shelter & Warmth', 4, 'One per person'),
        makeItem('Lightweight rain ponchos', 'Shelter & Warmth', 4, 'Keep in outside pocket'),
        makeItem('Compact tarp (6×8 or 8×10)', 'Shelter & Warmth', 1, 'For shade or rain cover'),
        makeItem('Paracord 550', 'Shelter & Warmth', '100 ft', 'Shelter, repairs, etc.'),
        makeItem('Full change of clothes', 'Shelter & Warmth', '1 set/person', 'Quick-dry shirt, pants, socks'),
        makeItem('Light fleece or hoodie', 'Shelter & Warmth', 4, 'Nights can drop'),
        makeItem('Beanie + work gloves', 'Shelter & Warmth', 4, '4 hats + 4 gloves'),
        makeItem('Comprehensive first-aid kit', 'First Aid & Meds', '1–2', 'Family-size kit'),
        makeItem('Tourniquet + large dressings', 'First Aid & Meds', '1–2', 'For serious bleeding'),
        makeItem('Ibuprofen & acetaminophen', 'First Aid & Meds', 'Family-size', 'Include child doses'),
        makeItem('Antihistamine tablets', 'First Aid & Meds', '1 pack', 'Allergies or mild reactions'),
        makeItem('Prescription meds', 'First Aid & Meds', '7–14 day supply', 'Rotate before expiry'),
        makeItem('Biodegradable wipes', 'First Aid & Meds', 2, 'Body cleaning without water'),
        makeItem('Hand sanitizer', 'First Aid & Meds', 2, 'Clip one to pack'),
        makeItem('Multitool', 'Tools, Light & Fire', '1–2', 'One on each adult'),
        makeItem('Fixed or folding knife', 'Tools, Light & Fire', 1, 'Durable, easy access'),
        makeItem('Bic lighters', 'Tools, Light & Fire', '2–4', 'Simple and reliable'),
        makeItem('Waterproof matches', 'Tools, Light & Fire', '1–2 containers', 'Backup ignition'),
        makeItem('Ferro rod', 'Tools, Light & Fire', 1, 'Works wet and long-lasting'),
        makeItem('LED flashlight', 'Tools, Light & Fire', 2, 'One per adult'),
        makeItem('Headlamps', 'Tools, Light & Fire', '2–4', 'Hands-free light'),
        makeItem('Duct tape (wrapped on card)', 'Tools, Light & Fire', '10–20 ft', 'Repairs, first aid, shelter'),
        makeItem('Printed local evacuation maps', 'Communication & Nav', '1–2', 'Evacuation routes'),
        makeItem('Basic compass', 'Communication & Nav', 1, 'Even if you have GPS'),
        makeItem('Hand-crank / solar weather radio', 'Communication & Nav', 1, 'NOAA emergency broadcasts'),
        makeItem('Power bank (10,000+ mAh)', 'Communication & Nav', '1–2', 'With cables for all phones'),
        makeItem('Whistles', 'Communication & Nav', 4, 'One per family member'),
        makeItem('Photocopies of IDs', 'Documents & Money', 1, 'Driver\'s licenses, passports'),
        makeItem('Waterproof document pouch', 'Documents & Money', 1, 'Insurance, deed, medical info'),
        makeItem('Emergency numbers list', 'Documents & Money', 2, 'Local and out-of-state contacts'),
        makeItem('Cash — small bills', 'Documents & Money', '$300–600', '1s, 5s, 10s, 20s — no ATMs'),
        makeItem('Spare house & car keys', 'Documents & Money', 1, 'In a separate pocket'),
        makeItem('Pepper spray / Gel', 'Protection & Defense', 2, 'Non-lethal defense for each adult'),
        makeItem('Personal alarm / Whistle', 'Protection & Defense', 4, 'Deterrent and signaling'),
        makeItem('Heavy-duty door jammer', 'Protection & Defense', 1, 'For securing temporary shelter'),
    ]
};

// ─── Rolling Suitcase ─────────────────────────────────────────────────────────

const ROLLING_SUITCASE_DEFAULT: Checklist = {
    id: 'rolling-suitcase-1',
    title: 'Rolling Suitcase',
    description: 'Supplemental kit for vehicle evacuations. Grab both bags.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
        makeItem('Extra water jugs', 'Extra Water & Food', '2–4 gal', 'Refreshed regularly'),
        makeItem('Canned goods (beans, chili, tuna)', 'Extra Water & Food', '12–24 cans', 'Include manual can opener'),
        makeItem('Ready-to-eat pouches (MRE-type)', 'Extra Water & Food', '8–12', 'No cooking needed'),
        makeItem('Extra snacks', 'Extra Water & Food', '4–6 bags', 'Use oldest first — rotate'),
        makeItem('Small family tent or large tarp', 'Shelter & Bedding', 1, 'Enough for 4 to shelter'),
        makeItem('Lightweight sleeping bags', 'Shelter & Bedding', '2–4', 'Especially for kids'),
        makeItem('Compact sleeping pads', 'Shelter & Bedding', '2–4', 'At least for kids & one adult'),
        makeItem('Second change of clothes', 'Clothing & Footwear', '1 set/person', 'Focus on durability & layers'),
        makeItem('Extra underwear & socks', 'Clothing & Footwear', '8–12', 'Dry feet are critical'),
        makeItem('Wide-brim hats & sun sleeves', 'Clothing & Footwear', '2–4', 'For heat & humidity'),
        makeItem('Lightweight packable rain shells', 'Clothing & Footwear', 4, 'One per person'),
        makeItem('Bulk pack of wipes', 'Hygiene & Sanitation', 1, 'Resupply small packs'),
        makeItem('Extra toilet paper (in zip bags)', 'Hygiene & Sanitation', '2–4 rolls', 'Remove cardboard core'),
        makeItem('Heavy-duty trash bags', 'Hygiene & Sanitation', '10–20', 'Toilets, gear protection'),
        makeItem('Small trowel/shovel', 'Hygiene & Sanitation', 1, 'For catholes when needed'),
        makeItem('Small hatchet or axe', 'Extra Tools', 1, 'Firewood, shelter building'),
        makeItem('Folding saw', 'Extra Tools', 1, 'Easier wood cutting'),
        makeItem('Battery or solar lantern', 'Extra Tools', 1, 'Area lighting at night'),
        makeItem('N95 masks', 'Extra Tools', '8–12', 'Smoke, dust, pandemics'),
        makeItem('Extra work gloves', 'Extra Tools', 2, 'For guests or spares'),
        makeItem('Extra electrolyte mix', 'Region-Specific (Gulf Coast)', '20+ packets', 'Critical in heat & humidity'),
        makeItem('Insect repellent', 'Region-Specific (Gulf Coast)', '1–2 bottles', 'Mosquito-heavy area'),
        makeItem('Sunscreen SPF 30+', 'Region-Specific (Gulf Coast)', '1–2 bottles', 'Whole family'),
        makeItem('Waterproof dry sacks', 'Region-Specific (Gulf Coast)', '4–6', 'For phones, documents, clothes'),
        makeItem('Extra ammo / magazines', 'Protection & Defense', 'As needed', 'Securely stored for transport'),
        makeItem('Tactical flashlight (high lumen)', 'Protection & Defense', 1, 'Blinding/disorientation + light'),
    ]
};

// ─── Deep Pantry ─────────────────────────────────────────────────────────────

const DEEP_PANTRY_DEFAULT: Checklist = {
    id: 'deep-pantry-1',
    title: 'Deep Pantry',
    description: 'Long-term food & supply storage — 3 to 12 months for a family of 4.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
        // Grains & Starches
        makeItem('White rice (long grain)', 'Grains & Starches', '100 lbs', '~360 cal/cup dry; 25–30 yr shelf life sealed'),
        makeItem('Hard red or hard white wheat berries', 'Grains & Starches', '50 lbs', 'Mill into flour; 25+ yr shelf life'),
        makeItem('All-purpose flour (stored/sealed)', 'Grains & Starches', '25 lbs', 'Use within 1–2 yrs; rotate'),
        makeItem('Rolled oats', 'Grains & Starches', '25 lbs', 'Great breakfast base'),
        makeItem('Pasta (various shapes)', 'Grains & Starches', '30 lbs', 'Rotate every 2–3 yrs'),
        makeItem('Cornmeal / masa harina', 'Grains & Starches', '10 lbs', 'Tortillas, cornbread, polenta'),
        makeItem('Potatoes (instant/dehydrated)', 'Grains & Starches', '10 lbs', '25+ yr shelf life'),

        // Proteins
        makeItem('Pinto beans (dry)', 'Proteins & Legumes', '25 lbs', '~350 cal/cup dry'),
        makeItem('Black beans (dry)', 'Proteins & Legumes', '25 lbs', 'Rotate every 10+ yrs'),
        makeItem('Lentils (red & green)', 'Proteins & Legumes', '10 lbs', 'Fast cook, no soaking needed'),
        makeItem('Split peas', 'Proteins & Legumes', '10 lbs', 'Soups and stews'),
        makeItem('Canned tuna / salmon', 'Proteins & Legumes', '48 cans', '3–5 yr shelf life; rotate'),
        makeItem('Canned chicken', 'Proteins & Legumes', '24 cans', 'Easy protein source'),
        makeItem('Canned sardines / mackerel', 'Proteins & Legumes', '24 cans', 'High omega-3, long shelf life'),
        makeItem('Freeze-dried ground beef', 'Proteins & Legumes', '10 lbs', '25 yr shelf life'),
        makeItem('Textured vegetable protein (TVP)', 'Proteins & Legumes', '10 lbs', 'Meat substitute, 10+ yr life'),

        // Fats & Oils
        makeItem('Coconut oil (refined)', 'Fats & Oils', '6 quarts', '2–5 yr shelf life; solid at room temp'),
        makeItem('Extra virgin olive oil', 'Fats & Oils', '6 quarts', '18–24 mo shelf life; rotate'),
        makeItem('Vegetable shortening (Crisco)', 'Fats & Oils', '4 cans', 'Baking; 8+ yr sealed'),
        makeItem('Butter powder', 'Fats & Oils', '5 lbs', '25 yr shelf life sealed'),

        // Canned Vegetables & Fruits
        makeItem('Canned tomatoes (diced & paste)', 'Canned Goods', '48 cans', 'Base for most cooked meals'),
        makeItem('Canned corn', 'Canned Goods', '24 cans', 'Rotate every 3–5 yrs'),
        makeItem('Canned green beans', 'Canned Goods', '24 cans', 'Good vegetable variety'),
        makeItem('Canned mixed vegetables', 'Canned Goods', '24 cans', 'Stews, soups, sides'),
        makeItem('Canned fruit (peaches, pears, etc.)', 'Canned Goods', '24 cans', 'Morale & sweetness'),
        makeItem('Canned pumpkin / sweet potato', 'Canned Goods', '12 cans', 'Vitamins & variety'),

        // Baking Staples
        makeItem('Salt (iodized)', 'Baking & Seasoning', '20 lbs', 'Preservation + nutrition'),
        makeItem('Baking soda', 'Baking & Seasoning', '5 lbs', 'Leavening, cleaning, odor'),
        makeItem('Baking powder', 'Baking & Seasoning', '3 lbs', 'Rotate every 1 yr'),
        makeItem('White granulated sugar', 'Baking & Seasoning', '50 lbs', 'Indefinite shelf life sealed'),
        makeItem('Honey', 'Baking & Seasoning', '10 lbs', 'Never expires; antimicrobial'),
        makeItem('Powdered milk (whole)', 'Baking & Seasoning', '20 lbs', '20–25 yr sealed'),
        makeItem('Apple cider vinegar', 'Baking & Seasoning', '6 bottles', 'Cooking, preserving, health'),
        makeItem('Soy sauce / Worcestershire', 'Baking & Seasoning', '6 bottles', 'Flavor base'),

        // Spices & Flavor
        makeItem('Garlic powder', 'Spices', '2 lbs', 'Nearly every savory dish'),
        makeItem('Onion powder', 'Spices', '2 lbs', 'Substitute for fresh onion'),
        makeItem('Cumin', 'Spices', '1 lb', 'Beans, chili, rice'),
        makeItem('Chili powder', 'Spices', '1 lb', 'Tex-Mex staple'),
        makeItem('Oregano', 'Spices', '1 lb', 'Italian + Latin cooking'),
        makeItem('Black pepper', 'Spices', '1 lb', 'Everyday seasoning'),
        makeItem('Cinnamon', 'Spices', '0.5 lbs', 'Oatmeal, baking, morale'),
        makeItem('Red pepper flakes', 'Spices', '0.5 lbs', 'Heat + variety'),

        // Drinks & Supplements
        makeItem('Coffee (vacuum-sealed)', 'Drinks & Nutrition', '10 lbs', 'Morale and stimulant'),
        makeItem('Tea bags (various)', 'Drinks & Nutrition', '200 bags', 'Hydration + morale'),
        makeItem('Powdered sports drink mix', 'Drinks & Nutrition', '5 lbs', 'Electrolytes'),
        makeItem('Multivitamins (family)', 'Drinks & Nutrition', '365 count', 'Fill nutritional gaps'),
        makeItem('Vitamin C supplements', 'Drinks & Nutrition', '365 count', 'Immune support'),
        makeItem('Fish oil / Omega-3', 'Drinks & Nutrition', '180 softgels', 'Heart and brain health'),

        // Storage Supplies
        makeItem('5-gallon food-grade buckets with gamma lids', 'Storage Supplies', 12, 'For grains, beans, rice'),
        makeItem('Mylar bags (1-gallon and 5-gallon)', 'Storage Supplies', '50 pack', 'Long-term oxygen barrier'),
        makeItem('Oxygen absorbers (300–2000cc)', 'Storage Supplies', '100 pack', 'Essential for long-term storage'),
        makeItem('Vacuum sealer + bags', 'Storage Supplies', 1, 'Seal smaller quantities'),
        makeItem('Food-safe desiccant packs', 'Storage Supplies', '50 pack', 'Prevent moisture/mold'),
        makeItem('Sharpie markers + labels', 'Storage Supplies', 1, 'Date everything'),
        makeItem('Safe / Lockbox', 'Protection & Defense', 1, 'For valuables and critical documents'),
        makeItem('Home security reinforcement (screws/plates)', 'Protection & Defense', 'Multiple', 'Hardening the bug-in location'),
    ]
};

// ─── Scenario: Bug In ────────────────────────────────────────────────────────
const BUG_IN_DEFAULT: Checklist = {
    id: 'bug-in-1',
    title: 'Bug In: Scenario Checklist',
    description: 'Immediate actions when sheltering in place is the safest option.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
        makeItem('Lock all doors and windows', 'Security', 1, 'Secure the perimeter immediately'),
        makeItem('Fill bathtubs and containers with water', 'Water', 'Max', 'Do this before water pressure drops'),
        makeItem('Identify a safe room', 'Shelter', 1, 'Interior room without windows if possible'),
        makeItem('Gather all family members and pets', 'Personnel', 'All', 'Ensure everyone is accounted for'),
        makeItem('Charge all essential electronics', 'Power', 'All', 'Phones, radios, power banks'),
        makeItem('Check emergency food and water supply', 'Supplies', 1, 'Verify you have enough for 2+ weeks'),
        makeItem('Prepare alternative lighting', 'Lighting', 'Multiple', 'Flashlights, lanterns (avoid candles)'),
        makeItem('Monitor local news and weather', 'Information', 1, 'Use hand-crank radio if power is out'),
        makeItem('Secure loose items outdoors', 'Exterior', 'All', 'Before high winds arrive'),
        makeItem('Prepare first aid and sanitation supplies', 'Health', 1, 'Ensure easy access')
    ]
};

// ─── Scenario: Full Evacuation ───────────────────────────────────────────────
const FULL_EVACUATION_DEFAULT: Checklist = {
    id: 'full-evac-1',
    title: 'Full Evacuation: Scenario Checklist',
    description: 'Critical steps when you must leave your home immediately.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
        makeItem('Grab Bugout Bags and Rolling Suitcases', 'Kits', 'All', 'Every family member should have theirs'),
        makeItem('Load vehicle with extra water and fuel', 'Transport', 'Max', 'Fill gas tank if not already full'),
        makeItem('Grab important document binder', 'Documents', 1, 'Passports, IDs, insurance, cash'),
        makeItem('Turn off main water and gas valves', 'Utilities', 2, 'Prevent flooding or fire hazards while away'),
        makeItem('Lock all doors and windows', 'Security', 'All', 'Secure the home before departure'),
        makeItem('Review primary and secondary evacuation routes', 'Navigation', 2, 'Have physical maps ready'),
        makeItem('Communicate evacuation plan to out-of-state contact', 'Communication', 1, 'Let them know where you are going'),
        makeItem('Secure pets and their supplies', 'Pets', 'All', 'Carriers, food, water, records'),
        makeItem('Dress in appropriate functional clothing', 'Clothing', 'All', 'Sturdy shoes, layers, weather-appropriate'),
        makeItem('Take prescription medications', 'Health', 'All', 'Grab all active prescriptions')
    ]
};

// ─── Protection & Defense ────────────────────────────────────────────────────
const PROTECTION_DEFAULT: Checklist = {
    id: 'protection-defense-1',
    title: 'Protection & Defense',
    description: 'Non-lethal and lethal deterrents, home hardening, and personal security essentials.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
        // Non-Lethal Personal Defense
        makeItem('Pepper spray / Gel (max strength)', 'Non-Lethal Defense', '1–2 per adult', 'OC gel preferred — less blowback'),
        makeItem('Tactical flashlight (1000+ lumens)', 'Non-Lethal Defense', '1–2', 'Blinding deterrent + utility light'),
        makeItem('Personal alarm (130dB+)', 'Non-Lethal Defense', '1 per person', 'Pull-pin type; clips to bag'),
        makeItem('Tactical pen or kubotan', 'Non-Lethal Defense', '1 per adult', 'Everyday carry last-resort tool'),
        makeItem('Stun gun or taser (if legal locally)', 'Non-Lethal Defense', 1, 'Check local laws before purchasing'),
        makeItem('Fixed-blade knife (legal carry)', 'Non-Lethal Defense', '1 per adult', 'Utility + last resort; keep sharpened'),

        // Firearm Readiness (if applicable)
        makeItem('Primary home defense firearm (cleaned & functional)', 'Firearm Readiness', 1, 'Cleaned, oiled, and verified functional'),
        makeItem('Handgun for carry / vehicle (if applicable)', 'Firearm Readiness', 1, 'Inspected and properly stored'),
        makeItem('Adequate ammunition stored safely', 'Firearm Readiness', '500+ rounds minimum', 'Per firearm; in ammo cans with desiccant'),
        makeItem('Extra magazines / speed loaders', 'Firearm Readiness', '3–5 per firearm', 'Labeled and loaded for use'),
        makeItem('Firearm cleaning kit', 'Firearm Readiness', 1, 'Solvent, patches, bore brush, oil'),
        makeItem('Secure gun safe or lockbox', 'Firearm Readiness', 1, 'Quick-access biometric preferred for home defense'),
        makeItem('All adults trained and practiced', 'Firearm Readiness', 'All', 'Dry-fire drills + range sessions quarterly'),

        // Home Hardening
        makeItem('Deadbolts on all exterior doors (ANSI Grade 1)', 'Home Hardening', 'All doors', 'Replace any Grade 2 or 3 locks'),
        makeItem('Door frame reinforcement kit (3" screws into studs)', 'Home Hardening', 'All exterior doors', 'Most break-ins exploit weak frames'),
        makeItem('Strike plate reinforcement (wrap-around steel)', 'Home Hardening', 'All exterior doors', 'Standard plates fail easily'),
        makeItem('Door jammer / security bar (adjustable)', 'Home Hardening', '2–3', 'Use at night; protects even unlocked doors'),
        makeItem('Window locks / pins on all ground-floor windows', 'Home Hardening', 'All', 'Prevent forced sliding or lift'),
        makeItem('Window film (security/shatter-resistant)', 'Home Hardening', 'Priority windows', 'Slows forced entry; reduces glass scatter'),
        makeItem('Exterior motion-sensor lights (front, back, sides)', 'Home Hardening', '3–4 locations', 'Bright light is the #1 deterrent'),
        makeItem('Security cameras (front door + driveway minimum)', 'Home Hardening', '2+', 'Cloud or local storage; night vision preferred'),
        makeItem('Visible alarm system signage', 'Home Hardening', 2, 'Even if no system — strong deterrent'),
        makeItem('Sliding glass door Charlie bar or rod', 'Home Hardening', 1, 'Prevents forced slide-open from outside'),

        // Vehicle Security
        makeItem('Vehicle doors locked at all times', 'Vehicle Security', 'Always', 'Including in the driveway'),
        makeItem('Steering wheel club lock', 'Vehicle Security', 1, 'Visible deterrent for carjacking / theft'),
        makeItem('Dash cam (front + rear)', 'Vehicle Security', 1, 'Incident documentation; deters theft'),
        makeItem('Go-bag/defense kit accessible in vehicle', 'Vehicle Security', 1, 'Pepper spray and flashlight within reach'),
        makeItem('Tire repair kit + compressor in vehicle', 'Vehicle Security', 1, 'Mobility = safety in emergency'),

        // Communication & Awareness
        makeItem('Police scanner app or dedicated radio', 'Awareness', 1, 'Monitor local incidents in real-time'),
        makeItem('Neighborhood watch or mutual aid group joined', 'Awareness', 1, 'Community intel is invaluable'),
        makeItem('Two-way radios (FRS/GMRS) for family members', 'Awareness', '2–4', 'When cell networks are overloaded'),
        makeItem('Out-of-area emergency contact designated', 'Awareness', 1, 'Someone outside the disaster zone to relay info'),

        // Digital Security
        makeItem('Password manager set up (Bitwarden/1Password)', 'Digital Security', 1, 'Protect accounts, financial, and comms'),
        makeItem('2FA enabled on all critical accounts', 'Digital Security', 'All accounts', 'Email, banking, accounts — use authenticator app'),
        makeItem('VPN installed on all devices', 'Digital Security', 'All devices', 'Especially important on public networks'),
        makeItem('Encrypted backup of critical documents', 'Digital Security', 1, 'Drive or cloud — Veracrypt or similar'),
    ]
};

// ─── Persistence Helpers ─────────────────────────────────────────────────────

function loadFromStorage(): Checklist[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.warn('Could not parse stored checklists', e);
    }
    return [];
}

function saveToStorage(checklists: Checklist[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checklists));
    } catch (e) {
        console.warn('Could not save checklists', e);
    }
}

// ─── Store ───────────────────────────────────────────────────────────────────

interface ChecklistState {
    checklists: Checklist[];
    loading: boolean;
    addChecklist: (checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateChecklist: (id: string, updates: Partial<Checklist>) => void;
    removeChecklist: (id: string) => void;
    init: () => void;
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
    checklists: [],
    loading: true,

    init: () => {
        let stored = loadFromStorage();
        if (stored.length === 0) {
            // First run — seed defaults
            stored = [BUGOUT_BAG_DEFAULT, ROLLING_SUITCASE_DEFAULT, DEEP_PANTRY_DEFAULT, BUG_IN_DEFAULT, FULL_EVACUATION_DEFAULT, PROTECTION_DEFAULT];
            saveToStorage(stored);
        } else {
            // Inject new checklists for existing users
            let modified = false;

            if (!stored.some(c => c.id === 'deep-pantry-1')) {
                stored.push(DEEP_PANTRY_DEFAULT);
                modified = true;
            }
            if (!stored.some(c => c.id === 'bug-in-1')) {
                stored.push(BUG_IN_DEFAULT);
                modified = true;
            }
            if (!stored.some(c => c.id === 'full-evac-1')) {
                stored.push(FULL_EVACUATION_DEFAULT);
                modified = true;
            }
            if (!stored.some(c => c.id === 'protection-defense-1')) {
                stored.push(PROTECTION_DEFAULT);
                modified = true;
            }

            if (modified) {
                saveToStorage(stored);
            }
        }
        set({ checklists: stored, loading: false });
    },

    addChecklist: (checklist) => {
        const newList: Checklist = {
            ...checklist,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updated = [...get().checklists, newList];
        set({ checklists: updated });
        saveToStorage(updated);
    },

    updateChecklist: (id, updates) => {
        const updated = get().checklists.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        );
        set({ checklists: updated });
        saveToStorage(updated);
    },

    removeChecklist: (id) => {
        const updated = get().checklists.filter(c => c.id !== id);
        set({ checklists: updated });
        saveToStorage(updated);
    },
}));
