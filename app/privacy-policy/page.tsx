import generatePageMetadata from "@/utils/generateMetadata";

export const metadata = generatePageMetadata("privacy-policy");

export default function PrivacyPolicyPage() {
    return (
        <main className="w-full pt-20 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-12">Privacy Policy</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>Welcome to Vortexio Solutions. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or interact with our services.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                        <p>We collect information that you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or engage in a project with us. This may include your name, email address, phone number, and project details.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-400">
                            <li>Provide and maintain our services</li>
                            <li>Respond to your inquiries and support requests</li>
                            <li>Improve our website and user experience</li>
                            <li>Send periodic updates or marketing materials (if opted in)</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. However, no method of transmission over the internet is 100% secure.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p className="mt-2 text-primary">info@vortexiosolutions.com</p>
                        <p className="text-primary">+91 7011636150</p>
                    </section>

                    <p className="text-sm text-gray-500 mt-12">Last Updated: December 29, 2025</p>
                </div>
            </div>
        </main>
    );
}
