import { useState } from 'react';
import { BookOpen, Clock, ChevronLeft } from 'lucide-react';

interface BlogArticle {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    readTime: string;
    tag: string;
    tagColor: string;
    renderContent: () => React.ReactNode;
}

/* ─── Article Definitions ─── */

const ARTICLES: BlogArticle[] = [
    {
        id: 'fortress-economy',
        title: 'The Coming Shift: What a "Fortress" Economy Means for Your Family',
        subtitle: 'Geopolitical decoupling and the transition depression.',
        image: '/blog/fortress-economy.png',
        readTime: '5 min',
        tag: 'ECONOMY',
        tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    If you’ve been paying attention to global news, it feels like chaos. Supply chains are stumbling, and overseas conflicts dominate the headlines. But what if this chaos isn't random?
                    <br/><br/>
                    According to geopolitical analysis from the YouTube channel Predictive History, we may be witnessing the intentional dismantling of the old global trade system. Their "Game Theory" series suggests the United States is actively pivoting away from being the world’s consumer and police force, shifting instead toward a "Fortress North America" model. In this scenario, the economy turns inward, heavily relying on domestic energy, manufacturing, and local resources while cutting off cheap overseas imports.
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-orange-400 mb-1">🤔 What does this mean for beginners?</div>
                    <div className="text-[11px] text-slate-400">
                        It means the era of relying on just-in-time shipping for cheap goods and food is ending. A sudden shift like this creates a "transition depression"—a period where prices skyrocket and store shelves empty before new domestic factories can catch up.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ The Action Step</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Don't panic; prepare. Start by building a simple 1-week and 1-month baseline of absolute necessities: shelf-stable food, water filtration, and perimeter security. Your goal right now isn't surviving the apocalypse; it’s simply insulating your household from the upcoming supply chain friction.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'energy-chokepoint',
        title: 'The Energy Chokepoint: Why You Must Become Your Own Power Plant',
        subtitle: 'Insulating your home from grid vulnerability.',
        image: '/blog/energy-grid.png',
        readTime: '4 min',
        tag: 'ENERGY',
        tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    We flip a switch, and the lights come on. It’s a luxury we take for granted. But the global energy grid is far more fragile than most people realize.
                    <br/><br/>
                    The Predictive History channel highlights a chilling reality: global conflicts, particularly in the Middle East, aren't just about territory; they are about controlling the energy and fertilizer chokepoints of the world. If those chokepoints close, the resulting energy shock will send shockwaves straight into our domestic power grids. Power becomes incredibly expensive, and rolling blackouts become a normal part of life.
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-amber-400 mb-1">🤔 What does this mean for beginners?</div>
                    <div className="text-[11px] text-slate-400">
                        You cannot outsource your family's basic power needs to a vulnerable national grid. True resilience requires localized, off-grid capability.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ The Action Step</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Look beyond basic emergency flashlights. Start researching high-performance, modular solar and battery setups capable of running essential medical devices, deep freezers, and communication tools. Building an independent energy rig ensures that when the neighborhood goes dark, your household continues to function flawlessly.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'protein-preservation',
        title: 'The Ultimate Barter Currency: Protein and Preservation',
        subtitle: 'Why calories are the ultimate localized currency.',
        image: '/blog/protein-preservation.png',
        readTime: '6 min',
        tag: 'FOOD',
        tagColor: 'bg-red-500/20 text-red-400 border-red-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    If the global financial system stumbles, what becomes the real currency in your neighborhood? History tells us it’s calories.
                    <br/><br/>
                    A fascinating point raised by the Predictive History channel is that geopolitical wars heavily impact the flow of nitrogen and agricultural fertilizers. A disruption there means lower crop yields globally, making high-density food—especially meat—incredibly scarce and expensive.
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-red-400 mb-1">🤔 What does this mean for beginners?</div>
                    <div className="text-[11px] text-slate-400">
                        A deep pantry of rice and beans is a great start, but it lacks the high-value calories needed for extreme physical output and local trade.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ The Action Step</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Master the art of preservation that requires zero electricity to maintain. Two of the best methods are pressure canning meats and dry-curing whole muscles (like making your own prosciutto or capicola). A pint jar of pressure-canned beef is shelf-stable for years without a refrigerator. In a grid-down scenario, that ready-to-eat protein isn't just dinner; it’s a highly valuable currency you can trade for hardware, repairs, or other essential supplies.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'hard-assets',
        title: 'Hard Assets: Silver, Seeds, and Analog Skills',
        subtitle: 'Escaping digital fragility through physical wealth.',
        image: '/blog/hard-assets.png',
        readTime: '5 min',
        tag: 'ASSETS',
        tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    When a society transitions away from a globalized financial system to a localized "Technate" (a self-sufficient regional bloc, a concept heavily explored by Predictive History), digital numbers on a screen temporarily lose their power. Wealth transitions back to physical, tangible reality.
                    <br/><br/>
                    If the internet goes down, or if the supply of microchips from overseas halts entirely, the things that hold value are the things you can hold in your hand.
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-blue-400 mb-1">🤔 What does this mean for beginners?</div>
                    <div className="text-[11px] text-slate-400">
                        You need to diversify your savings out of the digital realm and into the physical realm.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ The Action Step</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Begin accumulating operational hard assets. Yes, physical silver (like 1oz rounds or pre-1964 "junk silver") is fantastic for local trade. But also consider stockpiling heavy-gauge copper wiring, spare off-grid charge controllers, heirloom seeds, and medical trauma kits. Just as importantly, build an "analog network." Get to know the mechanics, welders, and farmers within a 20-mile radius. In a resource crunch, knowing who has the skills is just as important as having the supplies.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'digital-lifeboat',
        title: 'The Digital Lifeboat: Why Your Survival Tech Must Be "Offline-First"',
        subtitle: 'Preserving vital intelligence when cell towers fail.',
        image: '/blog/digital-lifeboat.png',
        readTime: '4 min',
        tag: 'TECH',
        tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    We live in a cloud-based world. Your bank, your notes, your maps, and your survival checklists likely live on a server hundreds of miles away. But what happens when the connection breaks?
                    <br/><br/>
                    The geopolitical shifts outlined by the Predictive History channel warn of cyber vulnerabilities and grid instability. If you rely on a cloud-based app to tell you what's in your deep pantry, how to wire your solar panels, or what frequency to tune your emergency radio to, you are entirely at the mercy of the cell towers.
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-emerald-400 mb-1">🤔 What does this mean for beginners?</div>
                    <div className="text-[11px] text-slate-400">
                        Your preparation strategy is only as strong as your ability to access your information during a blackout.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ The Action Step</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Transition your vital data to offline-first tools. This is exactly why we are building the PrepRigs app. You need a system where your inventory data, solar blueprints, curing logs, and local topographical maps live securely and entirely on your physical device. If the internet dies on a Tuesday, your household's operating system must boot up flawlessly on Wednesday. Build your digital lifeboat now, before the waters get rough.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'scenario-technate',
        title: 'Scenario 1: The "Greater North America" Consolidation',
        subtitle: 'The Technate and the fracturing of North American free-trade.',
        image: '/blog/technate_scenario_blog.png',
        readTime: '4 min',
        tag: 'SCENARIO',
        tagColor: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    Following Secretary of War Pete Hegseth’s explicit March 2026 declarations regarding a "Greater North America" security perimeter stretching from Greenland to the Panama Canal, the U.S. aggressively forces localized resource compliance. This causes a severe strategic and economic split with Canada and Mexico, fracturing the North American free-trade system in favor of U.S. resource hoarding.
                </div>
                
                <div className="bg-zinc-500/10 border border-zinc-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-zinc-400 mb-1">📊 Probability & Timeline</div>
                    <div className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Probability:</strong> 75%<br/>
                        <strong className="text-slate-300">Timeline:</strong> Actively unfolding now; peaking by mid-2027 as Canadian and Mexican trade agreements are forcibly restructured or abandoned.
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-red-500 mb-1">🚨 The Signals</div>
                    <div className="text-[11px] text-slate-400">
                        Look for sudden tariffs on Canadian energy and minerals, heavy militarization of the Arctic, and aggressive federal mandates prioritizing domestic industrial material over civilian distribution.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ How to Prepare</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Cross-border energy grid vulnerabilities will skyrocket. The deployment of high-performance, off-grid energy platforms becomes an absolute necessity. Scaling modular solar architectures—specifically systems robust enough for industrial or extreme-weather use—will shield localized operations from grid instability and soaring public utility costs.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'scenario-chokepoint',
        title: 'Scenario 2: The Chokepoint Energy Shock',
        subtitle: 'Decimating infrastructure and creating massive asymmetric response.',
        image: '/blog/chokepoint_energy_shock_blog.png',
        readTime: '3 min',
        tag: 'SCENARIO',
        tagColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    Operation Epic Fury successfully decimates Iranian military infrastructure and leadership, but the resulting power vacuum triggers a desperate, asymmetric response that successfully mines or blocks the Strait of Hormuz. 20% of the world's oil is temporarily paralyzed, forcing Asia and Europe into a severe energy crisis.
                </div>
                
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-rose-400 mb-1">📊 Probability & Timeline</div>
                    <div className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Probability:</strong> 60%<br/>
                        <strong className="text-slate-300">Timeline:</strong> Late 2026 to early 2027, as the initial shock and awe of the 11,000+ U.S. strikes settle into a protracted, chaotic proxy war.
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-red-500 mb-1">🚨 The Signals</div>
                    <div className="text-[11px] text-slate-400">
                        Immediate, violent spikes in Brent Crude prices; emergency rationing of natural gas in Europe; and massive capital flight into non-fiat stores of value.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ How to Prepare</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Avoid traditional, heavily regulated financial choke points. Utilize high-performance decentralized platforms to trade perpetual contracts on Brent oil, natural gas, and tokenized gold. Capturing the volatility of energy commodities directly on-chain acts as a pure hedge against the physical supply shock while keeping capital highly liquid.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'scenario-infrastructure',
        title: 'Scenario 3: The Asymmetric Infrastructure Attack',
        subtitle: 'Targeting the soft underbelly: cloud, water, and telecom.',
        image: '/blog/asymmetric_infrastructure_attack_blog.png',
        readTime: '5 min',
        tag: 'SCENARIO',
        tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    With conventional naval capacities targeted in the Middle East, retaliation shifts entirely to cyber warfare and asymmetrical infrastructure sabotage. State-sponsored entities target the soft underbelly of the U.S.: cloud service providers, water treatment facilities, and telecom networks.
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-purple-400 mb-1">📊 Probability & Timeline</div>
                    <div className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Probability:</strong> 40%<br/>
                        <strong className="text-slate-300">Timeline:</strong> Within the next 12 to 18 months, representing the "long tail" of the current overseas conflict.
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-red-500 mb-1">🚨 The Signals</div>
                    <div className="text-[11px] text-slate-400">
                        Unexplained, localized blackouts on the U.S. Gulf Coast; widespread, multi-day outages of AWS, Google Cloud, or Firebase; and severe disruptions in digital payment gateways.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ How to Prepare</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Digital resilience must be completely decoupled from the cloud. Critical logistical software, survival blueprints, and operational checklists must be migrated to a fully localized, offline-first architecture. If the internet fails, a self-contained, offline manual builder running locally on a device needs to be the central nervous system for household and community management.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'scenario-caloric',
        title: 'Scenario 4: The Caloric and Fertilizer Freeze',
        subtitle: 'Permanent disruption to global nitrogen and raw phosphate.',
        image: '/blog/caloric_fertilizer_freeze_blog.png',
        readTime: '6 min',
        tag: 'SCENARIO',
        tagColor: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    The Middle East conflict permanently disrupts the global export of nitrogen, urea, and raw phosphates. Global agricultural yields plummet. The U.S. prioritizes its own domestic food supply, but hyperinflation hits grocery store shelves as the cost to produce and transport commercial food triples.
                </div>
                
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-fuchsia-400 mb-1">📊 Probability & Timeline</div>
                    <div className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Probability:</strong> 85%<br/>
                        <strong className="text-slate-300">Timeline:</strong> The lag effect takes about one growing season. Expect severe supply crunches and price spikes by the Fall 2026 and Spring 2027 harvest cycles.
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-red-500 mb-1">🚨 The Signals</div>
                    <div className="text-[11px] text-slate-400">
                        Extreme price surges in raw agricultural commodities (wheat, corn); limits placed on consumer grocery purchases; and government subsidies specifically aimed at domestic synthetic fertilizer production.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ How to Prepare</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Transition from simply stockpiling dry goods to producing high-density, zero-power caloric reserves. Mastering pressure canning for bulk meats and refining the environmental controls needed for dry-curing ensures a localized, shelf-stable protein supply. These preserved proteins instantly become the ultimate physical currency for barter when the analog economy takes over.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'guide-canning-meats',
        title: 'Guide: Pressure Canning Raw Meats',
        subtitle: 'Shelf-stable beef, chicken, and pork without refrigeration.',
        image: '/blog/guide_canning_meats_blog.png',
        readTime: '7 min',
        tag: 'GUIDE',
        tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    Pressure canning raw meat is one of the highest value skills you can acquire for localized resilience. Unlike water bath canning (which is just boiling water for high-acid foods like jams), pressure canning reaches 240°F (115°C) to safely destroy botulism spores, creating deeply tender, safe-to-eat proteins that last for years on a shelf.
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-emerald-400 mb-1">📋 The Core Method: Raw Pack</div>
                    <div className="text-[11px] text-slate-400">
                        Cube your meat (beef, chicken, or game), pack tightly into clean mason jars leaving 1-inch headspace, add a half teaspoon of canning salt, and process in a heavy-duty pressure canner (like an All American or Presto) at your altitude's required PSI (usually 10-15 PSI) for 75 mins (pints) or 90 mins (quarts).
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-red-500 mb-1">⚠️ Safety First</div>
                    <div className="text-[11px] text-slate-400">
                        You MUST use a dedicated pressure canner, NOT a pressure cooker or Instant Pot. Adhere strictly to the USDA Complete Guide to Home Canning times and pressures. Never shortcut the processing time.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ Action Steps</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Purchase a 21-quart or larger gauge-equipped pressure canner. Start with a simple batch of chicken breasts—they are inexpensive, forgiving to can, and produce an incredible ready-to-eat pulled chicken for immediate emergency use.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'guide-canning-meals',
        title: 'Guide: Processing Complete Meals',
        subtitle: 'Heat-and-eat stews, chili, and soups in a jar.',
        image: '/blog/guide_canning_meals_blog.png',
        readTime: '6 min',
        tag: 'GUIDE',
        tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    Once you master canning single ingredients, the next evolution is "Meals in a Jar." These are pre-cooked stews, bean chilis, and hearty soups that are processed so that during a chaotic emergency, your family simply needs to pop a lid and heat it up over a camp stove.
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-orange-400 mb-1">📋 The Core Method: Hot Pack</div>
                    <div className="text-[11px] text-slate-400">
                        Cook your stew or chili normally, but leave out thickeners like flour, cornstarch, or pasta as they break down or inhibit heat penetration. Ladle the hot food into hot jars, leaving 1-inch headspace. You MUST process the entire jar for the time required by the ingredient that takes the longest (e.g., if it has meat, it requires 75-90 minutes at pressure, regardless of the vegetables).
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-red-500 mb-1">⚠️ Safety First</div>
                    <div className="text-[11px] text-slate-400">
                        Never add dairy, rice, noodles, or thickeners to a canning recipe before processing. They interfere with the heat penetration necessary to kill bacteria within the jar.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ Action Steps</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Prepare a large batch of your favorite venison or beef chili (without beans if you want a faster process, or with soaked beans processed for the full time). Can 7 quarts. You now have seven ready-to-eat dinners that require zero grid power to maintain.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'guide-pantry-staples',
        title: 'Guide: The Mylar & Bucket System',
        subtitle: 'Decade-long storage for bulk rice, beans, and grains.',
        image: '/blog/guide_pantry_staples_blog.png',
        readTime: '5 min',
        tag: 'GUIDE',
        tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    While canned meats provide necessary proteins, bulk dry goods fuel the caloric engine of your household. The enemy of dry goods storage is moisture, oxygen, light, and rodents. To defeat all four simultaneously and achieve a 20-30 year shelf life, you must utilize the Mylar Bag and Oxygen Absorber system.
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-blue-400 mb-1">📋 The Core Method: Mylar Sealing</div>
                    <div className="text-[11px] text-slate-400">
                        Place a heavy-duty 5-mil or 7-mil Mylar bag inside a clean 5-gallon bucket. Fill with dry goods (white rice, oats, beans) leaving 2 inches at the top. Drop in a 2000cc Oxygen Absorber. Immediately seal the top of the bag using a hair straightener or impulse sealer, pressing out as much air as possible before the final seal. Snap on a gamma seal lid.
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-red-500 mb-1">⚠️ Safety First</div>
                    <div className="text-[11px] text-slate-400">
                        Never vacuum seal or use oxygen absorbers on sugar or salt (they will turn into solid bricks) or things with high moisture/fat content like brown rice or nuts (which will go rancid despite the oxygen absorber).
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ Action Steps</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Start with a 50lb bag of white rice from Costco or a restaurant supply store. Buy five 5-gallon buckets with gamma lids, and a pack of 5-gallon Mylar bags with absorbers. Dedicate a Saturday afternoon to sealing them up. Label the buckets clearly with the date.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'guide-dry-curing',
        title: 'Guide: Dry Curing and Smoking',
        subtitle: 'Traditional no-power protein preservation.',
        image: '/blog/guide_dry_curing_blog.png',
        readTime: '6 min',
        tag: 'GUIDE',
        tagColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        renderContent: () => (
            <div className="space-y-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                    Long before refrigeration, our ancestors preserved massive amounts of game and livestock using salt and smoke. By manipulating salinity, pH, and water activity, you can create hostile environments for bacteria while rendering meats completely shelf-stable and deeply flavorful.
                </div>
                
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                    <div className="text-xs font-bold text-rose-400 mb-1">📋 The Core Method: Equilibrium Curing</div>
                    <div className="text-[11px] text-slate-400">
                        Weigh your meat in grams. Apply exactly 2.5% to 3% of that weight in sea salt, and 0.25% in Prague Powder #2 (Nitrate/Nitrite). Coat the meat, seal it in a bag or container in a cold environment (under 40°F) to allow the salt to equalize throughout the muscle. Once cured, hang the meat in a controlled chamber (55°F, 75% humidity) until it loses 30-40% of its initial raw weight.
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-red-500 mb-1">⚠️ Safety First</div>
                    <div className="text-[11px] text-slate-400">
                        Precision is non-negotiable. Too little salt or nitrate leaves the core vulnerable to botulism. Too much humidity during hanging causes bad mold; too little causes "case hardening," where the outside dries out and rots the inside. Use a digital scale and maintain strict calibration.
                    </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                    <div className="text-xs font-bold text-primary mb-1">⚡ Action Steps</div>
                    <div className="text-sm text-white mt-1 leading-relaxed">
                        Start small. Build a "Biltong Box" or a small jerky smoker first. Master the salt equilibrium cure on a simple piece of pork belly to make your own bacon before moving on to hanging whole muscle groups like proscuitto or salami in a dedicated curing chamber.
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'infographic-strategic-prepper',
        title: 'INFOGRAPHIC: The Strategic Prepper Framework',
        subtitle: 'Geopolitical geometry, economic shifts, and the offline roadmap.',
        image: '/blog/strategic_infographic_blueprint.png',
        readTime: '10 min',
        tag: 'INFOGRAPHIC',
        tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        renderContent: () => (
            <div className="space-y-6">
                {/* Header Phase */}
                <div className="text-center p-4 border-b border-white/10">
                    <h3 className="text-lg font-black text-cyan-400 tracking-widest uppercase">The Strategic Prepper</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Geopolitical Geometry for Resilience</p>
                </div>

                {/* Section 1: The Geopolitical Shift */}
                <div className="relative border border-white/5 rounded-xl bg-black/40 p-4">
                    <div className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-3 text-center">Phase 01: The Macro Shift</div>
                    
                    <div className="flex flex-col gap-2 relative">
                        <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-3 text-center relative z-10 mr-12">
                            <div className="text-xs font-bold text-red-500 tracking-wider mb-2">OLD WORLD ORDER</div>
                            <div className="text-[9px] text-slate-400 space-y-1 font-semibold uppercase tracking-wider">
                                <div>• Debt Expansion</div>
                                <div>• Offshored Manufacturing</div>
                                <div>• Global Police Force</div>
                            </div>
                        </div>
                        
                        <div className="absolute inset-y-0 right-10 flex flex-col items-center justify-center -mr-2 z-0 opacity-50">
                            <div className="text-[20px]">↓</div>
                        </div>
                        
                        <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-3 text-center relative z-10 ml-12 mt-2">
                            <div className="text-xs font-bold text-emerald-400 tracking-wider mb-2">TRUMP WORLD ORDER</div>
                            <div className="text-[9px] text-slate-300 space-y-1 font-semibold uppercase tracking-wider">
                                <div>• Domestic Resources</div>
                                <div>• Re-Industrialization</div>
                                <div>• Fortress North America</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: The Transition Depression */}
                <div className="relative border border-white/5 rounded-xl bg-black/40 p-4">
                    <div className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-3 text-center">Phase 02: 2026-2029 "Valley of Death"</div>
                    <div className="space-y-3 border-l text-left border-orange-500/30 ml-2 pl-3">
                        <div className="relative">
                            <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-orange-500"></div>
                            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">⚡ Energy & Supply Shocks</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Strait of Hormuz blockades cause hyper-inflation in natural gas and logistics.</div>
                        </div>
                        <div className="relative pt-2 border-t border-white/5">
                            <div className="absolute -left-[17px] top-3 w-2 h-2 rounded-full bg-rose-500"></div>
                            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">📉 Fiat/Debt Ponzi Collapse</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">The US Dollar and sovereign bonds crack, causing a massive credit freeze and killing the "email economy."</div>
                        </div>
                        <div className="relative pt-2 border-t border-white/5">
                            <div className="absolute -left-[17px] top-3 w-2 h-2 rounded-full bg-amber-400"></div>
                            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">🏗️ Re-industrialization Lag</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Cheap overseas goods vanish; a multi-year gap exists before domestic automated factories come online.</div>
                        </div>
                        <div className="relative pt-2 border-t border-white/5">
                            <div className="absolute -left-[17px] top-3 w-2 h-2 rounded-full bg-purple-400"></div>
                            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">🛡️ Resource Hoarding</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Gov. diverts heavy steel, copper, and lithium for national infrastructure, starving civilian markets.</div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Strategic Framework */}
                <div className="relative border border-white/5 rounded-xl bg-black/40 p-4">
                    <div className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-3 text-center">Phase 03: The Three Pillars</div>
                    <div className="space-y-3">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <div className="text-xs font-bold text-blue-400 flex items-center gap-2"><span>1.</span> Financial Fortress</div>
                            <div className="text-[10px] text-slate-300 mt-1">Trim LMT & broad indexes. Pivot capital heavily into domestic energy, utilities, and raw material sectors.</div>
                        </div>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                            <div className="text-xs font-bold text-indigo-400 flex items-center gap-2"><span>2.</span> DeFi & AI Flywheel</div>
                            <div className="text-[10px] text-slate-300 mt-1">Stake TAO for absolute AI upside. Deploy SUI/vSUI on Navi Protocol with an automated Python "Guardian" script to block liquidation.</div>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2"><span>3.</span> Operational Hard Assets</div>
                            <div className="text-[10px] text-slate-300 mt-1">Accumulate physical silver rounds, deploy modular MPPT solar architecture, and establish analog protein preservation (heavy pressure canning/dry curing).</div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Architecture */}
                <div className="relative border border-cyan-500/20 rounded-xl bg-cyan-500/5 p-4">
                    <div className="text-[10px] font-black tracking-widest text-cyan-400 uppercase mb-3 text-center">PrepRigs: Offline-First OS</div>
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-200">
                        <div className="bg-black/50 border border-cyan-500/20 flex flex-col justify-center rounded p-2 h-12">Local SQLite<br/>Database</div>
                        <div className="bg-black/50 border border-cyan-500/20 flex flex-col justify-center rounded p-2 h-12">1-Week / 1-Month<br/>Item Seed</div>
                        <div className="bg-black/50 border border-cyan-500/20 flex flex-col justify-center rounded p-2 h-12">Energy & Solar<br/>Telemetry</div>
                        <div className="bg-black/50 border border-cyan-500/20 flex flex-col justify-center rounded p-2 h-12">AI Cortex<br/>Device SLM</div>
                        <div className="bg-black/50 border border-cyan-500/20 flex flex-col justify-center rounded p-2 h-12">Encrypted Seed<br/>Vault (Crypto)</div>
                        <div className="bg-black/50 border border-cyan-500/20 flex flex-col justify-center rounded p-2 h-12">P2P Mesh<br/>Barter Ledger</div>
                    </div>
                </div>
            </div>
        ),
    }
];

