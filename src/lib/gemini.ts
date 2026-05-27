import { GoogleGenerativeAI } from "@google/generative-ai";
import { InventoryItem } from "../types";

// In production Vite builds, .env.local is not embedded. Use the key directly as fallback.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyC3x1i9exYo59UyjOoxFUWgFPJKR-4iCCc";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const SYSTEM_PROMPT = `
You are a survival logistics expert. Analyze the provided image of inventory (pantry, gear, medical supplies) and extract a structured list of items.

Real-world constraints:
1. Look for bulk identifiers: "12-pack", "Case of 24", "Net Wt 20lb", "Gallon". If it says 12-pack, quantity should be 12 (or 1 if the unit is "case/box", but "12 cans" is preferred).
2. Category Mapping:
   - "Food": Canned goods, dry bags (rice/beans), snacks, baking (salt/oil/shortening).
   - "Water": Bottled water, filtration, purification.
   - "Medical": First aid, bandages, medications, hygiene.
   - "Protection": Defense tools, pepper spray, tasers, ammo, security gear.
   - "Utility": Fuel (Butane/Propane), lighting (headlamps/batteries), fire starting, multi-tools.
3. Unit Extraction: Use common units like "cans", "lbs", "bottles", "boxes", "kits", "rolls".
4. Calorie Estimation: Be realistic. 1lb of rice is ~1600 cal. 1 can of Spam is ~1000 cal. 1 can of soup is ~250 cal. If not food, 0.
5. Expiry: If not visible, estimate 2 years from today for canned/dry goods, 5 years for medical.

Return a JSON array where each object has:
- name: string (Specific brand/product name if visible)
- category: "Food" | "Water" | "Medical" | "Protection" | "Utility"
- quantity: number (Estimate count based on visible items)
- unit: string
- calories: number (Estimate total calories for the QUANTITY provided)
- costPerUnit: number (Estimate in USD, common market price)
- expiryDate: string (ISO date YYYY-MM-DD)

JSON ONLY. No markdown formatting.
`;

export async function parseInventoryImage(imageFile: File): Promise<Omit<InventoryItem, 'id' | 'addedAt'>[]> {
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64String = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const result = await model.generateContent([
        SYSTEM_PROMPT,
        {
            inlineData: {
                mimeType: imageFile.type,
                data: base64String
            }
        }
    ]);

    const response = await result.response;
    const text = response.text();

    let jsonStr = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = jsonStr.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) jsonStr = jsonMatch[0];

    return JSON.parse(jsonStr);
}

const CHAT_SYSTEM_PROMPT = `
You are the "Commander Intelligence", an elite, pragmatic, and highly strategic AI survival logistics expert assisting the user in prepping.
Your job is to provide actionable advice, recommend specific items, and analyze their readiness.

IMPORTANT INSTRUCTION ON PREFERENCES:
If the user explicitly states a long-term preference, restriction, or habit (e.g., "my family hates beans", "I am allergic to peanuts", "we only use solar power"), you MUST acknowledge it AND output a specific JSON payload AT the very end of your response to save it to their profile.
Format for saving a preference:
\`\`\`json
{ "preference_learned": "User's family hates beans" }
\`\`\`
Always provide a helpful text response FIRST, and only append the JSON block if a NEW lasting preference is stated in the current message. Do NOT output this JSON if they are just asking a general question.
`;

export async function generateIntelligenceChat(
    messages: { role: 'user' | 'assistant' | 'system', content: string }[],
    context: string,
    preferences: string[]
): Promise<{ text: string, newPreference?: string }> {

    const contextPrompt = `
CURRENT LIVE CONTEXT FOR THIS USER:
---
${context}
---

KNOWN PREFERENCES / RESTRICTIONS (RESPECT THESE):
${preferences.length > 0 ? preferences.map(p => `- ${p}`).join('\n') : 'None recorded yet.'}
---

Please respond to their latest message directly.
`;

    const chatMessages = [
        { role: 'user', parts: [{ text: CHAT_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "Understood. I am Commander Intelligence." }] },
        { role: 'user', parts: [{ text: contextPrompt }] },
        { role: 'model', parts: [{ text: "Context received. I will keep this in mind during our entire conversation." }] },
        ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : m.role,
            parts: [{ text: m.content }]
        }))
    ];

    const result = await model.generateContent({
        contents: chatMessages as any
    });

    const responseText = result.response.text();

    let newPreference: string | undefined;
    const jsonMatch = responseText.match(/```json\s*({[^}]+})\s*```/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed.preference_learned) {
                newPreference = parsed.preference_learned;
            }
        } catch (e) {
            console.error("Failed to parse learned preference", e);
        }
    }

    const finalCleanText = responseText.replace(/```json\s*({[^}]+})\s*```/g, '').trim();

    return { text: finalCleanText, newPreference };
}
