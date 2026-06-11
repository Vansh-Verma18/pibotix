import generatePageMetadata from "@/utils/generateMetadata";

export const metadata = generatePageMetadata("terms-conditions");

export default function TermsConditionsPage() {
    return (
        <main className="w-full pt-20 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-12">Terms & Conditions</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using the services of Vortexio Solutions, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Services</h2>
                        <p>Vortexio Solutions provides software development, design, and consulting services. The scope of work for each project will be defined in a separate agreement or proposal.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Intellectual Property</h2>
                        <p>Unless otherwise agreed in writing, all source code, designs, and materials created by Vortexio Solutions during a project remain the property of Vortexio Solutions until full payment is received. Upon full payment, intellectual property rights are transferred to the client as specified in our service agreement.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
                        <p>Payments for services are due according to the schedule outlined in the project proposal. Late payments may result in a suspension of services or additional fees.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>Vortexio Solutions will not be liable for any indirect, incidental, or consequential damages arising out of the use of our services or the failure of any software delivered.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">6. Governing Law</h2>
                        <p>These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Delhi, India.</p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">7. Contact Information</h2>
                        <p>For any questions regarding these terms, please contact us at <span className="text-primary">info@vortexiosolutions.com</span>.</p>
                    </section>

                    <p className="text-sm text-gray-500 mt-12">Last Updated: December 29, 2025</p>
                </div>
            </div>
        </main>
    );
}