/* ─── Main Component ─── */

export function BlogSection() {
    const [openArticle, setOpenArticle] = useState<BlogArticle | null>(null);

    if (openArticle) {
        return (
            <div className="animate-fadeIn">
                <div className="relative">
                    <img src={openArticle.image} className="w-full h-44 object-cover rounded-t-xl" alt={openArticle.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-t-xl" />
                    <button
                        onClick={() => setOpenArticle(null)}
                        className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border inline-block mb-2 ${openArticle.tagColor}`}>
                            {openArticle.tag}
                        </span>
                        <h2 className="text-xl font-bold text-white leading-tight">{openArticle.title}</h2>
                        <p className="text-[11px] text-slate-300 mt-1">{openArticle.subtitle}</p>
                    </div>
                </div>
                <div className="p-4">
                    {openArticle.renderContent()}
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <button
                            onClick={() => setOpenArticle(null)}
                            className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline"
                        >
                            <ChevronLeft size={14} /> Back to all articles
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" />
                    <h2 className="text-base font-bold text-white">Prep Academy</h2>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{ARTICLES.length} guides</span>
            </div>

            <div className="space-y-3">
                {ARTICLES.map((article) => (
                    <button
                        key={article.id}
                        onClick={() => setOpenArticle(article)}
                        className="w-full text-left group"
                    >
                        <div className="bg-surface rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all active:scale-[0.98]">
                            <div className="flex gap-0">
                                <div className="w-28 h-28 flex-shrink-0 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${article.tagColor}`}>
                                                {article.tag}
                                            </span>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <Clock size={9} /> {article.readTime}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                                            {article.title}
                                        </h3>
                                    </div>
                                    <div className="text-primary text-[11px] font-semibold mt-1">
                                        View Guide →
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
