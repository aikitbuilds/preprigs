const fs = require('fs');
const path = 'f:/Active Projects 2-1-26/Proto/preprigs.com/src/components/BlogSection.tsx';
let content = fs.readFileSync(path, 'utf-8');

// Update imports
content = content.replace(
  "import { BookOpen, Clock, ChevronLeft } from 'lucide-react';", 
  "import { BookOpen, Clock, ChevronLeft, Star, ShieldAlert } from 'lucide-react';"
);

// Update interface
content = content.replace(
  "    renderContent: () => React.ReactNode;",
  "    category: 'Geopolitics' | 'Food & Preserving' | 'Hardware & Tech';\n    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';\n    rating: number;\n    reviewCount: number;\n    renderContent: () => React.ReactNode;"
);

// Add properties
const updates = {
    'fortress-economy': `category: 'Geopolitics', difficulty: 'Beginner', rating: 4.8, reviewCount: 142,`,
    'energy-chokepoint': `category: 'Hardware & Tech', difficulty: 'Intermediate', rating: 4.9, reviewCount: 89,`,
    'protein-preservation': `category: 'Food & Preserving', difficulty: 'Intermediate', rating: 4.7, reviewCount: 205,`,
    'hard-assets': `category: 'Hardware & Tech', difficulty: 'Beginner', rating: 4.9, reviewCount: 167,`,
    'digital-lifeboat': `category: 'Hardware & Tech', difficulty: 'Intermediate', rating: 4.8, reviewCount: 114,`,
    'scenario-technate': `category: 'Geopolitics', difficulty: 'Advanced', rating: 4.9, reviewCount: 312,`,
    'scenario-chokepoint': `category: 'Geopolitics', difficulty: 'Advanced', rating: 4.7, reviewCount: 154,`,
    'scenario-infrastructure': `category: 'Geopolitics', difficulty: 'Intermediate', rating: 4.6, reviewCount: 98,`,
    'scenario-caloric': `category: 'Geopolitics', difficulty: 'Advanced', rating: 4.9, reviewCount: 288,`,
    'guide-canning-meats': `category: 'Food & Preserving', difficulty: 'Advanced', rating: 5.0, reviewCount: 405,`,
    'guide-canning-meals': `category: 'Food & Preserving', difficulty: 'Intermediate', rating: 4.8, reviewCount: 231,`,
    'guide-pantry-staples': `category: 'Food & Preserving', difficulty: 'Beginner', rating: 4.9, reviewCount: 512,`,
    'guide-dry-curing': `category: 'Food & Preserving', difficulty: 'Advanced', rating: 4.7, reviewCount: 177,`,
    'infographic-strategic-prepper': `category: 'Geopolitics', difficulty: 'Beginner', rating: 4.9, reviewCount: 423,`,
};

for (const [id, payload] of Object.entries(updates)) {
    content = content.replace(`id: '${id}',`, `id: '${id}',\n        ${payload}`);
}

// Update BlogSection component state and rendering
const blogSectionRegex = /export function BlogSection\(\) \{[\s\S]*?return \(/;

let newBlogSectionTop = `export function BlogSection() {
    const [openArticle, setOpenArticle] = useState<BlogArticle | null>(null);
    const [activeCategory, setActiveCategory] = useState<'All' | 'Geopolitics' | 'Food & Preserving' | 'Hardware & Tech'>('All');

    const filteredArticles = activeCategory === 'All' 
        ? ARTICLES 
        : ARTICLES.filter(a => a.category === activeCategory);

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
                        <div className="flex items-center gap-2 mb-2">
                            <span className={\`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border inline-block \${openArticle.tagColor}\`}>
                                {openArticle.tag}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-yellow-500/20">
                                <Star size={10} fill="currentColor" /> {openArticle.rating} ({openArticle.reviewCount} Reviews)
                            </span>
                            <span className={\`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full \${openArticle.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border-green-500/20' : openArticle.difficulty === 'Intermediate' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}\`}>
                                {openArticle.difficulty}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-white leading-tight">{openArticle.title}</h2>
                        <p className="text-[11px] text-slate-300 mt-1">{openArticle.subtitle}</p>
                    </div>
                </div>
                <div className="p-4 bg-surface rounded-b-xl border border-white/5 border-t-0 text-white">
                     {openArticle.renderContent()}
                     <div className="pt-4 mt-4 border-t border-white/5">
                        <button
                            onClick={() => setOpenArticle(null)}
                            className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                            <ChevronLeft size={14} /> Back to Prep Academy
                        </button>
                     </div>
                </div>
            </div>
        );
    }

    return (`;

content = content.replace(blogSectionRegex, newBlogSectionTop);

const listRegex = /<div className="space-y-3">\s*\{ARTICLES\.map\(\(article\) => \(/;

let newListTop = `
            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Geopolitics', 'Food & Preserving', 'Hardware & Tech'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={\`px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-all \${activeCategory === cat ? 'bg-primary border-primary text-background' : 'bg-surface border-white/10 text-slate-400 hover:text-white hover:border-white/20'}\`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredArticles.map((article) => (`;
content = content.replace(listRegex, newListTop);

let replaceCardHeaderRegex = /<div className="text-primary text-\[11px\] font-semibold mt-1">\s*View Guide →\s*<\/div>/g;
let newCardHeader = `<div className="flex items-center gap-3 mt-1.5">
                                        <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
                                            <Star size={9} fill="currentColor" /> {article.rating}
                                        </div>
                                        <div className={\`text-[9px] font-bold px-1.5 py-0.5 rounded border \${article.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' : article.difficulty === 'Intermediate' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}\`}>
                                            {article.difficulty}
                                        </div>
                                        <div className="text-primary text-[10px] font-bold ml-auto flex items-center pr-1">
                                            Read →
                                        </div>
                                     </div>`;
content = content.replace(replaceCardHeaderRegex, newCardHeader);

fs.writeFileSync(path, content);
console.log("Updated BlogSection successfully!");
