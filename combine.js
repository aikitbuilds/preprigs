import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = {
    apiKey: "AIzaSyCNM1u_mE8j9k3LBq3mnZDGn96C9yh2DNw",
    authDomain: "gen-lang-client-0686783756.firebaseapp.com",
    projectId: "gen-lang-client-0686783756",
    storageBucket: "gen-lang-client-0686783756.firebasestorage.app",
    messagingSenderId: "942449514075",
    appId: "1:942449514075:web:c7578453425413149fd17e",
    measurementId: "G-MEMY6GHJ54"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const USER_ID = 'z9RyQu2udGY2sWxPlevVZyckmvF3'; // michaelcongtran@gmail.com

async function main() {
    console.log('Fetching inventory for user:', USER_ID);

    // 1. Fetch items
    const q = query(collection(db, 'inventory'), where('userId', '==', USER_ID));
    const snapshot = await getDocs(q);

    const items = [];
    snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Found ${items.length} items.`);

    // 2. Group items
    const grouped = {};
    const flagged = [];

    for (const item of items) {
        if (!item.name) {
            flagged.push({ reason: 'Missing name', item });
            continue;
        }

        let normalizedName = item.name.toLowerCase().trim();
        // Flag extreme quantities or suspicious costs
        if (item.quantity < 0 || item.quantity > 100000) {
            flagged.push({ reason: 'Suspicious quantity: ' + item.quantity, item });
        }
        if (item.costPerUnit < 0 || item.costPerUnit > 10000) {
            flagged.push({ reason: 'Suspicious cost: ' + item.costPerUnit, item });
        }

        if (!grouped[normalizedName]) {
            grouped[normalizedName] = [item];
        } else {
            grouped[normalizedName].push(item);
        }
    }

    // 3. Combine duplicates
    const actions = []; // to log output
    const batch = writeBatch(db);
    let batchOperationsCount = 0;

    for (const [name, group] of Object.entries(grouped)) {
        if (group.length > 1) {
            // There are duplicates
            let primaryItem = group[0];
            let totalQuantity = primaryItem.quantity || 0;
            let units = new Set([primaryItem.unit]);

            const duplicatesToRemove = [];

            for (let i = 1; i < group.length; i++) {
                const item = group[i];
                totalQuantity += (item.quantity || 0);
                units.add(item.unit);
                duplicatesToRemove.push(item);
            }

            if (units.size > 1) {
                flagged.push({
                    reason: `Conflicting units across items named '${name}'`,
                    items: group,
                    unitsFound: Array.from(units)
                });
            }

            actions.push({
                name: primaryItem.name,
                originalQuantity: primaryItem.quantity,
                combinedQuantity: totalQuantity,
                duplicatesRemoved: duplicatesToRemove.length
            });

            // Update the primary item with the new total
            const primaryRef = doc(db, 'inventory', primaryItem.id);
            batch.update(primaryRef, { quantity: totalQuantity });
            batchOperationsCount++;

            // Delete the duplicates
            for (const item of duplicatesToRemove) {
                const dupRef = doc(db, 'inventory', item.id);
                batch.delete(dupRef);
                batchOperationsCount++;
            }
        }
    }

    console.log(`Operations to perform in batch: ${batchOperationsCount}`);

    let report = [];
    report.push('# Database Update Report\\n');
    report.push(`Total Items Before: ${items.length}`);
    report.push(`Items Combined: ${actions.length}`);

    if (batchOperationsCount > 0) {
        await batch.commit();
        console.log('Batch commit successful.');
    } else {
        console.log('No duplicates found to combine.');
    }

    report.push('\\n## Combined Items');
    if (actions.length > 0) {
        actions.forEach(a => {
            report.push(`- **${a.name}**: Updated quantity to ${a.combinedQuantity} (was ${a.originalQuantity}, removed ${a.duplicatesRemoved} duplicate entries)`);
        });
    } else {
        report.push('- No duplicate items merged.');
    }

    report.push('\\n## Flagged Items / Anomalies');
    if (flagged.length > 0) {
        flagged.forEach(f => {
            report.push(`- **Reason**: ${f.reason}`);
            if (f.items) {
                f.items.forEach(i => report.push(`  - Item: ${i.name} (id: ${i.id}), qty: ${i.quantity}, unit: ${i.unit}`));
            } else if (f.item) {
                report.push(`  - Item: ${f.item.name || 'Unnamed'} (id: ${f.item.id}), qty: ${f.item.quantity}`);
            }
        });
    } else {
        report.push('- No anomalies found.');
    }

    fs.writeFileSync('report.md', report.join('\\n'));
    console.log('Done! Wrote results to report.md');
}

main().catch(console.error);
