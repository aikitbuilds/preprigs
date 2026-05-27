
interface PrivacyPolicyProps {
    onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
    return (
        <div className="min-h-screen bg-background text-white p-6 md:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto bg-surface border border-white/5 rounded-2xl p-6 md:p-10 shadow-lg">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    &larr; Back
                </button>
                
                <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
                <p className="text-slate-500 text-sm mb-8">Last Updated: April 2026</p>

                <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                    <p>
                        At PrepRigs, we take your privacy and the security of your preparedness data seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our Service.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">1. What Data We Collect</h2>
                    <p className="mb-3">When you use PrepRigs, we collect the following types of information:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Account Data:</strong> When you register, we collect your email address and authentication credentials securely via our identity provider.</li>
                        <li><strong>Onboarding & Profile Data:</strong> To customize your readiness plans, we gather your submitted household size, general location type (e.g., Urban, Suburban, Rural), experience level, and zip code (for regional threat analysis).</li>
                        <li><strong>Inventory & Preparedness Data:</strong> We collect and store your inputted inventory lists, tracked items, custom checklists, scenarios, and prep builder budgets.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Your Data</h2>
                    <p className="mb-3">Your data is strictly used to run the app's features and improve your personal planning experience. Specifically, we use it to:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Run the analytical engines that calculate your readiness scores.</li>
                        <li>Power the Cortex AI models to provide scenario models, gear suggestions, and tailored advice.</li>
                        <li>Sync your preparedness information securely across your mobile and desktop devices.</li>
                    </ul>
                    <p className="italic mt-2">We do not sell your personal data to third parties.</p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Third-Party Services</h2>
                    <p className="mb-3">To operate the PrepRigs platform robustly, we integrate with secured third-party infrastructure providers:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Google Firebase:</strong> We use Firebase for authentication, database hosting (Firestore), and web hosting. Your profile and inventory data are stored securely on Firebase cloud servers.</li>
                        <li><strong>AI Providers / Cortex AI Integration:</strong> Your inventory metadata and preparedness questions may be processed by third-party Large Language Model (LLM) APIs to generate responses. <strong>We configure these integrations such that your personal preparedness data is NOT used to train third-party public models.</strong></li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Data Security</h2>
                    <p>
                        We employ industry-standard security measures, including secured cloud protocols and encrypted data-in-transit, to safeguard your information. Our database operates under strict security rules ensuring that only an authenticated user can read or write their own personal records. However, please be aware that no method of internet transmission or electronic storage is 100% secure.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Your Rights: Account & Data Deletion</h2>
                    <p className="mb-3">You maintain complete control over your data. We provide a frictionless way for you to permanently delete your data when you choose to leave the platform.</p>
                    
                    <strong className="text-white block mb-2 mt-4">How to Delete Your Data:</strong>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Log into your PrepRigs account.</li>
                        <li>Navigate to the <strong>Profile / Settings</strong> screen from the main dashboard.</li>
                        <li>Scroll to the "Account Management" or "Danger Zone" section.</li>
                        <li>Click <strong>Delete Account and Wipe Data</strong>.</li>
                        <li>You will be prompted to confirm this action. Upon confirmation, a script will permanently purge all your inventory records, checklists, profile data, and your authentication account from the active database. Data cannot be recovered once this action is executed.</li>
                    </ol>

                    <div className="mt-12 pt-8 border-t border-white/10 text-slate-400">
                        <p>If you have questions about this Privacy Policy or need assistance regarding your data, please contact: <a href="mailto:info@prepproto.com" className="text-primary hover:underline">info@prepproto.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
