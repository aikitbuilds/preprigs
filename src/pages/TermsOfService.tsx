
interface TermsOfServiceProps {
    onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
    return (
        <div className="min-h-screen bg-background text-white p-6 md:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto bg-surface border border-white/5 rounded-2xl p-6 md:p-10 shadow-lg">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    &larr; Back
                </button>
                
                <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
                <p className="text-slate-500 text-sm mb-8">Last Updated: April 2026</p>

                <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                    <p>
                        Welcome to PrepRigs. These Terms of Service ("Terms") govern your use of the PrepRigs application, website, and associated services (collectively, the "Service"). By creating an account or using our Service, you agree to these Terms. If you do not agree, do not use PrepRigs.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By registering for an account or otherwise accessing PrepRigs, you represent that you are of legal age to form a binding contract and agree to be bound by these Terms and our Privacy Policy.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Nature of the Service</h2>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                        <strong className="text-orange-400 block mb-2">CRUCIAL DISCLAIMER:</strong>
                        <p className="mb-2">PrepRigs is designed strictly as an <strong>informational and planning tool</strong> to assist users in organizing preparedness inventory and evaluating conceptual emergency scenarios.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>PrepRigs <strong>does not guarantee</strong> survival, safety, physical protection, or positive health outcomes in any emergency or disaster event.</li>
                            <li>PrepRigs is <strong>not</strong> an emergency communications system, a first-responder service, or a replacement for official government or local emergency broadcast systems.</li>
                        </ul>
                    </div>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">3. AI & Automated Advice Disclaimer</h2>
                    <p className="mb-3">
                        PrepRigs utilizes artificial intelligence (including our "Cortex AI" system) to generate scenarios, suggest shopping lists, and estimate readiness scores based on your inputs.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Predictive Estimates Only:</strong> All AI-generated advice, inventory calculations, and survival scenarios are predictive estimates. They are strictly for educational and planning purposes.</li>
                        <li><strong>No Professional Advice:</strong> The AI's outputs <strong>must not</strong> replace or supersede professional medical, tactical, financial, or structural engineering advice.</li>
                        <li>You agree that PrepRigs and its creators possess <strong>zero liability</strong> for any personal injury, property damage, loss of life, or other harm resulting from actions you take or fail to take based on the suggestions, estimates, or data provided by Cortex AI or the PrepRigs system.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">4. User Responsibilities</h2>
                    <p className="mb-3">You are entirely responsible for the accuracy, legality, and maintenance of the data you input into the Service.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Data Integrity:</strong> If you overstate, miscalculate, or incorrectly input your caloric inventory, water supplies, or medical items, and subsequently suffer a shortfall during a real-world event, PrepRigs is completely absolved of any resulting liability.</li>
                        <li><strong>Real-World Execution:</strong> The execution, storage safety, and practical application of the prep plans you build are entirely your responsibility.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Service Availability</h2>
                    <p className="mb-3">PrepRigs currently relies on cloud-based infrastructure to store your inventory and profile data.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Grid-Down Scenarios:</strong> Because PrepRigs requires an active internet connection to access cloud databases, service interruptions may occur. PrepRigs <strong>is not liable</strong> for your inability to access your inventory, checklists, or plans during power outages, grid-down scenarios, natural disasters, or internet service disruptions.</li>
                        <li>We strongly advise users to keep offline, physical backups of critical readiness information.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Account Termination & Data Deletion</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Termination by User:</strong> You have the right to close your account and initiate the deletion of your personal data at any time via the account settings panel.</li>
                        <li><strong>Termination by PrepRigs:</strong> We reserve the right to suspend or ban users, without notice or liability, for violating these Terms, engaging in abusive behavior, or using the platform for illegal activities.</li>
                    </ul>

                    <div className="mt-12 pt-8 border-t border-white/10 text-slate-400">
                        <p>For support or legal inquiries, please contact: <a href="mailto:info@prepproto.com" className="text-primary hover:underline">info@prepproto.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
