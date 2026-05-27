import { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { useInventoryStore } from '../store/useInventoryStore';
import { useChecklistStore } from '../store/useChecklistStore';
import { useChatStore } from '../store/useChatStore';
import { generateIntelligenceChat } from '../lib/gemini';
import { BrainCircuit, Target, CheckCircle2, Droplets, Utensils, ShieldAlert, Send, Loader2, MessageSquareText, Settings } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { InfographicBanner } from '../components/InfographicBanner';

interface AIAssistantProps {
    userProfile: UserProfile | null;
}

export function AIAssistant({ userProfile }: AIAssistantProps) {
    const items = useInventoryStore(state => state.items);
    const checklists = useChecklistStore(state => state.checklists);
    const isDesktopView = useUIStore(state => state.isDesktopView);

    const { messages, preferences, addMessage, addPreference, clearChat } = useChatStore();
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll chat to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const { metrics, recommendations } = useMemo(() => {
        const householdSize = userProfile?.householdSize || 1;
        const experience = userProfile?.experienceLevel || 'Beginner';

        const totalCalories = items.filter(i => i.category === 'Food').reduce((sum, item) => sum + (item.calories * item.quantity), 0);
        const daysOfFood = Math.floor(totalCalories / (2000 * householdSize));
        const waterItemsCount = items.filter(i => i.category === 'Water').reduce((sum, item) => sum + item.quantity, 0);

        const checklistStats = checklists.map(c => {
            const completed = c.items.filter(i => i.completed).length;
            const total = c.items.length;
            return {
                id: c.id,
                title: c.title,
                percent: total > 0 ? (completed / total) * 100 : 0
            };
        }).sort((a, b) => a.percent - b.percent);

        const lowestChecklist = checklistStats.length > 0 ? checklistStats[0] : null;

        const recs = [];

        if (waterItemsCount < householdSize * 3) {
            recs.push({
                title: 'Secure Emergency Water',
                description: `Aim for a minimum of ${householdSize * 3} gallons total for a 3-day supply for ${householdSize} people.`,
                icon: <Droplets className="text-blue-400" size={20} />,
                urgency: 'high'
            });
        }

        if (daysOfFood < 3) {
            recs.push({
                title: 'Build a 72-Hour Food Cache',
                description: `You have ${daysOfFood} days of food. Prioritize high-calorie, shelf-stable foods.`,
                icon: <Utensils className="text-orange-400" size={20} />,
                urgency: 'high'
            });
        } else if (daysOfFood < 14 && experience !== 'Beginner') {
            recs.push({
                title: 'Expand to 2-Week Supply',
                description: `Great job on basics. Scale your food storage to 14 days.`,
                icon: <Target className="text-yellow-400" size={20} />,
                urgency: 'medium'
            });
        }

        if (lowestChecklist && lowestChecklist.percent < 100) {
            recs.push({
                title: `Protocol: ${lowestChecklist.title}`,
                description: `Finish this task list to boost readiness score. Currently ${Math.round(lowestChecklist.percent)}% complete.`,
                icon: <CheckCircle2 className="text-emerald-400" size={20} />,
                urgency: lowestChecklist.percent === 0 ? 'high' : 'medium'
            });
        }

        const protectionItems = items.filter(i => i.category === 'Protection').length;
        if (protectionItems === 0 && userProfile?.locationType === 'Urban') {
            recs.push({
                title: 'Urban Defense Considerations',
                description: 'Your Urban location carries higher risks during civil unrest.',
                icon: <ShieldAlert className="text-purple-400" size={20} />,
                urgency: 'medium'
            });
        }

        if (recs.length === 0) {
            recs.push({
                title: 'Maintain and Rotate',
                description: 'Begin routinely checking expiration dates and rotating stock.',
                icon: <CheckCircle2 className="text-emerald-400" size={20} />,
                urgency: 'low'
            });
        }

        return {
            metrics: { daysOfFood, waterItemsCount },
            recommendations: recs.slice(0, 4)
        };
    }, [items, checklists, userProfile]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userText = input.trim();
        setInput('');
        addMessage({ role: 'user', content: userText });
        setIsTyping(true);

        const contextStr = `
Household Size: ${userProfile?.householdSize || 1}
Experience: ${userProfile?.experienceLevel || 'Beginner'}
Location: ${userProfile?.locationType || 'Urban'}

Inventory Snapshot:
- Total Items: ${items.length}
- Food Days: ${metrics.daysOfFood}
- Water Containers: ${metrics.waterItemsCount}
- Medical Items: ${items.filter(i => i.category === 'Medical').reduce((sum, i) => sum + i.quantity, 0)}

Checklists:
${checklists.map(c => `- ${c.title}: ${c.items.filter(i => i.completed).length}/${c.items.length} done`).join('\n')}
        `.trim();

        try {
            const chatPayload = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
            chatPayload.push({ role: 'user', content: userText });

            const result = await generateIntelligenceChat(chatPayload, contextStr, preferences);

            addMessage({ role: 'assistant', content: result.text });

            if (result.newPreference) {
                addPreference(result.newPreference);
                addMessage({ role: 'system', content: `[SYSTEM: Recorded new preference - "${result.newPreference}"]` });
            }
        } catch (error) {
            console.error("Chat Error", error);
            addMessage({ role: 'system', content: "Error: Comm link to Intelligence severed." });
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={`flex flex-col bg-background min-h-full pb-24 transition-all duration-300 ${isDesktopView ? 'p-8 max-w-7xl mx-auto w-full' : ''}`}>
            {/* Header */}
            <div className={`bg-surface border-b border-white/5 px-4 pt-4 pb-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 ${isDesktopView ? 'rounded-2xl mb-6 border border-white/10' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <BrainCircuit className="text-primary" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Intelligence Officer</h2>
                        <p className="text-xs text-slate-400">AI-Driven Action Plan & Advisory</p>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-0">
                <InfographicBanner
                    title="Actionable Intelligence"
                    description="Your AI advisor processes your inventory gaps and checklist progress to deliver daily, prioritized directives so you always know your next move."
                    features={[
                        { icon: <Target size={16} />, title: "Precision", text: "Calculates precise calorie & water deficits." },
                        { icon: <ShieldAlert size={16} />, title: "Risk Aware", text: "Factor in your location and experience." },
                        { icon: <MessageSquareText size={16} />, title: "On-Call", text: "Ask questions, get tailored protocols." }
                    ]}
                />
            </div>

            <div className={`grid gap-6 px-4 md:px-0 ${isDesktopView ? 'md:grid-cols-12' : 'grid-cols-1'}`}>

                {/* LEFT COLUMN: Static Directives */}
                <div className={`${isDesktopView ? 'md:col-span-4' : ''} space-y-4`}>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Directives</h3>
                    {recommendations.map((rec, index) => (
                        <div key={index} className="bg-surface rounded-2xl border border-white/5 p-4 shadow-sm relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-1 h-full ${rec.urgency === 'high' ? 'bg-red-500' : rec.urgency === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                            <div className="flex gap-4">
                                <div className="mt-1 flex-shrink-0 bg-black/20 p-2 rounded-xl border border-white/5">
                                    {rec.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-white text-base">{rec.title}</h4>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {rec.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Show Learned Preferences if any */}
                    {preferences.length > 0 && (
                        <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-2xl">
                            <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-2">
                                <Settings size={14} /> Learned Parameters
                            </h4>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                                {preferences.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: AI Chat */}
                <div className={`${isDesktopView ? 'md:col-span-8 flex flex-col h-[calc(100vh-200px)]' : 'flex flex-col h-[500px] mb-8'} bg-surface rounded-2xl border border-white/5 overflow-hidden shadow-sm relative`}>

                    {/* Chat Header */}
                    <div className="p-3 border-b border-white/5 bg-black/20 flex items-center gap-2">
                        <MessageSquareText size={16} className="text-primary" />
                        <h3 className="font-bold text-sm text-white">Secure Comms Channel</h3>
                        {messages.length > 0 && (
                            <button onClick={clearChat} className="ml-auto text-xs text-slate-500 hover:text-white transition-colors">Clear History</button>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 max-w-sm mx-auto text-center px-4">
                                <BrainCircuit size={48} className="mb-4 opacity-20" />
                                <p className="mb-2 font-semibold">Intelligence Online.</p>
                                <p className="text-xs">Ask me about your inventory, request alternatives to items you dislike, or ask for specific survival strategies based on your location.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'system' ? (
                                        <div className="w-full text-center text-[10px] text-primary/60 font-mono tracking-wider py-2">
                                            {msg.content}
                                        </div>
                                    ) : (
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-black font-medium rounded-tr-sm' : 'bg-black/40 border border-white/5 text-slate-300 rounded-tl-sm'
                                            }`}>
                                            {/* Simple markdown bold parsing for AI response formatting */}
                                            {msg.content.split('**').map((text, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-white">{text}</strong> : text)}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-black/40 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                                    <Loader2 size={16} className="text-primary animate-spin" />
                                    <span className="text-xs font-semibold text-slate-500">Processing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-black/40 border-t border-white/5">
                        <div className="flex items-end gap-2 bg-surface border border-white/10 rounded-xl focus-within:border-primary/50 transition-colors p-1 pr-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Consult Intelligence..."
                                className="w-full bg-transparent text-white text-sm outline-none px-3 py-2.5 resize-none max-h-32 min-h-[44px] custom-scrollbar"
                                rows={1}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="mb-1 p-2 rounded-lg bg-primary text-black disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500 transition-colors shrink-0"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <p className="text-center text-[9px] text-slate-500 mt-2 tracking-wide uppercase">AI can make mistakes. Verify critical logic.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
