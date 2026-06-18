export const metadata = {
  title: 'Terms & Conditions | AutoForge',
};

export default function TermsConditionsPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Terms & Conditions</h1>
        <p className="text-gray-400">Last Updated: June 2026</p>
        
        <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-400">
          By accessing and using the AutoForge website and our services, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Intellectual Property</h2>
        <p className="text-gray-400">
          All content, design, graphics, compilation, magnetic translation, digital conversion, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary rights.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Limitation of Liability</h2>
        <p className="text-gray-400">
          AutoForge shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products.
        </p>
      </div>
    </div>
  );
}
